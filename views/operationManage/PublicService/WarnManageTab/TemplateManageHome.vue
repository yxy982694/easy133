<template>
  <div class="children-container" id="templateManageTable">
    <div class="children-container-selector">
      <div class="spec-con">
        <label>专业：</label>
        <el-select v-model="specValue" :clearable="true" placeholder="请选择">
          <el-option
            v-for="item in specArr"
            :key="item.id"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <div class="warn-level-con">
        <label>告警级别：</label>
        <el-select v-model="warnLevelValue" :clearable="true" placeholder="请选择">
          <el-option
            v-for="item in warnLevelArr"
            :key="item.id"
            :label="item.name"
            :value="item.code">
          </el-option>
        </el-select>
      </div>
      <div class="div-btn-container">
        <kt-button @click.native="clickSearch" icon="fa fa-search" type="primary" :label="$t('action.search')" />
        <kt-button @click.native="clickNewBuild" icon="fa fa-plus" type="primary" :label="$t('action.newBuild')" />
      </div>
    </div>
    <kt-table ref="ktTable"
      :loading="loading"
      :columns="columns"
      :dataArr="tableData"
      :showOperate="true"
      :showPage="true"
      :showCheckBox="false"
      :showWarnNullifyBtn="true"
      :showFulColumn="false"
      :showPreColumn="true"
      :showCenterColumn="true"
      :showAfterColumn="true"
      :currentPage="currentPage"
      :pageSizes="pageSizes"
      :pageSize="pageSize"
      :total="total"
      centerColumnText="预警模板"
      centerColumnTextObj="发送对象"
      :showCenterColumnObj="true"
      @handleEdit="handleEdit"
      @handleNullify="handleNullify"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></kt-table>
  </div>
</template>

<script>
  import KtButton from "@/components/KtButton/KtButton"
  import KtTable from "@/components/KtTable/KtTable"
  import { mapMutations } from 'vuex'
  import commonFun from '@/common/js/commonFun.js'
  export default {
    name: 'TemplateManageHome',
    data () {
      return {
        loading: false,
        specValue: '',
        warnLevelValue: '',
        total: 0, // 数据总条数 默认0条
        pageSize: 10, // 每页显示条数 15条
        currentPage: 1, // 显示第几页 默认第1页
        pageSizes: [10,25,50,100], // 每页显示条数 可选择
        specArr: [],
        warnLevelArr: [],
        columns: [],
        tableData: [],
      }
    },
    components:{
    	KtButton,
      KtTable
    },
    computed: {
      // warnManageObj: {
      //   get: function () {
      //     return this.$store.state.warnManage.warnManageObj
      //   },
      //   set: function () {}
      // },
      warnManageSpecArr: {
        get: function () {
          return this.$store.state.warnManage.warnManageSpecArr
        },
        set: function () {}
      },
      warnManageWarnLevelArr: {
        get: function () {
          return this.$store.state.warnManage.warnManageWarnLevelArr
        },
        set: function () {}
      },
      // warnManageFlag: {
      //   get: function () {
      //     return this.$store.state.warnManage.warnManageFlag
      //   },
      //   set: function () {}
      // },
    },
    created: function () {
      this.initColumns()
      this.getSpecArr()
      // if (this.warnManageFlag) {
      //   // console.log(this.warnManageObj.warnManageArr)
      //   this.tableData = this.warnManageObj.warnManageArr
      //   this.specValue = this.warnManageObj.warnManageSpecValue
      //   this.warnLevelValue = this.warnManageObj.warnManageWarnLevelValue
      //   this.total = this.warnManageObj.warnManageTotale
      //   this.currentPage = this.warnManageObj.warnManageCurrentPage
      //   this.pageSize = this.warnManageObj.warnManagePageSize
      //   this.specArr = this.warnManageSpecArr
      //   this.warnLevelArr = this.warnManageWarnLevelArr
      // } else {
      //   this.getSpecArr()
      // }
    },
    mounted: function () {
      let _this = this
      if (navigator.userAgent.indexOf("MSIE 9.0")>0) {
      	_this.resizeHeight()
        let timeKey
      	window.onresize = function(){
          if (timeKey) {
            clearTimeout(timeKey)
            timeKey = null
          }
          timeKey = setTimeout(function () {
            commonFun.resizeHeight()
            _this.resizeHeight()
          },100)
      	}
      }
    },
    activated: function () {
      let _this = this
      if (navigator.userAgent.indexOf("MSIE 9.0")>0) {
      	_this.resizeHeight()
        let timeKey
      	window.onresize = function(){
          if (timeKey) {
            clearTimeout(timeKey)
            timeKey = null
          }
          timeKey = setTimeout(function () {
            commonFun.resizeHeight()
            _this.resizeHeight()
          },100)
      	}
      }
    },
    methods: {
      ...mapMutations({
        'setWarnComponentWho': 'setWarnComponentWho',
        'setIsClickNewBuild': 'setIsClickNewBuild',
        // 'setTemplateManageArr': 'setTemplateManageArr',
        // 'setWarnManageObj': 'setWarnManageObj',
        'setWarnManageSpecArr': 'setWarnManageSpecArr',
        'setWarnManageWarnLevelArr': 'setWarnManageWarnLevelArr',
        'setTemplateManageData': 'setTemplateManageData',
        // 'setWarnManageFlag': 'setWarnManageFlag',
        'setMajorAbled': 'setMajorAbled',
      }),
      getSpecArr: function () {
        this.$api.warnManage.findNeTypeParams().then((res) => {
          // if (res.code == '00') {
            this.specArr = res
            this.setWarnManageSpecArr(res)
            this.getWarnLevelArr()
          // }
        })
      },
      getWarnLevelArr: function () {
        this.$api.warnManage.findFaultResponseLevel().then((res) => {
          // if (res.code == '00') {
            this.warnLevelArr = res
            this.setWarnManageWarnLevelArr(res)
            this.handleParam()
          // }
        })
      },
      handleParam: function () {
        let jsonObj = {
          major: this.specValue,
          alarmlevel: this.warnLevelValue,
          currentPage: this.currentPage,
          pageSize: this.pageSize
        }
        // console.log(jsonObj)
        let jsonStr = JSON.stringify(jsonObj)
        this.getTableData(jsonStr)
      },
      handleSizeChange: function (pageSize) {
        this.pageSize = pageSize
        this.currentPage = 1
        this.handleParam()
      },
      handleCurrentChange: function (currentPage) {
        this.currentPage = currentPage
        this.handleParam()
      },
      clickSearch: function () {
        this.currentPage = 1
        this.handleParam()
      },
      resizeHeight: function () {
        let templateManageTableContainer = document.querySelector('#templateManageTable .table-container')
        let templateManageTable = document.querySelector('#templateManageTable .table-container-con')
        if (templateManageTableContainer) {
          templateManageTableContainer.style.height = document.documentElement.clientHeight-227 + 'px'
          if (templateManageTable) {
            templateManageTable.style.height = document.documentElement.clientHeight-252 + 'px'
          }
        }
        templateManageTableContainer = null
      },
      handleEdit: function (id,row) {
        this.setWarnComponentWho('TemplateManageNewBuild')
        this.setIsClickNewBuild('编辑')
        this.setTemplateManageData(row)
        this.setMajorAbled(true)
      },
      handleNullify: function (index,row) {
        let _this = this
        if (row.state == '无效') {
          return
        }
        this.$api.warnManage.cancelMould(row.id).then(function (res) {
          if (res.code == '0') {
            _this.handleParam()
          }
        })
      },
      initColumns: function () {
        this.columns = [[
          {prop:"ROW_ID", label:"序号",sortable: true,width: "80px"},
          {prop:"major", label:"专业",sortable: true,width: "100px"},
          {prop:"alarmlevel", label:"告警级别",sortable: true,width: "120px"},
        ],[
          // {prop:"publishobjectProvince", label:"发送对象",sortable: true},
          {prop:"updatetime", label:"更新时间",sortable: true,width:"150px"},
          {prop:"state", label:"状态",sortable: true,width: "80px"}
        ]]
      },
      getTableData: function (jsonStr) {
        this.loading = true
        this.$api.warnManage.findMould(jsonStr).then((res) => {
          let tempTableData
          let _this = this
          if (res.code == '0') {
            tempTableData = res.data.concat()
            tempTableData = tempTableData.map(function (item) {
              let mouldTempArr = item.mouldcontent.replace(/\s+/g,'').split('},')
              let arrMould = mouldTempArr.map(function (item,index) {
                let mouldtitleStart = item.indexOf('mouldtitle=')
                let mouldtitleEnd = item.indexOf(',mouldvariate')
                let mouldvariateEnd = item.indexOf(',readO')
                let obj = null;
                if (index == 0) {
                	obj = {
                		mouldtitle: item.substring(mouldtitleStart+11,mouldtitleEnd),
                		mouldvariate: item.substring(mouldtitleEnd+14,mouldvariateEnd),
                		readO: true
                	}
                } else {
                	obj = {
                		mouldtitle: item.substring(mouldtitleStart+11,mouldtitleEnd),
                		mouldvariate: item.substring(mouldtitleEnd+14,mouldvariateEnd),
                		readO: false
                	}
                }
                return obj
              })
              item.mouldcontent = arrMould
              let arrSpec = _this.specArr.concat()
              let arrLev = _this.warnLevelArr.concat()
              for (let i=0;i<arrSpec.length;i++) {
                if (item.major == arrSpec[i].code) {
                  item.major = arrSpec[i].name
                  break
                }
              }
              for (let i=0;i<arrLev.length;i++) {
                if (item.alarmlevel == arrLev[i].code) {
                  item.alarmlevel = arrLev[i].name
                  break
                }
              }
              if (item.state == '0') {
                item.state = '无效'
              } else if (item.state == '1') {
                item.state = '有效'
              }
              return item
            })
            this.tableData = tempTableData
            // this.setTemplateManageArr(tempTableData)
            this.loading = false
            this.total = parseInt(res.total)
            // this.setWarnManageFlag(true)
            // this.setWarnManageObj({
            //   warnManageArr: tempTableData,
            //   warnManageTotale: this.total,
            //   warnManageCurrentPage: this.currentPage,
            //   warnManagePageSize: this.pageSize,
            //   warnManageSpecValue: this.specValue,
            //   warnManageWarnLevelValue: this.warnLevelValue
            // })
          }
        })

      },
      clickNewBuild: function () {
        this.setIsClickNewBuild('新建')
        this.setMajorAbled(false)
        this.setWarnComponentWho('TemplateManageNewBuild')
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .children-container-selector
    overflow: hidden
    padding: 10px 0
    box-sizing: border-box
    text-align: center
    height: 45px
    .spec-con
      display: inline-block
    .warn-level-con
      display: inline-block
      margin-left: 20px
    .div-btn-container
      display: inline-block
      margin-left: 10px
</style>
