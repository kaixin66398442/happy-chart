// 对axios进行二次封装
import axios from "axios";
import useUserStore from "@/store/modules/user";
import { ElMessage } from "element-plus"

// 创建axios实例
let request = axios.create({
    // 基础路径
    // baseURL: '',
    // 超时时间
    timeout: 5000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})

// 请求拦截器
request.interceptors.request.use((config) => {
    // 获取user仓库中token，发送请求是携带给服务器
    const userStore = useUserStore();
    if (userStore.token) {
        config.headers.token = userStore.token;
    }
    // 返回配置对象
    // config对象的headers属性请求头，经常给服务器携带公共参数
    return config;
});
// 响应拦截器
// request.interceptors.response.use(
//     (response) => {
//         // 成功回调
//         // 简化数据
//         return response.data;
//     },
//     (error) => {
//         // 失败回调：处理http网络错误
//         // 定义一个变量存储网络错误信息
//         let msg = "";
//         let status = error.response.status;
//         console.log(status)

//         switch (status) {
//             case 401:
//                 msg = "token过期";
//                 break;
//             case 403:
//                 msg = "无权访问";
//                 break;
//             case 404:
//                 msg = "请求地址错误";
//                 break;
//             case 500:
//                 msg = "服务器出现问题";
//                 break;
//             default:
//                 msg = "网络出现问题";
//         }
//         // 弹出错误提示信息
//         ElMessage({
//             type: "error",
//             message: msg,
//         });

//         return Promise.reject(error);
//     }
// );

// 导出
export default request;