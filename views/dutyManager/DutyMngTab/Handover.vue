<template>
	<div class="user-container" ref="userContainer">
		<div class="user-right" ref="userRight">
			<div class="right-top">
				<div class="search-container">
                    <el-select v-model="form.dutyType" placeholder="值班类型" @change="dutyTypeChange">
                        <el-option v-for="item in dutyTypes" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                    <el-select v-model="form.dutyName" multiple filterable collapse-tags placeholder="值班名称">
                        <el-option v-for="item in dutyTypes" :key="item.id" :label="item.name" :value="item.id"/>
                    </el-select>
                    <el-date-picker v-model="form.startDate" type="date" value-format="yyyy-MM-dd" placeholder="开始时间"/>
                    <el-date-picker v-model="form.endDate" type="date" value-format="yyyy-MM-dd" placeholder="结束时间"/>
                    <el-input v-model="form.watchmanName" type="text" placeholder="值班人名称"></el-input>
                    <kt-button icon="fa fa-search" type="primary" class="user-search-btn" :label="$t('action.search')" @click="searchUserName"/>
				</div>
			</div>
			<div class="right-center">
				<div class="btn-container">
                    <kt-button type="primary" icon="fa fa-calendar" label="新建值班" @click="addInfo"/>
				</div>
			</div>
			<div class="right-bottom">
                <kt-table :showCheckBox='false' :loading="loadingTable" :dataArr="tableData.content" :border="border" @selectionChange="selectionChange" @clickCell="clickCell" :columns="columns"  @handleSizeChange="handleSizeChange"  @handleCurrentChange="handleCurrentChange" :currentPage="currentPage" :pageSizes="pageSizes" :pageSize="pageSize" :total="total" ref="ktTable"/>
			</div>
		</div>
        <el-dialog title="替班" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
            <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size" label-position="right">
                <el-form-item label="值班名称" prop="username">
                    <el-input v-model="dataForm.dutyName" auto-complete="off" :disabled="true"/>
                </el-form-item>
                <el-form-item label="值班班次" prop="shifts">
                    <el-input v-model="dataForm.shifts" auto-complete="off" :disabled="true"/>
                </el-form-item>
                <el-form-item label="替班说明" prop="explain">
                    <el-input v-model="dataForm.explain" auto-complete="off"/>
                </el-form-item>
                <el-form-item label="原排班人员" prop="createUser">
                    <el-input v-model="dataForm.oldWatchmanName" auto-complete="off" :disabled="true"/>
                </el-form-item>
                <el-form-item label="替班人员" prop="valid">
                    <el-select v-model="dataForm.newWatchmanName" placeholder="请选择" style="width: 100%;">
                    <el-option v-for="item in validArr" :key="item.id" :label="item.value" :value="item.id"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
                <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/components/KtButton/KtButton"
import KtTable from "@/components/KtTable/KtTable"
import { mapMutations } from 'vuex'
export default {
    data: function() {
        return {
            form: {
                dutyType:'',
                dutyName:'',
                startDate:'',
                endDate:'',
                watchmanName:''
            },
            dutyTypes: [
                {
                    value: '2',
                    label: '专家值班'
                }, 
                {
                    value: '1',
                    label: '日常维护值班'
                }
            ],
            dutyTypes:[],
            dateValue: '',
            editAble: true,
            checkedBox: false,
            selectedVal: '',
            radioVal: '',
            currentDepId: '0',
            loadingTable: false,
            loadingTree: false,
            border: true,
            usernameVal: '',
            total: 0,
            pageSize: 15,
            currentPage: 1,
            pageSizes: [15,50,100,200],
            size: 'small',
            dialogVisible: false,
            operation: false,
            editLoading: false,
            userId: null,
            outData: [{name: '', age: ''}],
            treeData: [],
            defaultProps: {children: 'Children',label: 'Name'},
            validArr: [{
                id: 1,
                value: '可用'
                },{
                id: 2,
                value: '不可用'
            }],
            dataForm: null,
            dataFormRules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                name: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
                valid: [{ required: true, message: '请选择有效性', trigger: 'blur' }],
            },
            tableData: {
                content: [
                    {
                        dutyDate: '2017-09-28',
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'值班班长',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: '2017-09-28',
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'值班助理',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'监控',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'传输',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'交换',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'数据',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'网管',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'监控',
                        dutyType: '日常维护值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'数据',
                        dutyType: '专家值班'
                    }, 
                    {
                        dutyDate: "2017-09-28",
                        startTime: '00:00',
                        endTime: '00:00',
                        name: '袁晓宇',
                        shiftName: '袁晓宇',
                        dutyName:'网管',
                        dutyType: '专家值班'
                    }
                ]
            },
            columns: [
                {
                    prop: 'dutyDate',
                    label: '值班日期'
                }, 
                {
                    prop: 'startTime',
                    label: '开始时间'
                }, 
                {
                    prop: 'endTime',
                    label: '结束时间'
                }, 
                {
                    prop: 'name',
                    label: '值班人'
                }, 
                {
                    prop: 'shiftName',
                    label: '替班发起人'
                }, 
                {
                    prop: 'dutyName',
                    label: '值班名称'
                }, 
                {
                    prop: 'dutyType',
                    label: '值班类型'
                }
            ]
        }
    },
    computed: {
        userFlag: {
            get: function () {
                return this.$store.state.loadData.userFlag
            },
            set: function () {}
        },
        userObj: {
            get: function () {
                return this.$store.state.loadData.userObj
            },
            set: function () {}
        },
        userOriganFlag: {
            get: function () {
                return this.$store.state.loadData.userOriganFlag
            },
            set: function () {}
        },
        userOriganArr: {
            get: function () {
                return this.$store.state.loadData.userOriganArr
            },
            set: function () {}
        },
        userName: {
          get: function () {
            return this.$store.state.menu.userName
          },
          set: function () {}
        },
    },
    mounted: function () {
		this.dataForm = {
                organid: '',
                username: '',
                name: '',
                valid: '',
                createUser: this.userName,
                createTime: '',
                accountEffectTime: '',
                accountExpireTime: ''
            }
        if (this.userOriganFlag) {
            this.treeData = this.userOriganArr
        } else {
            this.loadingTree = true
            this.$api.user.findAllOrgan().then((res) => {
                this.treeData = res.data
                this.setUserOriganArr(res.data)
                this.setUserOriganFlag(true)
                this.loadingTree = false
            })
        }
        let jsonObj = {
        currentPage: this.currentPage,
        pageSize: this.pageSize
        }
        // 不传部门默认是所有数据
        // 不传页码默认是第1页
        // 不传当前页显示条数默认是10条
        // 不传输入值默认为空
        let jsonStr = JSON.stringify(jsonObj)
        // 第一次什么都不传
        // 后台默认返回全部数据的前10条数据和所有数据总条数（无参数）0
        // jsonStr
        // this.getUserInfo(jsonStr)
    },
    components: {
        KtButton,
        KtTable
    },
    methods: {
        ...mapMutations({
            'setUserFlag': 'setUserFlag',
            'setUserObj': 'setUserObj',
            'setUserOriganFlag': 'setUserOriganFlag',
            'setUserOriganArr': 'setUserOriganArr'
        }),
        selectionChange: function (selection) {
            if (selection.length == 1) {
                this.editAble = false
                this.userId = selection[0].ID
            } else {
                this.editAble = true
            }
        },
        clickCell(val){
            // console.log(val);
            this.editAble=false;
            this.dataForm.oldWatchmanName=val.name;
            this.dataForm.dutyName=val.dutyName;
            this.dataForm.shifts=val.dutyDate+' '+val.startTime+'-'+val.endTime;
        },
        addInfo: function () {
            let date1 = new Date()
            let date2 = new Date(date1)
            date2.setDate(date1.getDate()+90)
            this.dialogVisible = true
            this.operation = true
        },
        editInfo: function () {
            let date1 = new Date()
            let date2 = new Date(date1)
            date2.setDate(date1.getDate()+90)
            this.dialogVisible = true
            this.operation = false
        },
        deleteInfo: function () {
            let _this = this
            let jsonObj = {
                organId: _this.currentDepId,
                userId: _this.userId
            }
            let jsonStr = JSON.stringify(jsonObj)
            _this.$api.user.deleteUser(jsonStr).then((res) => {
                // console.log(res)
                if(res.code == 0) {
                    _this.$message({ message: '删除成功', type: 'success' })
                    let jsonObj = {
                    organId: _this.currentDepId,
                    pageSize: _this.pageSize
                    }
                    let jsonStr = JSON.stringify(jsonObj)
                    _this.getUserInfo()
                } else {
                    _this.$message({message: '操作失败, ' + res.msg, type: 'error'})
                }
            })
        },
        submitForm: function () {
            let _this = this
            this.$refs.dataForm.validate((valid) => {
                if (valid) {
                    _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        _this.editLoading = true
                        let User = Object.assign({}, _this.dataForm)
                        User.organid = _this.currentDepId
                        if (_this.operation) { // 处理添加
                            User = JSON.stringify(User)
                            _this.$api.user.addUser(User).then((res) => {
                            // console.log(res)
                            if(res.code == 0) {
                                _this.$message({ message: '添加成功', type: 'success' })
                                _this.dialogVisible = false
                                _this.editLoading = false
                                this.$refs['dataForm'].resetFields()
                                let jsonObj = {
                                organId: _this.currentDepId,
                                pageSize: _this.pageSize
                                }
                                let jsonStr = JSON.stringify(jsonObj)
                                _this.setUserFlag(false)
                                _this.getUserInfo()
                            } else {
                                _this.$message({message: '添加失败, ' + res.msg, type: 'error'})
                            }
                            })
                        } else { // 处理编辑
                            User.id = _this.userId // 通过ROW_ID获取的userId
                            User = JSON.stringify(User)
                            _this.$api.user.editUser(User).then((res) => {
                                // console.log(res)
                                if(res.code == 0) {
                                    _this.$message({ message: '编辑成功', type: 'success' })
                                    _this.dialogVisible = false
                                    _this.editLoading = false
                                    this.$refs['dataForm'].resetFields()
                                    let jsonObj = {
                                    organId: _this.currentDepId,
                                    pageSize: _this.pageSize
                                    }
                                    let jsonStr = JSON.stringify(jsonObj)
                                    _this.setUserFlag(false)
                                    _this.getUserInfo()
                                } else {
                                    _this.$message({message: '编辑失败, ' + res.msg, type: 'error'})
                                }
                            })
                        }
                    })
                }
            })
        },
        getUserInfo: function (jsonStr) {
            if (this.userFlag) {
                this.loadingTable = false
                this.tableData = this.userObj.data
                this.total = parseInt(this.userObj.total)
            } else {
                this.loadingTable = true
                this.$api.user.getPageList(jsonStr).then((res) => {
                // console.log(res.data)
                this.tableData= res.data
                this.loadingTable = false
                this.total = parseInt(res.total)
                this.setUserObj(res)
                this.setUserFlag(true)
                })
            }
        },
        openAll: function() {
            // console.log(this.$refs.tree.store._getAllNodes())
            for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
                this.$refs.tree.store._getAllNodes()[i].expanded=true
            }
        },
        closeAll: function() {
            for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
                this.$refs.tree.store._getAllNodes()[i].expanded=false
            }
        },
        handleNodeClick: function(data) {
            // console.log(data)
            this.currentDepId = data.Id
            // console.log(data.Id)
            // console.log(this.pageSize)
            this.usernameVal = ''
            // 点击某个部门,把当前部门id传到后台（部门id）2  每页显示条数
            // 后台默认返回当前部门的前‘每页显示条数’数据和该部门总条数
            let jsonObj = {
                organId: this.currentDepId,
                pageSize: this.pageSize
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.setUserFlag(false)
            this.getUserInfo(jsonStr)
        },
        changeBox: function () {
        },
        searchUserName: function () {
            // 当输入用户名,点击查询时
            // 把当前部门id,每页显示条数,输入的字段值（3个参数）
            // 返回前‘每页显示条数’条数据和总条数
            let jsonObj = {
                username: this.usernameVal,
                organId: this.currentDepId,
                pageSize: this.pageSize
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.setUserFlag(false)
            this.getUserInfo(jsonStr)
            this.currentPage = 1
        },
        handleSizeChange: function (pageSize) {
            // 当每页显示条数变化时,
            // 把当前部门id和条数传至后台（部门id和条数），当前输入的字段值3（不传输入值默认为空）
            // 返回当前部门的前"刚传的条数"的数据和当前部门的总条数
            // console.log(pageSize)
            this.pageSize = pageSize
            let jsonObj = {
                username: this.usernameVal,
                organId: this.currentDepId,
                pageSize: this.pageSize
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.setUserFlag(false)
            this.getUserInfo(jsonStr)
            this.currentPage = 1
        },
        handleCurrentChange: function (currentPage) {
            // 当页数变化时，把当前页数传到后台
            // 还要把当前部门id传至后台(不传id默认是全部数据)（部门id和页数），当前输入的字段值（不传输入值默认为空）
            // 每页显示多少条数据  传4个参数
            // 返回该部门当前页的数据和当前部门的总条数
            // console.log(currentPage)
            this.currentPage = currentPage
            let jsonObj = {
                username: this.usernameVal,
                organId: this.currentDepId,
                pageSize: this.pageSize,
                currentPage: this.currentPage
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.setUserFlag(false)
            this.getUserInfo(jsonStr)
        },
        dutyTypeChange(val){
            // console.log(val)
            this.$api.duty.findDutyNamesByDutyType(val).then((res) => {
                if(res.returnCode=='200'){
                    this.options2=res.valueList
                }
            });
        }
    }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "../../../common/stylus/variable"
    .user-container
      display: flex
      border: 1px solid #dad9e6
      overflow: hidden
      box-sizing: border-box
      height: 100%
      position: relative
      margin: 3px
    .user-left
      box-sizing: border-box
      height: 100%
      background-color: #fff
      overflow: hidden
      width: 180px
      display: flex
      flex-direction: column
      border: 1px solid #f0f2f5
      // margin: 2px 4px
      .user-depit
        text-align: left
        font-size: $font-size-medium-s
        font-weight: bold
        background-color: #f9f9f9
        padding: 5px 10px
      .expand-container
         display: flex
         justify-content: center
      .tree-container
        width: 100%
        overflow: auto
        flex: 1
    .user-middle
      // float: left
      width: 3px
      height: 100%
      cursor: col-resize
      box-sizing: border-box
      background-color: #ddd
      overflow: hidden
    .user-right
      width: 70%
      flex: 1
      display: flex
      flex-direction: column
      // border: 1px solid red
      // float: left
      box-sizing: border-box
      height: 100%
      // padding-top: 15px
      position: relative
      overflow: hidden
    .date-container
      display: flex
      justify-content: center
      align-items: center
    .user-search-btn
      margin-right: 15px
    .search-container
        padding: 2px 20px
        display: flex
       // margin: 15px
       // position: relative
       // min-height: 10px
    .checkbox-more
      position: absolute
      left: 20px
      top: -15px
      background-color: #ddd
      width: 130px
      height: 30px
      display: flex
      justify-content: center
      align-items: center
      z-index: 22
      input
        margin-right: 10px
    .more-line
      position: absolute
      left: 0
      top: 0
      height: 1px
      width: 100%
      background-color: #999
      z-index: 11
    .search-container-border
       border: 1px solid #999
       border-top: none
       display: flex
       padding: 0 20px
       justify-content: center
    .search-container-input
       display: flex
       align-items: center
       margin: 23px 0 10px 0
    .search-container-middle
       margin: 23px 30px 10px 30px
    .input-name
       width: 54px
    .right-center
      border-top: 1px solid $color-border
    .right-bottom
      // overflow: auto
      overflow: hidden
      flex: 1
      position: relative
      // border: 1px solid green
      .box-all
        position: absolute
        left: 13px
        top: 6px
        z-index: 9999999
    .bread-crumb
	    height: 30px
	    line-height: 30px
	    background-color: #abcdef
	    // border: 1px solid blue
     font-size: 13px
	    box-sizing: border-box
	    text-align: left
	    padding: 0 10px
	.btn-container
    padding: 3px 0
	   display: flex
	   // border: 1px solid green
	   border-top: none
	.btn-container .el-button
    border-radius: 0
	  // margin-left: 0
  .btn-container .el-button+.el-button
    margin-left: 0px !important
    border-left: 1px solid #fff
    // margin-left: 5px !important
	.input-left
	  margin-right: 10px
  .user-toolbar
    padding-right: 20px
    background-color: #DFDFDF
  	// background-color: #f0f2f5
  	// padding: 5px 0
  	// color: #fff
    // position: absolute
    // bottom: 7px
    // left: 0
    // width: 100%
  .userbox-div
    position: relative
</style>
