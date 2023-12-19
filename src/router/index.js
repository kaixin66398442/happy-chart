import { createWebHashHistory, createRouter } from "vue-router";

// 定义路由
const routes = [
    // 登录
    {
        path: '/login',
        component: () => import('@/pages/Login/index.vue') // 路由懒加载 
    },
    // 主页
    {
        path: '/home',
        component: () => import('@/pages/Home/index.vue') // 路由懒加载 
    },
    // 编辑页
    {
        path: '/',
        component: () => import('@/pages/Editor/index.vue') // 路由懒加载 
    },
]

// 创建路由器
const router = createRouter({
    // 路由模式hash
    history:createWebHashHistory(),
    routes,
})

// 导出
export default router

