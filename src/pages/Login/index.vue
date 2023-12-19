<template>
  <div class="login-container">
    <!-- 登录盒子 -->
    <div class="login-box" v-if="isLoginShow">
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="formRules"
        ref="loginFormRef"
      >
        <h1>happy-chart</h1>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            v-model="loginForm.username"
            placeholder="用户名"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            :prefix-icon="Lock"
            type="password"
            show-password
            v-model="loginForm.password"
            placeholder="密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            class="login-btn"
            @click="login"
            :loading="loginLoading"
            >登录</el-button
          >
        </el-form-item>
        <div class="switch-box">
          <span @click="isLoginShow = false">没有账号？前往注册</span>
        </div>
      </el-form>
    </div>
    <!-- 注册盒子 -->
    <div class="register-box" v-else>
      <el-form
        class="register-form"
        :model="registerForm"
        :rules="formRules"
        ref="registerFormRef"
      >
        <h1>happy-chart</h1>
        <el-form-item prop="username">
          <el-input
            :prefix-icon="User"
            placeholder="用户名"
            v-model="registerForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="firstPassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="密码"
            v-model="registerForm.firstPassword"
          ></el-input>
        </el-form-item>
        <el-form-item prop="secondPassword">
          <el-input
            :prefix-icon="Lock"
            type="password"
            show-password
            placeholder="确认密码"
            v-model="registerForm.secondPassword"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="default"
            class="register-btn"
            @click="register"
            :loading="registerLoading"
            >注册</el-button
          >
        </el-form-item>
        <div class="switch-box">
          <span @click="isLoginShow = true">前往登录</span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";
// 导入表单验证规则
import formRules from "./validate";
// 导入仓库
import useUserStore from "@/store/modules/user.js";
// 控制登录注册盒子切换
const isLoginShow = ref(true);
// 收集登录表单信息
const loginForm = reactive({
  username: "happy",
  password: "211543326",
});
// 收集注册表单信息
const registerForm = reactive({
  username: "",
  firstPassword: "",
  secondPassword: "",
});
// user仓库
const userStore = useUserStore();
// 获取登录表单组件和注册表单组件
const loginFormRef = ref();
const registerFormRef = ref();
// 获取路由器对象
const $router = useRouter();
// loading状态
let loginLoading = ref(false);
let registerLoading = ref(false);
// 登录按钮回调函数
const login = async () => {
  // 保证表单通过校验才发送请求
  // 表单组件身上的validate方法可以对整个表单的内容进行验证，返回promise
  await loginFormRef.value.validate();
  // 开始加载
  loginLoading.value = true;
  try {
    // 通知仓库发送请求
    await userStore.userLogin(loginForm);
    // 路由跳转
    $router.push({ path: "/home" });
    // 登录成功提示信息
    ElNotification({
      type: "success",
      message: "登录成功！",
    });
  } catch (error) {
    // 登录失败的提示信息
    ElNotification({
      type: "error",
      message: error.message,
    });
  } finally {
    // 不论登录成功失败加载效果消失
    loginLoading.value = false;
  }
};
// 注册按钮回调函数
const register = async () => {
  // 注册之前要保证所有表单验证通过
  await registerFormRef.value.validate();
  // 开始加载
  registerLoading.value = true;
  try {
    // 通知仓库发送请求
    await userStore.userRegister(registerForm);
    // 注册成功提示信息
    ElNotification({
      type: "success",
      message: "注册成功，马上去登录吧！",
    });
  } catch (error) {
    // 注册失败的提示信息
    ElNotification({
      type: "error",
      message: error.message,
    });
  } finally {
    // 不论登录成功失败加载效果消失
    registerLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.login-container {
  position: relative;
  width: 100%；;
  height: 100vh;
  background-color: #f6f8f9;
  background-size: cover;
  overflow: hidden;
  // 登录盒子
  .login-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: #fff;
    border-radius: 20px;
    border: 2px solid #000;
    .login-form {
      width: 70%;
      height: 100%;
      margin: 0 auto;
      padding: 40px;
      h1 {
        margin-bottom: 20px;
        color: #000;
        font-weight: 900;
        text-align: center;
      }
      .login-btn {
        width: 100%;
      }
    }
  }
  // 注册盒子
  .register-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background-color: #fff;
    border-radius: 20px;
    border: 2px solid #000;
    .register-form {
      width: 70%;
      height: 100%;
      margin: 0 auto;
      padding: 40px;
      h1 {
        margin-bottom: 20px;
        color: #000;
        font-weight: 900;
        text-align: center;
      }
      .register-btn {
        width: 100%;
      }
    }
  }
  // 切换按钮
  .switch-box {
    display: flex;
    justify-content: center;
    font-size: 12px;
    color: #409eff;
    width: 100%;
    span {
      cursor: pointer;
    }
  }
}
</style>
