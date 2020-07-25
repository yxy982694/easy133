<template>
    <!-- 专家值班 -->
    <div class="content-radius">
      <div class="section-title">
        <p class="section-title-name">专家值班</p>
        <p class="section-title-click" @click="clickAll">全部 >></p>
      </div>
      <div class="duty-container">
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{shiftBossName}}</span>
      				<span class="duty-posit" style="color:#e63a62;">值班班长</span>
      			</p>
      			<p class="duty-tel">{{shiftBossTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{dutyAssistantName}}</span>
      				<span class="duty-posit" style="color:#f3bf44;">值班助理</span>
      			</p>
      			<p class="duty-tel">{{dutyAssistantTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{monitorName}}</span>
      				<span class="duty-posit" style="color:#66ccaf;">监控</span>
      			</p>
      			<p class="duty-tel">{{monitorTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{transportName}}</span>
      				<span class="duty-posit" style="color:#66ccaf;">传输</span>
      			</p>
      			<p class="duty-tel">{{transportTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{exchangeName}}</span>
      				<span class="duty-posit" style="color:#66ccaf;">交换</span>
      			</p>
      			<p class="duty-tel">{{exchangeTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{dataName}}</span>
      				<span class="duty-posit" style="color:#66ccaf;">数据</span>
      			</p>
      			<p class="duty-tel">{{dataTel}}</p>
      		</div>
      	</div>
      	<div class="duty-item">
      		<div class="duty-userimg"></div>
      		<div class="duty-usertext">
      			<p class="duty-username">
      				<span class="duty-name">{{webmasterName}}</span>
      				<span class="duty-posit" style="color:#66ccaf;">网管</span>
      			</p>
      			<p class="duty-tel">{{webmasterTel}}</p>
      		</div>
      	</div>
      </div>
    </div>
</template>

<script>
  import { getIFramePath } from '@/utils/iframe'
  import { mapMutations } from 'vuex'
  export default {
      data() {
          return {
            showHead: false,
            dutyData: [],
            dutyMap: ['值班班长','值班助理','监控','传输','交换','数据','网管'],
            allUrl: '/SysManage/OperProcess/ConfigManageTab/ResourceManage',
            shiftBossName: '',
            shiftBossTel: '',
            dutyAssistantName: '',
            dutyAssistantTel: '',
            monitorName: '',
            monitorTel: '',
            transportName: '',
            transportTel: '',
            exchangeName: '',
            exchangeTel: '',
            dataName: '',
            dataTel: '',
            webmasterName: '',
            webmasterTel: '',
          }
      },
      created() {
          this.$api.home.getExpertDutyList().then((res) => {
              if (res && res.data) {
                let arr = []
                for (let i=0;i<res.data.length;i++) {
                  if (res.data[i].SPECIALTY == '1') {
                    this.shiftBossName = res.data[i].NAME
                    this.shiftBossTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '2') {
                    this.dutyAssistantName = res.data[i].NAME
                    this.dutyAssistantTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '3') {
                    this.monitorName = res.data[i].NAME
                    this.monitorTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '5') {
                    this.transportName = res.data[i].NAME
                    this.transportTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '6') {
                    this.exchangeName = res.data[i].NAME
                    this.exchangeTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '8') {
                    this.dataName = res.data[i].NAME
                    this.dataTel = res.data[i].MOBILE
                  } else if (res.data[i].SPECIALTY == '7') {
                    this.webmasterName = res.data[i].NAME
                    this.webmasterTel = res.data[i].MOBILE
                  }
                }
              }
          })
      },
      computed: {
        userName: {
          get: function () {
            return this.$store.state.menu.userName
          },
          set: function () {}
        },
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
        }),
        showNewTabAll: function () {
          this.setEditableTabs([{
            label: '我的主页',
            name: '/SubAsideTab/MainPage',
            id: '0'
          },{
              label: '通讯录全部',
              name: this.allUrl,
              id: 'telall1'
          }])
          this.setExistTabs(['0','telall1'])
          this.setCurrentTabLabel(this.allUrl)
          this.setCurrentTitle('公告查询全部')
          this.setCurrentTabId('telall1')
          this.setMainIdStoreTabObj({
            id: '07396bd5d37c41bb879b8d533b0b7172', // 主菜单id，用于保存整个对象（在store中）
            editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
            existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
            currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
            currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
            currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
          })
        },
        clickAll: function () {
              let allUrlIframe = ''
              if (location.host == '10.87.61.43') {
                allUrlIframe = '110101&url=http://10.87.61.43/edm/IntoEdm.wsm?userName='+this.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true'
              } else {
                allUrlIframe = '110101&url=http://10.217.1.44:9085/edm/IntoEdm.wsm?userName='+this.userName+'%26url=CurrentShift.do?option=contact&urlName='+encodeURI('专家值班')+'&urlCode=21203603&external=true'
              }
              if ('110101') {
                this.setIframeLocationObj({
                  id: '110101',
                  iframeLocation: allUrlIframe
                })
                this.$router.push({
                  path: "/110101"
                })
                return
              }
          if (this.$store.state.routerIdData.routerObj.hasOwnProperty('07396bd5d37c41bb879b8d533b0b7172')) {
              this.showNewTabAll()
              this.$router.push({
                path: '/DutyManager/ExpertDuty'
              })
            } else {
              this.$api.menu.resourceManage('07396bd5d37c41bb879b8d533b0b7172').then((res) => {
                this.setRouterObj({
                  id: '07396bd5d37c41bb879b8d533b0b7172',
                  arr: res
                })
                this.setRouterId('07396bd5d37c41bb879b8d533b0b7172')
                let path = getIFramePath('/DutyManager/ExpertDuty')
                sessionStorage.setItem('id', '07396bd5d37c41bb879b8d533b0b7172')
                if(!path) {
                  path = '/DutyManager/ExpertDuty'
                }
                if (parseInt(path)) {
                  this.setShowIframe(true)
                } else {
                  this.setShowIframe(false)
                }
                this.$router.push({
                  path: path
                })
                this.showNewTabAll()
              })
            }
        },
        positColor: function (val) {
          if (val == '值班班长') {
            return 'color: #e63a62'
          } else if (val == '值班助理') {
            return 'color: #f3bf44'
          } else {
            return 'color: #66ccaf'
          }
        }
      }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
    .content-radius
      height: 435px
    .duty-item
      margin: 0 30px
      position: relative
      overflow: hidden
      &+.duty-item
        margin-top: 17px
    .duty-item:first-child
       margin-top: 10px
    .duty-userimg
      width: 36px
      height: 36px
      background: url("../../../common/image/dutySpecialist_bg.png") no-repeat
      background-size: 100% 100%
      float: left
    .duty-usertext
      position: absolute
      left: 46px
      top: 50%
      transform: translate(0,-50%)
      -ms-transform: translate(0,-50%)
    .duty-username
      text-align: left
    .duty-name
      font-size: $font-size-medium
      color: $color-textblack
      margin-right: 5px
    .duty-posit
      font-size: $font-size-small
    .duty-tel
      font-size: $font-size-small
      text-align: left
      margin-top: 7px
      color: $color-textgray
    @media screen and (min-height: 980px)
      .content-radius
        height: 600px
      .duty-item
        margin: 0 40px
        &+.duty-item
          margin-top: 30px
      .duty-item:first-child
         margin-top: 20px
      .duty-userimg
        width: 46px
        height: 46px
        background: url("../../../common/image/dutySpecialist_bg.png") no-repeat
        background-size: 100% 100%
        float: left
      .duty-usertext
        left: 60px
</style>
