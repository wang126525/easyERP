<template>
  <div class="supplier">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input
          v-model="filters.supplierName"
          clearable
          @keydown.enter.native="handleSearch"
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
                >批量启用</el-button
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiUse(false)" size="mini"
                >批量停用</el-button
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="suppliers"
      max-height="540"
      @selection-change="handleSelection"
      style="margin-top:-10px"
      v-loading="loading"
    >
      <el-table-column type="selection"> </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label">
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.supplierIsUse ? 'success' : 'danger'"
            close-transition
            >{{ scope.row.supplierIsUse ? "已启用" : "已停用" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210">
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
              <template v-if="scope.row.supplierIsUse">
                <el-dropdown-item>
                  <el-button type="text" @click="handleUse(scope.row)"
                    >停用</el-button
                  >
                </el-dropdown-item>
              </template>
              <el-dropdown-item v-else>
                <el-button type="text" @click="handleUse(scope.row)"
                  >启用</el-button
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

    <!-- 新增/编辑框 -->
    <el-dialog
      :title="currowdata.supplierNum ? '编辑供应商' : '添加供应商'"
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
        <el-form-item label="供应商名" prop="supplierName">
          <el-input
            v-model="addForm.supplierName"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="supplierLegalPerson">
          <el-input
            v-model="addForm.supplierLegalPerson"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="supplierPhone">
          <el-input v-model="addForm.supplierPhone"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="supplierCompanyAddr">
          <el-cascader
            :options="CityInfo"
            v-model="option.add.supplierCompanyAddr"
            :clearable="true"
            :filterable="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" placeholder="街道/小区">
          <el-input v-model="option.add.supplierCompanyAddrDetail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { add, getSupplierList,edit,delItem,delMany,editMany } from "@/api/supplier.js";
import tableItems from "@/assets/data/supplier.json";
import cities from "@/assets/city/cities.json";
export default {
  name: "employee",
  data() {
    return {
      currowdata: {},//当前操作行数据
      tableItems: tableItems.tableColumn,//表格字段名称
      suppliers: [],//表格数据
      loading: false,
      total: 0,//总数
      page: 1,//当前页
      multipleSelection: [],//表格多选项
      filters: {//关键字查询
        supNo: "",
        supplierName: ""
      },
      addVisible: false,//弹窗是否开启
      rules: tableItems.rules,//表单验证规则
      addForm: tableItems.addform,//表单字段 
      CityInfo: cities,//城市列表
      option: {//表单字段地址信息
        add: {
          supplierCompanyAddr: [],
          supplierCompanyAddrDetail: ""
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
      getSupplierList({
        page: parseInt(this.page),
        content: this.filters.supplierName
      }).then(res => {
        if (res.status) {
          this.suppliers = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    // 分页查询
    handleCurrentChange(val) {
      console.log("page", val);
      this.page = val;
      this.getList();
    },
    // 弹窗关闭事件
    closeAddDialog() {
      this.currowdata = {};
      this.addForm = {
        supplierName: "",
        supplierLegalPerson: "",
        supplierPhone: "",
        supplierCompanyAddr: ""
      };
      this.option.add.supplierCompanyAddr = [];
      this.option.add.supplierCompanyAddrDetail = "";
    },
    // 行内启用
    handleUse(row){
      const params = {...row};
      const use = row.supplierIsUse;
      params.supplierIsUse = !use;
      edit(params).then(res=>{
        if(res.status){
          row.supplierIsUse = !use;
          this.$message.success("启用成功");
        }
      })

    },
    // 批量启用停用
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
    // 监听表格选中
    handleSelection(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    // 批量删除
    handleMultiDel() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择");
      } else {
        this.$confirm("确定删除吗？", "提示", {}).then(() => {
            delMany(this.multipleSelection).then(res=>{
              console.log(res)
              if(res.status){
                this.$message.success("删除成功")
                this.page = 1;
                this.getList();
              }
            })
          }).catch(err=>{
          })

      }
    },
    // 搜索查询
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    // 行内编辑
    handleEdit(row) {
      this.addVisible = true;
      this.currowdata = {...row};
      this.addForm = {
        supplierName: row.supplierName,
        supplierLegalPerson: row.supplierLegalPerson,
        supplierPhone: row.supplierPhone,
        supplierCompanyAddr: row.supplierCompanyAddr
      };
      this.option.add.supplierCompanyAddr = row.supplierCompanyAddr.split(" ");
      this.option.add.supplierCompanyAddrDetail = row.supplierCompanyAddrDetail;
    },
    // 新增或编辑
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.addForm);
          const data = {
            supplierName: params.supplierName,
            supplierLegalPerson: params.supplierLegalPerson,
            supplierPhone: params.supplierPhone,
            supplierCompanyAddr: this.option.add.supplierCompanyAddr.toString().replace(/,/g, " "),
            supplierCompanyAddrDetail: this.option.add.supplierCompanyAddrDetail,
          };
          if (this.currowdata.supplierNum) {
            edit({...data,supplierNum:this.currowdata.supplierNum}).then(res=>{
              if (res.status) {
                this.$message.success("编辑成功");
                this.addForm = {
                  supplierName: "",
                  supplierLegalPerson: "",
                  supplierPhone: "",
                  supplierCompanyAddr: ""
                };
                this.option.add.supplierCompanyAddr = [];
                this.option.add.supplierCompanyAddrDetail = "";
                this.addVisible = false;
                this.getList();
              }
            })
          } else {
            add(data).then(res => {
              if (res.status) {
                this.$message.success("添加成功");
                this.addForm = {
                  supplierName: "",
                  supplierLegalPerson: "",
                  supplierPhone: "",
                  supplierCompanyAddr: ""
                };
                this.option.add.supplierCompanyAddr = [];
                this.option.add.supplierCompanyAddrDetail = "";
                this.addVisible = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    // 行内删除
    handleDel(row) {
      this.$confirm("删除该记录，确定？", "提示", {
        type: "warning"
      }).then(()=>{
        delItem(row).then(res=>{
            console.log(res)
            if(res.status){
              this.$message.success("删除成功");
              this.page = 1;
              this.getList();
            }
          })
      }).catch();

    }
  }
};
</script>
