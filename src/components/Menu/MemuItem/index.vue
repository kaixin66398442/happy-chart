<template>
  <li class="menu-item" @click="hide">
    <span>{{ props.label }}</span>
  </li>
</template>

<script setup>
import { inject } from "vue";
const props = defineProps(["label"]);
const hide = inject("hide");
</script>

<style lang="scss" scoped>
.menu-item {
  line-height: 30px;
  width: 150px;
  border-bottom: 1px solid #ccc;
  text-align: center;
  cursor: pointer;
}
</style>
