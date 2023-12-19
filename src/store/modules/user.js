// user小仓库，存放与user有关的信息
import { defineStore } from "pinia";
// 引入接口方法
import { reqLogin,reqRegister } from "@/api/user";
// 引入本地存储保存和获取token的方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from "@/utils/token";

const useUserStore = defineStore('user', {
    // 数据
    state: () => {
        return {
            token: GET_TOKEN(), // 用户唯一标识token
            username: '',
        }
    },
    actions: {
        // 定义方法发送登录请求
        async userLogin(data) {
            let result = await reqLogin(data)
            // 成功
            if (result.status === 0) {
                this.token = result.token;
                // 本地存储持久化token
                SET_TOKEN(result.token);
                return "ok";
            } else {
                return Promise.reject(new Error(result.message));
            }
        },
        // 定义方法发送注册请求
        async userRegister(data) {
            let result = await reqRegister(data)
            console.log(result)
            // 成功
            if (result.status === 0) {
                return "ok";
            } else {
                return Promise.reject(new Error(result.message));
            }
        }
    }
})

// 导出
export default useUserStore