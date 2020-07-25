<template>
    <!-- 短信定制 -->
    <div class="content-radius">
      <div class="section-title">
        <p class="section-title-name">短信定制</p>
      </div>
      <div class="sms-container">
          <div class="sms-item" @click="clickSmsItem(item.id,item.name,item.location,item.type,item.iframeUrl)" v-for="(item,index) in faultSheetList" :key="item.key" :title="item.name">
            <div class="sms-absoute">
              <p :class="'sms-bg'+index"></p>
              <p class="sms-text">{{ item.name }}</p>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    data() {
      return {
          showHead: false,
      }
    },
    computed: {
      faultSheetList: {
        get: function () {
          return this.$store.state.menu.faultSheetList
        },
        set: function () {}
      },
    },
    methods: {
      ...mapMutations({
        'setMainIdStoreTabObj': 'setMainIdStoreTabObj',
        'setEditableTabs': 'setEditableTabs',
        'setExistTabs': 'setExistTabs',
        'setCurrentTabLabel': 'setCurrentTabLabel',
        'setCurrentTabId': 'setCurrentTabId',
        'setCurrentTitle': 'setCurrentTitle',
        'setIframeLocationObj': 'setIframeLocationObj',
      }),
      clickSmsItem: function (id,name,location,type,iframeUrl) {
        if (parseInt(type)) {
          this.setIframeLocationObj({
            id: type,
            iframeLocation: iframeUrl
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
            label: name,
            name: location,
            id: id
        }])
        this.setCurrentTabLabel(location)
        this.setExistTabs(['0',id])
        this.setCurrentTitle('配置快速通道')
        this.setCurrentTabId(id)
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
      }
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
    .content-radius
      height: 390px
      // display: flex
      // flex-direction: column
    .sms-container
      // display: flex
      // flex: 1
      // flex-wrap: wrap
      // height: 340px
      margin: 5px 15px 25px 15px
      overflow: hidden
      .sms-item
        height: 105px
        width: 50%
        float: left
        position: relative
        // display: flex
        // flex-direction: column
        // justify-content: center
        // align-items: center
        box-sizing: border-box
        font-size: $font-size-medium
        cursor: pointer
        &:nth-child(1)
          border-right: 1px solid $color-border
          border-bottom: 1px solid $color-border
        &:nth-child(2)
          border-bottom: 1px solid $color-border
        &:nth-child(3)
          border-right: 1px solid $color-border
          border-bottom: 1px solid $color-border
        &:nth-child(4)
          border-bottom: 1px solid $color-border
        &:nth-child(5)
          border-right: 1px solid $color-border
        .sms-absoute
          position: absolute
          width: 100%
          top: 50%
          left: 50%
          transform: translate(-50%,-50%)
          -ms-transform: translate(-50%,-50%)
    .sms-text
      display: block
      padding-top: 10px
      color: $color-textblack
      // no-wrap()
    .iconfont
      font-size: 35px
      display: inline-block
      color: $color-textblue
    .sms-bg0
      background: url('../../../common/image/sms/faultList_bg.png') no-repeat
      background-size: 100% 100%
      width: 44px
      height: 36px
      margin: 0 auto
    .sms-bg1
      background: url('../../../common/image/sms/nonFaultList_bg.png') no-repeat
      background-size: 100% 100%
      width: 31px
      height: 36px
      margin: 0 auto
    .sms-bg2
      background: url('../../../common/image/sms/demandSheet_bg.png') no-repeat
      background-size: 100% 100%
      width: 33px
      height: 36px
      margin: 0 auto
    .sms-bg3
      background: url('../../../common/image/sms/publicService_bg.png') no-repeat
      background-size: 100% 100%
      width: 36px
      height: 36px
      margin: 0 auto
    .sms-bg4
      background: url('../../../common/image/sms/computerLab_bg.png') no-repeat
      background-size: 100% 100%
      width: 41px
      height: 36px
      margin: 0 auto
    .sms-bg5
      background: url('../../../common/image/sms/dutyManage_bg.png') no-repeat
      background-size: 100% 100%
      width: 36px
      height: 36px
      margin: 0 auto
    @media screen and (min-height: 980px)
      .content-radius
        height: 600px
        .sms-item
          height: 176px
        .sms-text
          padding-top: 20px
</style>
