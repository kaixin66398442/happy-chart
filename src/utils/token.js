// 封装本地存储保存和获取数据的方法
export const SET_TOKEN = (token) => {
  localStorage.setItem("TOKEN", token);
};
export const GET_TOKEN = () => {
  return localStorage.getItem("TOKEN");
};
export const REMOVE_TOKEN = () => {
  return localStorage.removeItem("TOKEN");
};