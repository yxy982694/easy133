<style scoped lang="stylus" rel="stylesheet/stylus">
  //样式代码
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 435px;
  }

</style>

<template>
  <el-container>
    <el-header>信息发布</el-header>
    <el-main>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="重大自然灾害" name="first">
          <new-information-table></new-information-table>
        </el-tab-pane>
        <el-tab-pane label="重大社会事件" name="second">

        </el-tab-pane>
        <el-tab-pane label="大型重要活动" name="third">

        </el-tab-pane>
        <el-tab-pane label="重大故障预警" name="fourth">重大故障预警</el-tab-pane>
        <el-tab-pane label="重大故障类信息发布" name="fifth">重大故障类信息发布</el-tab-pane>
        <el-tab-pane label="隐患预警信息发布" name="sixth">隐患预警信息发布</el-tab-pane>
        <el-tab-pane label="自定义信息发布" name="seventh">自定义信息发布</el-tab-pane>
      </el-tabs>

    </el-main>
  </el-container>
</template>
<script>
  import '../../../../common/stylus/informationTab.styl'
  import NewInformationTable from "@/views/OperationManage/PublicService/InformationTab/A"
  /*import NewInformationTable from "@/views/OperationManage/PublicService/InformationTab/NewInformationTable"*/
  export default {
    components:{
      NewInformationTable
    },
    data() {
      return {
        activeName: 'first'
      };
    },
    methods: {
      handleClick(tab, event) {
        /* console.log(tab, event);*/
        // console.log(this.tableData);
      }
    }
  };

</script>
