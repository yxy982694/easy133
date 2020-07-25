<template>
<div class="resource-container children-tab-container">
  <div class="children-container">
    <!-- 搜索框 -->
    <div class="search-container">
      <el-input type="text" v-model="usernameVal"  placeholder="用户名"></el-input>
      <kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.search')" @click="searchUserName"></kt-button>
    </div>
    <!-- 按钮组 -->
    <div class="btn-container">
        <kt-button type="primary" icon="fa fa-calendar" :label="$t('action.add')" @click="addInfo"></kt-button>
        <kt-button icon="fa fa-edit" :disabled="editAble" :label="$t('action.edit')" @click="editInfo"></kt-button>
        <kt-button type="danger" icon="fa fa-trash" :disabled="editAble" :label="$t('action.delete')" @click="deleteInfo"></kt-button>
        <kt-button type="primary" icon="fa fa-calendar" :disabled="editAble" label="启用"></kt-button>
        <kt-button type="primary" icon="fa fa-calendar" :disabled="editAble" label="停用"></kt-button>
        <kt-button type="primary" icon="fa fa-calendar" :disabled="editAble" @click="grantRoleFn" label="授权"></kt-button>
        <kt-button type="primary" icon="fa fa-calendar" :disabled="editAble" label="批量授权"></kt-button>
    </div>
    <!-- 表格内容 -->
    <kt-table ref="ktTable"
      :loading="loading"
      :columns="columns"
      :dataArr="tableData"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @selectAll="selectAll"
      @selectionChange="selectionChange"
      @clickCell="clickCell"
      @changeShortCutInfo="changeShortCutInfo"
      :currentPage="currentPage"
      :pageSizes="pageSizes"
      :pageSize="pageSize"
      :total="total">
    </kt-table>
    <!--‘新增’或编辑弹框-->
  </div>
  <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm"
      label-position="right">
      <el-form-item label="id" prop="id" v-if="false">
        <el-input v-model="dataForm.id" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色中文名称" prop="nameCn">
        <el-input v-model="dataForm.nameCn" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="dataForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="createUser">
        <el-input v-model="dataForm.createUser" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" prop="roledesc">
        <el-input v-model="dataForm.roledesc" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
      <el-button type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
    </div>
  </el-dialog>
  <!-- 右键菜单 -->
  <div class="shortcut-container" :style="{position: 'absolute',top: resourceTop,left: resourceLeft,display: resourceDisplay}"><!--  v-if="ifShortCut" -->
    <!-- <kt-button icon="fa fa-plus" :label="$t('action.add')" @click="addInfo" /> -->
    <kt-button icon="fa fa-edit" :label="$t('action.edit')" @click="editInfo" />
    <kt-button icon="fa fa-trash" :label="$t('action.delete')" @click="deleteInfo" />
  </div>
</div>

</template>
<script>
  import { mapMutations } from 'vuex'
  import { tablePageMixin } from '@/common/js/mixin.js'
  export default {
    name: 'ConfigManageTabRoleManage',
    mixins: [tablePageMixin],
    data() {
      return {
        dataForm: null,
        dataFormRules: { // 规定哪些字段为必填项
          nameCn: [
          	{ required: true, message: '请输入中文名称', trigger: 'blur' }
          ],
          name: [
          	{ required: true, message: '请输入用户名', trigger: 'blur' }
          ]
        }
      }
    },
    created: function () {
      this.dataForm = { // 弹框中显示字段
          id: '',
          nameCn: '',
          name: '',
          createUser: this.userName,
          createTime: '',
          roledesc: ''
        }
    },
    activated: function () {
      // this.dataForm = { // 弹框中显示字段
      //     id: '',
      //     nameCn: '',
      //     name: '',
      //     createUser: this.userName,
      //     createTime: '',
      //     roledesc: ''
      //   }
    },
    mounted: function () {
      this.handleParam()
      // if (this.roleObj.roleFlag) {
      //   this.tableData = this.roleObj.roleArr
      //   this.usernameVal = this.roleObj.roleNameVal
      //   this.total = this.roleObj.roleTotale
      //   this.currentPage = this.roleObj.roleCurrentPage
      //   this.pageSize = this.roleObj.rolePageSize
      // } else {
      //   this.handleParam()
      // }
    },
    computed: {
      // roleObj: {
      //   get: function () {
      //     return this.$store.state.loadData.roleObj
      //   },
      //   set: function () {}
      // },
      userName: {
        get: function () {
          return this.$store.state.menu.userName
        },
        set: function () {}
      },
    },
    methods: {
      ...mapMutations({
        // 'setRoleObj': 'setRoleObj'
      }),
      handleParam: function () {
        let jsonObj = {
          roleName: this.usernameVal,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        let jsonStr = JSON.stringify(jsonObj)
        this.getTableData(jsonStr)
      },
      getTableData: function (jsonStr) {
        this.loading = true
        // let jsonObj = {
        //   currentPage: this.currentPage,
        //   pageSize: this.pageSize
        // }
        // let jsonStr = JSON.stringify(jsonObj)
        this.$api.role.getAllRoles(jsonStr).then((res) => {
          this.tableData= res.data
          this.loading = false
          this.total = parseInt(res.total)
          // this.setRoleObj({
          //   roleFlag: true,
          //   roleArr: this.tableData,
          //   roleTotale: this.total,
          //   roleCurrentPage: this.currentPage,
          //   rolePageSize: this.pageSize,
          //   roleNameVal: this.usernameVal
          // })
        }).catch(function (e) {
          // console.log(e)
        })
      },
      submitForm: function () {
          let _this = this
          this.$refs.dataForm.validate((valid) => {
          	if (valid) {
          		_this.$confirm('确认提交吗？', '提示', {}).then(() => {
          			_this.loading = true
                let role = Object.assign({}, _this.dataForm)
                role = JSON.stringify(role)
                if (_this.operation) { // 处理添加
                  _this.$api.role.addRole(role).then((res) => {
                    // console.log(res)
                    if(res.code == 0) {
                      _this.$message({ message: '添加成功', type: 'success' })
                      _this.dialogVisible = false
                      _this.loading = false
                      _this.$refs['dataForm'].resetFields()
                      _this.handleParam()
                    } else {
                      _this.$message({message: '添加失败, ' + res.msg, type: 'error'})
                    }
                  })
                } else { // 处理编辑
                  _this.$api.role.editRole(role).then((res) => {
                    // console.log(res)
                    if(res.code == 0) {
                      _this.$message({ message: '编辑成功', type: 'success' })
                      _this.dialogVisible = false
                      _this.loading = false
                      this.$refs['dataForm'].resetFields()
                      this.handleParam()
                    } else {
                      _this.$message({message: '编辑失败, ' + res.msg, type: 'error'})
                    }
                  })
                }
          		})
          	}
          })
      },
      // 点击搜索
      searchUserName: function () {
        this.handleParam()
        this.currentPage = 1
      },
      // 每页显示条数改变时，执行的函数
      handleSizeChange: function (pageSize) {
        this.pageSize = pageSize
        this.currentPage = 1
        this.handleParam()
      },
      // 切换页码时，执行的函数
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
        this.handleParam()
      },
      // 复选框全部选中时，执行的函数
      selectAll: function (selection) {
        if (selection.length == 1) {
          this.editAble = false
        } else {
          this.editAble = true
        }
      },
      // 复选框切换时，执行的函数
      selectionChange: function (selection) {
        if (selection.length == 1) {
          this.editAble = false
        } else {
          this.editAble = true
        }
      },
      // 单击单元格时，执行的函数
      clickCell: function (row,column) {
         if (column.type != 'selection') {
           this.rowObj = row
           this.editAble = false
           this.$refs.ktTable.clickRow(this.tableData[row.index])
         }
      },
      // 右键时，执行的函数
      changeShortCutInfo: function (obj,row) {
        this.editAble = false
        this.rowObj = row
        this.$refs.ktTable.clickRow(this.tableData[row.index])
        this.setResourceDisplay(obj.showShortCut)
        this.setResourceLeft(obj.x+'px')
        this.setResourceTop(obj.y+15+'px')
      },
      // 点击角色授权时执行
      grantRoleFn: function () {
        let jsonObj = {
          roleId: this.rowObj.id,// 角色id
          resIds:'1&2&3' // 针对的菜单项
        }
        let jsonObject = JSON.stringify(jsonObj)
        this.$api.role.grantRole().then(function () {
            // console.log('授权成功');
        })
      },
      // 添加
      addInfo: function () {
        let date1 = new Date()
        let date2 = new Date(date1)
        this.$set(this.dataForm,'createTime',date1.toLocaleString())
        this.$set(this.dataForm,'nameCn','')
        this.$set(this.dataForm,'name','')
        this.dialogVisible = true
        this.operation = true
      },
      // 菜单组编辑
      editInfo: function () {
        let date1 = new Date()
        let date2 = new Date(date1)
        this.$set(this.dataForm,'id',this.rowObj.id)
        this.$set(this.dataForm,'nameCn',this.rowObj.nameCn)
        this.$set(this.dataForm,'name',this.rowObj.name)
        this.$set(this.dataForm,'createTime',date1.toLocaleString())
        this.dialogVisible = true
        this.operation = false
      },
      // 菜单组删除
      deleteInfo: function () {
        let _this = this
        this.$confirm('确认删除选中记录吗？', '提示', {
        	type: 'warning'
        }).then(function () {
          _this.$api.role.delRole(_this.rowObj.id).then(function () {
            _this.handleParam()
          })
        })
      },
      initColumns: function () {
        this.columns = [
          {prop:"nameCn", label:"角色中文名称",sortable: true},
          {prop:"name", label:"角色名称",sortable: true},
          {prop:"createUser", label:"创建人",sortable: true},
          {prop:"createTime", label:"创建时间",sortable: true},
          {prop:"roledesc", label:"角色描述",sortable: true},
        ]
      },
      // getTableData: function (jsonStr) {
      //   this.loading = true
      //   this.$api.role.getAllRoles(jsonStr).then((res) => {
      //     console.log(res.data)
      //     this.tableData= res.data
      //     this.loading = false
      //     this.total = parseInt(res.total)
      //   })
        // setTimeout(function () {
        //   _this.loading = false
        //   _this.tableData = [{
        //       id: '001',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 1
        //     },{
        //       id: '002',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 2
        //     },{
        //       id: '003',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 3
        //     },{
        //       id: '004',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 4
        //     },{
        //       id: '005',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 5
        //     },{
        //       id: '006',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 6
        //     },{
        //       id: '007',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 7
        //     },{
        //       id: '008',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 8
        //     },{
        //       id: '009',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 9
        //     },{
        //       id: '010',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 10
        //     },{
        //       id: '011',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 11
        //     },{
        //       id: '012',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 12
        //     },{
        //       id: '013',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 13
        //     },{
        //       id: '014',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 14
        //     },{
        //       id: '015',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 15
        //     },{
        //       id: '016',
        //       nameCn: '袁晓宇',
        //       name: 'yxy',
        //       createUser: sessionStorage.getItem('user'),
        //       createTime: '2020年01月16日',
        //       desc: '菜单描述',
        //       ROW_ID: 16
        //     },]
        // }, 1000)
      // }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .table-seat
    height: 10px
    width: 100%
  .menu-location-img
    width: 40px
    height: 40px
    border: 1px solid red
</style>
