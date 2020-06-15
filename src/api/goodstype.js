import request from "@/axios";

// 添加商品分类
export const add = params =>
  request({ url: "/api/goodstype/add", method: "post", data: params });

// 获取商品分类列表
export const getGoodsTypeList = params =>
  request({ url: "/api/goodstype/pagination", method: "get", params: params });

// 编辑商品分类
export const edit = params =>
  request({ url: "/api/goodstype/edit", method: "post", data: params });

// 批量编辑商品分类
export const editMany = params =>
  request({ url: "/api/goodstype/editMany", method: "post", data: params });

// 删除商品分类
export const delItem = params =>
  request({ url: "/api/goodstype/delete", method: "post", data: params });

// 批量删除商品分类
export const delMany = params =>
  request({ url: "/api/goodstype/deleteMany", method: "post", data: params });
