<!-- 编辑页左侧物料区，放置用于拖拽的组件块 -->
<template>
  <div class="editor-left" v-show="containerStore.material.isShowMaterial">
    <!-- <CollapseFiled></CollapseFiled> -->
    <div class="lib-memu">
      <div class="symbol-lib svg">
        <SvgIcon iconName="icon-lib"></SvgIcon>
        <span class="text">符号库</span>
      </div>
      <div
        class="packUp svg"
        @click="containerStore.material.isShowMaterial = false"
      >
        <SvgIcon iconName="icon-leftTwo"></SvgIcon>
      </div>
    </div>
    <div class="lib">
      <div
        class="item svg"
        v-for="(component, index) in config.componentList"
        :key="index"
        draggable="true"
        @dragstart="handleDragStart($event, component)"
        @dragend="handleDragEnd"
      >
        <component :is="component.preview()"></component>
      </div>
    </div>
  </div>
</template>

<script setup>
// 引入仓库
import useContainerStore from "@/store/modules/container";
const containerStore = useContainerStore();
import useBlockStore from "@/store/modules/block";
const blockStore = useBlockStore();
// 引入配置文件
import { config } from "@/utils/config";
import { pushRecord } from "@/hooks/historySnapShot";
// 引入全局事件总线
import emitter from "@/utils/eventBus";
import CollapseFiled from "@/components/CollapseFiled/index.vue";

// 目前拖动的组件
let currentComponent = null;

// 开始拖拽回调
const handleDragStart = (e, component) => {
  // 获取目标降落元素
  // console.log(containerStore.canvasDOM);
  // dragenter 进入目标元素中，添加一个移动的标识
  containerStore.canvasDOM.addEventListener("dragenter", handleDragEnter);
  // dragover 在目标元素经过，必须要阻止默认行为，否则不能触发drop
  containerStore.canvasDOM.addEventListener("dragover", handleDragOver);
  // dragleave 离开目标元素时要增加一个禁用标识
  containerStore.canvasDOM.addEventListener("dragleave", handleDragLeave);
  // drop松手时，根据拖拽的组件，添加一个组件
  containerStore.canvasDOM.addEventListener("drop", handleDrop);

  currentComponent = component;

  // 触发全局事件总线上的开始命令
  emitter.emit("startCommand");
};

// 移入目标的回调
const handleDragEnter = (e) => {
  e.dataTransfer.dropEffect = "move";
};

// 在目标上空的回调
const handleDragOver = (e) => {
  e.preventDefault();
};

// 离开目标元素
const handleDragLeave = (e) => {
  e.dataTransfer.dropEffect = "none";
};

// 在目标元素上松手
const handleDrop = (e) => {
  let blockList = blockStore.blockList;
  blockStore.blockList = [
    ...blockList,
    {
      top: e.offsetY,
      left: e.offsetX,
      alignCenter: true, // 松手时希望居中
      zIndex: 1,
      key: currentComponent.key,
      props: [],
    },
  ];
  currentComponent = null; // 置空
  // 将此时的快照加入到快照队列中
  // pushRecord();
};

// 拖拽结束回调
const handleDragEnd = () => {
  containerStore.canvasDOM.removeEventListener("dragenter", handleDragEnter);
  containerStore.canvasDOM.removeEventListener("dragover", handleDragOver);
  containerStore.canvasDOM.removeEventListener("dragleave", handleDragLeave);
  containerStore.canvasDOM.removeEventListener("drop", handleDrop);

  // 触发全局事件总线上的结束命令
  emitter.emit("endCommand");
};
</script>

<style lang="scss" scoped>
.editor-left {
  width: 250px;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;
  .lib-memu {
    width: 100%;
    height: 45px;
    padding: 0 5px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .symbol-lib {
      height: 35px;
      .text {
        font-weight: 600;
        margin-left: 5px;
        color: #424242;
      }
    }
    .packUp {
      float: right;
    }
  }
  .lib {
    display: flex;
    flex-wrap: wrap;
    padding: 10px;

    .item {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 64px;
      height: 64px;
      border-radius: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
      margin: 6px;
      background-color: #fff;
      cursor: move;
    }
    .item:hover {
      background-color: #e7e7e7;
    }
  }
}

.svg {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  cursor: pointer;
  margin: 0 6px;
}
.svg:hover {
  background-color: #e7e7e7;
}
</style>
