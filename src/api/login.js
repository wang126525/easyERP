import request from "@/axios";

// 注册
export const register = params =>
  request({ url: "/api/admin/register", method: "post", data: params });
// 用户名校验
export const queryName = params =>
  request({ url: "/api/admin/queryName", method: "post", data: params });
// 登录
export const login = params =>
  request({ url: "/api/admin/login", method: "post", data: params });


 
