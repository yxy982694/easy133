<template>
  <div class="page-container">
    <el-row :gutter="10">
      <el-col :span="5" class="colHeight">
        <div class="grid-content bg-purple">
          <!-- 我的待办 -->
          <my-todo></my-todo>
          <!-- 快速通道 -->
          <expertDuty></expertDuty>
          <!-- <turbe></turbe> -->
        </div>
      </el-col>
      <el-col :span="14" class="colHeight">
        <div class="grid-content bg-purple">
          <!-- 最新公告 -->
          <latestNews></latestNews>
          <!-- 待办列表 -->
          <upComList></upComList>
          <!-- 留言板 -->
          <div>
            <message-board @newwindow="newwindowfn"></message-board>
            <!-- 弹窗部分 -->
            <el-dialog title="新建留言"
              :visible.sync="dialogVisible"
              width="30%"
              :before-close="handleClose">
              <div class="demo-input-suffix">
              <!--  标题:-->
                <el-input style="margin-bottom: 10px; width: 80%"
                  placeholder="请输入标题"
                  v-model="headMessage"
                  clearable>
                </el-input>
               <!-- 内容:-->
                <el-input type="textarea" autosize placeholder="请输入留言内容（文本域可自适应文本内容多少）" v-model="newMessage"></el-input>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="postMessage">确 定</el-button>
              </span>
            </el-dialog>


          </div>
        </div>
      </el-col>
      <el-col :span="5" class="colHeight">
        <div class="grid-content bg-purple">
          <!-- 专家值班 -->
          <turbe></turbe>
          <!-- <expertDuty></expertDuty> -->
          <!-- 短信定制 -->
          <smsCus></smsCus>
        </div>
      </el-col>
    </el-row>
    <footer-bar></footer-bar>
  </div>
</template>

<script>
    import "@/common/stylus/intro.styl"
    import FooterBar from "../Home/FooterBar"
    export default {
        components: {
            turbe: require("./SubIntro/Turbe.vue").default, //快速通道
            upComList: require("./SubIntro/UpComList.vue").default, // 待办列表
            expertDuty: require("./SubIntro/ExpertDuty.vue").default, // 专家值班组件
            smsCus: require("./SubIntro/SmsCus.vue").default, // 短信定制组件
            latestNews: require("./SubIntro/LatestNews.vue").default, // 最新公告
            myTodo: require("./SubIntro/MyTodo.vue").default, // 我的待办
            messageBoard: require("./SubIntro/Message.vue").default, // 留言板
            FooterBar
        },
        data() {
            return {
                activeName: "second",
                activeIndex: "1",
                dialogVisible: false,
                newMessage: '',
                headMessage: ''
            };
        },
        methods: {
            handleClick() {
                // console.log("方法运行了");
            },
            newwindowfn () {
              this.dialogVisible = true
            },
            startHacking() {
                this.$notify({
                    title: "It works!",
                    type: "success",
                    message:
                        "We've laid the ground work for you. It's time for you to build something epic!",
                    duration: 5000
                });
            },
            handleSelect(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        done();
                    })
                    .catch(_ => {});
            },
            postMessage() {// 发表留言
                this.dialogVisible = false

            }
        },
        mounted() {
          // console.log('intro mounted')
        },
    };
</script>
