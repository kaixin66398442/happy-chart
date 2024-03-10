<template>
  <div class="block" :style="blockStyles" ref="blockRef">
    <component :is="RenderComponent"></component>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
// 引入配置文件
import { config } from "@/utils/config.js";
import useBlockStore from "@/store/modules/block";
const blockStore = useBlockStore();
blockStore.componentList = config.componentList;
blockStore.componentMap = config.componentMap;

const props = defineProps(["data"]);
const blockData = props.data; // blockData是一个响应式数据
// console.log(blockData);

// 组件块样式
const blockStyles = computed(() => {
  return {
    top: `${blockData.top}px`,
    left: `${blockData.left}px`,
    "z-index": `${blockData.zIndex}`,
  };
});
// 获得key对应的物料组件
const component = config.componentMap[blockData.key];
const RenderComponent = component.render();

// block的DOM
const blockRef = ref(null);

// 组件挂载完毕
onMounted(() => {
  let { offsetWidth, offsetHeight } = blockRef.value;
  if (blockData.alignCenter) {
    // 如果需要居中（说明是从左侧物料区拖拽过来的）
    blockData.left = blockData.left - offsetWidth / 2;
    blockData.top = blockData.top - offsetHeight / 2;
    blockData.alignCenter = false;
  }
  // 给每个组件携带上宽高
  blockData.width = offsetWidth;
  blockData.height = offsetHeight;
});
</script>

<style lang="scss" scoped>
.block {
  position: absolute;
  user-select: none;
  cursor: move;
}
</style>
