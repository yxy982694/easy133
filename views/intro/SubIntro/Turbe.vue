<template>
  <div class="content-radius">
    <div class="section-title">
      <p class="section-title-name">快速通道</p>
      <p class="section-title-click" @click="clickEdit">配置 >></p>
    </div>
    <div class="fast-container" v-show="!showTip"><!-- item.grandfatherId,item.ID,item.grandfatherLocation,item.location,item.NAME, -->
      <div class="fast-item" @click="clickItem(item.iframeLocation,item.MTYPE)" v-for="(item,index) in channelList" :key="item.ID" :title="item.NAME" :class="{'hidden-fast':index>5}">
        <p class="fast-item-icon"><i class="iconfont icon-chuangjiangongdan"></i></p>
        <p class="fast-item-text">
          <span class="fast-text-new"></span>
          <span class="fast-text-name">{{ item.NAME }}</span>
        </p>
      </div>
    </div>
    <div class="fast-nodata" v-show="showTip">
      <p>暂无数据</p>
      <p>可通过配置,添加快速通道菜单</p>
    </div>
  </div>
</template>
<script>
  import { getIFramePath } from '@/utils/iframe'
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
        channelList: [],
        showTip: false,
        usern: '',
      }
    },
    mounted: function () {
      this.loadTurbeList()
    },
    computed: {
      operProFlag: {
        get: function () {
          return this.$store.state.menu.operProFlag
        },
        set: function () {}
      },
    },
    watch: {
      operProFlag: function () {
        this.loadTurbeList()
      }
    },
    methods: {
      ...mapMutations({
        'setRouterObj': 'setRouterObj',
        'setRouterId': 'setRouterId',
        'setShowIframe': 'setShowIframe',
        'setMainIdStoreTabObj': 'setMainIdStoreTabObj',
        'setEditableTabs': 'setEditableTabs',
        'setExistTabs': 'setExistTabs',
        'setCurrentTabLabel': 'setCurrentTabLabel',
        'setCurrentTabId': 'setCurrentTabId',
        'setCurrentTitle': 'setCurrentTitle',
        'setIframeLocationObj': 'setIframeLocationObj',
        'setFaultSheetList': 'setFaultSheetList',
      }),
      loadTurbeList: function () {
        this.$api.home.getUserId().then((res) => {
          let phone = ''
          if (res && res.data) {
            this.usern = res.data.account // username
            phone = res.data.phone
          } else {
            return
          }
          let faultSheet = []

          if (location.host == '10.87.61.43') { // 生产环境不带端口号
            faultSheet = [{  //this.userName
                    id: 'mainmenu1',
                    name: '故障工单短信',
                    url: 'icon-zhidongxiguzhang',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName=故障工单短信&urlCode=21203657&external=true#21203657',
                    type: '12',
                    iframeUrl: '12&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
                  },{
                    id: 'mainmenu2',
                    name: '非故障工单短信',
                    url: 'icon-tianxiegongdan-kuozhan-hebing',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=非故障工单短信&urlCode=21203658&external=true#21203658',
                    type: '140',
                    iframeUrl: '14&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
                    // url: require('../../../common/image/sms/fgzgd.png')
                  },{
                    id: 'mainmenu3',
                    name: '公共服务短信',
                    url: 'icon-fabuxuqiu',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+this.userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName=公共服务短信&urlCode=21203660&external=true#21203660',
                    type: '10',
                    iframeUrl: '10&url=http://10.87.61.43/wrm/Login.do?user='+this.usern+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
                    // url: require('../../../common/image/sms/xqgd.png')
                  },{
                    id: 'mainmenu4',
                    name: '需求工单短信',
                    url: 'icon-yingyongfuwu',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=需求管理短信&urlCode=21203659&external=true#21203659',
                    type: '141',
                    iframeUrl: '14&url=http://10.87.61.43/wsc/IntoWsc.wsm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
                    // url: require('../../../common/image/sms/gzgd.png')
                  },{
                    id: 'mainmenu5',
                    name: '值班管理短信',
                    url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10',
                    type: '15',//15&url=http://10.87.61.48/ess/IntoEss.wsm?userName=zhaodanping%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10
                    iframeUrl: '15&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.usern+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
                    // url: require('../../../common/image/sms/jfgl.png')
                  },{
                    id: 'mainmenu6',
                    name: '机房管理短信',
                    url: 'icon-zhibanchaxun',
                    // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName=机房管理短信&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
                    type: '700021',
                    iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
                    // url: require('../../../common/image/sms/zbgl.png')
                  }]
            } else {  // 测试环境带端口号
              faultSheet = [{  //this.userName
                    id: 'mainmenu1',
                    name: '故障工单短信',
                    url: 'icon-zhidongxiguzhang',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
                    type: '12',
                    iframeUrl: '12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=GoInitTthSheetSmsConfigUI.do&urlName='+encodeURI('故障工单短信')+'&urlCode=21203657&external=true#21203657',
                  },{
                    id: 'mainmenu2',
                    name: '非故障工单短信',
                    url: 'icon-tianxiegongdan-kuozhan-hebing',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
                    type: '140',
                    iframeUrl: '14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName='+encodeURI('非故障工单短信')+'&urlCode=21203658&external=true#21203658',
                    // url: require('../../../common/image/sms/fgzgd.png')
                  },{
                    id: 'mainmenu3',
                    name: '公共服务短信',
                    url: 'icon-fabuxuqiu',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+this.userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
                    type: '10',
                    iframeUrl: '10&url=http://10.87.61.48/wrm/Login.do?user='+this.usern+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName='+encodeURI('公共服务短信')+'&urlCode=21203660&external=true#21203660',
                    // url: require('../../../common/image/sms/xqgd.png')
                  },{
                    id: 'mainmenu4',
                    name: '需求工单短信',
                    url: 'icon-yingyongfuwu',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
                    type: '141',
                    iframeUrl: '14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName='+encodeURI('需求管理短信')+'&urlCode=21203659&external=true#21203659',
                    // url: require('../../../common/image/sms/gzgd.png')
                  },{
                    id: 'mainmenu5',
                    name: '值班管理短信',
                    url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
                    type: '15',//15&url=http://10.87.61.48/ess/IntoEss.wsm?userName=zhaodanping%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10
                    iframeUrl: '15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.usern+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName='+encodeURI('值班管理短信定制')+'&urlCode=demo_page10&external=true#demo_page10',
                    // url: require('../../../common/image/sms/jfgl.png')
                  },{
                    id: 'mainmenu6',
                    name: '机房管理短信',
                    url: 'icon-zhibanchaxun',
                    location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
                    type: '700021',
                    iframeUrl: '700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName='+encodeURI('机房管理短信')+'&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
                    // url: require('../../../common/image/sms/zbgl.png')
                  }]
          }
          // if (location.href.indexOf(':',7)>-1) { // 测试环境带端口号
          //   faultSheet = [{  //this.userName
          //           id: 'mainmenu1',
          //           name: '故障工单短信',
          //           url: 'icon-zhidongxiguzhang',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName=故障工单短信&urlCode=21203657&external=true#21203657'),
          //           type: '12',
          //           iframeUrl: encodeURI('12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=GoInitTthSheetSmsConfigUI.do&urlName=故障工单短信&urlCode=21203657&external=true#21203657'),
          //         },{
          //           id: 'mainmenu2',
          //           name: '非故障工单短信',
          //           url: 'icon-tianxiegongdan-kuozhan-hebing',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=非故障工单短信&urlCode=21203658&external=true#21203658'),
          //           type: '140',
          //           iframeUrl: encodeURI('14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName=非故障工单短信&urlCode=21203658&external=true#21203658'),
          //           // url: require('../../../common/image/sms/fgzgd.png')
          //         },{
          //           id: 'mainmenu3',
          //           name: '公共服务短信',
          //           url: 'icon-fabuxuqiu',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+this.userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName=公共服务短信&urlCode=21203660&external=true#21203660'),
          //           type: '10',
          //           iframeUrl: encodeURI('10&url=http://10.87.61.48/wrm/Login.do?user='+this.usern+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName=公共服务短信&urlCode=21203660&external=true#21203660'),
          //           // url: require('../../../common/image/sms/xqgd.png')
          //         },{
          //           id: 'mainmenu4',
          //           name: '需求工单短信',
          //           url: 'icon-yingyongfuwu',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=需求管理短信&urlCode=21203659&external=true#21203659'),
          //           type: '141',
          //           iframeUrl: encodeURI('14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName=需求管理短信&urlCode=21203659&external=true#21203659'),
          //           // url: require('../../../common/image/sms/gzgd.png')
          //         },{
          //           id: 'mainmenu5',
          //           name: '值班管理短信',
          //           url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10'),
          //           type: '15',//15&url=http://10.87.61.48/ess/IntoEss.wsm?userName=zhaodanping%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10
          //           iframeUrl: encodeURI('15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.usern+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10'),
          //           // url: require('../../../common/image/sms/jfgl.png')
          //         },{
          //           id: 'mainmenu6',
          //           name: '机房管理短信',
          //           url: 'icon-zhibanchaxun',
          //           location: encodeURI('http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName=机房管理短信&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9'),
          //           type: '700021',
          //           iframeUrl: encodeURI('700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName=机房管理短信&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9'),
          //           // url: require('../../../common/image/sms/zbgl.png')
          //         }]
          // } else {  // 生产环境不带端口号
          //   faultSheet = [{  //this.userName
          //           id: 'mainmenu1',
          //           name: '故障工单短信',
          //           url: 'icon-zhidongxiguzhang',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=12&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=GoInitTthSheetSmsConfigUI.do&urlName=故障工单短信&urlCode=21203657&external=true#21203657',
          //           type: '12',
          //           iframeUrl: encodeURI('12&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=GoInitTthSheetSmsConfigUI.do&urlName=故障工单短信&urlCode=21203657&external=true#21203657'),
          //         },{
          //           id: 'mainmenu2',
          //           name: '非故障工单短信',
          //           url: 'icon-tianxiegongdan-kuozhan-hebing',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/gpm/IntoGpm.gpm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=非故障工单短信&urlCode=21203658&external=true#21203658',
          //           type: '140',
          //           iframeUrl: encodeURI('14&url=http://10.87.61.43/gpm/IntoGpm.gpm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName=非故障工单短信&urlCode=21203658&external=true#21203658'),
          //           // url: require('../../../common/image/sms/fgzgd.png')
          //         },{
          //           id: 'mainmenu3',
          //           name: '公共服务短信',
          //           url: 'icon-fabuxuqiu',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=10&url=http://10.87.61.48/wrm/Login.do?user='+this.userName+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName=公共服务短信&urlCode=21203660&external=true#21203660',
          //           type: '10',
          //           iframeUrl: encodeURI('10&url=http://10.87.61.43/wrm/Login.do?user='+this.usern+'%26myaction=ToMsgManage.do?op=gotoMsgManage%26pass=%26flag=portal&urlName=公共服务短信&urlCode=21203660&external=true#21203660'),
          //           // url: require('../../../common/image/sms/xqgd.png')
          //         },{
          //           id: 'mainmenu4',
          //           name: '需求工单短信',
          //           url: 'icon-yingyongfuwu',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=14&url=http://10.87.61.48/wsc/IntoWsc.wsm?userName='+this.userName+'%26url=SmsConfigUI.do&urlName=需求管理短信&urlCode=21203659&external=true#21203659',
          //           type: '141',
          //           iframeUrl: encodeURI('14&url=http://10.87.61.43/wsc/IntoWsc.wsm?userName='+this.usern+'%26url=SmsConfigUI.do&urlName=需求管理短信&urlCode=21203659&external=true#21203659'),
          //           // url: require('../../../common/image/sms/gzgd.png')
          //         },{
          //           id: 'mainmenu5',
          //           name: '值班管理短信',
          //           url: 'icon-bangongqujifangshebeijinrushenqingliucheng',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=15&url=http://10.87.61.48/ess/IntoEss.wsm?userName='+this.userName+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10',
          //           type: '15',//15&url=http://10.87.61.48/ess/IntoEss.wsm?userName=zhaodanping%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10
          //           iframeUrl: encodeURI('15&url=http://10.87.61.43/ess/IntoEss.wsm?userName='+this.usern+'%26url=%2Fess%2Fsms%2FConfig.do%3Fop%3DgetConfigs&urlName=值班管理短信定制&urlCode=demo_page10&external=true#demo_page10'),
          //           // url: require('../../../common/image/sms/jfgl.png')
          //         },{
          //           id: 'mainmenu6',
          //           name: '机房管理短信',
          //           url: 'icon-zhibanchaxun',
          //           // location: 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName=机房管理短信&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9',
          //           type: '700021',
          //           iframeUrl: encodeURI('700021&url=/ddmnew/sms/smsConfig/ddmNewSMSPage&urlName=机房管理短信&urlCode=jfgldxdzpage9&external=false#jfgldxdzpage9'),
          //           // url: require('../../../common/image/sms/zbgl.png')
          //         }]
          // }
          this.setFaultSheetList(faultSheet)
          this.$api.home.getFastPassData().then((turbeRes) => {
            let arr = []
            if (turbeRes && turbeRes.data) {
              arr = turbeRes.data
            } else {
              this.showTip = true
              this.channelList = []
              return
            }
            this.showTip = false
            let preUrl = ''
            for (let i=0;i<arr.length;i++) {
              // if (Object.keys(arr[i]).length === 0) {
              //   continue
              // }
              let urlIndexOf = ''
              if (turbeRes.data[i].URL.indexOf('../') == 0) {
                urlIndexOf = turbeRes.data[i].URL.replace('../','/workbench/')
              } else if (turbeRes.data[i].URL.indexOf('./') == 0) {
                urlIndexOf = turbeRes.data[i].URL.replace('./','/workbench/jsp/')
              } else {
                urlIndexOf = turbeRes.data[i].URL
              }
              if (turbeRes.data[i].SUBSYSTEMID==1) { // 新emos+'&_='+this.$store.state.menu.phone
                if (turbeRes.data[i].URL.indexOf('?')>-1) {
                    preUrl = urlIndexOf+'&phoneUser='+this.usern+'&_='+phone
                } else {
                    preUrl = urlIndexOf+'?phoneUser='+this.usern+'&_='+phone
                }
                arr[i].iframeLocation = turbeRes.data[i].MTYPE+'&url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(turbeRes.data[i].NAME)+'&urlCode='+turbeRes.data[i].CODE+'&external=false'
                // arr[i].iframeLocation = encodeURI(turbeRes.data[i].MTYPE+'&url='+preUrl.replace(/&/g, '%26')+'&urlName='+turbeRes.data[i].NAME+'&urlCode='+turbeRes.data[i].CODE+'&external=false')
              } else {
                if (location.host == '10.87.61.43') {
                  if (turbeRes.data[i].SUBSYSTEMID==2) { // gpm
                    preUrl = 'http://10.87.61.43/gpm/IntoGpm.gpm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==3) { // 值班作业
                    preUrl = 'http://10.87.61.43/ess/IntoEss.wsm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==4) { // 公共服务
                     preUrl = 'http://10.87.61.43/wrm/Login.do?userName='+this.usern+'&myaction='+urlIndexOf+'&pass=&flag=portal'
                  } else if (turbeRes.data[i].SUBSYSTEMID==5) { // 专家值班
                    preUrl = 'http://10.87.61.43/edm/IntoEdm.wsm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==6) { // 需求管理
                    preUrl = 'http://10.87.61.43/wsc/IntoWsc.wsm?userName='+this.usern+'&url='+urlIndexOf
                  }
                } else {
                  if (turbeRes.data[i].SUBSYSTEMID==2) { // gpm
                    preUrl = 'http://10.97.87.8/gpm/IntoGpm.gpm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==3) { // 值班作业
                    preUrl = 'http://192.168.7.39:9080/ess/IntoEss.wsm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==4) { // 公共服务
                     preUrl = 'http://192.168.7.39:9080/wrm/Login.do?userName='+this.usern+'&myaction='+urlIndexOf+'&pass=&flag=portal'
                  } else if (turbeRes.data[i].SUBSYSTEMID==5) { // 专家值班
                    preUrl = 'http://192.168.7.39:9080/edm/IntoEdm.wsm?userName='+this.usern+'&url='+urlIndexOf
                  } else if (turbeRes.data[i].SUBSYSTEMID==6) { // 需求管理
                    preUrl = 'http://10.217.1.33:9083/wsc/IntoWsc.wsm?userName='+this.usern+'&url='+urlIndexOf
                  }
                }
                arr[i].iframeLocation = turbeRes.data[i].MTYPE+'&'+'url='+preUrl.replace(/&/g, '%26')+'&urlName='+encodeURI(turbeRes.data[i].NAME)+'&urlCode='+turbeRes.data[i].CODE+'&external=true'
                // arr[i].iframeLocation = encodeURI(turbeRes.data[i].MTYPE+'&'+'url='+preUrl.replace(/&/g, '%26')+'&urlName='+turbeRes.data[i].NAME+'&urlCode='+turbeRes.data[i].CODE+'&external=true')
              }
            }
            this.channelList = arr
          })
        })
      },
      clickEdit: function () {
        let allUrlIframe = '7&url=/workbench/kjdispose?type=1&urlName='+encodeURI('运维管理')+'&urlCode=demo_page7&external=false#demo_page7'
        // let allUrlIframe = encodeURI('7&url=/workbench/kjdispose?type=1&urlName=运维管理&urlCode=demo_page7&external=false#demo_page7')
        if (parseInt('7')) {
          this.setIframeLocationObj({
            id: '7',
            iframeLocation: allUrlIframe
          })
          this.$router.push({
            path: "/7"
          })
          return
        }
        this.setEditableTabs([{
          label: '我的主页',
          name: '/SubAsideTab/MainPage',
          id: '0'
        },{
            label: '配置快速通道',
            name: 'http://10.217.1.31:9082/workbench/kjdispose?type=1&pageNum=1&numPerPage=10&type=1&_=1582598848670',
            id: 'pzkstd11'
        }])
        this.setCurrentTabLabel('http://10.217.1.31:9082/workbench/kjdispose?type=1&pageNum=1&numPerPage=10&type=1&_=1582598848670')
        this.setExistTabs(['0','pzkstd11'])
        this.setCurrentTitle('配置快速通道')
        this.setCurrentTabId('pzkstd11')
        this.setMainIdStoreTabObj({
          id: 'mainmenu01', // 主菜单id，用于保存整个对象（在store中）
          editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
          existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
          currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
          currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
          currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
        })
        this.$router.push({
          path: '/mainMenu'
        })
      },
      clickItem: function (iframeLocation,type) {
        if (parseInt(type)) {
          this.setIframeLocationObj({
            id: type,
            iframeLocation: iframeLocation
          })
          this.$router.push({
            path: "/"+type
          })
          return
        }
        this.setEditableTabs([{
            label: '我的主页',
            name: '/SubAsideTab/MainPage',
            id: '0'
          },{
              label: nameCn,
              name: location,
              id: id
          }])
        this.setCurrentTabLabel(location)
        this.setExistTabs(['0',id])
        this.setCurrentTitle(nameCn)
        this.setCurrentTabId(id)
        this.setMainIdStoreTabObj({
          id: grandfatherId, // 主菜单id，用于保存整个对象（在store中）
          editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
          existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
          currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
          currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
          currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
        })
        if (this.$store.state.routerIdData.routerObj.hasOwnProperty(grandfatherId)) {
          if (parseInt(grandfatherLocation)) {
            this.setShowIframe(true)
          } else {
            this.setShowIframe(false)
          }
          this.$router.push({
            path: grandfatherLocation
          })
        } else {
          this.$api.menu.resourceManage(grandfatherId).then((res) => {
          // console.log(res)
          // sessionStorage.setItem('arr', res.data)
          this.setRouterObj({
            id: grandfatherId,
            arr: res
          })
          this.setRouterId(grandfatherId)
          let path = getIFramePath(grandfatherLocation)
          sessionStorage.setItem('id', grandfatherId)
          if(!path) {
            path = grandfatherLocation
          }
          if (parseInt(path)) {
            this.setShowIframe(true)
          } else {
            this.setShowIframe(false)
          }
          this.$router.push({
            path: path
          })
        })
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
    .content-radius
      //max-height: 416px
      height: 416px
      position: relative
    .fast-container
      // display: flex
      // flex-wrap: wrap
      // justify-content: space-between
      //margin: 0 18px 18px
      overflow: hidden
      margin: 0 18px
      .fast-item
        width: 48%
        height: 110px
        margin-top: 12px
        text-align: left
        border-radius: 2px
        transition: all 0.38s ease-out
        cursor: pointer
        float: left
        &:hover
          background-color: rgb(42,148,226)
          color: #fff
        &:nth-child(1)
          margin-top: 0
          background-color: #deefff
          .iconfont
            color: #93b5f2
        &:nth-child(2)
          margin-top: 0
          background-color: #e9f7f7
          margin-left: 4%
          .iconfont
            color: #68b8e7
        &:nth-child(3)
          background-color: #f8efea
          .iconfont
            color: #f6a87c
        &:nth-child(4)
          background-color: #e9ebf7
          margin-left: 4%
          .iconfont
            color: #94a2f6
        &:nth-child(5)
          background-color: #f4e9f7
          .iconfont
            color: #e6a1f8
        &:nth-child(6)
          background-color: #f7f5e9
          margin-left: 4%
          .iconfont
            color: #dbc857
        .fast-item-icon
          padding-left: 15px
          padding-top: 15px
          .iconfont
            font-size: 30px
        .fast-item-text
          padding-right: 10px
          text-align: right
          position: relative
          height: 20px
          .fast-text-new
            //margin-bottom: 17px
            display: block
          .fast-text-name
            font-size: $font-size-small
            position: absolute
            top: 10px
            right: 15px
            left: 15px
            color: $color-textblack
            display: block
            // width: 90px
            line-height: 16px
            //no-wrap()
      .hidden-fast
        display: none
    .fast-nodata
      position: absolute
      width: 100%
      top: 30%
      left: 50%
      transform: translate(-50%,0)
      -ms-transform: translate(-50%,0)
      font-size: $font-size-medium-s
      color: #909399
      line-height: 26px
    @media screen and (min-height: 980px)
      .content-radius
        height: 600px
        position: relative
        .fast-item
          height: 167px
          .fast-item-icon
            padding-top: 50px
      .fast-container
        margin-top: 6px
</style>
