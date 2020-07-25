<template>
  <div class="warn-manage-container" id="warnInfoTable">
    <div class="children-container form-input-left-right">
      <div class="warn-manage-form-height">
        <div class="warn-manage-form">
          <h3 class="warn-manage-title">预警管理</h3>
          <div class="warn-manage-form-content">
            <el-form :model="dataForm" class="warn-manage-form-left">
              <el-form-item class="float-left" label="告警流水号：" prop="sourceId">
                <el-input clearable type="text" v-model="dataForm.sourceId" placeholder="请输入预警流水号"></el-input>
              </el-form-item>
              <el-form-item class="float-right" label="告警ID：" prop="alarmID">
                <el-input clearable type="text" v-model="dataForm.alarmID" placeholder="请输入预警ID"></el-input>
              </el-form-item>
              <el-form-item class="float-left wran-biaoti" label="告警标题：" prop="alarmTitle">
                <el-input clearable type="text" v-model="dataForm.alarmTitle" placeholder="请输入预警标题"></el-input>
              </el-form-item>
              <el-form-item class="float-left" label="专业：" prop="major">
                <el-select v-model="dataForm.major" :clearable="true" placeholder="请选择专业"
                   style="width: 100%;">
                  <el-option
                    v-for="item in deviceSpecialtyArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="float-right" label="地市：" prop="city">
                <el-select v-model="dataForm.city" :clearable="true" placeholder="请选择地市"
                   style="width: 100%;">
                  <el-option
                    v-for="item in cityArr"
                    :key="item.CITYID"
                    :label="item.CITYNAME"
                    :value="item.CITYNAME">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="float-left date-picker-container" label="发布时间：" prop="publishTime">
                <el-date-picker
                  v-model="dataForm.publishTime"
                  type="daterange"
                  @change="changeDate"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item class="float-right" label="状态：" prop="state">
                <el-select v-model="dataForm.state" :clearable="true" placeholder="请选择状态"
                   style="width: 100%;">
                  <el-option
                    v-for="item in stateArr"
                    :key="item.id"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="warn-manage-form-right">
              <kt-button @click.native="clickSearch()" icon="fa fa-search" type="primary" :label="$t('action.search')" />
              <kt-button @click.native="clickLeadIn()" icon="fa fa-plus" type="primary" :label="$t('action.leadIn')" />
            </div>
          </div>
        </div>
        <h3 class="warn-manage-title">预警信息列表</h3>
      </div>
      <kt-table id="warnInfoTableId" ref="ktTable"
        :columns="columns"
        :dataArr="tableData"
        :showCheckBox="false"
        :showOperate="true"
        :showEditBtn="false"
        :showLookUpBtn="true"
        :showIssueBtn="true"
        :showNullifyBtn="true"
        :operationWidth="operationWidth"
        :currentPage="currentPage"
        :pageSizes="pageSizes"
        :pageSize="pageSize"
        :total="total"
        @handleLookUp="handleLookUp"
        @handleIssue="handleIssue"
        @handleNullify="handleNullify"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      ></kt-table>
    </div>
    <el-dialog class="dialog-loadin-container" title="告警信息导入" :close-on-click-modal="false" width="40%" :visible.sync="dialogWarnInfoLeadIn">
      <div class="dialog-warn-info-download">
        <label>告警信息导入模板下载：</label>
        <a v-show="!showLeadIn" href="./告警信息导入模板.xlsx">告警信息导入模板.xlsx</a>
        <span v-show="showLeadIn" @click="clickDownFile" class="warnInfo-down-span">告警信息导入模板.xlsx</span>
      </div>
      <div class="dialog-warn-info-browse">
         <div v-show="showLeadIn"><!-- id="formFile" method="post" enctype="multipart/form-data" -->
           <el-input v-model="selectFileValue" type="text" :readonly="true"></el-input>
           <kt-button class="dialog-warn-info-browse-btn" icon="fa" type="primary" label="浏览"/>
           <input type="file" name="file" ref="fileRef" class="warn-info-template-download" @change="changeFile()">
         </div>
         <file-upload
         　　ref="upload"
             v-show="!showLeadIn"
         　　v-model="uploadFiles"
         　　post-action="/wrm/eomsWarnInfo/importWarnInfo"
            :multiple="false"
            :headers="{'Content-Type':'multipart/form-data'}"
            @input-file="inputFile"
         >浏览</file-upload>
         <el-input v-show="!showLeadIn" v-model="selectFileValue" type="text" :readonly="true"></el-input>
      </div>
      <kt-button class="dialog-select-variable-confirm" @click.native="clickWarnInfoLeadInConfirm()" icon="fa" type="primary" label="确定"/>
    </el-dialog>
    <el-dialog class="dialog-warn-info-lokeup" title="预警信息" :close-on-click-modal="false" width="60%" :visible.sync="dialogWarnInfoLokeUp">
      <div class="warn-info-lokeup-container">
        <el-form :model="dialogDataForm">
          <el-form-item class="warn-info-lokeup-input" label="预警编号：" prop="warnnumber">
            <el-input type="text" v-model="dialogDataForm.warnnumber" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item class="warn-info-lokeup-textarea" label="预警信息：" prop="warnContent">
            <el-input type="textarea" :autosize="{minRows:4,maxRows: 6}" v-if="isClickIssue" v-model="dialogDataForm.warnContent"></el-input>
            <div v-else class="warn-info-lokeup-textarea-text">{{dialogDataForm.warnContent}}</div>
          </el-form-item>
          <div v-show="isClickIssue" class="new-build-province">
            <el-form-item label="省公司发布对象：" prop="publishobjectProvince">
              <el-input :class="{'width100':!isClickIssue}" type="text" v-model="dialogDataForm.publishobjectProvince" placeholder="按照模板选择群组自动匹配发布对象;可通过选择按钮重新调整" :readonly="true"></el-input>
              <kt-button v-if="isClickIssue" @click.native="clickProvinceSelector()" icon="fa" type="primary" label="选择"/>
            </el-form-item>
          </div>
          <div v-show="isClickIssue" class="new-build-province">
            <el-form-item label="市公司发布对象：" prop="publishobjectCity">
              <el-input :class="{'width100':!isClickIssue}" v-model="dialogDataForm.publishobjectCity" auto-complete="off" :readonly="true" placeholder="按照模板选择人员,当前告警的地市匹配;可通过选择按钮重新调整"></el-input>
              <kt-button v-if="isClickIssue" icon="fa" type="primary" @click.native="clickCitySelector()" label="选择"/>
            </el-form-item>
          </div>
          <div v-show="!isClickIssue" class="width100-left warn-info-lokeup-item" :title="dialogDataForm.publishobjectProvince">
            <span>省公司发布对象：</span>
            <span>{{dialogDataForm.publishobjectProvince}}</span>
          </div>
          <div v-show="!isClickIssue" class="width100-left warn-info-lokeup-item" :title="dialogDataForm.publishobjectCity">
            <span>市公司发布对象：</span>
            <span>{{dialogDataForm.publishobjectCity}}</span>
          </div>
          <div class="width100-left warn-info-lokeup-item" :title="dialogDataForm.title">
            <span>告警标题：</span>
            <span>{{dialogDataForm.title}}</span>
          </div>
          <div class="width100-left warn-info-lokeup-item" :title="dialogDataForm.descr">
            <span>预警描述：</span>
            <span>{{dialogDataForm.descr}}</span>
          </div>
          <div class="width100-left warn-info-lokeup-item">
            <span>告警解释：</span>
            <span>{{dialogDataForm.comments}}</span>
          </div>
          <div class="width100-left warn-info-lokeup-item">
            <span>专业网管原始告警流水号：</span>
            <span>{{dialogDataForm.sourceId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警ID：</span>
            <span>{{dialogDataForm.eventId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警发生时间：</span>
            <span>{{dialogDataForm.occurTime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警级别：</span>
            <span>{{formSeverity(dialogDataForm.severity)}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>发布时间：</span>
            <span>{{dialogDataForm.publishtime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>发布人：</span>
            <span>{{dialogDataForm.publisher}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警产生时间：</span>
            <span>{{dialogDataForm.alarmcreatetime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>清除标记：</span>
            <span>{{dialogDataForm.clearTag}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>清除时间：</span>
            <span>{{dialogDataForm.clearTime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>清除用户：</span>
            <span>{{dialogDataForm.clearUser}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>网元别名：</span>
            <span>{{dialogDataForm.deviceAlias}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>地市：</span>
            <span>{{dialogDataForm.deviceCity}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>区县：</span>
            <span>{{dialogDataForm.deviceCounty}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备描述：</span>
            <span>{{dialogDataForm.deviceDesc}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备ID：</span>
            <span>{{dialogDataForm.deviceId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备IP：</span>
            <span>{{dialogDataForm.deviceIp}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备地理位置：</span>
            <span>{{dialogDataForm.deviceLocation}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>网元名称：</span>
            <span>{{dialogDataForm.deviceName}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属网络：</span>
            <span>{{dialogDataForm.deviceNetwork}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备网络级别：</span>
            <span>{{dialogDataForm.deviceNetworkLevel}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属子网络：</span>
            <span>{{dialogDataForm.deviceNetworkSub}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>省份：</span>
            <span>{{dialogDataForm.deviceProvince}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属业务：</span>
            <span>{{dialogDataForm.deviceService}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属子业务：</span>
            <span>{{dialogDataForm.deviceServiceSub}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属专业：</span>
            <span>{{dialogDataForm.deviceSpecialty}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备所属子专业：</span>
            <span>{{dialogDataForm.deviceSpecialtySub}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>设备类型：</span>
            <span>{{dialogDataForm.deviceType}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>厂家标识：</span>
            <span>{{dialogDataForm.deviceVendor}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>网元版本：</span>
            <span>{{dialogDataForm.deviceVersion}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警发现时间：</span>
            <span>{{dialogDataForm.discoverTime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>工单ID：</span>
            <span>{{dialogDataForm.dispId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>派单使用规则：</span>
            <span>{{dialogDataForm.dispRules}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>派单时间：</span>
            <span>{{dialogDataForm.dispTime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警类别：</span>
            <span>{{dialogDataForm.facility}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警逻辑分类：</span>
            <span>{{dialogDataForm.facilityLogic}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警逻辑子类：</span>
            <span>{{dialogDataForm.facilityLogicSub}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>id：</span>
            <span>{{dialogDataForm.id}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>是否需要上报集团：</span>
            <span>{{formIsReport(dialogDataForm.isReport)}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警标准名：</span>
            <span>{{dialogDataForm.name}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警对象别名：</span>
            <span>{{dialogDataForm.objectAlias}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>对象描述：</span>
            <span>{{dialogDataForm.objectDesc}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>对象ID：</span>
            <span>{{dialogDataForm.objectId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>对象IP：</span>
            <span>{{dialogDataForm.objectIp}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警对象名：</span>
            <span>{{dialogDataForm.objectName}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警对象类型：</span>
            <span>{{dialogDataForm.objectType}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警工程状态：</span>
            <span>{{dialogDataForm.projectStatus}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警工程细分状态：</span>
            <span>{{dialogDataForm.projectStatusSub}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>网管告警流水号：</span>
            <span>{{dialogDataForm.recordId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>该事件对设备的影响：</span>
            <span>{{dialogDataForm.referenceDevic}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>该事件对业务的影响：</span>
            <span>{{dialogDataForm.referenceService}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>专业网管原始告警系统：</span>
            <span>{{dialogDataForm.sourceSystem}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>告警开始时间：</span>
            <span>{{dialogDataForm.startTime}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>状态：</span>
            <span>{{formState(dialogDataForm.state)}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>厂家告警号：</span>
            <span>{{dialogDataForm.vendorEventId}}</span>
          </div>
          <div class="width50-left warn-info-lokeup-item">
            <span>厂家原始告警级别：</span>
            <span>{{dialogDataForm.vendorEventSeve}}</span>
          </div>
        </el-form>
      </div>
      <div class="warn-info-lokeup-btns">
        <kt-button v-if="isClickIssue" @click.native="clickWarnInfoLokeUpIssue()" icon="fa" type="primary" label="发布"/>
        <kt-button @click.native="clickWarnInfoLokeUpClose()" icon="fa" type="primary" label="关闭"/>
      </div>
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
      <!-- <div class="dialog-city-selector">
        <div class="width50-left">
          <label>地市：</label>
          <el-select v-model="cityNameValue" placeholder="请选择">
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
          <el-select v-model="positionValue" placeholder="请选择">
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
        :columns="cityColumns"
        :dataArr="cityTableData"
        :showPage="false"
        @selector="selectItemCity"
      ></kt-table> -->
      <kt-button class="dialog-select-variable-confirm dialog-city-btn" @click="clickCityConfirm()" icon="fa" type="primary" label="确定"/>
    </el-dialog>
    <p id="id_form"></p>
  </div>
</template>
<script>
import '../../../../common/stylus/warnManage/warnManage.styl'
import KtButton from "@/components/KtButton/KtButton"
import KtTable from "@/components/KtTable/KtTable"
import commonFun from '@/common/js/commonFun.js'
import { mapMutations } from 'vuex'
import axios from 'axios'
import $ from 'jquery'
// import jquery_form from 'jquery-form/dist/jquery.form.min.js'
import 'vue-upload-component/dist/vue-upload-component.part.css'
import FileUpload from 'vue-upload-component'
import XLSX from 'xlsx'
export default {
  name: 'WarnManageTabWarnManage',
  data () {
    return {
      total: 0, // 数据总条数 默认0条
      pageSize: 10, // 每页显示条数 15条
      currentPage: 1, // 显示第几页 默认第1页
      pageSizes: [5,10,15,20,50], // 每页显示条数 可选择
      operationWidth: '200',
      showLeadIn: true,
      tempPushlishTime: null,
      formDataFile: null,
      uploadFiles: [],
      loading: false,
      tableWidth: '',
      fileValue: '',
      selectFileValue: '',
      cityNameValue: '',
      positionValue: '',
      dialogWarnInfoLeadIn: false,
      dialogWarnInfoLokeUp: false,
      isClickIssue: false,
      dialogProvince: false,
      dialogCity: false,
      columns: [],
      tableData: [],
      cityColumns: [],
      cityTableData: [],
      citySelectorArr: [],
      provinceDefaultChecked: [],
      cityDefaultChecked: [],
      templateData:[ // 导出的excel模板数据
          {
            '网管告警流水号': '',
            '网管告警ID': '',
            '告警对象ID': '',
            '专业网管原始告警流水号': '',
            '告警正文': '',
            '告警开始时间': '',
            '告警发生时间': '',
            '告警发现时间': '',
            '清除标记': '',
            '清除用户': '',
            '清除时间': '',
            '派单时间': '',
            '派单使用规则': '',
            '工单ID': '',
            '告警来源': '',
            '告警工程状态': '',
            '告警工程细分状态': '',
            '告警对象名称': '',
            '告警对象别名': '',
            '对象IP': '',
            '对象描述': '',
            '告警对象类型': '',
            '设备ID': '',
            '网元名称': '',
            '网元别名': '',
            '设备IP': '',
            '设备所属专业': '',
            '设备所属子专业': '',
            '设备所属业务': '',
            '设备所属子业务': '',
            '设备所属网络': '',
            '设备所属子网络': '',
            '设备网络级别': '',
            '设备地理位置': '',
            '设备类型': '',
            '网元版本': '',
            '设备描述': '',
            '厂家标识': '',
            '省份': '',
            '地市': '',
            '区县': '',
            '厂家告警号': '',
            '厂家原始告警级别': '',
            '告警标题': '',
            '告警标准名': '',
            '网管告警级别': '',
            '告警解释': '',
            '告警类别': '',
            '告警逻辑分类': '',
            '告警逻辑子类': '',
            '该事件对设备的影响': '',
            '该事件对业务的影响': '',
            '是否需要上报集团：0不需要上报 1需要上报': '',
            '预警信息': '',
            '发布对象': ''
          },
      ],
      cityNameArr: [{
        ID: '001',
        VALUE: '移动'
        },{
          ID: '002',
          VALUE: '联想'
        },{
          ID: '003',
          VALUE: '电信'
        }],
        positionArr: [{
          ID: '001',
          VALUE: '移动'
          },{
            ID: '002',
            VALUE: '联想'
          },{
            ID: '003',
            VALUE: '电信'
          }],
      showPage: '',
      provinceDefaultProps: {
        children: 'children',
        label: 'username'
      },
      provinceData: [],
      dialogDataForm: {},
      dataForm: {},
      deviceSpecialtyArr: [],
      cityArr: [],
      stateArr: [
        {
        id: '001',
        name: '作废',
        value: '0'
        },{
          id: '002',
          name: '已发布',
          value: '1'
        },{
          id: '003',
          name: '未发布',
          value: '2'
        },{
          id: '004',
          name: '导入',
          value: '3'
        }
      ],
    }
  },
  components:{
  	KtButton,
    KtTable,
    FileUpload
  },
  created: function () {
    console.log('created____')
    this.handleParam()
    this.getSpecArr()
    this.getCityArr()
    this.getSmsGroupPerson()
    // this.initCityColumns()
    // this.getCityTableData()
    // this.dataForm = this.warnManageSearchForm
    // if (this.warnManageOneObj.flag) {
    //   this.tableData = this.warnManageOneObj.arr
    //   this.total = this.warnManageOneObj.total
    //   this.currentPage = this.warnManageOneObj.currentPage
    //   this.pageSize = this.warnManageOneObj.pageSize
    // } else {
    //   this.handleParam()
    // }
    // if (this.warnManageMajorObj.flag) {
    //   this.deviceSpecialtyArr = this.warnManageMajorObj.arr
    // } else {
    //   this.getSpecArr()
    // }
    // if (this.warnManageCityObj.flag) {
    //   this.cityArr = this.warnManageCityObj.arr
    // } else {
    //   this.getCityArr()
    // }
    // if (this.smsGroupPerson.flag) {
    //   this.provinceData = this.smsGroupPerson.arr
    // } else {
    //   this.getSmsGroupPerson()
    // }
  },
  // mounted: function () {
  //   console.log('mounted-------')
  //   // this.getTableData()
  //   // this.initCityColumns()
  //   // this.getCityTableData()
  //   let _this = this
  //   if (navigator.userAgent.indexOf("MSIE 9.0")>0) {
  //     this.showLeadIn = false
  //   	_this.resizeHeight()
  //     // _this.resizeWidth()
  //     let timeKey
  //   	window.onresize = function(){
  //       if (timeKey) {
  //         clearTimeout(timeKey)
  //         timeKey = null
  //       }
  //       timeKey = setTimeout(function () {
  //         commonFun.resizeHeight()
  //         _this.resizeHeight()
  //         // _this.resizeWidth()
  //       },100)
  //   	}
  //   } else {
  //     this.showLeadIn = true
  //   }
  //   this.initColumns()
  // },
  activated: function () {
    console.log('activated----')
    let _this = this
    if (navigator.userAgent.indexOf("MSIE 9.0")>0) {
      this.showLeadIn = false
    	_this.resizeHeight()
      // _this.resizeWidth()
      let timeKey
    	window.onresize = function(){
        if (timeKey) {
          clearTimeout(timeKey)
          timeKey = null
        }
        timeKey = setTimeout(function () {
          commonFun.resizeHeight()
          _this.resizeHeight()
          // _this.resizeWidth()
        },100)
    	}
    } else {
      this.showLeadIn = true
    }
    this.initColumns()
  },
  computed: {
    // warnManageOneObj: {
    //   get: function () {
    //     return this.$store.state.warnManage.warnManageOneObj
    //   },
    //   set: function () {}
    // },
    // warnManageSearchForm: {
    //   get: function () {
    //     return this.$store.state.warnManage.warnManageSearchForm
    //   },
    //   set: function () {}
    // },
    // warnManageMajorObj: {
    //   get: function () {
    //     return this.$store.state.warnManage.warnManageMajorObj
    //   },
    //   set: function () {}
    // },
    // warnManageCityObj: {
    //   get: function () {
    //     return this.$store.state.warnManage.warnManageCityObj
    //   },
    //   set: function () {}
    // },
    // smsGroupPerson: {
    //   get: function () {
    //     return this.$store.state.warnManage.smsGroupPerson
    //   },
    //   set: function () {}
    // },
    userName: {
      get () { return this.$store.state.menu.userName },
      set () { }
    },
  },
  methods: {
    ...mapMutations({
      // 'setWarnManageOneObj': 'setWarnManageOneObj',
      // 'setWarnManageSearchForm': 'setWarnManageSearchForm',
      // 'setWarnManageMajorObj': 'setWarnManageMajorObj',
      // 'setWarnManageCityObj': 'setWarnManageCityObj',
      // 'setSmsGroupPersonObj': 'setSmsGroupPersonObj',
    }),
    clickDownFile: function () {
      let ws = XLSX.utils.json_to_sheet(this.templateData)
      let wb = XLSX.utils.book_new()
      let xlsxName = '模板文件'
      XLSX.utils.book_append_sheet(wb, ws, xlsxName)
      XLSX.writeFile(wb, xlsxName + ".xlsx")
      // let fileName = 'warnInfoTemplate.xlsx'
      // axios({
      //   url: '../../../../static/warnInfoTemplate.xlsx',
      //   method: 'get',
      //   responseType: 'blob',
      //   headers: { // application/x-download
      //     'Content-Type': 'application/json'  //application/json;application/octet-stream
      //   }
      // }).then(function (res) {
      //   console.log(res.data)
      //   if(typeof(res.data) == 'string'){
      //     let blob = new Blob([res.data], {type:'application/vnd.ms-excel'})
      //     if (window.navigator.msSaveOrOpenBlob) {//msSaveOrOpenBlob方法返回bool值
      //       navigator.msSaveBlob(blob, fileName)//本地保存
      //     } else {
      //       // alert('jkj')
      //       let link = document.createElement('a')//a标签下载
      //       link.href = window.URL.createObjectURL(blob)
      //       link.download = fileName
      //       link.style.display = 'none'
      //       document.body.appendChild(link)
      //       link.click()
      //       document.body.removeChild(link)
      //       window.URL.revokeObjectURL(link.href)
      //     }
      //   }
      // }).catch((e) => {

      // })
      // downloadFile(attachment) {
      //         let fileName = attachment.displayName;
      //         this.$http.get(strategyDownloadUrl + '/' + attachment.id).then((res) => {
      //           if(typeof(res.data) == 'string'){
      //             var blob = new Blob([res.data], {type:'application/octet-stream'})
      //             if (window.navigator.msSaveOrOpenBlob) {//msSaveOrOpenBlob方法返回bool值
      //               navigator.msSaveBlob(blob, fileName);//本地保存
      //             } else {
      //               var link = document.createElement('a');//a标签下载
      //               link.href = window.URL.createObjectURL(blob);
      //               link.download = fileName;
      //               link.click();
      //               window.URL.revokeObjectURL(link.href);
      //             }
      //           }else{
      //             swal(res.data.msg,'','info')//个人弹窗忽视
      //           }
      //         })
      //       },
    },
    inputFile: function () {
      if (this.uploadFiles.length == 0) {
        return
      }
      this.selectFileValue = this.uploadFiles[0].name
    },
    changeDate: function () {
      let tempTime_start
      let tempTime_end
      if (this.dataForm.publishTime != null) {
        let tempArr = this.dataForm.publishTime.concat()
        tempTime_start = tempArr[0].toLocaleDateString()+' 00:00:00'
        tempTime_end = tempArr[1].toLocaleDateString()+' 00:00:00'
        this.tempPushlishTime = (tempTime_start+'--'+tempTime_end).replace(/\//g,'-')
      } else {
        this.tempPushlishTime = null
      }
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
    getSpecArr: function () {
      this.$api.warnManage.findNeTypeParams().then((res) => {
        // if (res.code == '00') {
          this.deviceSpecialtyArr = res
          // this.setWarnManageMajorObj({
          //   flag: true,
          //   arr: res
          // })
        // }
      })
    },
    getCityArr: function () {
      this.$api.warnManage.findCity().then((res) => {
        // if (res.code == '00') {
          this.cityArr = res
          // this.setWarnManageCityObj({
          //   flag: true,
          //   arr: res
          // })
        // }
      })
    },
    handleParam: function () {
      // let jsonObj = {
      //   sourceId: this.dataForm.sourceId,
      //   alarmID: this.dataForm.alarmID,
      //   alarmTitle: this.dataForm.alarmTitle,
      //   major: this.dataForm.major,
      //   publishTime: this.dataForm.publishTime,
      //   city: this.dataForm.city,
      //   state: this.dataForm.state,
      //   pageNum: this.currentPage,
      //   pageSize: this.pageSize
      // }
      let parmForm = {
        sourceId: this.dataForm.sourceId,
        alarmID: this.dataForm.alarmID,
        alarmTitle: this.dataForm.alarmTitle,
        major: this.dataForm.major,
        publishTime: this.tempPushlishTime,
        city: this.dataForm.city,
        state: this.dataForm.state,
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }
      // this.setWarnManageSearchForm(jsonObj)
      let jsonStr = JSON.stringify(parmForm)
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
    changeFile: function (event) {
      this.selectFileValue = this.$refs.fileRef.value
      try{
      	let file = this.$refs.fileRef.files[0]
	      let formData = new FormData()
	      formData.append('file', file)
	      this.formDataFile = formData
      } catch (e) {
      	this.formDataFile = 'ie9'
      }
    },
    clickWarnInfoLeadInConfirm: function () {
      // document.querySelector('#formFile').submit()
      let _this = this
      if (!(this.formDataFile != null || this.uploadFiles.length > 0)) {
        this.$alert('请选择要上传的文件', '温馨提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (!(this.selectFileValue.indexOf('.xls')>-1)) {
        this.$alert('请选择xls或xlsx文档', '温馨提示', {
          confirmButtonText: '确定'
        });
        return
      }
      if (navigator.userAgent.indexOf("MSIE 9.0")>0) {
        this.$refs.upload.active = true
        this.dialogWarnInfoLeadIn = false
        this.handleParam()
      } else {
        axios.post(
        '/haeoms/wrm/eomsWarnInfo/importWarnInfo',
        _this.formDataFile,
        {headers: {"Content-Type": "multipart/form-data"}}
        ).then(function (res) {
          if (res.data.code == '200') {
            _this.handleParam()
            _this.dialogWarnInfoLeadIn = false
          } else {
            _this.$alert('文件上传失败', '温馨提示', {
              confirmButtonText: '确定'
            });
          }
        }).catch((e) => {
          _this.$alert('调取文件上传接口失败', '温馨提示', {
            confirmButtonText: '确定'
          });
        })
      }
    },
    resizeHeight: function () {
      let warnInfoTable = document.querySelector('#warnInfoTable .table-container')
      let warnInfoTableCon = document.querySelector('#warnInfoTable .table-container-con')
      if (warnInfoTable) {
        warnInfoTable.style.height = document.documentElement.clientHeight-352 + 'px'
        if (warnInfoTableCon) {
          warnInfoTableCon.style.height = document.documentElement.clientHeight-377 + 'px'
        }
      }
      warnInfoTable = null
      warnInfoTableCon = null
    },
    selectItemCity: function (selector,row) {
      this.citySelectorArr = selector
    },
    clickCityConfirm: function () {
      // this.dialogDataForm.publishobjectCity = this.formatDataCity(this.citySelectorArr)
      // this.dialogCity = false
      this.dialogDataForm.publishobjectCity = this.formatDataProvince(this.$refs.provinceTree1.getCheckedNodes())
      this.dialogDataForm.publishObjectCityIds = this.formatDataProvinceIds(this.$refs.provinceTree1.getCheckedNodes())
      // this.dataForm.publishobjectCity = this.formatDataCity(this.citySelectorArr)
      this.dialogCity = false
    },
    formatDataCity: function (arr) {
      let arrToTostring = ''
      for (let i=0;i<arr.length;i++) {
        if (i==arr.length-1) {
          arrToTostring += '['+arr[i].xingming+','+arr[i].shoujihao+']'
        } else {
          arrToTostring += '['+arr[i].xingming+','+arr[i].shoujihao+'],'
        }
      }
      return arrToTostring
    },
    initCityColumns: function () {
      this.cityColumns = [
        {prop:"xingming", label:"姓名",sortable: true},
        {prop:"shoujihao", label:"手机号",sortable: true},
        {prop:"zhiwei", label:"职位",sortable: true},
        {prop:"city", label:"地市",sortable: true},
      ]
    },
    getCityTableData: function () {
      this.cityTableData = [{
        xingming: '赵丹萍',
        shoujihao: '1111',
        zhiwei: '职位',
        city: '洛阳'
      },
      {
        xingming: '赵丹萍3',
        shoujihao: '11113',
        zhiwei: '职位3',
        city: '洛阳3'
      },{
        xingming: '赵丹萍1',
        shoujihao: '11111',
        zhiwei: '职位1',
        city: '洛阳1'
      },{
        xingming: '赵丹萍2',
        shoujihao: '11112',
        zhiwei: '职位2',
        city: '洛阳2'
      }]
    },
    clickProvinceConfirm: function () {
      this.dialogDataForm.publishobjectProvince = this.formatDataProvince(this.$refs.provinceTree.getCheckedNodes())
      this.dialogDataForm.publishObjectProvinceIds = this.formatDataProvinceIds(this.$refs.provinceTree.getCheckedNodes())
      this.dialogProvince = false
     // this.dialogDataForm.shenggongsifabuduixiang = this.formatDataProvince(this.$refs.provinceTree.getCheckedNodes())
     // this.dialogProvince = false
    },
    formatDataProvince: function (arr) {
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
    clickProvinceSelector: function () {
      this.dialogProvince = true
      // if (this.$refs.provinceTree) {
      //   this.$refs.provinceTree.setCheckedNodes([])
      // }
    },
    clickCitySelector: function () {
      this.dialogCity = true
      // if (this.$refs.ktCityTable) {
      //   this.$refs.ktCityTable.clearUserSelection()
      // }
    },
    clickWarnInfoLokeUpIssue: function () {
      let temObjRow = Object.assign({}, this.dialogDataForm)
      temObjRow.publisher = this.userName
      temObjRow.publishtime = null//new Date()//commonFun.formDate()
      if (temObjRow.publishObjectProvinceIds) {
        temObjRow.publishObjectProvinceIds = JSON.stringify(temObjRow.publishObjectProvinceIds)
      }
      if (temObjRow.publishObjectCityIds) {
        temObjRow.publishObjectCityIds = JSON.stringify(temObjRow.publishObjectCityIds)
      }
      let eomsWarnInfo = JSON.stringify(temObjRow)
      this.$api.warnManage.publishWarnInfo(eomsWarnInfo).then((res)=>{
        if (res.code == '200') {
          this.handleParam()
          this.dialogWarnInfoLokeUp = false
        }
      })
    },
    clickWarnInfoLokeUpClose: function () {
      this.dialogWarnInfoLokeUp = false
    },
    clickLeadIn: function () {
      // this.selectFileValue = ''
      this.dialogWarnInfoLeadIn = true
    },
    formState: function (str) {
      if (str == '0') {
        str = '作废'
      } else if (str == '1') {
        str = '已发布'
      } else if (str == '2') {
        str = '未发布'
      } else if (str == '3') {
        str = '导入'
      }
      return str
    },
    formIsReport: function (str) {
      if (str == '0') {
        str = '不需要上报'
      } else if (str == '1') {
        str = '需要上报'
      }
      return str
    },
    formSeverity: function (str) {
      if (str == '1') {
        str = '一级'
      } else if (str == '2') {
        str = '二级'
      } else if (str == '3') {
        str = '三级'
      } else if (str == '4') {
        str = '四级'
      }
      return str
    },
    handleLookUp: function (index,row) {
      this.isClickIssue = false
      this.dialogDataForm = row
      this.dialogWarnInfoLokeUp = true
    },
    formatDataProvinceIds: function (arr) {
      let ids = []
      for (let i=0;i<arr.length;i++) {
        if (arr[i].hasOwnProperty('children')) {
          continue
        }
        ids.push(arr[i].userid)
      }
      return ids
    },
    formatState: function (str) {
      if (str == '0') {
        str = '作废'
      } else if (str == '1') {
        str = '已发布'
      } else if (str == '2') {
        str = '未发布'
      } else if (str == '3') {
        str = '导入'
      }
      return str
    },
    formatStateNum: function (str) {
      if (str == '作废') {
        str = '0'
      } else if (str == '已发布') {
        str = '1'
      } else if (str == '未发布') {
        str = '2'
      } else if (str == '导入') {
        str = '3'
      }
      return str
    },
    handleIssue: function (index,row) {
      this.isClickIssue = true
      this.formatTree(index,row)
    },
    formatTree: function (index,row) {
      let temObjRow = Object.assign({}, row)
      temObjRow.state = this.formatStateNum(temObjRow.state)
      if (temObjRow.publishObjectProvinceIds) {
        temObjRow.publishObjectProvinceIds = temObjRow.publishObjectProvinceIds.replace(/\[|\]|\s+/g,'').split(',')
      }
      if (temObjRow.publishObjectCityIds) {
        temObjRow.publishObjectCityIds = temObjRow.publishObjectCityIds.replace(/\[|\]|\s+/g,'').split(',')
      }
      this.dialogDataForm = temObjRow
      this.dialogWarnInfoLokeUp = true
      this.provinceDefaultChecked = temObjRow.publishObjectProvinceIds
      this.cityDefaultChecked = temObjRow.publishObjectCityIds
    },
    handleNullify: function (index,row) {
      let _this = this
      this.$api.warnManage.updateWarnInfoState(row.id).then(function (res) {
        if (res.code == '200') {
          _this.handleParam()
        }
      })
    },
    initColumns: function () {
      this.columns = [
        {prop:"orderNumber", label:"序号",sortable: false},
        {prop:"warnnumber", label:"预警编号",sortable: false,"minWidth": "100px"},
        {prop:"recordId", label:"告警流水号",sortable: false,"minWidth": "100px"},
        {prop:"deviceSpecialty", label:"专业",sortable: false,"minWidth": "150px"},
        {prop:"title", label:"告警标题",sortable: false,"minWidth": "250px"},
        {prop:"eventId", label:"告警ID",sortable: false,"minWidth": "150px"},
        {prop:"occurTime", label:"告警发生时间",sortable: false,"minWidth": "150px"},
        {prop:"deviceCounty", label:"告警发布地市",sortable: false,"minWidth": "100px"},
        {prop:"severity", label:"告警级别",sortable: false,"minWidth": "100px"},
        {prop:"warnContent", label:"告警内容",sortable: false,"minWidth": "100px"},
        {prop:"alarmcreatetime", label:"告警生成时间",sortable: false,"minWidth": "150px"},
        {prop:"publishtime", label:"发布时间",sortable: false,"minWidth": "150px"},
        {prop:"state", label:"状态",sortable: false},
      ]
    },
    getTableData: function (jsonStr) {
      this.loading = true
      this.$api.warnManage.queryAllEomsWarnInfo(jsonStr).then((res) => {
        if (res.code == '200') {
          let tempTableData = res.data.records.concat()
          tempTableData.map((item,index)=>{
            item.orderNumber = index+1
            item.state = this.formatState(item.state)
            return item
          })
          this.tableData = tempTableData
          this.loading = false
          this.total = parseInt(res.data.total)
          // this.setWarnManageOneObj({
          //   flag: true,
          //   arr: tempTableData,
          //   total: this.total,
          //   currentPage: this.currentPage,
          //   pageSize: this.pageSize
          // })
        }
      })
    },
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../../common/stylus/variable"
  @import "../../../../common/stylus/mixin"
  .warn-manage-container
    height: 100%
    .children-container
      padding: 5px 20px 0 20px
      box-sizing: border-box
      .warn-manage-form-height
        height: 160px
      .warn-manage-title
        padding-bottom: 5px
        box-sizing: border-box
        text-align: left
    .dialog-warn-info-browse
      overflow: hidden
      position: relative
      margin: 10px 0
  .warn-info-lokeup-container
    padding: 10px 0 30px 0
  .warn-info-lokeup-textarea
    text-align: left
  .warn-info-lokeup-textarea-text
    // border: 1px solid #DCDFE6
    margin-top: 8px
    padding: 5px 15px
    border-radius: 4px
    box-sizing: border-box
  .width100
    width: 100% !important
  .dialog-city-selector
    font-size: $font-size-small
    margin-bottom: 10px
    overflow: hidden
  .dialog-warn-info-download a
    font-size: $font-size-small
    border-bottom: 1px solid #0066FF
    display: inline-block
    padding-bottom: 3px
  .dialog-warn-info-download .warnInfo-down-span
    font-size: $font-size-small
    border-bottom: 1px solid #0066FF
    display: inline-block
    padding-bottom: 3px
    cursor: pointer
  .warn-info-lokeup-item
    overflow: hidden
    text-align: left
    font-size: $font-size-small
    color: #606266
    no-wrap()
    &+.warn-info-lokeup-item
      margin-top: 10px
  #id_form
    display: none
</style>
