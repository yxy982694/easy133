<template>
  <!-- 留言板 -->
  <!--  发表评论-->
  <!--  1. 把文本框做双向数据绑定-->
  <!--  2. 为发表按钮绑定一个事件-->
  <!--  3. 校验评论内容是否为空，如果为空，则Toast提示用户 评论内容不能为空-->
  <!--  4. 通过 vue-resource 发送一个请求，把评论内容提交给 服务器-->
  <!--  5. 当发表评论OK后，重新刷新列表，以查看最新的评论-->
  <!--  + 如果调用 getComments 方法重新刷新评论列表的话，可能只能得到 最后一页的评论，前几页的评论获取不到-->
  <!--  + 换一种思路： 当评论成功后，在客户端，手动拼接出一个 最新的评论对象，然后 调用 数组的 unshift 方法， 把最新的评论，追加到  data 中 comments 的开头；这样，就能 完美实现刷新评论列表的需求；-->
  <div class="content-radius">
    <div class="section-title">
      <p class="section-title-name">留言板</p>
      <p class="section-title-click">
        <!-- <i class="iconfont icon-liuyan message-color"></i> -->
        <span class="message-bg"></span>
        <span class="message-color" @click="clickNew">新建留言</span>
        <span @click="selectAll">全部 >></span>
      </p>
    </div>
    <div class="message-items">
      <div class="message-item" v-for="item in messageData" :key="item.ID">
        <p class="text-left" @click="clickMessage(item.ID)">
          <span class="text-name">{{item.NAME}}</span>
          <span class="text-content"><i class="message-quot">“</i><i class="text-content-title" :title="item.TITLE">{{item.TITLE}}</i><i class="message-quot">”</i></span>
        </p>
        <p class="text-right">{{item.MESSAGETIME}}</p>
      </div>
    </div>
    <el-dialog title="新建留言" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataFormRules" ref="dataForm"
        label-position="right">
        <el-form-item label="用户名:" prop="name" v-if="false">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input v-model="dataForm.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="留言:" prop="content">
          <el-input type="textarea" v-model="dataForm.content" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="日期:" prop="messagetime" v-if="false"> <!-- v-if="false" -->
          <el-input v-model="dataForm.messagetime" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="附件:" prop="messagetime" v-if="false">
          <input ref="fileInput" type="file" @change="selectFile">
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click.native="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submitForm" :loading="editLoading">发表</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    export default {
        data() {
            return {
                editLoading: false,
                fileData: null,
                dialogVisible: false,
                dataForm: null,
                allUrl: '',
                dataFormRules: { // 规定哪些字段为必填项
                  title: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                  ],
                  content: [
                    { required: true, message: '请输入留言信息', trigger: 'blur' }
                  ]
                },
                messageData: [] // 留言板数据
            }
        },
        created() {
			this.allUrl = 'http://10.217.1.31:9082/workbench/jsp/secframe.jsp?type=11&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663'
            this.$api.home.getMessageData().then((res) => {
                const result = res;
                this.messageData = result.data
            })
            Date.prototype.format = function(fmt) {
               var o = {
                  "M+" : this.getMonth()+1,                 //月份
                  "d+" : this.getDate(),                    //日
                  "h+" : this.getHours(),                   //小时
                  "m+" : this.getMinutes(),                 //分
                  "s+" : this.getSeconds(),                 //秒
                  "q+" : Math.floor((this.getMonth()+3)/3), //季度
                  "S"  : this.getMilliseconds()             //毫秒
              };
              if(/(y+)/.test(fmt)) {
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
              }
               for(var k in o) {
                  if(new RegExp("("+ k +")").test(fmt)){
                       fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                   }
               }
              return fmt;
            }
            this.dataForm = {
              title: '',
              content: '',
              messagetime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
            }
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
            'setMainIdStoreTabObj': 'setMainIdStoreTabObj',
            'setEditableTabs': 'setEditableTabs',
            'setExistTabs': 'setExistTabs',
            'setCurrentTabLabel': 'setCurrentTabLabel',
            'setCurrentTabId': 'setCurrentTabId',
            'setCurrentTitle': 'setCurrentTitle',
            'setIframeLocationObj': 'setIframeLocationObj',
          }),
          // 点击每一条留言
          // 传2个参数，每条留言的id和location
          clickMessage: function (id) {
            let urlIframe = ''
            if (location.host == '10.87.61.43') {
              urlIframe = '10&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663'  //5344409
            } else {
              urlIframe = '10&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663'  //5344409
            }
            // if (location.href.indexOf(':',7)>-1) {
            //   urlIframe = encodeURI('10&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName=网管留言板&urlCode=21203663&external=true#21203663')  //5344409
            // } else {
            //   urlIframe = encodeURI('10&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=LookMessage.do?id='+id+'%26num=1%26pass=%26flag=portal&urlName=网管留言板&urlCode=21203663&external=true#21203663')  //5344409
            // }
            if ('10') {
              this.setIframeLocationObj({
                id: '10',
                iframeLocation: urlIframe
              })
              this.$router.push({
                path: "/10"
              })
              return
            }
            this.setEditableTabs([{
              label: '我的主页',
              name: '/SubAsideTab/MainPage',
              id: '0'
            },{
                label: '留言板内容',
                name: url,
                id: id
            }])
            this.setCurrentTabLabel(url)
            this.setExistTabs(['0',id])
            this.setCurrentTitle('留言板内容')
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
          },
          clickNew () {
            this.dialogVisible = true
          },
          selectAll () {
            let allUrlIframe = ''
            if (location.host == '10.87.61.43') {
              allUrlIframe = '11&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663'
            } else {
              allUrlIframe = '11&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName='+encodeURI('网管留言板')+'&urlCode=21203663&external=true#21203663'
            }
            // if (location.href.indexOf(':',7)>-1) {
            //   allUrlIframe = encodeURI('11&url=http://10.217.1.44:9084/wrm/Login.do?user='+this.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName=网管留言板&urlCode=21203663&external=true#21203663')
            // } else {
            //   allUrlIframe = encodeURI('11&url=http://10.87.61.43/wrm/Login.do?user='+this.userName+'%26myaction=MessageBoardUI.do%26pass=%26flag=portal&urlName=网管留言板&urlCode=21203663&external=true#21203663')
            // }
            if ('11') {
              this.setIframeLocationObj({
                id: '11',
                iframeLocation: allUrlIframe
              })
              this.$router.push({
                path: "/11"
              })
              return
            }
            this.setEditableTabs([{
              label: '我的主页',
              name: '/SubAsideTab/MainPage',
              id: '0'
            },{
                label: '留言板全部',
                name: this.allUrl,
                id: 'messageall1'
            }])
            this.setCurrentTabLabel(this.allUrl)
            this.setExistTabs(['0','messageall1'])
            this.setCurrentTitle('留言板全部')
            this.setCurrentTabId('messageall1')
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
          submitForm () {
            let _this = this
            this.$refs.dataForm.validate((valid) => {
              if (valid) {
                _this.$confirm('确认发布吗？', '提示', {}).then(() => {
                  _this.editLoading = true
                  let jsonObj = Object.assign({}, _this.dataForm)
                  jsonObj.name = _this.$store.state.menu.nameCn
                  let jsonStr = JSON.stringify(jsonObj)
                  _this.$api.home.addMessage(jsonStr).then((res) => {
                    if(res.code == 0) {
                      _this.dialogVisible = false
                      _this.editLoading = false
                      _this.$message({ message: '发布成功', type: 'success' })
                      _this.$api.home.getMessageData().then((res) => {
                        const result = res
                        _this.messageData = result.data
                    })
                    } else {
                      _this.dialogVisible = false
                      _this.editLoading = false
                      _this.$message({ message: '发布失败', type: 'error' })
                    }
                  })
                  _this.dataForm = {
                    title: '',
                    content: '',
                    messagetime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
                  }
                })
              }
            })
          },
          selectFile () {
            this.fileData = this.$refs.fileInput.files[0]
          }
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
    .content-radius
      height: 203px
    .message-items
      margin: 0 22px
    .message-item
      // display: flex
      // justify-content: space-between
      // align-items: center
      // padding-right: 5px
      position: relative
      overflow: hidden
      height: 20px
      &+.message-item
        margin-top: 18px
      .text-left
        position: absolute
        text-align: left
        padding-left: 15px
        padding-right: 100px
        cursor: pointer
        height: 20px
        no-wrap()
        width: 100%
        box-sizing: border-box
        .text-name
          display: inline-block
          width: 90px
          font-size: $font-size-medium-s
          color: $color-textblue
        .message-quot
          color: #bed0f6
          font-size: 20px
          font-style: normal
        .text-content-title
          margin: 0 3px
          font-style: normal
          font-size: $font-size-medium-s
      .text-right
        width: 100px
        float: right
        text-align: right
        font-size: $font-size-small
        color: $color-textgray
        margin-top: 4px
    .message-color
      color: $color-textblue
      margin-right: 10px
    .message-bg
      display: inline-block
      background: url('../../../common/image/newMessage_bg.png') no-repeat
      background-size: 100% 100%
      width: 14px
      height: 14px
    @media screen and (min-height: 980px)
      .content-radius
        height: 360px
      .message-item
        overflow: hidden
        margin-top: 33px
        &+.message-item
          margin-top: 45px
</style>
