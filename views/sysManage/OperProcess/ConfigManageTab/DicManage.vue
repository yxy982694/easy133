<template>
<div class="resource-container children-tab-container">
  <div class="children-container">
    <div class="btn-buttons">
      <div>
        <el-input v-model="inpDictypeId" placeholder="请输入dictypeId类别"></el-input>
        <el-input v-model="inpCode" placeholder="请输入code编码"></el-input><br/>
        <el-input v-model="usernameVal" placeholder="请输入name名称"></el-input>
        <el-select v-model="inpValid" placeholder="请选择有效性"><br/>
          <el-option v-for="item in validArr" :key="item.id"
              :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </div>
      <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="searchInfo()"></kt-button>
    </div>
    <kt-table ref="ktTable"
      @changeShortCutInfo="changeShortCutInfo"
      :loading="loading"
      @addInfo="addInfo"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :columns="columns"
      :dataArr="tableData"
      :showCheckBox="false"
      :showPage="true"
      :currentPage="currentPage"
      :pageSizes="pageSizes"
      :pageSize="pageSize"
      :total="total"></kt-table>
    <!-- <div class="table-seat"></div> -->
    <!--新增编辑界面-->
    <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm"
        label-position="right">
        <el-form-item label="id" prop="ID" v-if="false">
          <el-input v-model="dataForm.ID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="CODE" v-if="false">
          <el-input v-model="dataForm.CODE" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="父ID" prop="PARENT" v-if="false">
          <el-input v-model="dataForm.PARENT" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="类别" prop="DICTYPEID" v-if="false">
          <el-input v-model="dataForm.DICTYPEID" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="NAME">
          <el-input v-model="dataForm.NAME" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="一级分类" prop="FIRSTLEVEL">
          <el-input v-model="dataForm.FIRSTLEVEL" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二级分类" prop="SECONDLEVEL">
          <el-input v-model="dataForm.SECONDLEVEL" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="三级分类" prop="THLEVEL">
          <el-input v-model="dataForm.THLEVEL" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="VALID">
          <el-select v-model="dataForm.VALID" placeholder="请选择"
             style="width: 100%;">
            <el-option v-for="item in validArr" :key="item.id"
              :label="item.value" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="DESCRIPTION">
          <el-input v-model="dataForm.DESCRIPTION" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button type="primary" @click.native="submitForm" >{{$t('action.submit')}}</el-button>
      </div><!-- :loading="editLoading" -->
    </el-dialog>
  </div><!-- v-show="showShortCut" -->
  <div class="shortcut-container" :style="{position: 'absolute',top: resourceTop,left: resourceLeft,display: resourceDisplay}"><!--  v-if="ifShortCut" -->
    <kt-button icon="fa fa-plus" :label="$t('action.add')" @click="addInfo" />
    <kt-button icon="fa fa-edit" :label="$t('action.edit')" @click="editInfoShortCut()" />
    <kt-button icon="fa fa-trash" :label="$t('action.delete')" @click="deleteShortCutInfo(currentId)" />
  </div>
</div>

</template>
<script>
  import { mapMutations } from 'vuex'
  import axios from 'axios'
  import { tablePageMixin } from '@/common/js/mixin.js'
  export default {
	name: 'ConfigManageTabDicManage',
    mixins: [tablePageMixin],
    data() {
      return {
        parentId: null, // 获取当前行的父节点id
        currentObj: null,
        rowObject: null,
        currentId: null,
        inpDictypeId: null,
        inpCode: null,
        inpValid: null,
        validArr: [{
          id: 1,
          value: '有效'
        },{
          id: 0,
          value: '无效'
        }],
        dataFormRules: {
        	NAME: [
        		{ required: true, message: '请输入名称', trigger: 'blur' }
        	],
        },
        dataForm: {
          ID: '',
          CODE: '',
          PARENT: '',
          DICTYPEID: '',
          NAME: '',
          FIRSTLEVEL: '',
          SECONDLEVEL: '',
          THLEVEL: '',
          VALID: '',
          DESCRIPTION: '',
        },
        treeProps: {children: 'children', hasChildren: 'hasChildren'},
      }
    },
    computed: {
      dicObj: {
        get: function () {
          return this.$store.state.loadData.dicObj
        },
        set: function () {}
      },
    },
    mounted: function () {
        // 从store中获取初始值
        this.tableData = this.dicObj.dataArr
        this.usernameVal = this.dicObj.nameVal
        this.total = this.dicObj.totale
        this.currentPage = this.dicObj.currentPage
        this.pageSize = this.dicObj.pageSize
        this.inpDictypeId = this.dicObj.inpDictypeId
        this.inpCode = this.dicObj.inpCode
        this.inpValid = this.dicObj.inpValid
    },
    methods: {
      ...mapMutations({
        'setDicObj': 'setDicObj'
      }),
      // 点击搜索时，改变了usernameVal
      // 点击页码时，改变了currentPage
      // 点击每页显示条数时，改变了pageSize
      // 3种情况，调用
      handleParam: function () {
        // 传入6个参数
        // 1.搜索的名称 默认为空字符串
        // 2.当前页码 默认是1
        // 3.每页显示条数 默认是15
        // 4.dictypeId 类别
        // 5.code 编码
        // 6. valid 有效性 默认值为1 有效性
        let jsonObj = {
          name: this.usernameVal,// 默认值为空字符串
          currentPage: this.currentPage, // 默认值为1
          pageSize: this.pageSize, // 默认值为15
          dictypeId: this.inpDictypeId,
          code: this.inpCode,
          valid: this.inpValid
        }
        // console.log(jsonObj)
        let jsonStr = JSON.stringify(jsonObj)
        this.getTableData(jsonStr)
      },
      // 初始进入页面时，加载的数据
      getTableData: function (jsonStr) {
        this.loading = true
        this.$api.menu.loadDicConfigData(jsonStr).then((res) => {
          for(let i=0;i<res.data.length;i++){
            if (res.data[i].VALID == 1) {
                res.data[i].VALID = '有效'
            } else if (res.data[i].VALID == 0) {
                res.data[i].VALID = '无效'
            }
          }
          this.tableData = res.data
          // console.log(res)
          this.loading = false
          this.total = res.total
          this.setDicObj({
            flag: true,
            dataArr: this.tableData,
            totale: this.total,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            nameVal: this.usernameVal,
            inpDictypeId: this.inpDictypeId,
            inpCode: this.inpCode,
            inpValid: this.inpValid
          })
          // _this.$refs.ktTable.getCellRow()
        })
      },
      // 右键
      changeShortCutInfo: function (obj,row) {
        this.rowObject = row
        this.setResourceDisplay(obj.showShortCut)
        this.currentId = obj.id
        this.setResourceLeft(obj.x+'px')
        this.setResourceTop(obj.y+'px')
      },
      // 添加
      addInfo: function (flag) {
        // console.log('开始添加')
        this.dataForm = {
          id: '',
          code: '',
          parent: '',
          dictypeid: '',
          name: '',
          firstLevel: '',
          secondLevel: '',
          thlevel: '',
          valid: '',
          description: '',
        }
        this.operation = true
        this.dialogVisible = true
      },
      // 编辑
      editInfoShortCut: function () {
        // console.log('点击了右键编辑')
        this.operation = false
        this.dialogVisible = true
        this.dataForm = this.rowObject
      },
      // 删除
      deleteShortCutInfo: function (id) {
        let _this = this
        this.$confirm('确认删除选中记录吗？', '提示', {
        	type: 'warning'
        }).then(function () {
          _this.$api.menu.deleteResource(id).then(res => {
            _this.handleParam()
          })
        })
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
      // 点击搜索
      searchInfo: function () {
        this.currentPage = 1
        this.handleParam()
      },
      // 提交
      submitForm: function () {
        let _this = this
      	this.$refs.dataForm.validate((valid) => {
      		if (valid) {
      			_this.$confirm('确认提交吗？', '提示', {}).then(() => {
      				_this.editLoading = true
              let Resources = Object.assign({}, _this.dataForm)
              let intOrder = parseInt(Resources.orderby)
              Resources.orderby = intOrder
              if (_this.operation) { // 处理添加
                Resources = JSON.stringify(Resources)
                // console.log(Resources)
                 _this.$api.menu.addResource(Resources).then((res) => {
                    _this.dialogVisible = false
                    _this.editLoading = false
                    // console.log(res)
                      if(res.code == 0) {
                        _this.$message({ message: '操作成功', type: 'success' })
                        _this.dialogVisible = false
                        this.$refs['dataForm'].resetFields()
                      } else {
                        _this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                      }
                      _this.getTableData()
                    }).catch(function () {
                      _this.dialogVisible = false
                    })
              } else { // 处理编辑
                // 需要知道自己的id
                // console.log('编辑')
                Resources = JSON.stringify(Resources)
                // console.log(Resources)
                _this.$api.menu.editResource(Resources).then((res) => {
                 // _this.$api.user.save(ss).then((res) => {
                   _this.dialogVisible = false
                   _this.editLoading = false
                   // console.log(res)
                     if(res.code == 0) {
                       _this.$message({ message: '操作成功', type: 'success' })
                       _this.dialogVisible = false
                       this.$refs['dataForm'].resetFields()
                     } else {
                       _this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                     }
                     _this.getTableData()
                   }).catch(function () {
                     _this.dialogVisible = false
                   })
              }
      			})
      		}
      	})
      },
      // 初始化列
      initColumns: function () {
        this.columns = [
          {prop:"ID", label:"id"},
          {prop:"CODE", label:"编码"},
          {prop:"PARENT", label:"父ID"},
          {prop:"DICTYPEID", label:"类别"},
          {prop:"NAME", label:"名称"},
          {prop:"FIRSTLEVEL", label:"一级分类"},
          {prop:"SECONDLEVEL", label:"二级分类"},
          {prop:"THLEVEL", label:"三级分类"},
          {prop:"VALID", label:"状态"},
          {prop:"DESCRIPTION", label:"描述"},
        ]
      },
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
