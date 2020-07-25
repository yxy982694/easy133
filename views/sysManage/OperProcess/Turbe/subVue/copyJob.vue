<template>
  <el-card class="draw-card" >
    <el-table
      :data="gridData"
      border
      style="width: 100%"
      :show-header="false"
      size="mini"
      :span-method="arraySpanMethod"
    >
      <el-table-column prop="firstColumn" label width="150"></el-table-column>
      <el-table-column prop="content" label align="left">
        <template slot-scope="scope">
          <div v-if="scope.row.type === '1'">{{scope.row.content}}</div>
          <div v-else-if="scope.row.type === '2'" style="max-height: 160px; overflow:auto">
            <el-radio-group size="mini" v-model="scope.row.value" @change="changeRadio">
              <el-radio
                style="display: block"
                v-for="(item, i) in scope.row.jobList"
                :label="item.id"
                :key="i"
              >{{item.jobName}}</el-radio>
            </el-radio-group>
          </div>
          <span v-else></span>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px">
      <el-button type="primary" plain size="mini">复制</el-button>
      <el-button type="success" plain size="mini">返回</el-button>
    </el-row>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      copyJobList: [],
      subJobList: [],
      gridData: [
        {
          firstColumn: "职位复制",
          content: "",
          type: "0"
        },
        {
          firstColumn: "职位名称",
          content: "",
          type: "0"
        },
        {
          firstColumn: "职位描述",
          content: "",
          type: "1"
        },
        {
          firstColumn: "可以复制的职位",
          content: "",
          type: "2",
          jobList: []
        },
        {
          firstColumn: "可以复制职位的子系统",
          content: "",
          type: "2",
          jobList: []
        }
      ]
    };
  },
  methods: {
    changeRadio(value) {
      // console.log("-------------------------" + value);
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        if (columnIndex === 0) {
          return [1, 2];
        }
      }
    }
  },
  created() {
    this.gridData[3].jobList = [
      { id: 1, jobName: "总经理" },
      { id: 2, jobName: "总经理" },
      { id: 3, jobName: "总经理" },
      { id: 4, jobName: "总经理" },
      { id: 5, jobName: "总经理" },
      { id: 6, jobName: "总经理" }
    ];
    this.gridData[4].jobList = [
      { id: 1, jobName: "系统管理" },
      { id: 2, jobName: "系统管理" },
      { id: 3, jobName: "系统管理" },
      { id: 4, jobName: "系统管理" },
      { id: 5, jobName: "系统管理" },
      { id: 6, jobName: "系统管理" },
      { id: 7, jobName: "系统管理" }
    ];
  }
};
</script>

<style scoped>
.draw-card {
  font-family: Helvetica, sans-serif;
  text-align: center;
  width: 95%;
  margin: 10px auto;
  padding: 10px;
}
</style>