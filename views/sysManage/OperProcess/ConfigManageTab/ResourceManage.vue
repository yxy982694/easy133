<template>
<div class="resource-container children-tab-container">
  <div class="children-container">
    <div class="search-container">
      <el-input v-model="usernameVal" placeholder="用户名"></el-input>
      <kt-button icon="fa fa-search" :label="$t('action.search')" type="primary" @click="searchInfo(usernameVal)"></kt-button>
    </div>
    <kt-table ref="ktTable"
      @changeShortCutInfo="changeShortCutInfo"
      :loading="loading"
      @handleEdit="editInfo"
      @addInfo="addInfo"
      @handleDelete="deleteInfo"
      :columns="columns"
      :dataArr="tableData"
      :showCheckBox="false"
      :showPage="false"
      rowKey="id"
      :treeProps="treeProps"
      :defaultExpandAll="false"></kt-table>
    <!-- <div class="table-seat"></div> -->
    <!--新增编辑界面-->
  </div><!-- v-show="showShortCut" -->
  <el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
    <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm"
      label-position="right">
      <el-form-item label="id" prop="id" v-if="false">
        <el-input v-model="dataForm.id" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="中文名称" prop="nameCn">
        <el-input v-model="dataForm.nameCn" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="location">
        <el-input v-model="dataForm.location" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择"
           style="width: 100%;">
          <el-option v-for="item in typeArr" :key="item.id"
            :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否网页" prop="isWebpage">
        <el-select v-model="dataForm.isWebpage" placeholder="请选择"
           style="width: 100%;">
          <el-option v-for="item in isWebpageArr" :key="item.id"
            :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序序号" prop="orderby">
        <el-input v-model="dataForm.orderby" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择"
           style="width: 100%;">
          <el-option v-for="item in statsArr" :key="item.id"
            :label="item.value" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="菜单描述" prop="remark">
        <el-input v-model="dataForm.remark" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标路径" prop="image" class="menu-location">
        <!-- <el-input type="file"></el-input> -->
        <input ref="menuInput" type="file" @change="selectMenuImg" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        <img ref="menuImg" class="menu-location-img" src="../../../../common/image/default.png" alt="">
        <!-- <el-input v-model="dataForm.image" auto-complete="off"></el-input> -->
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input v-model="dataForm.creator" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="父id" prop="parentId" v-if="false">
        <el-input v-model="dataForm.parentId" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
      <el-button type="primary" @click.native="submitForm" >{{$t('action.submit')}}</el-button>
    </div><!-- :loading="editLoading" -->
  </el-dialog>
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
  import { tableNoPageMixin } from '@/common/js/mixin.js'
  import KtButtons from "@/components/KtButtons/KtButtons"
  export default {
    name: 'ConfigManageTabResourceManage',
    mixins: [tableNoPageMixin],
    data() {
      return {
        parentId: null, // 获取当前行的父节点id
        currentObj: null,
        statsArr: [{
          id: 0,
          value: '失效'
        },{
          id: 1,
          value: '有效'
        },{
          id: 2,
          value: '隐藏'
        }],
        isWebpageArr: [{
          id: 0,
          value: '否'
        },{
          id: 1,
          value: '是'
        }],
        typeArr: [{
          id: 1,
          value: '顶部菜单'
        },{
          id: 2,
          value: '左侧菜单'
        },{
          id: 3,
          value: '功能菜单'
        }],
        dataFormRules: {
        	name: [
        		{ required: true, message: '请输入用户名', trigger: 'blur' }
        	],
          orderby: [
          	{ required: true, message: '请输入排序序号', trigger: 'blur' }
          ],
        },
        dataForm: null,
        treeProps: {children: 'children', hasChildren: 'hasChildren'},
      }
    },
    components:{
      KtButtons
    },
    created: function () {
      this.dataForm = {
          id: '',
          nameCn: '',
          name: '',
          location: '',
          type: '',
          isWebpage: '',
          orderby: '',
          status: '',
          remark: '菜单描述',
          image: '菜单图标路径',
          createTime:'创建时间', // (new Date()).toLocaleString()
          creator: this.userName,
          parentId: ''
        }
    },
    activated: function () {
      // this.dataForm = {
      //     id: '',
      //     nameCn: '',
      //     name: '',
      //     location: '',
      //     type: '',
      //     isWebpage: '',
      //     orderby: '',
      //     status: '',
      //     remark: '菜单描述',
      //     image: '菜单图标路径',
      //     createTime:'创建时间', // (new Date()).toLocaleString()
      //     creator: this.userName,
      //     parentId: ''
      //   }
    },
    mounted: function () {
      // console.log('getTableData')
      // if (this.resourceFlag) {
      //   // console.log('true')
      //   this.usernameVal = this.resourceNameVal
      //   this.tableData = this.resourceArr
      // } else {
      //   this.getTableData()
      // }
      this.getTableData()
    },
    computed: {
      currentId: {
        get: function () {
          return this.$store.state.tableCurrentId.currentId
        },
        set: function () {}
      },
      // resourceFlag: {
      //   get: function () {
      //     return this.$store.state.loadData.resourceFlag
      //   },
      //   set: function () {}
      // },
      // resourceArr: {
      //   get: function () {
      //     return this.$store.state.loadData.resourceArr
      //   },
      //   set: function () {}
      // },
      // resourceNameVal: {
      //   get: function () {
      //     return this.$store.state.loadData.resourceNameVal
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
        'setCurrentId': 'setCurrentId',
        // 'setResourceFlag': 'setResourceFlag',
        // 'setResourceArr': 'setResourceArr',
        // 'setResourceNameVal': 'setResourceNameVal'
      }),
      // 选择菜单图标图片
      selectMenuImg: function () {
        let file = this.$refs.menuInput.files[0]
        let formData = new FormData()
        formData.append('fileImg', file)
        formData.append('id', this.currentId)
        // console.log(formData)
        // this.$refs.menuImg.src = window.URL.createObjectURL(file)
        // axios.post('/haeoms/menu/editResourceImg',
        // axios.post('http://10.89.138.133:9091/addImage',
        axios.post('/addImage',
          formData,
          {
            headers: {"Content-Type": "multipart/form-data"}
          }
        ).then(function (res) {
          // console.log(res)
          if (res.code == '00') {
            var resImg = 'data:image/png;base64,'+res.resourceImg
            this.$refs.menuImg.src = resImg
          }
        })
      },
      changeShortCutInfo: function (obj) {
        this.setResourceDisplay(obj.showShortCut)
        this.setCurrentId(obj.id)
        this.setResourceLeft(obj.x+'px')
        this.setResourceTop(obj.y+'px')
      },
      searchInfo: function (name) {
        console.log(name)
        // this.setResourceNameVal(name)
        this.$api.menu.findByName(name).then(res => {
          // console.log(res)
          this.tableData = res.data
          // this.setResourceArr(res.data)
        })
      },
      deleteShortCutInfo: function (id) {
        let _this = this
        if (this.parentId) {
          this.$confirm('确认删除选中记录吗？', '提示', {
          	type: 'warning'
          }).then(function () {
            _this.deleteInfo(id)
          })
        } else {
          this.$alert('根节点不可删除')
        }
      },
      initColumns: function () {
        this.columns = [
          // {prop:"id", label:"id",sortable: false},
          {prop:"nameCn", label:"中文名称",sortable: true,minWidth: "160px",align: "left"},
          {prop:"name", label:"名称",sortable: true},
          {prop:"location", label:"路径",minWidth: "140px",sortable: true},
          // {prop:"type", label:"菜单类型",sortable: false},
          {prop:"isWebpage", label:"是否网页",sortable: true},
          {prop:"orderby", label:"排序序号",sortable: true},
          {prop:"status", label:"状态",sortable: true},
          {prop:"remark", label:"菜单描述",sortable: true},
          // {prop:"image", label:"菜单图标路径",sortable: false},
          {prop:"createTime", label:"创建时间",sortable: true},
          {prop:"creator", label:"创建人",sortable: true},
          // {prop:"parentId", label:"父id",sortable: false},
        ]
      },
      getTableData: function () {
        let _this = this
        this.loading = true
        this.$api.menu.loadResource().then((res) => {
          _this.tableData = res.data
          // console.log(res)
          _this.loading = false
          // _this.setResourceFlag(true)
          // _this.setResourceArr(res.data)
          // _this.$refs.ktTable.getCellRow()
        })
      },
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
                Resources.parentId = _this.currentId
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
                Resources.id = _this.currentId
                Resources.parentId = _this.currentObj.parentId
                // console.log(_this.currentId)
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
      addInfo: function (flag) {
        // console.log('开始添加')
        this.dataForm = {
          id: '',
          nameCn: '',
          name: '',
          location: '',
          type: '',
          isWebpage: '',
          orderby: '',
          status: '',
          remark: '菜单描述',
          image: '菜单图标路径',
          createTime:'创建时间', // (new Date()).toLocaleString()
          creator: this.userName,//sessionStorage.getItem('user')
          parentId: ''
        }
        this.operation = true
        this.dialogVisible = true
      },
      deleteInfo: function (id) {
        this.$api.menu.deleteResource(id).then(res => {
          this.getTableData()
        })
      },
      getTableOneLine: function (id) { // 在点击编辑时，获取某一行的数据
        this.$api.menu.findResourceById(id).then((res) => {
          if(res.code == 0) {
            this.currentObj = res.data
            this.dataForm = this.currentObj
            this.parentId = this.currentObj.parentId?this.currentObj.parentId:null
            this.$set(this.dataForm,'createTime',(new Date()).toLocaleString())
            this.$set(this.dataForm,'creator',sessionStorage.getItem('user'))
          } else {
            this.$message({message: '操作失败, ' + res.msg, type: 'error'})
          }
          // console.log(this.currentObj)
        })
      },
      editInfo: function (id) {
        // console.log('点击了操作中的编辑')
        this.operation = false
        this.dialogVisible = true
        this.setCurrentId(id)
        this.getTableOneLine(id)
      },
      editInfoShortCut: function () {
        // console.log('点击了右键编辑')
        this.operation = false
        this.dialogVisible = true
        this.getTableOneLine(this.currentId)
      },
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  .resource-container
     position: relative
     height: 100%
  .table-seat
    height: 10px
    width: 100%
  .menu-location-img
    width: 40px
    height: 40px
    float: right
    border: 1px solid red
</style>
