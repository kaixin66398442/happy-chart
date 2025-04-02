<template>
  <!-- 中间画布区 -->
  <div class="editor-container">
    <div class="wrapper" ref="wapperRef" v-resize="handleResize">
      <!--  这个可以传入图标 -->
      <SketchRule
        :thick="state.thick"
        :scale="containerStore.containerScale"
        :width="state.rulerWidth"
        :height="state.rulerHeight"
        :start-x="state.startX"
        :start-y="state.startY"
        :shadow="shadow"
        :isShowReferLine="state.isShowReferLine"
        :lines="state.lines"
        :palette="state.palette"
      >
      </SketchRule>
      <div
        id="screens"
        ref="screensRef"
        @wheel="handleWheel"
        @scroll="handleScroll"
      >
        <div ref="containerRef" class="screen-container">
          <!-- 画布 -->
          <div
            id="canvas"
            ref="canvasRef"
            :style="canvasStyle"
            @mousedown="handleCanvasMousedown"
          >
            <!-- 背景网格 -->
            <BackgroundGrid></BackgroundGrid>
            <Block
              v-for="(block, index) in blockStore.blockList"
              :key="`${blockStore.blockKey}${index}`"
              :data="block"
              @mousedown="handleBlockMousedown($event, block, index)"
              :class="block.focus ? 'block-focus' : ''"
              @contextmenu.prevent="handelBlockContextmenu($event, block)"
            >
              <BlockResize v-if="block.focus" :block="block"></BlockResize>
            </Block>
            <!-- 辅助线 -->
            <!-- 水平线 -->
            <div
              v-show="showLine.horizontalLine !== null"
              class="horizontal-line"
              :style="{ top: showLine.horizontalLine + 'px' }"
            ></div>
            <!-- 垂直线 -->
            <div
              v-show="showLine.verticalLine !== null"
              class="vertical-line"
              :style="{ left: showLine.verticalLine + 'px' }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted, nextTick, watchEffect } from "vue";
import { SketchRule } from "vue3-sketch-ruler";
import "vue3-sketch-ruler/lib/style.css";
import BackgroundGrid from "@/components/BackgroundGrid/index.vue";
// 引入仓库
import useContainerStore from "@/store/modules/container";
const containerStore = useContainerStore();
import useBlockStore from "@/store/modules/block";
const blockStore = useBlockStore();
// 引入组件块
import Block from "@/components/Block/index.vue";
import { pushRecord, undo, redo } from "@/hooks/historySnapShot";
import emitter from "@/utils/eventBus";
import { openContextMenus } from "@/components/Menu";
import BlockResize from "@/components/BlockResize/index.vue";

//#region 设置标尺和画布相关的代码
//rectWidth,rectHeight为画布宽高
const rectWidth = computed(() => containerStore.containerWidth);
const rectHeight = computed(() => containerStore.containerHeight);
const screensRef = ref(null);
const containerRef = ref(null);
const wapperRef = ref(null);
const canvasRef = ref(null);

//标尺的属性
const state = reactive({
  startX: 0,
  startY: 0,
  //标尺的宽高
  rulerWidth: 0,
  rulerHeight: 0,
  lines: {
    h: [],
    v: [],
  },
  thick: 20,
  isShowRuler: true, // 显示标尺
  isShowReferLine: false, // 显示参考线
  palette: {
    bgColor: "rgba(225,225,225, 0)",
    longfgColor: "#BABBBC",
    shortfgColor: "#C8CDD0",
    fontColor: "#7D8694",
    shadowColor: "#E8E8E8",
    lineColor: "#017FFF",
    borderColor: "#DADADC",
    cornerActiveColor: "rgb(235, 86, 72, 0.6)",
  },
});

//背景阴影
const shadow = computed(() => {
  return {
    x: 0,
    y: 0,
    width: rectWidth.value,
    height: rectHeight.value,
  };
});

//画布尺寸
const canvasStyle = computed(() => {
  return {
    width: `${rectWidth.value}px`,
    height: `${rectHeight.value}px`,
    transform: `scale(${containerStore.containerScale})`,
  };
});

//监听窗口变化改变标尺宽高
const handleResize = () => {
  state.rulerWidth = wapperRef.value?.offsetWidth - state.thick;
  state.rulerHeight = wapperRef.value?.offsetHeight - state.thick;
};

// 控制滚动后画布的尺寸
const handleScroll = () => {
  const screensRect = document
    .querySelector("#screens")
    ?.getBoundingClientRect();
  const canvasRect = document.querySelector("#canvas")?.getBoundingClientRect();

  // 标尺开始的刻度
  const startX =
    (screensRect.left + state.thick - canvasRect.left) /
    containerStore.containerScale;
  const startY =
    (screensRect.top + state.thick - canvasRect.top) /
    containerStore.containerScale;
  state.startX = startX;
  state.startY = startY;
};

// 控制缩放值
const handleWheel = (e) => {
  if (e.ctrlKey || e.metaKey) {
    e.preventDefault();

    const nextScale = parseFloat(
      Math.max(0.1, containerStore.containerScale - e.deltaY / 2000).toFixed(2)
    );
    containerStore.containerScale = nextScale;
  }
  nextTick(() => {
    handleScroll();
  });
};
//#endregion

//#region 画布中对组件块操作的代码
// 记录选中的组件和为选中的组件
const focusData = computed(() => {
  const focusBlocks = [];
  const unfocusBlocks = [];
  blockStore.blockList.forEach((item) => {
    (item.focus ? focusBlocks : unfocusBlocks).push(item);
  });
  return { focusBlocks, unfocusBlocks };
});

// 记录鼠标移动拖拽的信息
let dragState = {
  isDraging: false, // 是否拖拽中
};

// 记录最后一个选中的组件的下标
const lastSelectIndex = ref(-1); // -1表示没有选中的
// 最后一个选中的组件
const lastSelectBlock = computed(() => {
  // 保存到store
  blockStore.lastSelectBlock = blockStore.blockList[lastSelectIndex.value];
  return blockStore.blockList[lastSelectIndex.value];
});

// 将要显示的线存储为相应式数据
const showLine = reactive({
  horizontalLine: null, // 横线
  verticalLine: null, // 竖线
});

// 点击组件的回调
const handleBlockMousedown = (e, block, index) => {
  // 阻止默认事件
  e.preventDefault();
  // 阻止冒泡
  e.stopPropagation();
  // 在block中设置一个focus属性
  if (e.shiftKey) {
    // 按住shift键，可以连选
    block.focus = !block.focus;
  } else {
    if (!block.focus) {
      blockStore.blockList.forEach((item) => {
        item.focus = false;
      });
      block.focus = true;
    }
  }

  // 拿到最后点击的组件的下标
  lastSelectIndex.value = index;
  // 将拖拽的组件叫做B，被接近的组件叫做A
  const { width: BWidth, height: BHeight } = lastSelectBlock.value;
  // 每次点击组件的时候更新拖拽信息,辅助线也是每次点击都更新
  dragState = {
    startX: e.clientX,
    startY: e.clientY,
    // 拿到未移动前，所有focus的组件的left和top，形成一个数组[{left:;top:;}]
    startPos: focusData.value.focusBlocks.map((item) => {
      return { left: item.left, top: item.top };
    }),
    // 最后一个点击的组件（即是B）的位置
    startLeft: lastSelectBlock.value.left,
    startTop: lastSelectBlock.value.top,
    // 辅助线，是一个自动执行函数，每次拿到都会自动执行获得最新的辅助线数组
    lines: (() => {
      // 获得其他没有选中的以他们的位置做辅助线（即是A）
      const { unfocusBlocks } = focusData.value;
      // 存储水平线和垂直线
      const lines = { horizontalLines: [], verticalLines: [] };

      // 遍历未选中组件时，顺便遍历一下容器画布，这样组件到达容器中间的时候也有辅助线
      [
        ...unfocusBlocks,
        {
          left: 0,
          top: 0,
          width: containerStore.containerWidth,
          height: containerStore.containerHeight,
        },
      ].forEach((item) => {
        const { left: ALeft, top: ATop, width: AWidth, height: AHeight } = item;

        // showTop为辅助线的位置，top为B到达该位置会出现辅助线
        lines.horizontalLines.push({ showTop: ATop, top: ATop }); // A顶对B顶
        lines.horizontalLines.push({ showTop: ATop, top: ATop - BHeight }); // A顶对B底
        lines.horizontalLines.push({
          showTop: ATop + AHeight / 2,
          top: ATop + AHeight / 2 - BHeight / 2,
        }); // A中对B中
        lines.horizontalLines.push({
          showTop: ATop + AHeight,
          top: ATop + AHeight,
        }); // A底对B顶
        lines.horizontalLines.push({
          showTop: ATop + AHeight,
          top: ATop + AHeight - BHeight,
        }); // A底对B底

        // showLeft为辅助线的位置，left为B到达该位置会出现辅助线
        lines.verticalLines.push({ showLeft: ALeft, left: ALeft }); // A左对B左
        lines.verticalLines.push({ showLeft: ALeft, left: ALeft - BWidth }); // A左对B右
        lines.verticalLines.push({
          showLeft: ALeft + AWidth / 2,
          left: ALeft + AWidth / 2 - BWidth / 2,
        }); // A中对B中
        lines.verticalLines.push({
          showLeft: ALeft + AWidth,
          left: ALeft + AWidth,
        }); // A右对B左
        lines.verticalLines.push({
          showLeft: ALeft + AWidth,
          left: ALeft + AWidth - BWidth,
        }); // A右对B右
      });
      return lines;
    })(),
  };

  // console.log(blockStore.lastSelectBlock)

  // 再在document绑定mousemove和mouseup事件
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseup);
};

// 点击画布的回调
const handleCanvasMousedown = () => {
  blockStore.blockList.forEach((item) => {
    item.focus = false;
  });
  blockStore.lastSelectBlock = null;
  lastSelectIndex.value = -1;
};

// 点击组件后移动鼠标的回调
const handleMouseMove = (e) => {
  // 只有刚移动的时候触发，不会持续触发
  if (!dragState.isDraging) {
    dragState.isDraging = true;
    // 触发全局事件总线上的开始命令
    emitter.emit("startCommand");
  }
  // 鼠标移动到的位置
  let { clientX, clientY } = e;

  // 计算出当前最新的left和top
  let left = clientX - dragState.startX + dragState.startLeft;
  let top = clientY - dragState.startY + dragState.startTop;

  let horizontalLine = null;
  let verticalLine = null;
  // 先计算横线，距离参照物元素还5像素的时候就显示这根线
  for (let i = 0; i < dragState.lines.horizontalLines.length; i++) {
    const { top: t, showTop: s } = dragState.lines.horizontalLines[i]; // 获取每一条线
    if (Math.abs(t - top) < 5) {
      horizontalLine = s; // horizontalLine保存线要出现的位置
      // 实现快速贴边
      // 最新的clientY 容器距离顶部的距离 + 目标的高度
      clientY = dragState.startY - dragState.startTop + t;
      break; // 找到一根线就跳出循环
    }
  }
  // 再计算竖线
  for (let i = 0; i < dragState.lines.verticalLines.length; i++) {
    const { left: l, showLeft: s } = dragState.lines.verticalLines[i]; // 获取每一条线
    if (Math.abs(l - left) < 5) {
      verticalLine = s; // verticalLine保存线要出现的位置
      // 最新的clientX
      clientX = dragState.startX - dragState.startLeft + l;
      break; // 找到一根线就跳出循环
    }
  }

  // showLine是响应式数据，改变会引起视图的变化
  showLine.horizontalLine = horizontalLine;
  showLine.verticalLine = verticalLine;

  // 移动的距离
  let durX = clientX - dragState.startX;
  let durY = clientY - dragState.startY;

  // 拿到所有选中的组件的位置，并进行移动
  focusData.value.focusBlocks.forEach((item, index) => {
    item.left = dragState.startPos[index].left + durX;
    item.top = dragState.startPos[index].top + durY;
  });
};

// 移动组件后鼠标抬起的回调
const handleMouseup = () => {
  if (dragState.isDraging) {
    dragState.isDraging = false;
    // 触发全局事件总线上的结束命令
    emitter.emit("endCommand");
  }
  // 鼠标抬起后清除事件
  document.removeEventListener("mousemove", handleMouseMove);
  document.removeEventListener("mouseup", handleMouseup);

  // 鼠标抬起清除辅助线
  showLine.horizontalLine = null;
  showLine.verticalLine = null;

  // 移动后鼠标抬起，记录此时的快照
  // pushRecord();
};
//#endregion

// 组件右击的回调函数
const handelBlockContextmenu = (e, block) => {
  console.log("右击");
  console.log(e, block);
  openContextMenus(e);
};

// 监听focusData修改仓库中的focusData
watchEffect(() => {
  blockStore.focusData = focusData.value;
}, focusData);

import { jsPlumb } from "jsplumb";
// 生命周期钩子
onMounted(() => {
  handleResize();
  // 滚动居中
  screensRef.value.scrollLeft =
    containerRef.value.getBoundingClientRect().width / 2 - state.thick - 1;
  screensRef.value.scrollTop =
    containerRef.value.getBoundingClientRect().height / 2 - state.thick - 1;

  // 将画布DOM保存一份到store
  containerStore.canvasDOM = canvasRef.value;

  let plumbIns = jsPlumb.getInstance();

  //公共配置
  let globalConfig = {
    anchor: ["Bottom", "Top", "Left", "Right"],
    connector: "Straight",
    endpoint: "Blank",
    paintStyle: { stroke: "black", strokeWidth: 1 },
    overlays: [["Arrow", { width: 5, length: 5, location: 1 }]],
    endpointStyle: {
      fill: "lightgray",
      outlineStroke: "darkgray",
      outlineWidth: 2,
    },
  };

  nextTick(() => {
    let renderList = [];
    blockStore.blockList.forEach((block) => {
      if (block.to.length > 0) {
        block.to.forEach((item) => {
          renderList.push({
            source: block.id,
            target: item,
            ...globalConfig,
          });
        });
      }
    });
    plumbIns.ready(() => {
      renderList.forEach((item) => {
        plumbIns.connect(item);
      });
    });
  });
});
</script>

<style lang="scss" scoped>
.editor-container {
  flex: 1;
  position: relative;
  width: 100%;
  height: 100%;
  border-top: 1px solid rgba(0, 0, 0, 0.06);

  .wrapper {
    position: absolute;
    /* 特别注意,这个width要和传入组件的width成对应关系,
     也就是 780width +thick20 =800
     否则影子不和容器搭配,这个在2X中会进行自动匹配修正,省得配置麻烦
      */
    width: 100%;
    height: 100%;
    background-color: #ebebf1;
    // border: 1px solid #dadadc;
  }

  #screens {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;

    /* 设置滚动条的样式 */
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      border-radius: 5px;
    }

    /* 滚动槽 */
    &::-webkit-scrollbar-track {
      background-color: #ebebf1;
    }

    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      width: 100px;
      height: 100px;
      border-radius: 5px;
      background: #c9c9c9;
      border: 0.1px solid #fff;
      margin: 2px;
    }
  }

  .screen-container {
    position: absolute;
    width: 5000px;
    height: 3000px;
  }

  #canvas {
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #fff;
    background-size: 100% 100%;
    transform-origin: 50% 50%;
    .block-focus {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 1px solid #017fff;
      }
    }
    // 水平线
    .horizontal-line {
      position: absolute;
      left: 0;
      right: 0;
      border-top: 1px dashed #017fff;
    }
    // 垂直线
    .vertical-line {
      position: absolute;
      top: 0;
      bottom: 0;
      border-left: 1px dashed #017fff;
    }
  }
}
</style>
