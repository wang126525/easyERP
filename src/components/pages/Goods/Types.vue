<template>
  <div>
    <el-form inline>
      <el-form-item>
        <el-input v-model="addType" clearable placeholder="请输入分类"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"  @click="handleAdd">添加分类</el-button>
      </el-form-item>
      <el-form-item>
        <el-dropdown>
          <el-button type="primary">批量操作</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item type="text">
              <el-button type="text" @click="handleMultiDel"> 批量删除</el-button>
            </el-dropdown-item>
            <el-dropdown-item type="text">
              <el-button type="text" @click="handleMultiUse">批量启用</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiStopUse">批量禁用</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
    </el-form>
    <el-table :data="types" @selection-change="handleSelection">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="goodstypeNum" width="100px" label="分类编号"></el-table-column>
      <el-table-column prop="goodstypeName" width="150px" label="分类名">
        <template slot-scope="scope">
            <el-input v-model="scope.row.goodstypeName" v-show="scope.row.editState" @blur="editSubmit(scope.row)" ></el-input>
          <span v-show="!scope.row.editState" @click="handleEdit(scope.row)">{{scope.row.goodstypeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="goodstypeAddTime" width="150px" label="添加时间"></el-table-column>
      <el-table-column prop="tag" label="状态" width="100"  filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goodstypeState === '已启用' ? 'success':'danger'" close-transition>{{scope.row.goodstypeState?'已启用':'已禁用'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
         <el-button  @click="handleEdit(scope.row)" :type="scope.row.editState?'success':'primary'" size="mini" icon="edit">{{scope.row.editState?'完成':'编辑'}}</el-button>
          <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
          <el-dropdown>
            <el-button type="warning" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.goodstypeState==='已启用'">
                <el-dropdown-item>
                  <el-button type="text" @click="handleStopUse(scope.row)">禁用</el-button>
                </el-dropdown-item>
              </template>
              <el-dropdown-item v-else>
                <el-button type="text" @click="handleUse(scope.row)">启用</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import axios from 'axios'
  import moment from 'moment'
  import {
  add,
  getGoodsTypeList,
  edit,
  delItem,
  delMany,
  editMany
} from "@/api/goodstype.js";
  export default {
    data() {
      return {
        types: [],
        addType: '',
        multipleSelection: [],
        editForm: {
          goodstypeName: '',
          goodstypeNum: ''
        },
        
      }
    },
    mounted(){
      this.getList();
    },
    methods: {
      getList(){
        getGoodsTypeList().then(res=>{
          if(res.status){
            this.types = res.data.data;
          }
        })
      },
      filterTag(value, row) {
        return row.goodstypeState === value;
      },
      _stateChange(state, goodstypeNum, cb) {
        axios.post('api/types/stateChange', {
            goodstypeState: state,
            goodstypeNum: goodstypeNum
          }).then(cb)
          .catch(err => console.log(err))
      },
      handleUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已启用', this.editForm.goodstypeNum, res => {
          this.$message.success('已启用')
          this.queryAll()
        })
      },
      handleStopUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已禁用', this.editForm.goodstypeNum, res => {
          this.$message.success('已禁用')
          this.queryAll()
        })
      },
      _multiStateChange(state, cb) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          let goodstypeNum = multi.map(el => el.goodstypeNum)
          axios.post('api/types/multiStateChange', {
              goodstypeState: state,
              goodstypeNum: goodstypeNum
            })
            .then(cb)
            .catch(err => console.log(err))
        }
      },
      handleMultiUse() {
        this._multiStateChange('已启用', res => {
          this.$message.success('已启用')
          this.queryAll()
        })
      },
      handleMultiStopUse() {
        this._multiStateChange('已禁用', res => {
          this.$message.success('已禁用')
          this.queryAll()
        })
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      handleMultiDel(val) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          this.$confirm('你确定？', '提示', {}).then(() => {
              let goodstypeNum = multi.map(el => el.goodstypeNum)
              axios.post('api/types/multiDel', {
                  goodstypeNum: goodstypeNum
                })
                .then(res => {
                  this.$message.success('删除成功');
                  multi.map(el => {
                    let i = this.types.indexOf(el);
                    this.types.splice(i, 1);
                  })
                  this.queryAll()
                })
                .catch(err => console.log(err))
            })
            .catch(() => {
              this.$message.info('删除取消')
            })
        }
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      queryAll() {
        axios.get('api/types/queryAll')
          .then(res => {
            let key='editState'
            let value=false
            res.data.map(el=>el[key]=value) 
            this.types = res.data
          })
          .catch(err => console.log(err))
      },
      handleAdd() {
        const params = {
          goodstypeName:this.addType,
          goodstypeAddTime:new Date()
        }
        add(params).then(res=>{
          if(res.status){
            this.$message.success("添加成功")
          }
        })
      },
      handleEdit(row) {
        row.editState=!row.editState
        this.editForm = Object.assign({}, row);
      },
      editSubmit(row) {
        axios.post('api/types/update', {
            goodstypeName:row.goodstypeName,
            goodstypeNum:row.goodstypeNum
          }).then(res => {
            this.$message.success('提交成功')
            this.queryAll()
          })
          .catch(err => console.log(err))
      },
      handleDel(row) { console.log(row)
        this.$confirm('删除该记录，确定？', '提示', {
            type: 'warning'
          }).then(() => {
           
            axios.post('api/types/del', {
                goodstypeNum: row.goodstypeNum
              }).then(res => {
                let index = this.types.indexOf(row);
                this.types.splice(index, 1);
                this.$message.success('删除成功')
                this.loading = true
                this.queryAll()
              })
              .catch(err => console.log(err))
          })
          .catch(() => {
            this.$message.info('删除已取消')
          })
      },
    },
    
  }

</script>

<style>


</style>
