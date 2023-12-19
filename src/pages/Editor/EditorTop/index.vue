<!-- 编辑页顶部的菜单区，放置各种各样的功能按键 -->
<template>
  <div class="editor-top">
    <!-- 第一层 -->
    <div class="first">
      <!-- 左侧 -->
      <div class="left">
        <!-- 左侧上层 -->
        <div class="topBar">
          <!-- 返回按钮 -->
          <div class="topbar-back">
            <span><ArrowLeft /></span>
          </div>
          <div class="topbar-options">
            <div class="rename">
              <span class="edit-box">未命名文件</span>
            </div>
            <!-- 保存按钮 -->
            <div class="save"></div>
            <!-- 导出按钮 -->
            <div class="export"></div>
            <!-- 收藏按钮 -->
            <div class="star"></div>
          </div>
        </div>
        <!-- 左侧下层 -->
        <div class="bottomBar"></div>
      </div>
      <!-- 右侧 -->
      <div class="right"></div>
    </div>
    <!-- 第二层 -->
    <div class="second"></div>
  </div>
</template>

<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";
</script>

<style lang="scss" scoped>
.editor-top {
  width: 100%;
  .first {
    display: flex;
    height: 55px;
    background-color: #eef0f5;
    .left {
      flex: 1;
      .topBar {
        height: 32px;
        // 回退按钮
        .topbar-back {
          width: 30px;
          padding-left: 10px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-right: 10px;
          cursor: pointer;
          opacity: 0.8;
          span {
            width: 20px;
            height: 20px;
          }
        }
        // 回退按钮后面几个功能选项
        .topbar-options {
          position: relative;
          margin: 0 auto;
          display: flex;
          align-items: center;

          // 可以重命名的盒子
          .rename {
            color: #000;
            padding: 0;
            max-width: 400px;
            min-width: 87px;
            border: unset;
            height: 32px;
            text-overflow: ellipsis;
            white-space: nowrap;
            opacity: 0.8;

            .edit-box {
              display: block;
              line-height: 32px;
              // color: $base-text-color;
              font-size: 12px;
              width: 100%;
              height: 100%;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              user-select: none;
              cursor: pointer;

              &:hover {
                color: #000;
              }
            }
          }
          .bottomBar {
            height: 23px;
          }
        }
      }
      .right {
        flex: 1;
      }
    }
  }
  .second {
    height: 45px;
    background-color: #fff;
  }
}
</style>
