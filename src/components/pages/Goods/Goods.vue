<template>
  <div class="goods">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input
          v-model="filters.goodsName"
          clearable
          @keydown.enter.native="handleKey"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="mini">
          <i class="el-icon-search"></i>查找</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addVisible = true" size="mini">
          <i class="el-icon-plus"></i>新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-dropdown>
          <el-button type="danger" size="mini">批量操作</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiDel" size="mini">
                批量删除
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiUse(true)" size="mini"
                >批量上架</el-button
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiUse(false)" size="mini"
                >批量下架</el-button
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="goods"
      max-height="540"
      @selection-change="handleSelection"
      style="margin-top:-10px"
      v-loading="loading"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="expand" label="展开">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="单位:">
              <span>{{ props.row.goodsUnit }}</span>
            </el-form-item>
            <el-form-item label="供应商:">
              <span>{{ props.row.supplierName }}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{ props.row.goodsAddTime }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label">
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.goodsState ? 'success' : 'danger'"
            close-transition
            >{{ scope.row.goodsState ? "已上架" : "已下架" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button @click="handleDel(scope.row)" type="danger" size="mini"
            >删除</el-button
          >
          <el-dropdown>
            <el-button type="warning" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.goodsState">
                <el-dropdown-item>
                  <el-button type="text" @click="handleUse(scope.row)"
                    >下架</el-button
                  >
                </el-dropdown-item>
              </template>
              <el-dropdown-item v-else>
                <el-button type="text" @click="handleUse(scope.row)"
                  >上架</el-button
                >
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      background
      layout="total, prev, pager, next, jumper"
      :total="total"
      :current-page.sync="page"
      :page-size="10"
    >
    </el-pagination>
    <!-- 新增框 -->
    <el-dialog
      title="添加信息"
      :visible.sync="addVisible"
      @close="closeAddDialog"
    >
      <el-form
        v-if="addVisible"
        :model="addForm"
        :inline="true"
        label-width="80px"
        :rules="rules"
        ref="addForm"
      >
        <el-form-item label="商品名" prop="goodsName">
          <el-input v-model="addForm.goodsName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-select v-model="addForm.goodsType" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.goodsType"
              :value="item.goodsType"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="goodsUnit">
          <el-select v-model="addForm.goodsUnit" placeholder="请选择">
            <el-option
              v-for="item in units"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="goodsModel">
          <el-input v-model="addForm.goodsModel"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="goodsSpec">
          <el-input v-model="addForm.goodsSpec"></el-input>
        </el-form-item>
        <el-form-item label="进价" prop="stockPrice">
          <el-input v-model="addForm.stockPrice"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goodsPrice">
          <el-input v-model="addForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplierName">
          <el-select v-model="addForm.supplierName" placeholder="请选择">
            <el-option
              v-for="item in suppliers"
              :key="item.id"
              :value="item.id"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
.avatar {
  font-size: 12px;
}
</style>
<script>
import tableItems from "@/assets/data/goods.json";
import axios from "axios";
import {
  add,
  getGoodsList,
  edit,
  delItem,
  delMany,
  editMany
} from "@/api/goods.js";
import cities from "@/assets/city/cities.json";
import moment from "moment";
export default {
  name: "goods",
  data() {
    return {
      curRowData: {},
      tableItems: tableItems.tableColumn,
      goods: [],
      suppliers: [
        { id: "165165165", label: "165165165" },
        { id: "efstfsef", label: "fsdfsdfsdf" },
        { id: "fsdfsdfsdfs", label: "1651fsdfsdf65165" },
        { id: "sdf", label: "fsdf" }
      ],
      loading: false,
      pageCount: 0,
      total: 0,
      page: 1,
      multipleSelection: [],
      filters: {
        goodsNo: "",
        goodsName: "",
        goodsType: ""
      },
      units: tableItems.units,
      types: [
        { goodsType: "1", label: "烟" },
        { goodsType: "2", label: "酒" },
        { goodsType: "3", label: "饮料" },
        { goodsType: "4", label: "方便面" }
      ],
      editVisible: false,
      addVisible: false,
      rules: tableItems.rules,
      editForm: tableItems.editform,
      addForm: tableItems.addform,
      CityInfo: cities, //地区数据
      option: {
        edit: {
          addrCity: [],
          addrDetail: ""
        },
        add: {
          addrCity: [],
          addrDetail: ""
        }
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 获取数据列表
    getList() {
      getGoodsList({ content: this.filters.goodsName, page: this.page }).then(
        res => {
          console.log(res);
          if (res.status) {
            this.goods = res.data.data;
            this.total = res.data.total;
          }
        }
      );
    },
    // 添加商品
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.addForm);
          let goodsAddTime = new Date();
          const data = {
            goodsName: params.goodsName,
            goodsType: params.goodsType,
            goodsUnit: params.goodsUnit,
            goodsModel: params.goodsModel,
            goodsSpec: params.goodsSpec,
            stockPrice: parseInt(params.stockPrice),
            goodsPrice: parseInt(params.goodsPrice),
            supplierName: params.supplierName,
            goodsAddTime: goodsAddTime
          };
          if (this.curRowData.goodsNum) {
            edit({...data,goodsNum:this.curRowData.goodsNum}).then(res=>{
              if(res.status){
                this.$message.success("编辑成功");
                this.addVisible = false;
                this.getList();
              }
            })
          } else {
            add(data).then(res => {
              if(res.status){
                this.$message.success("添加成功");
                this.addVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    // 编辑
    handleEdit(row) {
      const rowdata = { ...row };
      this.curRowData = { ...row };
      this.addForm = {
        goodsName: rowdata.goodsName,
        goodsType: rowdata.goodsType,
        goodsUnit: rowdata.goodsUnit,
        goodsModel: rowdata.goodsModel,
        goodsSpec: rowdata.goodsSpec,
        stockPrice: rowdata.stockPrice,
        goodsPrice: rowdata.goodsPrice,
        supplierName: rowdata.supplierName
      };
      this.addVisible = true;
    },
    // 窗口关闭事件
    closeAddDialog() {
      this.curRowData = {};
      this.addForm = {
        goodsName: "",
        goodsType: "",
        goodsUnit: "",
        goodsModel: "",
        goodsSpec: "",
        goodsPrice: "",
        supplierName: ""
      };
      this.addVisible = false;
    },
    // 行内删除
    handleDel(row) {
      this.$confirm("删除该记录，确定？", "提示", {
        type: "warning"
      }).then(() => {
        delItem({ goodsNum: row.goodsNum }).then(res => {
          if (res.status) {
            this.$message.success("删除成功");
            this.page = 1;
            this.getList();
          }
        })
      })
    },
    // 模糊查询
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    // 多选删除
    handleMultiDel() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择");
      } else {
        this.$confirm("你确定？", "提示", {}).then(() => {
          let multi = this.multipleSelection;
          let empNum = multi.map(el => el.empNum);
          delMany(multi).then(res => {
            if (res.status) {
              this.$message.success("删除成功");
              this.page = 1;
              this.getList();
            }
          });
        });
      }
    },
    // 批量上下架
    handleMultiUse(type) {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择");
      } else {
        const str = type?'启用':'停用';
        this.$confirm(`确定要批量${str}吗？`, "提示", {}).then(() => {
            editMany({list:this.multipleSelection,type}).then(res=>{
              console.log(res)
              if(res.status){
                this.$message.success("操作成功")
                this.page = 1;
                this.getList();
              }
            })
          }).catch(err=>{
          })

      }

    },
    // 行内启用
    handleUse(row){
      const params = {...row};
      const use = row.goodsState;
      params.goodsState = !use;
      edit(params).then(res=>{
        if(res.status){
          row.goodsState = !use;
          this.$message.success("启用成功");
        }
      })
    },
    // 分页查询
    handleCurrentChange(val) {
      console.log("page", val);
      this.page = val;
      this.getList();
    },
    // 监听表格选中
    handleSelection(val) {
      this.multipleSelection = val;
      console.log(val);
    },
  }
};
</script>
