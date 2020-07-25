<template>
  <el-card class="draw-card">
    <el-table
      :data="gridData"
      border
      style="width: 100%"
      :show-header="false"
      size="mini"
      :span-method="arraySpanMethod"
    >
      <el-table-column prop="firstColumn" label width="150"></el-table-column>
      <el-table-column prop="content" label align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.type === '1'"
            v-model="scope.row.content"
            clearable
            size="mini"
            style="width: 90%"
          ></el-input>

          <el-radio-group
            size="mini"
            v-else-if="scope.row.type === '2'"
            v-model="scope.row.value"
            @change="changeRadio"
          >
            <el-radio :label="1">正职</el-radio>
            <el-radio :label="2">副职</el-radio>
            <el-radio :label="3">一般工作人员</el-radio>
          </el-radio-group>

          <span v-else></span>
        </template>
      </el-table-column>
    </el-table>
    <el-row style="margin-top: 20px">
      <el-button type="primary" plain size="mini">保存</el-button>
      <el-button type="success" plain size="mini" @click="resetContent">重置</el-button>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: ["passContent"],
  data() {
    return {
      gridData: [
        {
          firstColumn: "修改职位",
          content: "",
          type: "0"
        },
        {
          firstColumn: "职位名称 *",
          content: "",
          type: "1"
        },
        {
          firstColumn: "职位描述",
          content: "",
          type: "1"
        },
        {
          firstColumn: "职位类型 *",
          content: "",
          value: 3,
          type: "2"
        }
      ]
    };
  },
  computed: {

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
    },
    updateJob() {
      //保存修改的数据
    },
    resetContent() {
      //重置内容
      this.$options.methods.initContent(this.gridData, this.passContent);
    },
    initContent(passData, originalData) {
      let param = originalData;
      passData.forEach((item, index) => {
        // console.log("===============index=================" + index);
        switch (index) {
          case 1:
            item.content = param.jobName;
            break;
          case 2:
            item.content = param.desc;
            break;
          case 3:
            item.value = param.jobTypeCode;
            break;
          default:
            item.content = "";
        }
      });
    }
  },
  created() {
    this.$options.methods.initContent(this.gridData, this.passContent);
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