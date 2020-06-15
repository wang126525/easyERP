import request from "@/axios";

// 添加商品
export const add = params =>
  request({ url: "/api/goods/add", method: "post", data: params });

// 获取商品列表
export const getGoodsList = params =>
  request({ url: "/api/goods/pagination", method: "get", params: params });

// 编辑商品
export const edit = params =>
  request({ url: "/api/goods/edit", method: "post", data: params });

// 批量编辑商品
export const editMany = params =>
  request({ url: "/api/goods/editMany", method: "post", data: params });

// 删除商品
export const delItem = params =>
  request({ url: "/api/goods/delete", method: "post", data: params });

// 批量删除商品
export const delMany = params =>
  request({ url: "/api/goods/deleteMany", method: "post", data: params });
