import request from "@/axios";

// 添加员工
export const add = params =>
  request({ url: "/api/goods/add", method: "post", data: params });

// 获取员工列表
export const getGoodsList = params =>
  request({ url: "/api/goods/pagination", method: "get", params: params });

// 编辑员工
export const edit = params =>
  request({ url: "/api/goods/edit", method: "post", data: params });

// 批量编辑员工
export const editMany = params =>
  request({ url: "/api/goods/editMany", method: "post", data: params });

// 删除员工
export const delItem = params =>
  request({ url: "/api/goods/delete", method: "post", data: params });

// 批量删除员工
export const delMany = params =>
  request({ url: "/api/goods/deleteMany", method: "post", data: params });
