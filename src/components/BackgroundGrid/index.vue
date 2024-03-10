<template>
  <div class="background-grid" ref="backgroundGridRef"></div>
</template>

<script setup>
import { ref, onMounted, inject, watch } from "vue";
// 引入x6的Graph,使用x6来配置网格背景
import { Graph } from "@antv/x6";
// 引入仓库
import useContainerStore from "@/store/modules/container";
const containerStore = useContainerStore();

// 背景网格容器
const backgroundGridRef = ref();

// 将graph设为全局变量
let graph;

// 初始化graph
function initGraph() {
  graph = new Graph({
    container: backgroundGridRef.value,
    width: containerStore.containerWidth,
    height: containerStore.containerHeight,
    grid: {
      visible: containerStore.operator.isShowGrid,
      size: containerStore.operator.gridSpacingValue,
      type: containerStore.operator.gridTypeValue,
      args: [
        {
          color: containerStore.operator.gridColorMainValue, // 主网格线颜色(mesh,dot,fixedDot)
          thickness: 1, // 主网格线宽度
        },
        {
          color: containerStore.operator.gridColorSecondValue, // 次网格线颜色 (深)
          thickness: 1, // 次网格线宽度
          factor: 4, // 主次网格线间隔
        },
      ],
    },
  });
  graph.drawBackground({
    color: containerStore.operator.gridBackgroundColorValue,
  });
}

// 校验页面方向函数（横向模式和竖向模式）
function checkDirection() {
  if (
    containerStore.operator.canvaDirectionValue === "transverse" &&
    containerStore.containerWidth < containerStore.containerHeight
  ) {
    [containerStore.containerWidth, containerStore.containerHeight] = [
      containerStore.containerHeight,
      containerStore.containerWidth,
    ];
  } else if (
    containerStore.operator.canvaDirectionValue === "vertical" &&
    containerStore.containerWidth > containerStore.containerHeight
  ) {
    [containerStore.containerWidth, containerStore.containerHeight] = [
      containerStore.containerHeight,
      containerStore.containerWidth,
    ];
  }
}

onMounted(() => {
  // X6配置
  initGraph();
});

// 监听画布页面方向和预设画布类型
watch(
  () => [
    containerStore.operator.canvaDirectionValue,
    containerStore.operator.pageSizeValue,
  ],
  () => {
    checkDirection();
  },
  { immediate: true }
);

// 监听数据变化，重新绘制背景网格
watch(
  () => [
    containerStore.operator.gridTypeValue,
    containerStore.operator.gridSpacingValue,
    containerStore.operator.gridColorMainValue,
    containerStore.operator.gridColorSecondValue,
    containerStore.operator.gridBackgroundColorValue,
    containerStore.containerWidth,
    containerStore.containerHeight,
    containerStore.operator.isShowGrid,
  ],
  () => {
    graph.dispose();
    initGraph();
  },
  {
    deep: true,
  }
);
</script>

<style scoped>
.background-grid {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
}
</style>
