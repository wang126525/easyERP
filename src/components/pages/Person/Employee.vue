<template>
  <div class="employee">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input
          v-model="filters.empName"
          clearable
          @keydown.enter.native="handleSearch"
          placeholder="请输入关键字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleSearch">
          <i class="el-icon-search"></i>查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="addVisible = true">
          <i class="el-icon-plus"></i>新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="mini" @click="handleMultiDel">
          <i class="el-icon-delete"></i> 批量删除</el-button
        >
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table
      :data="users"
      max-height="540"
      @selection-change="handleSelection"
      v-loading="loading"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column type="expand" label="展开">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="生日:">
              <span>{{ props.row.empBirthday }}</span>
            </el-form-item>
            <el-form-item label="身份证:">
              <span>{{ props.row.empIdCard }}</span>
            </el-form-item>
            <el-form-item label="家庭住址:">
              <span>{{ props.row.empAddress }}</span>
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
            :type="scope.row.empState ? 'success' : 'danger'"
            close-transition
            >{{ scope.row.empState ? "在职" : "离职" }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)"
            >编辑</el-button
          >
          <el-button @click="handleDel(scope.row)" type="danger" size="mini"
            >删除</el-button
          >
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
      title="新增信息"
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
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="addForm.empName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="empAge">
          <el-input v-model="addForm.empAge" :min="0" :max="100"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="empSex">
          <el-select v-model="addForm.empSex" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证" prop="empIdCard">
          <el-input v-model="addForm.empIdCard"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="empTel">
          <el-input v-model="addForm.empTel"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="empQQ">
          <el-input v-model="addForm.empQQ"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="empBirthday">
          <el-date-picker
            v-model="addForm.empBirthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职时间" prop="empEntryDate">
          <el-date-picker
            v-model="addForm.empEntryDate"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" prop="empAddress">
          <el-cascader
            :options="CityInfo"
            v-model="option.add.addrCity"
            :clearable="true"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细住址" placeholder="街道/小区">
          <el-input v-model="option.add.addrDetail"></el-input>
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
import {
  add,
  getEmployeeList,
  edit,
  delItem,
  delMany,
  editMany
} from "@/api/employee.js";
import tableItems from "@/assets/data/employee.json";
import cities from "@/assets/city/cities.json";
export default {
  name: "employee",
  data() {
    return {
      currowdata: {},
      tableItems: tableItems.tableColumn,
      users: [],
      loading: false,
      pageCount: 0,
      page: 1,
      total: 0,
      multipleSelection: [],
      filters: {
        empName: ""
      },
      options: [
        {
          value: "男",
          label: "男"
        },
        {
          value: "女",
          label: "女"
        }
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
      getEmployeeList({
        page: parseInt(this.page),
        content: this.filters.empName
      }).then(res => {
        if (res.status) {
          this.users = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    // 弹窗关闭事件
    closeAddDialog() {
      this.currowdata = {};
      this.addForm = {
        empName: "",
        empAge: "",
        empSex: "",
        empBirthday: "",
        empIdCard: "",
        empTel: "",
        empQQ: "",
        empEntryDate: ""
      };
      this.option.add.addrCity = [];
      this.option.add.addrDetail = "";
    },
    // 表格选中事件
    handleSelection(val) {
      this.multipleSelection = val;
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
    // 模糊查询
    handleSearch() {
      this.page = 1;
      this.getList();
    },
    // 行内编辑
    handleEdit(row) {
      this.addVisible = true;
      this.currowdata = { ...row };
      const data = row;
      this.addForm = {
        empName: data.empName,
        empAge: data.empAge,
        empSex: data.empSex,
        empBirthday: data.empBirthday,
        empIdCard: data.empIdCard,
        empTel: data.empTel,
        empQQ: data.empQQ,
        empEntryDate: data.empEntryDate
      };
      this.option.add.addrCity = data.empAddress.split(" ");
      this.option.add.addrDetail = data.empAddressDetail;
    },
    // 添加、编辑保存
    addSubmit() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.addForm);
          const data = {
            empName: params.empName,
            empAge: params.empAge,
            empSex: params.empSex,
            empBirthday: params.empBirthday,
            empIdCard: params.empIdCard,
            empTel: params.empTel,
            empQQ: params.empQQ,
            empAddress: this.option.add.addrCity.toString().replace(/,/g, " "),
            empAddressDetail: this.option.add.addrDetail,
            empEntryDate: params.empEntryDate
          };
          if (this.currowdata.empName) {
            edit({ ...data, empNum: this.currowdata.empNum }).then(res => {
              console.log(res);
              if (res.status) {
                this.$message.success("编辑成功");
                this.addVisible = false;
                this.page = 1;
                this.getList();
              }
            });
          } else {
            add(data).then(res => {
              console.log(res);
              if (res.status) {
                this.$message.success("添加成功");
                this.addVisible = false;
                this.page = 1;
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
      }).then(() => {
        delItem({ empNum: row.empNum }).then(res => {
          if (res.status) {
            this.$message.success("删除成功");
            this.page = 1;
            this.getList();
          }
        })
      })
    },
    // 分页事件
    handleCurrentChange(val) {
      this.page = val;
    }
  }
};
</script>
