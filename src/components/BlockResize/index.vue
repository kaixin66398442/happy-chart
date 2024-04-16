<template>
  <div
    class="block-resize block-resize-left"
    @mousedown="
      handelMousedown($event, { horizontal: 'start', vertical: 'center' })
    "
  ></div>
  <div
    class="block-resize block-resize-right"
    @mousedown="
      handelMousedown($event, { horizontal: 'end', vertical: 'center' })
    "
  ></div>
  <div
    class="block-resize block-resize-top"
    @mousedown="
      handelMousedown($event, { horizontal: 'center', vertical: 'start' })
    "
  ></div>
  <div
    class="block-resize block-resize-bottom"
    @mousedown="
      handelMousedown($event, { horizontal: 'center', vertical: 'end' })
    "
  ></div>
  <div
    class="block-resize block-resize-top-left"
    @mousedown="
      handelMousedown($event, { horizontal: 'start', vertical: 'start' })
    "
  ></div>
  <div
    class="block-resize block-resize-top-right"
    @mousedown="
      handelMousedown($event, { horizontal: 'end', vertical: 'start' })
    "
  ></div>
  <div
    class="block-resize block-resize-bottom-left"
    @mousedown="
      handelMousedown($event, { horizontal: 'start', vertical: 'end' })
    "
  ></div>
  <div
    class="block-resize block-resize-bottom-right"
    @mousedown="handelMousedown($event, { horizontal: 'end', vertical: 'end' })"
  ></div>
</template>

<script setup>
const props = defineProps(["block"]);
let data;
const handleMousemove = (e) => {
  let { clientX, clientY } = e;
  let {
    startX,
    startY,
    startWidth,
    startHeight,
    startLeft,
    startTop,
    direction,
  } = data;

  // 若拖拽的是中间的点，有一个方向不变
  if (direction.horizontal == "center") {
    clientX = startX;
  }
  if (direction.vertical == "center") {
    clientY = startY;
  }

  let durX = clientX - startX;
  let durY = clientY - startY;

  if (direction.horizontal == "start") {
    durX = -durX;
    props.block.left = startLeft - durX;
  }
  if (direction.vertical == "start") {
    durY = -durY;
    props.block.top = startTop - durY;
  }

  const width = startWidth + durX;
  const height = startHeight + durY;

  props.block.width = width;
  props.block.height = height;
};
const handleMouseup = () => {
  // document.body.style.cursor = "";
  document.body.removeEventListener("mousemove", handleMousemove);
  document.body.removeEventListener("mouseup", handleMouseup);
};
// 点击伸缩点的回调
const handelMousedown = (e, direction) => {
  e.stopPropagation();
  // switch (direction.horizontal + direction.vertical) {
  //   case "startcenter":
  //     document.body.style.cursor = "w-resize";
  //     break;
  //   case "endcenter":
  //     document.body.style.cursor = "e-resize";
  //     break;
  //   case "centerstart":
  //     document.body.style.cursor = "n-resize";
  //     break;
  //   case "centerend":
  //     document.body.style.cursor = "s-resize";
  //     break;
  //   case "startstart":
  //     document.body.style.cursor = "nw-resize";
  //     break;
  //   case "endstart":
  //     document.body.style.cursor = "ne-resize";
  //     break;
  //   case "startend":
  //     document.body.style.cursor = "sw-resize";
  //     break;
  //   case "endend":
  //     document.body.style.cursor = "se-resize";
  //     break;
  // }
  data = {
    startX: e.clientX,
    startY: e.clientY,
    startWidth: props.block.width,
    startHeight: props.block.height,
    startLeft: props.block.left,
    startTop: props.block.top,
    direction,
  };
  document.body.addEventListener("mousemove", handleMousemove);
  document.body.addEventListener("mouseup", handleMouseup);
};
</script>

<style lang="scss" scoped>
.block-resize {
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: #fff;
  border: 1px solid #017fff;
  z-index: 1000;
}
.block-resize-top {
  top: -3px;
  left: calc(50% - 4px);
  cursor: n-resize;
}

.block-resize-bottom {
  bottom: -3px;
  left: calc(50% - 4px);
  cursor: s-resize;
}

.block-resize-left {
  left: -3px;
  top: calc(50% - 4px);
  cursor: w-resize;
}

.block-resize-right {
  right: -3px;
  top: calc(50% - 4px);
  cursor: e-resize;
}

.block-resize-top-left {
  top: -3px;
  left: -3px;
  cursor: nw-resize;
}

.block-resize-top-right {
  top: -3px;
  right: -3px;
  cursor: ne-resize;
}

.block-resize-bottom-left {
  bottom: -3px;
  left: -3px;
  cursor: sw-resize;
}

.block-resize-bottom-right {
  bottom: -3px;
  right: -3px;
  cursor: se-resize;
}
</style>
