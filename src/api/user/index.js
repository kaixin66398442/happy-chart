// 统一管理项目user相关请求函数

import request from "@/utils/request";

// user相关接口
const baseURL = import.meta.env.VITE_API_BASE_URL
// 登录
const loginURL = baseURL + '/api/login'
// 注册
const registerURL = baseURL + '/api/register'

// 请求函数
// 登录
export const reqLogin = (data) => {
    return request.post(loginURL, data)
}
// 注册
export const reqRegister = (data) => {
    const { username, firstPassword } = data
    return request.post(registerURL, { username, password: firstPassword })
}

