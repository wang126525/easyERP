import request from "@/axios";

// 添加员工
export const add = params =>
  request({ url: "/api/employee/add", method: "post", data: params });

// 获取员工列表
export const getEmployeeList = params =>
  request({ url: "/api/employee/pagination", method: "get", params: params });

// 编辑员工
export const edit = params =>
  request({ url: "/api/employee/edit", method: "post", data: params });

// 删除员工
export const delItem = params =>
  request({ url: "/api/employee/delete", method: "post", data: params });

// 批量删除员工
export const delMany = params =>
  request({ url: "/api/employee/deleteMany", method: "post", data: params });
