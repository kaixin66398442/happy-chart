<!-- 编辑页顶部的菜单区，放置各种各样的功能按键 -->
<template>
  <div class="editor-top" ref="top">
    <!-- 第一层 -->
    <div class="first">
      <!-- 左侧 -->
      <div class="left">
        <!-- 左侧上层 -->
        <div class="topBar">
          <!-- 返回按钮 -->
          <div class="topbar-back">
            <SvgIcon iconName="icon-back"></SvgIcon>
          </div>
          <div class="topbar-options">
            <!-- 重命名框 -->
            <div class="rename">
              <span v-show="!isEdit" class="edit-text" @click="editFileName">
                {{ fileName }}
              </span>
              <input
                v-show="isEdit"
                class="edit-box"
                type="text"
                v-model="fileName"
                ref="fileNameInputRef"
                @blur="isEdit = false"
              />
            </div>
            <!-- 保存按钮 -->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="保存文件"
              placement="bottom"
              :show-after="500"
            >
              <div
                class="save"
                @mouseenter="currentSaveIconName = 'icon-save-hover'"
                @mouseleave="currentSaveIconName = 'icon-save'"
                @click="save"
              >
                <SvgIcon :iconName="currentSaveIconName"></SvgIcon>
              </div>
            </el-tooltip>
            <!-- 导出按钮 -->
            <el-tooltip
              class="box-item"
              effect="dark"
              content="导出文件"
              placement="bottom"
              :show-after="500"
            >
              <div
                class="export"
                @mouseenter="currentExportIconName = 'icon-export-hover'"
                @mouseleave="currentExportIconName = 'icon-export'"
                @click="handleExport"
              >
                <SvgIcon :iconName="currentExportIconName"></SvgIcon>
              </div>
            </el-tooltip>
            <!-- 收藏按钮 -->
            <div
              class="star"
              @mouseenter="starIconMounseEnter"
              @mouseleave="starIconMounseLeave"
              @click="isStar = !isStar"
            >
              <SvgIcon :iconName="currentStarIconName"></SvgIcon>
            </div>
          </div>
        </div>
        <!-- 左侧下层 -->
        <div class="bottomBar">
          <!-- 一排菜单 -->
          <el-menu class="el-menu" mode="horizontal" :ellipsis="false">
            <el-sub-menu index="0" class="menu-btn">
              <template #title>文件</template>
              <el-menu-item index="0-1">回到首页</el-menu-item>
              <el-menu-item index="0-2">保存(Ctrl+S)</el-menu-item>
              <el-menu-item index="0-3">另存为</el-menu-item>
              <el-menu-item index="0-4">重命名</el-menu-item>
              <el-menu-item index="0-5">文档加密</el-menu-item>
              <el-menu-item index="0-6">导入数据</el-menu-item>
              <el-sub-menu index="0-7">
                <template #title>导出</template>
                <el-menu-item
                  index="0-4-1"
                  class="el-menu-item"
                  @click="exportToPNG"
                  >PNG</el-menu-item
                >
                <el-menu-item index="0-4-2">PDF</el-menu-item>
                <el-menu-item index="0-4-3">Excel</el-menu-item>
                <el-menu-item index="0-4-4">HTML</el-menu-item>
              </el-sub-menu>
              <el-menu-item index="0-8">分享</el-menu-item>
              <el-menu-item index="0-9">下载</el-menu-item>
              <el-menu-item index="0-10">打印</el-menu-item>
            </el-sub-menu>

            <el-sub-menu index="1" class="menu-btn">
              <template #title>编辑</template>
              <el-menu-item index="1-1">撤销(Ctrl+Z)</el-menu-item>
              <el-menu-item index="1-2">重做(Ctrl+Y)</el-menu-item>
              <el-menu-item index="1-3">剪切(Ctrl+X)</el-menu-item>
              <el-menu-item index="1-4">复制(Ctrl+C)</el-menu-item>
              <el-menu-item index="1-5">粘贴(Ctrl+V)</el-menu-item>
            </el-sub-menu>

            <el-menu-item index="2">选择</el-menu-item>
            <el-menu-item index="3">插入</el-menu-item>
            <el-menu-item index="4">布局</el-menu-item>
            <el-menu-item index="5">视图</el-menu-item>
            <el-menu-item index="6">符号</el-menu-item>
          </el-menu>
        </div>
      </div>
      <!-- 右侧 -->
      <div class="right"></div>
    </div>
    <!-- 第二层 -->
    <div class="second">
      <!-- 左侧 -->
      <div class="left">
        <!-- 展开左侧符号库 -->
        <div
          class="svg expand"
          @click="containerStore.material.isShowMaterial = true"
          v-show="!containerStore.material.isShowMaterial"
        >
          <SvgIcon iconName="icon-rightTwo"></SvgIcon>
        </div>
        <!-- 字体选择 -->
        <el-select
          v-model="fontType"
          placeholder="Select"
          class="font-type-select"
        >
          <el-option
            v-for="item in fontTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 字号选择 -->
        <el-select
          v-model="fontSize"
          placeholder="Select"
          class="font-size-select"
        >
          <el-option
            v-for="item in fontSizeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <!-- 按钮合集 -->
        <el-tooltip
          v-for="button in buttons"
          :key="button.icon"
          class="box-item"
          effect="dark"
          :content="button.content"
          placement="bottom"
          :show-after="500"
        >
          <div class="svg" @click="button.handler">
            <SvgIcon :iconName="button.icon"></SvgIcon>
          </div>
        </el-tooltip>
      </div>
      <!-- 右侧 -->
      <div class="right">
        <!-- 收缩展开 -->
        <!-- 折叠 -->
        <div
          class="svg"
          v-if="containerStore.operator.isShowOperator"
          @click="containerStore.operator.isShowOperator = false"
        >
          <SvgIcon iconName="icon-unfolded"></SvgIcon>
        </div>
        <!-- 展开 -->
        <div
          class="svg"
          v-if="!containerStore.operator.isShowOperator"
          @click="containerStore.operator.isShowOperator = true"
        >
          <SvgIcon iconName="icon-folded"></SvgIcon>
        </div>
      </div>
    </div>
  </div>
  <!-- 导出流程图对话框 -->
  <el-dialog v-model="dialogVisible" title="预览" width="1000">
    <div
      class="imgBox"
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 400px;
        background-color: #f2f2f2;
        border-radius: 20px;
      "
    >
      <img :src="imgData" alt="" style="width: 50%" />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleExportConfirm">
          导出
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, nextTick, computed } from "vue";
import html2canvas from "html2canvas";
// 引入仓库
import useContainerStore from "@/store/modules/container";
import useBlockStore from "@/store/modules/block";
const containerStore = useContainerStore();
const blockStore = useBlockStore();
import { undo, redo } from "@/hooks/historySnapShot";
// 引入命令
import useCommand from "@/hooks/useCommand";
const { commandMap } = useCommand();

const top = ref(null);

// 保存图标的iconName
const currentSaveIconName = ref("icon-save");
// 导出图标的iconName
const currentExportIconName = ref("icon-export");
// 收藏图标的iconName
const starIconName = reactive({
  init: "icon-star",
  initHover: "icon-star-hover",
  fill: "icon-star-fill",
  fillHover: "icon-star-fill-hover",
});
// 是否收藏
const isStar = ref(false);
// 现在收藏图标的iconName
const currentStarIconName = ref(starIconName.init);
//字体类型
const fontType = ref("微软雅黑");
const fontTypeOptions = [
  {
    value: "微软雅黑",
    label: "微软雅黑",
  },
  {
    value: "黑体",
    label: "黑体",
  },
  {
    value: "宋体",
    label: "宋体",
  },
  {
    value: "华文楷体",
    label: "华文楷体",
  },
  {
    value: "华文行楷",
    label: "华文行楷",
  },
];

//字体大小
const fontSize = ref(10);
const fontSizeOptions = [
  {
    value: 6,
    label: "6",
  },
  {
    value: 7,
    label: "7",
  },
  {
    value: 8,
    label: "8",
  },
  {
    value: 9,
    label: "9",
  },
  {
    value: 10,
    label: "10",
  },
  {
    value: 11,
    label: "11",
  },
  {
    value: 12,
    label: "12",
  },
  {
    value: 14,
    label: "14",
  },
  {
    value: 16,
    label: "16",
  },
  {
    value: 18,
    label: "18",
  },
  {
    value: 20,
    label: "20",
  },
  {
    value: 22,
    label: "22",
  },
  {
    value: 24,
    label: "24",
  },
  {
    value: 26,
    label: "26",
  },
  {
    value: 28,
    label: "28",
  },
  {
    value: 36,
    label: "36",
  },
  {
    value: 72,
    label: "72",
  },
];
// 收藏图标鼠标进入回调
const starIconMounseEnter = function () {
  // 已收藏
  if (isStar.value) {
    currentStarIconName.value = starIconName.fillHover;
  }
  // 未收藏
  else {
    currentStarIconName.value = starIconName.initHover;
  }
};
// 收藏图标鼠标离开回调
const starIconMounseLeave = function () {
  // 已收藏
  if (isStar.value) {
    currentStarIconName.value = starIconName.fill;
  }
  // 未收藏
  else {
    currentStarIconName.value = starIconName.init;
  }
};
// 文件名
const fileName = ref("未命名文件");
// 文件名编辑状态
const isEdit = ref(false);
const fileNameInputRef = ref(null);
// 点击文件名字文本编辑框的回调
const editFileName = function () {
  isEdit.value = true;
  nextTick(() => {
    // 全选文本
    fileNameInputRef.value.select();
    fileNameInputRef.value.focus();
  });
};
// 导出为png
const exportToPNG = function () {};
// 按钮合集（核心）
const buttons = reactive([
  {
    content: "格式刷",
    icon: "icon-geshishua",
    handler: () => {
      console.log("格式刷");
    },
  },
  {
    content: "加粗 Ctrl+B",
    icon: "icon-jiacu",
    handler: () => {
      console.log("加粗 Ctrl+B");
    },
  },
  {
    content: "斜体 Ctrl+I",
    icon: "icon-xieti",
    handler: () => {
      console.log("斜体 Ctrl+I");
    },
  },
  {
    content: "下划线 Ctrl+U",
    icon: "icon-xiahuaxian",
    handler: () => {
      console.log("下划线 Ctrl+U");
    },
  },
  {
    content: "字体颜色",
    icon: "icon-zitiyanse",
    handler: () => {
      console.log("字体颜色");
    },
  },
  {
    content: "撤销",
    icon: "icon-undo",
    passiveIcon: "icon-undo-no",
    activeIcon: "icon-undo",
    handler: () => {
      commandMap.undo();
    },
  },
  {
    content: "重做",
    icon: "icon-redo",
    passiveIcon: "icon-redo-no",
    activeIcon: "icon-redo",
    handler: () => {
      commandMap.redo();
    },
  },
  {
    content: "置顶",
    icon: "icon-placeTop",
    handler: () => {
      commandMap.placeTop();
    },
  },
  {
    content: "置底",
    icon: "icon-placeBottom",
    handler: () => {
      commandMap.placeBottom();
    },
  },
  {
    content: "删除",
    icon: "icon-delete",
    handler: () => {
      commandMap.delete();
    },
  },
]);
// 控制导出图片对话课的显示
const dialogVisible = ref(false);

// 要导出的图片路径
let imgData = ref("");
// 导出按钮的回调
function handleExport() {
  dialogVisible.value = true;
  let element = containerStore.canvasDOM;
  html2canvas(element).then((canvas) => {
    imgData.value = canvas.toDataURL("image/png");
  });
}
function handleExportConfirm() {
  let element = containerStore.canvasDOM;
  html2canvas(element).then((canvas) => {
    const link = document.createElement("a");
    link.href = imgData;
    link.download = "exported-image.png";
    link.click();
  });
}
</script>

<style lang="scss" scoped>
.editor-top {
  width: 100%;
  .first {
    display: flex;
    height: 55px;
    background-color: #eef0f5;
    .left {
      flex: 1.5;
      .topBar {
        display: flex;
        height: 32px;
        // 回退按钮
        .topbar-back {
          width: 20px;
          margin: 0 10px;
          font-size: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          opacity: 0.8;
          span {
            width: 20px;
            height: 20px;
          }
        }
        // 回退按钮后面几个功能选项
        .topbar-options {
          display: flex;
          // 可以重命名的盒子
          .rename {
            display: flex;
            align-items: center;
            height: 32px;
            max-width: 400px;
            min-width: 67px;
            opacity: 0.8;
            .edit-text {
              display: block;
              text-align: center;
              height: 100%;
              line-height: 32px;
              font-size: 12px;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              user-select: none;
              cursor: pointer;
              &:hover {
                color: #000;
              }
            }
            .edit-box {
              margin: 0;
              border: 0.5px solid #ccc;
              border-radius: 5px;
              background-color: #fff;
              font-size: 12px;
              width: 90px;
              height: 80%;
              color: #333;
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              user-select: none;
            }
            ::selection {
              background-color: #ccc;
            }
          }

          .save,
          .export,
          .star {
            width: 20px;
            font-size: 14px;
            margin-left: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            opacity: 0.8;
          }
        }
      }
      .bottomBar {
        height: 23px;
        .el-menu {
          margin-left: 10px;
          height: 100%;
          background-color: transparent;
          border: 0;
          &-item {
            background-color: transparent;
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
            font-size: 12px;
            border: 0;
            user-select: none;
            &:hover {
              background-color: #fff;
              color: #333;
            }
          }
        }
        :deep(.menu-btn) {
          cursor: pointer;
          user-select: none;
          .el-sub-menu__title.el-tooltip__trigger.el-tooltip__trigger {
            font-size: 12px;
            border-top-right-radius: 8px;
            border-top-left-radius: 8px;
            &:hover {
              color: #333;
            }
          }
        }
      }
    }
    .right {
      flex: 1;
    }
  }
  .second {
    display: flex;
    justify-content: space-between;
    height: 45px;
    background-color: #fff;
    .left {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 20px;
    }
    .right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 5px;
    }
    .svg {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 30px;
      height: 30px;
      border-radius: 6px;
      transition: all 0.2s ease;
      cursor: pointer;
      margin: 0 6px;
    }

    .svg:hover {
      background-color: #e7e7e7;
    }

    // 字体类型
    .font-type-select {
      width: 120px;
      margin: 0 6px;
    }

    //字体大小
    .font-size-select {
      width: 60px;
      margin: 0 6px;
    }
  }
}
</style>
