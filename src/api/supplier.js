import request from "@/axios";

// 添加供应商
export const add = params =>
  request({ url: "/api/supplier/add", method: "post", data: params });

// 获取供应商列表
export const getSupplierList = params =>
  request({ url: "/api/supplier/pagination", method: "get", params: params });

// 编辑供应商
export const edit = params =>
  request({ url: "/api/supplier/edit", method: "post", data: params });

// 批量编辑供应商
export const editMany = params =>
  request({ url: "/api/supplier/editMany", method: "post", data: params });

// 删除供应商
export const delItem = params =>
  request({ url: "/api/supplier/delete", method: "post", data: params });

// 批量删除供应商
export const delMany = params =>
  request({ url: "/api/supplier/deleteMany", method: "post", data: params });
