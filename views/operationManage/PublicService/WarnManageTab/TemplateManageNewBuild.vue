<template>
  <div class="new-build-container">
    <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm">
      <div class="children-container-selector">
        <div class="spec-con">
          <el-form-item label="专业：" prop="major">
            <el-select v-model="dataForm.major" placeholder="请选择" :disabled="majorAbled">
              <el-option
                v-for="item in warnManageSpecArr"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="warn-level-con">
          <el-form-item label="告警级别：" prop="alarmlevel">
            <el-select v-model="dataForm.alarmlevel" placeholder="请选择" :disabled="majorAbled">
              <el-option
                v-for="item in warnManageWarnLevelArr"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
      </div>
      <div class="new-build-add">
        <div class="new-build-add-btn">
          <label>预警模板：</label>
          <kt-button @click.native="clickAdd()" icon="fa fa-plus" type="primary" :label="$t('action.add')" />
        </div>
        <div class="new-build-add-content">
          <div class="new-build-add-item" v-for="(item,index) in dataForm.mouldcontent" :key="index">
            <el-form-item label="" :prop="'mouldcontent.'+index+'.mouldtitle'">
              <el-input class="new-build-add-itemleft" type="text" v-model="item.mouldtitle" :readonly="item.readO" placeholder="请输入预警发布项"></el-input>
            </el-form-item>
            <el-form-item label="" :prop="'mouldcontent.'+index+'.mouldvariate'">
              <el-input class="new-build-add-itemcenter" v-model="item.mouldvariate" type="text" placeholder="请点击右侧选择变量添加内容"></el-input>
            </el-form-item>
            <kt-button icon="fa" type="primary" label="删除" @click.native="clickSelectVariableDel(index,item.mouldvariate)" />
            <kt-button icon="fa" type="primary" label="选择变量" @click.native="clickSelectVariable(index,item.mouldvariate)" />
          </div>
        </div>
      </div>
      <div class="new-build-issue">
        <el-form-item label="发布方式：" prop="publishtype">
          <el-select v-model="dataForm.publishtype" placeholder="请选择"
             style="width: 100%;">
            <el-option
              v-for="item in issueArr"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <div class="new-build-province">
        <el-form-item label="省公司发布对象：" prop="publishobjectProvince">
          <el-input v-model="dataForm.publishobjectProvince" auto-complete="off" :readonly="true" placeholder="预警模板省公司发布对象选择,选择对象为短彩信群组"></el-input>
          <kt-button @click.native="clickProvince()" icon="fa" type="primary" label="选择"/>
        </el-form-item>
      </div>
      <div class="new-build-province">
        <el-form-item label="市公司发布对象：" prop="publishobjectCity">
          <el-input v-model="dataForm.publishobjectCity" auto-complete="off" :readonly="true" placeholder="预警模板市公司发布对象选择,选择对象为地市群组矩阵表"></el-input>
          <kt-button @click.native="clickCity()" icon="fa" type="primary" label="选择"/>
        </el-form-item>
      </div>
      <kt-button v-if="isClickNewBuild=='新建'" @click.native="clickNewBuild()" icon="fa" type="primary" label="新建"/>
      <kt-button v-else @click.native="clickNewBuild()" icon="fa" type="primary" label="编辑"/>
      <kt-button @click.native="clickBack()" icon="fa" type="primary" label="关闭"/>
    </el-form>
    <el-dialog title="选择变量" :close-on-click-modal="false" width="40%" :visible.sync="dialogSelectVariable">
        <el-checkbox-group v-model="selectVariableCheckList">
          <el-checkbox :label="item.name" v-for="item in selectVariableArrLocal" :key="item.id"></el-checkbox>
        </el-checkbox-group>
      <kt-button class="dialog-select-variable-confirm" @click.native="clickSelectVariableConfirm()" icon="fa" type="primary" label="确定"/>
    </el-dialog>
    <el-dialog class="dialog-province dialog-warnManage" title="省公司发布对象" :close-on-click-modal="false" width="40%" :visible.sync="dialogProvince">
      <el-tree
        :data="provinceData"
        show-checkbox
        node-key="userid"
        :props="provinceDefaultProps"
        :default-checked-keys="provinceDefaultChecked"
        ref="provinceTree">
      </el-tree>
      <kt-button class="dialog-select-variable-confirm" @click="clickProvinceConfirm()" icon="fa" type="primary" label="确定"/>
    </el-dialog>
    <el-dialog class="dialog-warnManage" title="选择(地市群组矩阵表)" :close-on-click-modal="false" width="40%" :visible.sync="dialogCity">
      <el-tree
        :data="provinceData"
        show-checkbox
        node-key="userid"
        :props="provinceDefaultProps"
        :default-checked-keys="cityDefaultChecked"
        ref="provinceTree1">
      </el-tree>
      <kt-button class="dialog-select-variable-confirm" @click="clickCityConfirm()" icon="fa" type="primary" label="确定"/>
      <!-- <div class="dialog-city-selector">
        <div class="width50-left">
          <label>地市：</label>
          <el-select @change="changeCityName" v-model="cityNameValue" placeholder="请选择">
            <el-option
              v-for="item in cityNameArr"
              :key="item.ID"
              :label="item.VALUE"
              :value="item.VALUE">
            </el-option>
          </el-select>
        </div>
        <div class="width50-left">
          <label>职位：</label>
          <el-select @change="changeCityPosition" v-model="positionValue" placeholder="请选择">
            <el-option
              v-for="item in positionArr"
              :key="item.ID"
              :label="item.VALUE"
              :value="item.VALUE">
            </el-option>
          </el-select>
        </div>
      </div>
      <kt-table ref="ktCityTable"
        :columns="columns"
        :dataArr="tableData"
        :showPage="showPage"
        :loading="loading"
        @selector="selectItem"
      ></kt-table>
      <kt-button class="dialog-select-variable-confirm dialog-city-btn" @click="clickCityConfirm()" icon="fa" type="primary" label="确定"/> -->
    </el-dialog>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex'
  import KtTable from "@/components/KtTable/KtTable"
  import KtButton from "@/components/KtButton/KtButton"
  import commonFun from '@/common/js/commonFun.js'
  export default {
    name: 'TemplateManageNewBuild',
    data () {
      return {
        dataFormRules: {
        	publishtype: [
        		{ required: true, message: '请选择发布方式', trigger: 'blur' }
        	],
          publishobjectProvince: [
          	{ required: true, message: '请选择省级发送对象', trigger: 'blur' }
          ],
          // publishobjectCity: [
          // 	{ required: true, message: '请选择市级发送对象', trigger: 'blur' }
          // ],
        },
        provinceDefaultChecked: [],
        cityDefaultChecked: [],
        loading: false,
        issueArr: [
          {
            id: '1',
            name: '人工'
          },{
            id: '2',
            name: '自动'
          }
        ],
        selectVariableArrLocal: [],
        dialogSelectVariable: false,
        dialogProvince: false,
        dialogCity: false,
        selectVariableCheckList: [],
        selectVariableIndex: 0,
        dataForm: {},
        provinceDefaultProps: {
          children: 'children',
          label: 'username'
        },
        provinceData: [],
        cityNameValue: '',
        cityNameArr: [{
          ID: '001',
          VALUE: '移动'
          },{
            ID: '002',
            VALUE: '联想'
          },{
            ID: '003',
            VALUE: '电信'
          },],
        positionValue: '',
        positionArr: [{
          ID: '001',
          VALUE: '移动'
          },{
            ID: '002',
            VALUE: '联想'
          },{
            ID: '003',
            VALUE: '电信'
          },],
          columns: [],
          tableData: [],
          showPage: false,
          citySelectorArr: []
      }
    },
    components:{
    	KtButton,
      KtTable
    },
    computed: {
      isClickNewBuild: {
        get: function () {
          return this.$store.state.warnManage.isClickNewBuild
        },
        set: function () {}
      },
      majorAbled: {
        get: function () {
          return this.$store.state.warnManage.majorAbled
        },
        set: function () {}
      },
      templateManageData: {
        get: function () {
          return this.$store.state.warnManage.templateManageData
        },
        set: function () {}
      },
      // templateManageArr: {
      //   get: function () {
      //     return this.$store.state.warnManage.templateManageArr
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
      // selectVariableObj: {
      //   get: function () {
      //     return this.$store.state.warnManage.selectVariableObj
      //   },
      //   set: function () {}
      // },
      // provinceObj: {
      //   get: function () {
      //     return this.$store.state.warnManage.provinceObj
      //   },
      //   set: function () {}
      // },
      // cityObj: {
      //   get: function () {
      //     return this.$store.state.warnManage.cityObj
      //   },
      //   set: function () {}
      // },
      // smsGroupPerson: {
      //   get: function () {
      //     return this.$store.state.warnManage.smsGroupPerson
      //   },
      //   set: function () {}
      // },
    },
    mounted: function () {
      this.getTemplateVariate()
      this.getSmsGroupPerson()
      // console.log(this.templateManageData)
      // this.specArr = this.warnManageSpecArr
      // this.warnLevelArr = this.warnManageWarnLevelArr
      // this.initColumns()
      // this.getTableData()
      // if (this.selectVariableObj.flag) {
      //   this.selectVariableArrLocal = this.selectVariableObj.arr
      // } else {
      //   this.getTemplateVariate()
      // }
      // if (this.smsGroupPerson.flag) {
      //   this.provinceData = this.smsGroupPerson.arr
      // } else {
      //   this.getSmsGroupPerson()
      // }
      // if (this.provinceObj.flag) {
      //   this.provinceData = this.provinceObj.arr
      // } else {
      //   this.getTemplateProvince()
      // }
      // if (this.cityObj.flag) {
      //   this.tableData = this.cityObj.arr
      // } else {
      //   this.getTemplateCity()
      // }
      if (this.isClickNewBuild == '新建') {
        this.dataForm = {
          major: '',
          alarmlevel: '',
          publishtype: '',
          publishobjectProvince: '',
          publishobjectCity: '',
          mouldcontent: [{
            mouldtitle: '短信主题',
            mouldvariate: '',
            readO: true
          }],
          publishobjectProvinceIds: [],
          publishobjectCityIds: [],
        }
      } else if (this.isClickNewBuild == '编辑') {
        let temData = Object.assign({}, this.templateManageData)
        if (temData.publishtype == '1') {
          temData.publishtype = '人工'
        } else if (temData.publishtype == '2') {
          temData.publishtype = '自动'
        }
        if (temData.state == '有效') {
          temData.state = '1'
        } else if (temData.state == '无效') {
          temData.state = '0'
        }
        if (temData.publishobjectProvinceIds) {
          temData.publishobjectProvinceIds = temData.publishobjectProvinceIds.replace(/\[|\]|\s+/g,'').split(',')
        }
        if (temData.publishobjectCityIds) {
          temData.publishobjectCityIds = temData.publishobjectCityIds.replace(/\[|\]|\s+/g,'').split(',')
        }
        this.dataForm = temData
      }
      // console.log(this.dataForm)
      this.provinceDefaultChecked = this.dataForm.publishobjectProvinceIds
      this.cityDefaultChecked = this.dataForm.publishobjectCityIds
    },
    activated: function () {
      if (this.isClickNewBuild == '新建') {
        this.dataForm = {
          major: '',
          alarmlevel: '',
          publishtype: '',
          publishobjectProvince: '',
          publishobjectCity: '',
          mouldcontent: [{
            mouldtitle: '短信主题',
            mouldvariate: '',
            readO: true
          }],
          publishobjectProvinceIds: [],
          publishobjectCityIds: [],
        }
      } else if (this.isClickNewBuild == '编辑') {
        let temData = Object.assign({}, this.templateManageData)
        if (temData.publishtype == '1') {
          temData.publishtype = '人工'
        } else if (temData.publishtype == '2') {
          temData.publishtype = '自动'
        }
        if (temData.state == '有效') {
          temData.state = '1'
        } else if (temData.state == '无效') {
          temData.state = '0'
        }
        if (temData.publishobjectProvinceIds) {
          temData.publishobjectProvinceIds = temData.publishobjectProvinceIds.replace(/\[|\]|\s+/g,'').split(',')
        }
        if (temData.publishobjectCityIds) {
          temData.publishobjectCityIds = temData.publishobjectCityIds.replace(/\[|\]|\s+/g,'').split(',')
        }
        this.dataForm = temData
      }
      // console.log(this.dataForm)
      this.provinceDefaultChecked = this.dataForm.publishobjectProvinceIds
      this.cityDefaultChecked = this.dataForm.publishobjectCityIds
    },
    methods:{
      ...mapMutations({
        'setWarnComponentWho': 'setWarnComponentWho',
        // 'setSelectVariableObj': 'setSelectVariableObj',
        // 'setProvinceObj': 'setProvinceObj',
        // 'setCityObj': 'setCityObj',
        'setWarnManageFlag': 'setWarnManageFlag',
        // 'setSmsGroupPersonObj': 'setSmsGroupPersonObj',
      }),
      clickSelectVariableDel: function (index,item) {
        let temArr = this.dataForm.mouldcontent.concat()
        temArr.splice(index,1)
        this.dataForm.mouldcontent = temArr
      },
      getSmsGroupPerson: function () {
        this.$api.warnManage.findSmsGroupPerson().then((res) => {
            this.provinceData = res.data
            // this.setSmsGroupPersonObj({
            //   flag: true,
            //   arr: res.data
            // })
        })
      },
      handleParam: function () {
        let jsonObj = {
          cityName: this.cityNameValue,
          positionName: this.positionValue
        }
        let jsonStr = JSON.stringify(jsonObj)
        this.getTemplateCity(jsonStr)
      },
      changeCityName: function () {
        this.handleParam()
      },
      changeCityPosition: function () {
        this.handleParam()
      },
      getTemplateVariate: function () {
        this.$api.warnManage.findTemplateVariate().then((res) => {
            this.selectVariableArrLocal = res
            // this.setSelectVariableObj({
            //   flag: true,
            //   arr: res
            // })
        })
      },
      getTemplateProvince: function () {
        this.$api.warnManage.findTemplateProvince().then((res) => {
          // console.log(res)
            this.provinceData = res
            // this.setProvinceObj({
            //   flag: true,
            //   arr: res
            // })
        })
      },
      getTemplateCity: function () {
        // this.loading = true
        this.$api.warnManage.findTemplateCity().then((res) => {
          this.loading = false
          // console.log(res)
            this.tableData = res
            // this.setCityObj({
            //   flag: true,
            //   arr: res
            // })
        })
      },
      clickEdit: function () {
        if (!this.dataForm.major||!this.dataForm.alarmlevel) {
          this.$alert('专业和告警级别都为必选项', '温馨提示', {
            confirmButtonText: '确定'
          });
          return
        }
        let temData = Object.assign({}, this.dataForm)
        for (let i=0,len=this.warnManageSpecArr.length;i<len;i++) {
          if (temData.major == this.warnManageSpecArr[i].name) {
            temData.major = this.warnManageSpecArr[i].code
            break
          }
        }
        for (let i=0,len=this.warnManageWarnLevelArr.length;i<len;i++) {
          if (temData.alarmlevel == this.warnManageWarnLevelArr[i].name) {
            temData.alarmlevel = this.warnManageWarnLevelArr[i].code
            break
          }
        }
        if (temData.publishtype == '人工') {
          temData.publishtype = '1'
        } else if (temData.publishtype == '自动') {
          temData.publishtype = '2'
        }
        if (temData.state == '有效') {
          temData.state = '1'
        } else if (temData.state == '无效') {
          temData.state = '0'
        }
        let temauto = temData.mouldcontent.map((item) => {
          return item.mouldvariate
        })
        let jsonObj = {
          id: temData.id,
          major: temData.major,
          alarmlevel: temData.alarmlevel,
          mouldcontent: temData.mouldcontent,
          publishtype: temData.publishtype,
          publishobjectProvince: temData.publishobjectProvince,
          publishobjectCity: temData.publishobjectCity,
          updatetime: commonFun.formDate(),
          automouldcontent: temauto,
          publishobjectProvinceIds: [],
          publishobjectCityIds: [],
        }
        // console.log(jsonObj)
        let jsonStr = JSON.stringify(jsonObj)
        this.$api.warnManage.addMould(jsonStr).then((res) => {
          if (res.code == 'isExist') {
              this.$alert('已存在所选专业告警级别的模板，请重新配置', '温馨提示', {
                confirmButtonText: '确定'
              });
          } else if (res.code == '0') {
            this.setWarnManageFlag(false)
            this.setWarnComponentWho('TemplateManageHome')
          }
        })
      },
      clickNewBuild: function () {
        if (!this.dataForm.major||!this.dataForm.alarmlevel) {
          this.$alert('专业和告警级别都为必选项', '温馨提示', {
            confirmButtonText: '确定'
          });
          return
        }
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            let temData = Object.assign({}, this.dataForm)
            let temauto = temData.mouldcontent.map((item) => {
              return item.mouldvariate
            })
            for (let i=0,len=this.warnManageSpecArr.length;i<len;i++) {
              if (temData.major == this.warnManageSpecArr[i].name) {
                temData.major = this.warnManageSpecArr[i].code
                break
              }
            }
            for (let i=0,len=this.warnManageWarnLevelArr.length;i<len;i++) {
              if (temData.alarmlevel == this.warnManageWarnLevelArr[i].name) {
                temData.alarmlevel = this.warnManageWarnLevelArr[i].code
                break
              }
            }
            if (temData.publishtype == '人工') {
              temData.publishtype = '1'
            } else if (temData.publishtype == '自动') {
              temData.publishtype = '2'
            }
            let jsonObj
            if (this.isClickNewBuild == '新建') {
              jsonObj = {
                major: temData.major,
                alarmlevel: temData.alarmlevel,
                mouldcontent: temData.mouldcontent,
                publishtype: temData.publishtype,
                publishobjectProvince: temData.publishobjectProvince,
                publishobjectCity: temData.publishobjectCity,
                updatetime: commonFun.formDate(),
                automouldcontent: temauto,
                state: 1,
                publishobjectProvinceIds: temData.publishobjectProvinceIds,
                publishobjectCityIds: temData.publishobjectCityIds,
              }
            } else if (this.isClickNewBuild == '编辑') {
              jsonObj = {
                id: temData.id,
                major: temData.major,
                alarmlevel: temData.alarmlevel,
                mouldcontent: temData.mouldcontent,
                publishtype: temData.publishtype,
                publishobjectProvince: temData.publishobjectProvince,
                publishobjectCity: temData.publishobjectCity,
                updatetime: commonFun.formDate(),
                automouldcontent: temauto,
                state: temData.state,
                publishobjectProvinceIds: temData.publishobjectProvinceIds,
                publishobjectCityIds: temData.publishobjectCityIds,
              }
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.$api.warnManage.addMould(jsonStr).then((res) => {
              if (res.code == 'isExist') {
                  this.$alert('已存在所选专业告警级别的模板，请重新配置', '温馨提示', {
                    confirmButtonText: '确定'
                  });
              } else if (res.code == '0') {
                this.setWarnManageFlag(false)
                this.setWarnComponentWho('TemplateManageHome')
              }
            })
          }
        })
      },
      clickBack: function () {
        this.setWarnComponentWho('TemplateManageHome')
        // 把dataForm数据传到后台
      },
      clickAdd: function () {
        // 测试中配置
        if (!this.dataForm.major||!this.dataForm.alarmlevel) {
          this.$alert('专业和告警级别都为必选项', '温馨提示', {
            confirmButtonText: '确定'
          });
          return
        }
        this.dataForm.mouldcontent.push({
          mouldtitle: '',
          mouldvariate: '',
          readO: false
        })
      },
      clickSelectVariable: function (index,variableContent) {
        if (variableContent) {
          this.selectVariableCheckList = variableContent.split(',')
        }
        this.dialogSelectVariable = true
        this.selectVariableIndex = index
      },
      clickSelectVariableConfirm: function () {
        this.dataForm.mouldcontent[this.selectVariableIndex].mouldvariate = this.formatData(this.selectVariableCheckList)
        this.dialogSelectVariable = false
        this.selectVariableCheckList = []
      },
      clickProvince: function () {
        this.dialogProvince = true
        // if (this.$refs.provinceTree) {
        //   this.$refs.provinceTree.setCheckedNodes([])
        // }
      },
      clickProvinceConfirm: function () {
       this.dataForm.publishobjectProvince = this.formatDataProvince(this.$refs.provinceTree.getCheckedNodes())
       this.dataForm.publishobjectProvinceIds = this.formatDataProvinceIds(this.$refs.provinceTree.getCheckedNodes())
       this.dialogProvince = false
      },
      clickCity: function () {
        this.dialogCity = true
        // if (this.$refs.provinceTree1) {
        //   this.$refs.provinceTree1.setCheckedNodes([])
        // }
        // if (this.$refs.ktCityTable) {
        //   this.$refs.ktCityTable.clearUserSelection()
        // }
      },
      clickCityConfirm: function () {
        this.dataForm.publishobjectCity = this.formatDataProvince(this.$refs.provinceTree1.getCheckedNodes())
        this.dataForm.publishobjectCityIds = this.formatDataProvinceIds(this.$refs.provinceTree1.getCheckedNodes())
        // this.dataForm.publishobjectCity = this.formatDataCity(this.citySelectorArr)
        this.dialogCity = false
      },
      selectItem: function (selector,row) {
        this.citySelectorArr = selector
      },
      initColumns: function () {
        this.columns = [
          {prop:"xingming", label:"姓名",sortable: true},
          {prop:"shoujihao", label:"手机号",sortable: true},
          {prop:"zhiwei", label:"职位",sortable: true},
          {prop:"dishi", label:"地市",sortable: true},
        ]
      },
      // 将数组转为字符串
      formatData: function (arr) {
        let arrToTostring = ''
        for (let i=0;i<arr.length;i++) {
          if (i==0) {
            arrToTostring += arr[i]
          } else {
            arrToTostring += ','+arr[i]
          }
        }
        return arrToTostring
      },
      formatDataCity: function (arr) {
        let arrToTostring = ''
        for (let i=0;i<arr.length;i++) {
          if (i==arr.length-1) {
            arrToTostring += '['+arr[i].xingming+':'+arr[i].shoujihao+']'
          } else {
            arrToTostring += '['+arr[i].xingming+':'+arr[i].shoujihao+'],'
          }
        }
        return arrToTostring
      },
      formatDataProvince: function (arr) {
        // console.log(arr)
        let arrToTostring = ''
        for (let i=0;i<arr.length;i++) {
          if (arr[i].hasOwnProperty('children')) {
            continue
          }
          if (i==arr.length-1) {
            arrToTostring += '['+arr[i].username+':'+arr[i].phoneno+']'
          } else {
            arrToTostring += '['+arr[i].username+':'+arr[i].phoneno+'],'
          }
        }
        return arrToTostring
      },
      formatDataProvinceIds: function (arr) {
        // console.log(arr)
        let ids = []
        for (let i=0;i<arr.length;i++) {
          if (arr[i].hasOwnProperty('children')) {
            continue
          }
          ids.push(arr[i].userid)
        }
        return ids
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../../common/stylus/variable"
  .new-build-container
    height: 100%
    padding-bottom: 10px
    overflow-y: auto
    box-sizing: border-box
  .children-container-selector
    overflow: hidden
    padding: 10px 20px
    box-sizing: border-box
    text-align: left
    border-bottom: 1px solid #dfdfdf
    .spec-con
      display: inline-block
    .warn-level-con
      display: inline-block
      margin-left: 20px
    .div-btn-container
      display: inline-block
    .el-input__suffix
      right: 20px
  .new-build-add
    text-align: left
    padding: 10px 20px
    border-bottom: 1px solid #dfdfdf
    .new-build-add-content
      padding: 0 20px
      box-sizing: border-box
      .new-build-add-item
        margin-top: 10px
        overflow: hidden
        position: relative
  .new-build-issue
    margin-top: 10px
    text-align: left
    padding-left: 20px
  .new-build-province
  .new-build-city
    padding-left: 20px
    padding-right: 40px
    overflow: hidden
  .dialog-city-selector
    font-size: $font-size-small
    margin-bottom: 10px
    overflow: hidden
</style>
