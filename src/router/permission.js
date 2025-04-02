// 路由鉴权：判断那个路由可以跳转到那个路由
// nprogress进度条
import nprogress from "nprogress";
// 引入nprogress样式
import "nprogress/nprogress.css";
// 设置不要转动的圆圈
nprogress.configure({ showSpinner: false });
// 获取用户相关的小仓库的token，判断用户是否登录成功
import useUserStore from "@/store/modules/user";
const userStore = useUserStore(pinia);

import router from ".";
import pinia from "@/store";


// 全局前置路由守卫
router.beforeEach(async (to, from, next) => {
    nprogress.start();
    // 获取用户仓库中的token信息
    let token = userStore.token;
    // 获取用户仓库中的用户信息
    let username = userStore.name;
    // 已登录
    if (token) {
        // 不能去登录页
        if (to.path == "/login") {
            next({ path: from.path });
        }
        // 其他都可以去
        else {
            // 如果有用户信息，直接放行
            // if (username) {
            next();
            // }
            // 如果没有就发请求获取用户信息,请求成功后再放行
            //   else {
            //     try {
            //       // 获取用户信息
            //       await userStore.userInfo();
            //       // 万一刷新的时候是异步路由，有可能获取到用户信息但是异步路由没有加载完毕，出现空白效果
            //       next({ ...to }); // 死循环加载，直到路由组件加载完毕
            //     } catch (error) {
            //       // token过期 | 用户手动修改本地token
            //       // 退出登录，用户相关数据清空
            //       await userStore.userLogout();
            //       next({ path: "/login", query: { redirect: to.path } });
            //     }
            //   }
        }
    }
    // 未登录
    else {
        // 只能去登录页
        if (to.path == "/login") {
            next();
        } else {
            next({ path: "/login", query: { redirect: to.path } });
        }
    }
});
// 全局后置路由守卫
router.afterEach((to, _from) => {
    nprogress.done();
});

// 两种情况
// 1.未登录：只能访问login
// 2.已登录：不能访问login，但是可以访问其他路由
