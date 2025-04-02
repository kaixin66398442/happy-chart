<template>
  <ul :class="classes" ref="el">
    <MenuItem
      label="删除"
      @click="
        () => {
          commandMap.delete();
        }
      "
    ></MenuItem>
    <MenuItem
      label="置顶"
      @click="
        () => {
          commandMap.placeTop();
        }
      "
    ></MenuItem>
    <MenuItem
      label="置底"
      @click="
        () => {
          commandMap.placrBottom();
        }
      "
    ></MenuItem>
  </ul>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, provide } from "vue";
import MenuItem from "./MemuItem/index.vue";

// 引入命令
import useCommand from "@/hooks/useCommand";
const { commandMap } = useCommand();

const isShow = ref(true);
const el = ref(null);
const onMousedownDocument = (e) => {
  console.log(el.value);
  if (!el.value.contains(e.target)) {
    isShow.value = false;
  }
};
const classes = computed(() => [
  "menu",
  {
    "menu-isShow": isShow.value,
  },
]);

// 给子代传递菜单隐藏函数
provide("hide", () => {
  isShow.value = false;
});

onMounted(() => {
  // 捕获阶段
  document.body.addEventListener("mousedown", onMousedownDocument, true);
});
onBeforeUnmount(() => {
  document.body.removeEventListener("mousedown", onMousedownDocument, true);
});
</script>

<style lang="scss" scoped>
.menu {
  display: none;
  width: 150px;
  background-color: #fff;
  box-shadow: 0px 0px 10px 0px #ccc;
  border-radius: 10px;
}
.menu-isShow {
  display: block;
}
</style>
