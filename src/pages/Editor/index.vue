<template>
  <div class="editor">
    <EditorTop></EditorTop>
    <div class="center">
      <EditorLeft></EditorLeft>
      <EditorContainer></EditorContainer>
      <EditorRight></EditorRight>
    </div>
    <EditorBottom></EditorBottom>
  </div>
</template>

<script setup>
// 导入子组件
import EditorTop from "@/pages/Editor/EditorTop/index.vue";
import EditorLeft from "@/pages/Editor/EditorLeft/index.vue";
import EditorContainer from "@/pages/Editor/EditorContainer/index.vue";
import EditorRight from "@/pages/Editor/EditorRight/index.vue";
import EditorBottom from "@/pages/Editor/EditorBottom/index.vue";
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  width: 100%;
  height: 100%;
  // 中部
  .center {
    display: flex;
    flex: 1;
  }
}
</style>
