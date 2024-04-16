<template>
  <div class="text" :style="styles">{{ props.data.props.text || "文本" }}</div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps(["data"]);
console.log(props);
const styles = computed(() => {
  return {
    color: props.data.props.color,
    fontSize: props.data.props.size,
  };
});
</script>

<style lang="scss" scoped>
.text {
  padding: 10px;
}
</style>
