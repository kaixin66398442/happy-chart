<template>
  <div class="rect" :style="styles"></div>
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
console.log(styles.value);
</script>

<style lang="scss" scoped>
.rect {
  width: 100px;
  height: 50px;
  border: 2px solid #000;
  background-color: #fff;
}
</style>
