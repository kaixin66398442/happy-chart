<!-- 编辑页右侧的属性编辑区 -->
<template>
  <!-- 右侧操作区 -->
  <div class="editor-right" v-if="containerStore.operator.isShowOperator">
    <el-tabs
      type="border-card"
      stretch
      v-if="blockStore.lastSelectBlock === null"
    >
      <el-tab-pane label="画布">
        <!-- 调节页面尺寸 -->
        <div class="page_size">
          <h5 class="title">页面尺寸</h5>
          <el-radio-group v-model="containerStore.operator.pageSizeType">
            <el-radio
              label="preset"
              size="large"
              @change="containerStore.operator.pageSizeType = 'preset'"
              >预设页面大小</el-radio
            >
            <!-- 预设页面大小 -->
            <el-select
              v-model="containerStore.operator.pageSizeValue"
              size="small"
              :disabled="!(containerStore.operator.pageSizeType === 'preset')"
              @change="presetChange"
            >
              <el-option
                v-for="ps in containerStore.operator.pageSizeArr"
                :key="ps.value"
                :label="ps.label"
                :value="ps.value"
              />
            </el-select>
            <el-radio
              label="custom"
              size="large"
              @change="containerStore.operator.pageSizeType = 'custom'"
              >自定义大小</el-radio
            >
            <!-- 自定义大小 -->
            <div class="custom">
              <el-input-number
                v-model="containerStore.containerWidth"
                :min="1"
                :max="10000"
                controls-position="right"
                size="small"
                :disabled="!(containerStore.operator.pageSizeType === 'custom')"
              />
              <el-input-number
                v-model="containerStore.containerHeight"
                :min="1"
                :max="10000"
                controls-position="right"
                size="small"
                :disabled="!(containerStore.operator.pageSizeType === 'custom')"
              />
            </div>
          </el-radio-group>
          <div class="canvas-direction">
            <p>页面方向：</p>
            <el-select
              v-model="containerStore.operator.canvaDirectionValue"
              size="small"
            >
              <el-option
                v-for="cd in containerStore.operator.canvaDirectionArr"
                :key="cd.value"
                :label="cd.label"
                :value="cd.value"
              />
            </el-select>
          </div>
        </div>
        <el-divider />
        <!-- 调整背景网格 -->
        <div class="background_grid">
          <h5 class="title">背景网格</h5>
          <!-- 是否显示网格 -->
          <div class="grid_isShow">
            <p>是否显示网格</p>
            <el-switch v-model="containerStore.operator.isShowGrid" />
          </div>
          <!-- 网格类型 -->
          <div class="grid_type">
            <p>网格类型</p>
            <el-select
              v-model="containerStore.operator.gridTypeValue"
              size="small"
            >
              <el-option
                v-for="(type) in containerStore.operator.gridTypeArr"
                :key="type.value"
                :label="type.label"
                :value="type.value"
              />
            </el-select>
          </div>
          <!-- 网格间距 -->
          <div class="grid_spacing">
            <p>网格间距</p>
            <el-slider
              v-model="containerStore.operator.gridSpacingValue"
              :max="containerStore.operator.gridSpacingMaxValue"
              :min="containerStore.operator.gridSpacingMinValue"
              size="small"
            />
            <div class="value-box">
              {{ containerStore.operator.gridSpacingValue }}
            </div>
          </div>
          <!-- 网格颜色 -->
          <div class="grid_color">
            <p>网格颜色</p>
            <div class="value-box">主</div>
            <el-color-picker
              v-model="containerStore.operator.gridColorMainValue"
              size="small"
            />
            <div class="value-box" style="margin-left: 20px">次</div>
            <el-color-picker
              v-model="containerStore.operator.gridColorSecondValue"
              size="small"
            />
          </div>
          <!-- 背景颜色 -->
          <div class="grid_background_color">
            <p>背景颜色</p>
            <el-color-picker
              v-model="containerStore.operator.gridBackgroundColorValue"
              size="small"
            />
          </div>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="样式"></el-tab-pane> -->
    </el-tabs>
    <el-tabs type="border-card" stretch v-else>
      <el-tab-pane label="样式">
        <el-form labelPosition="top">
          <el-form-item v-for="item in content" :label="item.propConfig.label" :key="item.propName">
            <ElInput
              v-if="item.propConfig.type === 'input'"
              v-model="blockStore.lastSelectBlock.props[item.propName]"
            ></ElInput>
            <ElColorPicker
              v-else-if="item.propConfig.type === 'color'"
              v-model="blockStore.lastSelectBlock.props[item.propName]"
            ></ElColorPicker>
            <ElSelect
              v-else-if="item.propConfig.type === 'select'"
              v-model="blockStore.lastSelectBlock.props[item.propName]"
            >
              <ElOption
                v-for="option in item.propConfig.options"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></ElOption>
            </ElSelect>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { computed } from "vue";
// 引入仓库
import useContainerStore from "@/store/modules/container";
const containerStore = useContainerStore();
import useBlockStore from "@/store/modules/block";
const blockStore = useBlockStore();
// 引入命令
import useCommand from "@/hooks/useCommand";

// 引入配置文件
import { config } from "@/utils/config";
const component = computed(() => {
  if (blockStore.lastSelectBlock) {
    return config.componentMap[blockStore.lastSelectBlock.key];
  }
});
const content = computed(() => {
  if (component.value && component.value.props) {
    return Object.entries(component.value.props).map(
      ([propName, propConfig]) => {
        return { propName, propConfig };
      }
    );
  } else {
    return [];
  }
});

// 预设页面大小选项的改变
function presetChange() {
  let presetCanvasSize = containerStore.operator.pageSizeValue.split(" ");
  containerStore.containerWidth = Number(presetCanvasSize[0]);
  containerStore.containerHeight = Number(presetCanvasSize[1]);
}
</script>

<style lang="scss" scoped>
.custom {
  .el-input-number {
    margin-right: 20px;
  }
}
.editor-right {
  width: 250px;
  height: 100%;
  background-color: #f5f5f5;
  border-left: 1px solid rgba(0, 0, 0, 0.06);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  user-select: none;

  .title {
    margin-bottom: 5px;
    font-weight: 900;
  }

  .canvas-direction {
    margin-top: 20px;
    display: flex;

    p {
      display: flex;
      align-items: center;
      margin-right: 15px;
      font-size: 12px;
      white-space: nowrap;
    }
  }

  div[class^="grid"] {
    display: flex;
    align-items: center;
    margin-bottom: 5px;

    p {
      margin-right: 15px;
      font-size: 12px;
      white-space: nowrap;
    }

    .value-box {
      margin-left: 5px;
      font-size: 10px;
      text-align: center;
      width: 30px;
      height: 20px;
      line-height: 20px;
      background-color: #f2f2f2;
      border-radius: 5px;
    }
  }

  // 修改某个elementui组件的样式，到控制台看选择器，并且不能设置scoped
  .grid_background_color {
    .el-color-picker--small .el-color-picker__trigger {
      width: 135px;
    }
  }

  // 调整网格间距的后面的有数字的方块
  .value-box input {
    width: 100%;
    margin-left: 2px;
    border: 0;
    background-color: transparent;
  }
}

// 选项卡的高度设置
.el-tabs {
  height: 100%;
}

// 选项卡的高度设置的字体颜色
.el-tabs--border-card > .el-tabs__header .el-tabs__item {
  font-weight: 900;
}

.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  color: #017fff;
  font-weight: 900;
}

.el-tabs--border-card
  > .el-tabs__header
  .el-tabs__item:not(.is-disabled):hover {
  color: #017fff;
}

// 调节页面尺寸-自定义大小的两个数字选择器
.el-input-number--small {
  width: 80px;
}

.el-input-number.is-controls-right .el-input__wrapper {
  padding-left: 5px;
  padding-right: 28px;
}
</style>
