<template>
  <div class="block" :style="blockStyles" ref="blockRef" :id="blockData.id">
    <component :is="RenderComponent" :data="blockData"></component>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
// 引入配置文件
import { config } from "@/utils/config.js";

const props = defineProps(["data"]);
const blockData = props.data; // blockData是一个响应式数据

// 组件块样式
const blockStyles = computed(() => {
  return {
    top: `${blockData.top}px`,
    left: `${blockData.left}px`,
    "z-index": `${blockData.zIndex}`,
    width: `${blockData.width}px`,
    height: `${blockData.height}px`,
  };
});
// 获得key对应的物料组件
const component = config.componentMap[blockData.key];
const RenderComponent = component.render();

// block的DOM
const blockRef = ref(null);

// 组件挂载完毕
onMounted(() => {
  // console.log("block组件创建了");
  let { offsetWidth, offsetHeight } = blockRef.value;
  if (blockData.alignCenter) {
    // 如果需要居中（说明是从左侧物料区拖拽过来的）
    blockData.left = blockData.left - offsetWidth / 2;
    blockData.top = blockData.top - offsetHeight / 2;
    blockData.alignCenter = false;
  }
  // 给每个组件携带上宽高和zIndex
  blockData.width = offsetWidth;
  blockData.height = offsetHeight;
});

onUnmounted(() => {
  // console.log('block组件销毁了')
});
</script>

<style lang="scss" scoped>
.block {
  display: flex;
  align-items: center;
  position: absolute;
  user-select: none;
  // cursor: move;
}
</style>
