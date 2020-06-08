import request from "@/axios";

// 添加供应商
export const add = params =>
  request({ url: "/api/supplier/add", method: "post", data: params });

// 添加供应商
export const getSupplierList = params =>
  request({ url: "/api/supplier/pagination", method: "get", params: params });
