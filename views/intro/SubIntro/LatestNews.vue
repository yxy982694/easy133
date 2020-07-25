<template>
   <div class="content-radius">
     <div class="section-title">
       <p class="section-title-name">最新公告</p>
       <p class="section-title-click" @click="clickAll">全部 >></p>
     </div>
     <el-carousel style="width: 100%" class="lastnew-container" direction="vertical"  :interval="20000" >
       <el-carousel-item v-for="(item,indexx) in announceData" :key="indexx">
         <div v-for="(list,index) in item.data" class="lastest-item" :key="index">
           <p class="text-left">
             <i class="iconfont icon-jiantoucu"></i>
             <span>{{list.CHESETYPE}}</span>
           </p>
           <p class="text-center" :title="list.TITLE" @click="clickNews(list.ID,list.FLAG)">{{list.TITLE}}</p>
           <p class="text-right" :title="list.NY">{{list.NY}}</p>
         </div>
       </el-carousel-item>
     </el-carousel>
   </div>
</template>
<script>
  import { getIFramePath } from '@/utils/iframe'
  import { mapMutations } from 'vuex'
  export default {
      data() {
        return {
            showHead: false,
            announceData: [],
            count: 0,
            userAllUrl: '',
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
          }),
          //数据初始化
          initLatestNews: function () {
              this.$api.home.getLatestNews().then((res) => {//参数部门id
                  // console.log(res)
                  // const result = eval('(' + res + ')');
                  const result = res
                  if (!result && !Array.isArray(result.data)) {
                    return
                  }
                  let size = result.data.length;
                  let page = size/5;  //展示页数3
                  if(size%5 != 0){ // 如果不为4的整数倍,则再多一页
                      // page++;
                  }
                  for(let index = 0; index < page; index++){
                      let announceObj = {};
                      announceObj.id = index+1;
                      announceObj.data = result.data.slice(index*5, (index+1)*5);
                      this.announceData.push(announceObj);
                  }
                  // this.announceData = result.data
              })
          },
          showNewTab: function () {
              this.setExistTabs(['0','101'])
              // console.log(this.$store.state.showTab.existTabs)
              this.setCurrentTitle('公告查询')
              this.setCurrentTabId('101')
              this.setMainIdStoreTabObj({
                id: '100010201', // 主菜单id，用于保存整个对象（在store中）
                editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
                existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
                currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
                currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
                currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
              })
          },
          showNewTabAll: function () {
            this.userAllUrl = 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571'
            this.setEditableTabs([{
              label: '我的主页',
              name: '/SubAsideTab/MainPage',
              id: '0'
            },{
                label: '公告查询全部',
                name: this.userAllUrl,
                id: '102'
            }])
            this.setExistTabs(['0','102'])
            this.setCurrentTabLabel(this.userAllUrl)
            this.setCurrentTitle('公告查询全部')
            this.setCurrentTabId('102')
            this.setMainIdStoreTabObj({
              id: '100010201', // 主菜单id，用于保存整个对象（在store中）
              editableTabs: this.$store.state.showTab.editableTabs, // 当前出现的tab的对象列表
              existTabs: this.$store.state.showTab.existTabs, // 当前出现的tab的id列表
              currentTabLabel: this.$store.state.showTab.currentTabLabel,// 当前显示tab的location
              currentTitle: this.$store.state.showTab.currentTitle, // 当前显示tab的标题
              currentTabId: this.$store.state.showTab.currentTabId, // 当前显示tab的id
            })
          },
          // 传2个参数，每条信息的id和location
          clickNews: function (id,flag) {
             let urlIframe = ''
            if (location.host == '10.87.61.43') {
              if (flag == '1') {
                urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
              } else {
                urlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
              }
            } else {
              if (flag == '1') {
                urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
              } else {
                urlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
              }
            }
            // if (location.href.indexOf(':',7)>-1) {
            //   if (flag == '1') {
            //     urlIframe = encodeURI('010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            //   } else {
            //     urlIframe = encodeURI('010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            //   }
            // } else {
            //   if (flag == '1') {
            //     urlIframe = encodeURI('010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26afficheType=1%26page=1%26type=receive%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            //   } else {
            //     urlIframe = encodeURI('010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookAfficheUI.do?id='+id+'%26page=1%26type=receive%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            //   }
            // }
            if ('010201') {
              this.setIframeLocationObj({
                id: '010201',
                iframeLocation: urlIframe
              })
              this.$router.push({
                path: "/010201"
              })
              return
            }
            this.setEditableTabs([{
                label: '我的主页',
                name: '/SubAsideTab/MainPage',
                id: '0'
              },{
                  label: '公告查询',
                  name: url,
                  id: '101'
              }])
            this.setCurrentTabLabel(url)
            if (this.$store.state.routerIdData.routerObj.hasOwnProperty('100010201')) {
              this.showNewTab()
              this.$router.push({
                path: '/operManage/publicService/InfoAnnounce'
              })
            } else {
              this.$api.menu.resourceManage('100010201').then((res) => {
                this.setRouterObj({
                  id: '100010201',
                  arr: res
                })
                this.setRouterId('100010201')
                let path = getIFramePath('/operManage/publicService/InfoAnnounce')
                sessionStorage.setItem('id', '100010201')
                if(!path) {
                  path = 'operManage/publicService/InfoAnnounce'
                }
                if (parseInt(path)) {
                  this.setShowIframe(true)
                } else {
                  this.setShowIframe(false)
                }
                this.$router.push({
                  path: "/" + path
                })
                this.showNewTab()
              })
            }
          },
          clickAll: function () {
            let allUrlIframe
            if (location.host == '10.87.61.43') {
              allUrlIframe = '010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
            } else {
              allUrlIframe = '010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName='+encodeURI('公告查阅')+'&urlCode=21203571&external=true#21203571'
            }
            // if (location.href.indexOf(':',7)>-1) {
            //   allUrlIframe = encodeURI('010201&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            // } else {
            //   allUrlIframe = encodeURI('010201&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=ReceiveAfficheUI.do%26pass=%26flag=portal&urlName=公告查阅&urlCode=21203571&external=true#21203571')
            // }
            if ('010201') {
              this.setIframeLocationObj({
                id: '010201',
                iframeLocation: allUrlIframe
              })
              this.$router.push({
                path: "/010201"
              })
              return
            } else {
              // this.setShowIframe(false)
            }
            if (this.$store.state.routerIdData.routerObj.hasOwnProperty('100010201')) {
              this.showNewTabAll()
              this.$router.push({
                path: '/operManage/publicService/InfoAnnounce'
              })
            } else {
              this.$api.menu.resourceManage('100010201').then((res) => {
                // console.log(res)
                // sessionStorage.setItem('arr', res.data)
                this.setRouterObj({
                  id: '100010201',
                  arr: res
                })
                this.setRouterId('100010201')
                let path = getIFramePath('/operManage/publicService/InfoAnnounce')
                sessionStorage.setItem('id', '100010201')
                if(!path) {
                  path = 'operManage/publicService/InfoAnnounce'
                }
                if (parseInt(path)) {
                  this.setShowIframe(true)
                } else {
                  this.setShowIframe(false)
                }
                this.$router.push({
                  path: "/" + path
                })
                this.showNewTabAll()
              })
            }
          }
      },
      created() { // 钩子函数
          this.initLatestNews();
      },
      computed: {
        userName: {
          get: function () {
            return this.$store.state.menu.userName
          },
          set: function () {}
        },
      },

  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
  .content-radius
    height: 240px
  .lastnew-container
    height: 194px
    @media screen and (min-height: 980px)
      height: 316px
  .lastest-item
    // display: flex
    // justify-content: space-between
    margin: 6px 35px 0 20px
    font-size: $font-size-small
    overflow: hidden
    position: relative
    &+.lastest-item
      margin-top: 24px
  .text-left
    color: #F3BF44
    height: 14px
    width: 70px
    // display: flex
    // align-items: center
    float: left
    .icon-jiantoucu
      margin-right: 5px
      font-size: 13px
      color: $color-border
  .text-center
    height: 14px
    line-height: 14px
    text-align:left
    // margin-left: 15px
    // float: left
    color: $color-textblack
    no-wrap()
    cursor: pointer
    position: absolute
    padding-left: 80px
    padding-right: 100px
    width: 100%
    box-sizing: border-box
    left: 0
    top: 0
  .text-right
    width:100px
    height: 14px
    color: $color-textgray
    text-align: right
    float: right
  @media screen and (min-height: 980px)
    .content-radius
      height: 300px
    .lastest-item
      padding: 0 55px 0 33px
      margin-top: 18px
      &+.lastest-item
        margin-top: 33px
</style>
