<template>
  <div class="content-radius">
    <div class="todo-header">
      <div class="todo-header-user">
        <div class="todo-userimg">
          <img ref="userImg" class="userimg-img" src="../../../common/image/imgioServlet.png">
          <input class="userimg-input" ref="menuInput" type="file" @change="selectMenuImg" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg">
        </div>
        <p class="toto-username" :title="'您好,'+userName">您好，{{userName}}</p>
      </div>
      <div class="todo-usertext">
        <div class="dept-select">
          <p class="dept-select-p">运维流程：</p>
          <el-select @change="changeOperPro(operProValue)"  v-model="operProValue" placeholder="请选择运维流程">
            <el-option
              v-for="item in operProArr"
              :key="item.ID"
              :label="item.SHORTNAME"
              :value="item.SHORTNAME">
            </el-option>
          </el-select>
        </div>
        <div class="dept-select">
          <p class="dept-select-p">值班作业：</p>
          <el-select @change="changeDayWork(dayWorkValue)" v-model="dayWorkValue" placeholder="请选择值班作业">
            <el-option
              v-for="item in dayWorkArr"
              :key="item.ID"
              :label="item.SHORTNAME"
              :value="item.SHORTNAME">
            </el-option>
          </el-select>
        </div>
        <div class="dept-select">
          <p class="dept-select-p">公共服务：</p>
          <el-select @change="changePublicService(publicServiceValue)" v-model="publicServiceValue" placeholder="请选择公共服务">
            <el-option
              v-for="item in publicServiceArr"
              :key="item.ID"
              :label="item.SHORTNAME"
              :value="item.SHORTNAME">
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="todo-items">
      <el-collapse accordion>
        <el-collapse-item>
          <template slot="title">
            <div class="need-item">
              <p class="todo-item-p">
                <span class="todo-bg0"></span>
                <span class="todo-itemname">运维待办</span>
              </p>

            </div>
            <span class="todo-itemvalue">{{operProNum}}</span>
          </template>
          <div v-for="(list,index) in operProList" :key="index" class="todo-sublist" @click="clickItem(list.SHEETTYPE,1)">
            <span class="todo-listtext">{{list.N}}</span>
            <span class="todo-listvalue">{{list.C}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <div class="need-item">
              <p class="todo-item-p">
                <span class="todo-bg1"></span>
                <span class="todo-itemname">值班作业</span>
              </p>
            </div>
            <span class="todo-itemvalue">{{dayWorkNum}}</span>
          </template>
          <div v-for="(list,index) in dayWorkList" :key="index" class="todo-sublist" @click="clickItem(list.SHEETTYPE)">
            <span class="todo-listtext">{{list.N}}</span>
            <span class="todo-listvalue">{{list.C}}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item>
          <template slot="title">
            <div class="need-item">
              <p class="todo-item-p">
                <span class="todo-bg2"></span>
                <span class="todo-itemname">需求待办</span>
              </p>
            </div>
            <span class="todo-itemvalue">{{publicServiceNum}}</span>
          </template>
          <div v-for="(list,index) in publicServiceList" :key="index" class="todo-sublist" @click="clickItem(list.SHEETTYPE)">
            <span class="todo-listtext">{{list.N}}</span>
            <span class="todo-listvalue">{{list.C}}</span>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
    import { getIFramePath } from '@/utils/iframe'
    import { mapMutations } from 'vuex'
    export default {
        name: 'myTodo',
        data() {
            return {
                ieFlag: false,
                toggleDep: false,
                dialogTableVisible: false,
                imgUrl: '',
                toggleText: '资管室',
                deptArr: ['资管室','信息管理','移动'],
                dbList: [],
                operProValue: '',
                dayWorkValue: '',
                publicServiceValue: '',
                operProArr: [],
                dayWorkArr: [],
                publicServiceArr: [],
                operProNum: 0,
                dayWorkNum: 0,
                publicServiceNum: 0,
                operProList: [],
                dayWorkList: [],
                publicServiceList: [{
                    C: 0,
                    N: '需求管理工单',
                    SHEETTYPE: 'HA-001'
                  },{
                    C: 0,
                    N: '问题工单',
                    SHEETTYPE: 'HA-002'
                  },{
                    C: 0,
                    N: '割接管理工单',
                    SHEETTYPE: 'HA-003'
                  },{
                    C: 0,
                    N: '厂商考核管理工单',
                    SHEETTYPE: 'HA-008'
                  }],
            }
        },
        methods: {
          ...mapMutations({
            'setRouterObj': 'setRouterObj',
            'setRouterId': 'setRouterId',
            'setRouterLocation': 'setRouterLocation',
            'setShowIframe': 'setShowIframe',
            'setMainIdStoreTabObj': 'setMainIdStoreTabObj',
            'setEditableTabs': 'setEditableTabs',
            'setExistTabs': 'setExistTabs',
            'setCurrentTabLabel': 'setCurrentTabLabel',
            'setCurrentTabId': 'setCurrentTabId',
            'setCurrentTitle': 'setCurrentTitle',
            'setNameCn': 'setNameCn',
            'setPhone': 'setPhone',
            'setOperProFlag': 'setOperProFlag',
            'setSheetType': 'setSheetType',
            'setIframeLocationObj': 'setIframeLocationObj',
            'setDelIframeLocationObj': 'setDelIframeLocationObj',
            'menuRouteLoaded': 'menuRouteLoaded',
            'setMenuFlag': 'setMenuFlag',
            'setDayWorkIframeUrl': 'setDayWorkIframeUrl',
          }),
          changeOperPro: function (value) {
            let type =''
            let jobid = ''
            for (let i=0;i<this.operProArr.length;i++) {
              if (this.operProArr[i].SHORTNAME == value) {
                type = this.operProArr[i].TYPE
                jobid = this.operProArr[i].ID
                break;
              }
            }
            let jsonObj = {
              type: type,
              jobid: jobid
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.$api.home.changeJob(jsonStr).then((res) => {
              if (res.responseBody && parseInt(res.responseBody.data) == 0) {
                this.findJobList()
                this.findDutySchedule()
                this.setOperProFlag(!this.operProFlag)
                this.setSheetType('')
                // this.menuRouteLoaded(false)
                // this.setMenuFlag(true)
              }
            })
          },
          changeDayWork: function (value) {
            let type =''
            let jobid = ''
            for (let i=0;i<this.dayWorkArr.length;i++) {
              if (this.dayWorkArr[i].SHORTNAME == value) {
                type = this.dayWorkArr[i].TYPE
                jobid = this.dayWorkArr[i].ID
                break;
              }
            }
            let jsonObj = {
              type: type,
              jobid: jobid
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.$api.home.changeJob(jsonStr).then((res) => {
              if (parseInt(res.responseBody.data) == 0) {
                location.reload()
                // this.findJobList()
                // this.findDayWork()
                // if (iframeLocationObj['0401']) {
                //   this.setDelIframeLocationObj('0401')
                // }
              }
            })
          },
          changePublicService: function (value) {
            let type =''
            let jobid = ''
            for (let i=0;i<this.publicServiceArr.length;i++) {
              if (this.publicServiceArr[i].SHORTNAME == value) {
                type = this.publicServiceArr[i].TYPE
                jobid = this.publicServiceArr[i].ID
                break;
              }
            }
            let jsonObj = {
              type: type,
              jobid: jobid
            }
            let jsonStr = JSON.stringify(jsonObj)
            this.$api.home.changeJob(jsonStr).then((res) => {
              if (parseInt(res.responseBody.data) == 0) {
                location.reload()
                // this.findJobList()
                // this.findDayWork()
                // if (iframeLocationObj['0401']) {
                //   this.setDelIframeLocationObj('0401')
                // }
              }
            })
          },
          clickItem: function (sheettype,name) {
            if (name==1) {
              this.setSheetType(sheettype)
            }
            // 获取点击菜单的location
            if (sheettype != 'HA-no') {
              this.$api.home.findTodoLocation(sheettype).then((res) => {
                let locationa
                if (res.data.SURL.indexOf('../')==0) {
                  locationa = res.data.TYPE+'&url='+(res.data.FURL+res.data.SURL.substr(2)).replace(/&/g, '%26')+'&urlName='+encodeURI(res.data.NAME)+'&urlCode='+res.data.CODE+'&external=false#'+res.data.SHEETTYPE
                } else {
                  locationa = res.data.TYPE+'&url='+res.data.SURL.replace(/&/g, '%26')+'&urlName='+encodeURI(res.data.NAME)+'&urlCode='+res.data.CODE+'&external=false#'+res.data.SHEETTYPE
                }
                // if (res.data.SURL.indexOf('../')==0) {
                //   locationa = res.data.TYPE+'&url='+(res.data.FURL+res.data.SURL.substr(2)).replace(/&/g, '%26')+'&urlName='+res.data.NAME+'&urlCode='+res.data.CODE+'&external=false#'+res.data.SHEETTYPE
                //   locationa = encodeURI(locationa)
                // } else {
                //   locationa = res.data.TYPE+'&url='+res.data.SURL.replace(/&/g, '%26')+'&urlName='+res.data.NAME+'&urlCode='+res.data.CODE+'&external=false#'+res.data.SHEETTYPE
                //   locationa = encodeURI(locationa)
                // }
                let path = res.data.TYPE
                // this.setRouterLocation(location)
                if (parseInt(path)) {
                  // this.setShowIframe(true)
                  this.setIframeLocationObj({
                    id: path,
                    iframeLocation: locationa
                  })
                  this.$router.push({
                    path: '/'+path
                  })
                }
              })
            } else {
              // let location = '0401&url=http://10.217.1.43:9084/ess/InroEss.wsm?userName=zhaodanping%26url=/ess/wpm/Plan.do?op=initLogs&urlName=值班作业待办&urlCode=xqdb&external=true'
                let locationa
                if (location.host == '10.87.61.43') {
                  locationa = '0401&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.usern+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true'
                } else {
                  locationa = '0401&url=http://10.217.1.43:9084/ess/IntoEss.wsm?userName='+this.usern+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName='+encodeURI('值班作业待办')+'&urlCode=xqdb&external=true'
                }
                // if (location.href.indexOf(':',7)>-1) {
                //   locationa = encodeURI('0401&url=http://10.217.1.43:9084/ess/IntoEss.wsm?userName='+this.usern+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName=值班作业待办&urlCode=xqdb&external=true')
                // } else {
                //   locationa = encodeURI('0401&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.usern+'%26url=/ess/wpm/Plan.do?op=initLogs&urlName=值班作业待办&urlCode=xqdb&external=true')
                // }
                let path = '0401'
                // this.setDayWorkIframeUrl(locationa)// 针对值班作业，保存url
                // this.setRouterLocation(location)
                if (parseInt(path)) {
                  this.setIframeLocationObj({
                    id: path,
                    iframeLocation: locationa
                  })
                  // this.setShowIframe(true)
                  this.$router.push({
                    path: '/'+path
                  })
                } else {
                  // this.setShowIframe(false)
                }
            }
          },
          clickItem1: function (id,nameCn,fatherId,fatherLocation) {
            this.setRouterLocation(fatherLocation)
            if (parseInt(fatherLocation)) {
                this.setShowIframe(true)
                this.$router.push({
                  path: fatherLocation
                })
                return
              } else {
                this.setShowIframe(false)
              }
              this.setEditableTabs([{
                label: '我的主页',
                name: '/SubAsideTab/MainPage',
                id: '0'
              },{
                  label: nameCn,
                  name: '/AsideTab/SubAsideTab/LeftMenu',
                  id: id
              }])
              this.setCurrentTabLabel('/AsideTab/SubAsideTab/LeftMenu')
              this.setExistTabs(['0',id])
              this.setCurrentTitle(nameCn)
              this.setCurrentTabId(id)
              this.setMainIdStoreTabObj({
                id: fatherId, // 主菜单id，用于保存整个对象（在store中）
                editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
                existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
                currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
                currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
                currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
              })
              if (this.$store.state.routerIdData.routerObj.hasOwnProperty(fatherId)) {
                this.$router.push({
                  path: fatherLocation
                })
              } else {
                this.$api.menu.resourceManage(fatherId).then((res) => {
                // console.log(res)
                // sessionStorage.setItem('arr', res.data)
                this.setRouterObj({
                  id: fatherId,
                  arr: res
                })
                this.setRouterId(fatherId)
                let path = getIFramePath(fatherLocation)
                sessionStorage.setItem('id', fatherId)
                if(!path) {
                  path = fatherLocation
                }
                if (parseInt(path)) {
                  this.setShowIframe(true)
                } else {
                  this.setShowIframe(false)
                }
                // console.log(path)
                this.$router.push({
                  path: path
                })
              })
              }
          },
          selectMenuImg: function () {
            let file = this.$refs.menuInput.files[0]
            this.$refs.userImg.src = window.URL.createObjectURL(file)
            let formData = new FormData()
            formData.append('fileImg', file)
          },
          enterDep: function () {
            this.toggleDep = true
          },
          leaveDep: function (val) {
            this.toggleText = val
            this.toggleDep = false
          },
          // 3个职位选择
          findJobList: function () {
            // console.log('findJobList执行了');
            let operProTempArr = []
            let dayWorkTempArr = []
            let publicServiceTempArr = []
            // let operProTempArr = [{
            //   SHORTNAME: '请选择运维流程',
            //   ID: '001',
            //   FLAG: '0',
            //   TYPE: '0',
            //   NAME: '请选择运维流程',
            // }]
            this.$api.home.findJobList().then((res) => {
              // console.log(res)
              if (!res || !Array.isArray(res.data)) {
                return
              }
             for (let j=0;j<res.data.length;j++) {
              if (res.data[j].TYPE == '0') {
                operProTempArr.push(res.data[j])
                if (res.data[j].FLAG == '1') {
                  this.operProValue = res.data[j].SHORTNAME
                }
              } else if (res.data[j].TYPE == '1') {
                dayWorkTempArr.push(res.data[j])
                publicServiceTempArr.push(res.data[j])
                if (res.data[j].FLAG == '1') {
                  this.dayWorkValue = res.data[j].SHORTNAME
                  this.publicServiceValue = res.data[j].SHORTNAME
                }
              }
             }
             this.operProArr = operProTempArr
             this.dayWorkArr = dayWorkTempArr
             this.publicServiceArr = publicServiceTempArr
            })
          },
          // 值班作业列表
          findDayWork: function () {
            this.$api.home.findDutySchedule().then((dutyRes) => {
              // console.log(dutyRes)
              if (dutyRes && dutyRes.data) {
                this.dayWorkNum = dutyRes.data.length
                this.dayWorkList = [{
                  C: dutyRes.data.length,
                  N: '值班作业待办',
                  SHEETTYPE: 'HA-no'
                }]
              } else {
                this.dayWorkNum = 0
                this.dayWorkList = []
              }
           })
          },
          // 运维代码和需求待办列表
          findDutySchedule: function () {
            // alert('9090')
             // 运维待办接口
             this.$api.home.findOperation().then((res) => {
               // console.log('findDutySchedule执行了');
                // console.log(res);
                // alert(res.data.length)
                if (res.data) {
                  // let tempArr = res.data
                  let operValue = 0
                  let operArr = []
                  let needValue = 0
                  let needArr = []
                  let needTemArr = ['HA-001','HA-002','HA-003','HA-008']
                  let needTemListArr = this.publicServiceList
                  for (let i=0;i<res.data.length;i++) {
                    if (res.data[i].SHEETTYPE=='HA-001'||res.data[i].SHEETTYPE=='HA-002'||res.data[i].SHEETTYPE=='HA-003'||res.data[i].SHEETTYPE=='HA-008') {
                      needValue += parseInt(res.data[i].C)
                      needArr.push(res.data[i])
                    } else {
                      operValue += parseInt(res.data[i].C)
                      operArr.push(res.data[i])
                    }
                  }
                  for (let k=0;k<needArr.length;k++) {
                    for (let m=0;m<needTemListArr.length;m++) {
                      if (needArr[k].SHEETTYPE == needTemListArr[m].SHEETTYPE) {
                        needTemListArr[m].C = needArr[k].C
                        break;
                      }
                    }
                  }
                  this.operProNum = operValue
                  this.publicServiceNum = needValue
                  this.operProList = operArr
                  this.publicServiceList = needTemListArr
                  // console.log(this.operProList)
                }
            })
          },
        },
        computed: {
          userName: {
            get: function () {
              return this.$store.state.menu.nameCn
            },
            set: function () {}
          },
          usern: {
            get: function () {
              return this.$store.state.menu.userName
            },
            set: function () {}
          },
          operProFlag: {
            get: function () {
              return this.$store.state.menu.operProFlag
            },
            set: function () {}
          },
          iframeLocationObj: {
            get: function () {
              return this.$store.state.menu.iframeLocationObj
            },
            set: function () {}
          },
        },
        mounted: function () {
          var _this = this
           this.findJobList()
           this.findDutySchedule()
           this.findDayWork()
		       // console.log('mytodo mounted')
          document.body.onclick = function () {
            _this.leaveDep(_this.toggleText)
          }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
   .content-radius
     height: 370px
     // display: flex
     // flex-direction: column
   .todo-header
     height: 194px
     width: 100%
     background: url('../../../common/image/mytodo-img.png') no-repeat
     background-size: 100% 100%
     //background-color: #4c83ef
     //display: flex
     //justify-content: center
     //align-items: center
     //padding-right: 10px
     position: relative
     box-sizing: border-box
     .todo-header-user
       width: 100%
       // display: flex
       // padding-top: 10px
       position: absolute
       top: 10px
       //flex-direction: column
       // justify-content: center
       // align-items: center
       .toto-username
          font-size: $font-size-medium
          font-weight: bold
          line-height: 20px
          color: #fff
          no-wrap()
          margin-left: 10px
          display: inline-block
          vertical-align: middle
       .todo-userimg
          height: 60px
          width: 60px
          border: 2px solid #fff
          border-radius: 50%
          position: relative
          // margin-bottom: 2px
          display: inline-block
          vertical-align: middle
          .userimg-input
            position: absolute
            left: 0
            top: 0
            height: 100%
            width: 100%
            border-radius: 50%
            cursor: pointer
            opacity: 0
          .userimg-img
            position: absolute
            left: 0
            top: 0
            height: 100%
            width: 100%
            border-radius: 50%
     .todo-usertext
        text-align: left
        color: #fff
        padding: 0 20px
        padding-top: 77px
        .dept-select
          width: 100%
          font-size: $font-size-medium
          text-align: center
          overflow: hidden
          .dept-select-p
            width:71px
            display: inline-block
   .todo-items
     height: 176px
     font-size: $font-size-medium-s
     overflow: hidden
   .el-divider--horizontal
     margin: 6px 0 !important
   .todo-itemvalue
     font-weight: bold
     color: $color-textblue
     font-size: $font-size-medium-s
     position: absolute
     top: 8px
     right: 37px
     // float: right
   .need-item
     // float: left
     width: 190px
     display: inline-block
     overflow: hidden
     height: 100%
     // display: flex
     // flex: 1
     // align-items: center
     // justify-content: space-between
     // align-items: center
     @media screen and (max-width: 1200px)
       width: 180px
     margin-left: 20px
     //margin-top: 25px
     cursor: pointer
     &:first-child .todo-itemicon
      font-size: 30px
     .todo-itemicon
       margin-right: 10px
       color: $color-textblue
       font-size: 25px
     .todo-item-p
       // display: inline-block
       // display: flex
       // align-items: center
       // float: left
       height: 100%
       position: relative
     .serial-number
       flex: 1
       overflow: hidden
       margin: 0 10px
   .el-icon-caret-right
     color: #1296db
     padding-right: 6px
   .label-btn
     btn-blue()
   .need-left
     display: flex
     align-items: center
   .todo-bg0
     display: inline-block
     background: url('../../../common/image/operationAgency_bg.png') no-repeat
     background-size: 100% 100%
     width: 26px
     height: 26px
     margin-right: 10px
     margin-top: 3px
   .todo-bg1
     display: inline-block
     background: url('../../../common/image/demandAgency_bg.png') no-repeat
     background-size: 100% 100%
     width: 26px
     height: 26px
     margin-right: 10px
     margin-top: 3px
   .todo-bg2
     display: inline-block
     background: url('../../../common/image/dayWork_bg.png') no-repeat
     background-size: 100% 100%
     width: 27px
     height: 26px
     margin-right: 10px
     margin-top: 3px
   .todo-itemname
     position: absolute
     display: inline-block
     top: 7px
     left: 36px
   .todo-sublist
     height: 35px
     box-sizing: border-box
     padding-left: 28px
     padding-right: 25px
     cursor: pointer
     position: relative
     &:nth-child(even)
       background-color: #c9e8f0
     .todo-listvalue
       color: #356ce1
       position: absolute
       top: 50%
       right: 25px
       transform: translate(0,-50%)
       -ms-transform: translate(0,-50%)
     .todo-listtext
       position: absolute
       top: 50%
       transform: translate(0,-50%)
       -ms-transform: translate(0,-50%)
       left: 35px
   @media screen and (min-height: 980px)
     .content-radius
       height: 600px
     .todo-header
       height: 350px
       .todo-header-user
         top: 20px
         .todo-userimg
            height: 80px
            width: 80px
       .todo-usertext
          padding-top: 115px
     .todo-items
       height: 250px
     .todo-itemvalue
       right: 57px
     .need-item
       margin-left: 30px
</style>
