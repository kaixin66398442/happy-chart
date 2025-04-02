<template>
  <div class="rect" :style="styles">
    <div class="content" :style="contentStyles">
      {{ props.data.props?.text || "" }}
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["data"]);
const styles = computed(() => {
  return {
    width: props.data?.width + "px",
    height: props.data?.height + "px",
  };
});
const contentStyles = computed(() => {
  return {
    color: props.data.props?.color,
    fontSize: props.data.props?.size,
  };
});
</script>

<style lang="scss" scoped>
.rect {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 50px;
  border: 2px solid #000;
  background-color: #fff;
}
</style>
