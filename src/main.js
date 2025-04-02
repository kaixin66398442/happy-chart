import { createApp } from 'vue'
import App from '@/App.vue'
// 引入路由
import router from "./router";
// 引入element-plus组件与样式
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
// 引入全局样式
import '@/styles/index.scss'
// 引入仓库
import pinia from "./store";
// 引入路由鉴权文件
import "@/router/permission";

// 获取应用实例对象
const app = createApp(App)

// 将SvgIcon组件注册为全局组件
import SvgIcon from "@/components/SvgIcon/index.vue";
app.component("SvgIcon", SvgIcon);
// 引入iconfont.js
import '@/assets/iconfont/iconfont.js';

// 安装ElementPlus插件，并配置ElementPlus国际化
app.use(ElementPlus, {
    locale: zhCn,
});

// 注册路由
app.use(router);

// 安装仓库pinia
app.use(pinia);

import VueResizeObserver from "vue-resize-observer";
app.use(VueResizeObserver)

// 将应用挂载到挂载点上
app.mount("#app");
