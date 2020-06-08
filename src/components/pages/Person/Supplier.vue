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
              <el-button type="text" @click="handleMultiUse" size="mini"
                >批量启用</el-button
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiStopUse" size="mini"
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
                  <el-button type="text" @click="handleStopUse(scope.row)"
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
import axios from "axios";
import { add, getSupplierList } from "@/api/supplier.js";
import tableItems from "@/assets/data/supplier.json";
import cities from "@/assets/city/cities.json";
export default {
  name: "employee",
  data() {
    return {
      currowdata: {},
      tableItems: tableItems.tableColumn,
      checked: true,
      suppliers: [],
      loading: false,
      total: 0,
      page: 1,
      multipleSelection: [],
      loading: false,
      filters: {
        supNo: "",
        supplierName: ""
      },
      editVisible: false,
      addVisible: false,
      rules: tableItems.rules,
      editForm: tableItems.editform,
      addForm: tableItems.addform,
      CityInfo: cities,
      option: {
        edit: {
          supplierCompanyAddr: [],
          supplierCompanyAddrDetail: ""
        },
        add: {
          supplierCompanyAddr: [],
          supplierCompanyAddrDetail: ""
        }
      }
    };
  },
  mounted() {
    this.queryAll();
    this.getList();
  },
  methods: {
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
    handleCurrentChange(val) {
      console.log("page", val);
      this.page = val;
      this.getList();
    },
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

    _multiStateChange(state, cb) {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择");
      } else {
        let multi = this.multipleSelection;
        let supNo = multi.map(el => el.supNo);
        axios
          .post("api/supplier/multiStateChange", {
            supplierIsUse: state,
            supNo: supNo
          })
          .then(cb)
          .catch(err => console.log(err));
      }
    },
    handleMultiUse() {
      this._multiStateChange("已启用", res => {
        this.$message.success("已启用");
        this.queryAll();
      });
    },
    handleMultiStopUse() {
      this._multiStateChange("已停用", res => {
        this.$message.success("已停用");
        this.queryAll();
      });
    },
    handleSelection(val) {
      this.multipleSelection = val;
    },
    handleMultiDel() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择");
      } else {
        this.$confirm("你确定？", "提示", {})
          .then(() => {
            let multi = this.multipleSelection;
            let supNo = multi.map(el => el.supNo);
            axios
              .post("api/supplier/multiDel", {
                supNo: supNo
              })
              .then(res => {
                this.$message.success("删除成功");
                multi.forEach(el => {
                  let i = this.suppliers.indexOf(el);
                  this.suppliers.splice(i, 1);
                });
                this.loading = true;
                this.queryAll();
                this.loading = false;
              })
              .catch(err => console.log(err));
          })
          .catch(() => {
            this.$message.info("删除取消");
          });
      }
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    queryAll() {
      // axios
      //   .get("api/supplier/queryAll")
      //   .then(res => {
      //     this.suppliers = res.data;
      //     this.pageCount = Math.ceil(this.suppliers.length / 10);
      //   })
      //   .catch(err => console.log(err));
    },
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    handleReflash() {
      this.loading = true;
      this.queryAll();
      this.filters.supplierName = "";
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    handleEdit(row) {
      this.addVisible = true;
      this.addForm = {
                supplierName: row.supplierName,
                supplierLegalPerson: row.supplierLegalPerson,
                supplierPhone: row.supplierPhone,
                supplierCompanyAddr: row.supplierCompanyAddr
              };
              this.option.add.supplierCompanyAddr = supplierCompanyAddr.split(" ");
              this.option.add.supplierCompanyAddrDetail = row.supplierCompanyAddrDetail;

    },
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.addForm);
          add({
            supplierName: params.supplierName,
            supplierLegalPerson: params.supplierLegalPerson,
            supplierPhone: params.supplierPhone,
            supplierCompanyAddr: this.option.add.supplierCompanyAddr
              .toString()
              .replace(/,/g, " "),
            supplierCompanyAddrDetail: this.option.add
              .supplierCompanyAddrDetail,
            supplierIsUse: false
          }).then(res => {
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
      });
    },
    handleDel(row) {
      this.$confirm("删除该记录，确定？", "提示", {
        type: "warning"
      })
        .then()
        .catch();
    }
  }
};
</script>
