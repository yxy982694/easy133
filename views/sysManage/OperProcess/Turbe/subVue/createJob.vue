<template>
  <!-- :before-close="handleClose" -->
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
            v-model.trim="scope.row.content"
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
      <el-button type="primary" plain size="mini" @click="saveNewJob">保存</el-button>
      <el-button type="success" plain size="mini" @click="resetContent">重置</el-button>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: ["drawer"],
  data() {
    return {
      subDrawer: null,
      paramObject: ['正职','副职','一般工作人员'],
      gridData: [
        {
          firstColumn: "创建职位",
          content: "",
          type: "0"
        },
        {
          firstColumn: "所在机构",
          content: "",
          type: "1"
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
  methods: {
    handleClose(done) {
      this.$confirm("确定要提交表单吗？")
        .then(_ => {
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            done();
          }, 2000);
        })
        .catch(_ => {});
    },
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
    saveNewJob: function() { //保存增用户
      if (this.gridData[2].content === "") {
        this.$message({
          message: "职位名称不能为空！",
          type: "warning"
        });
        return;
      }
      let newJob = {}
      this.gridData.forEach( (item, index) => {
        switch (index) {
          case 1:
            newJob.institution = item.content;
            break;
          case 2:
            newJob.jobName = item.content;
            break;
          case 3:
            newJob.desc = item.content;
            break;
          case 4:
            newJob.jobTypeCode = item.value;
            newJob.jobType = this.paramObject[item.value];
            break;
          default:
            ;
        }
      })
      this.$emit('operateJob', newJob)
      this.$message({
        message: "保存成功！",
        type: "success"
      });
      this.drawer.drawerdiv.hide();
    },
    resetContent() { //重置新用户
        this.gridData.forEach( (item, index) => {
            if(index > 0 && index <= 3){
                item.content = ''
            }else if(index === 4){
                item.value = 3
            }
        })
    }
  }
};
</script>
<style scoped>
.draw-card {
  font-family: Helvetica, sans-serif;
  text-align: center;
  width: 95%;
  height: 300px;
  margin: 10px auto;
  padding: 10px;
}
.el-button {
  margin-left: 10px;
  margin-bottom: 6px;
}

.table {
  /* height: 240px; */
  border: 1px solid #ebeef5;
}
.table > .el-table td,
.el-table th.is-leaf {
  border-bottom: none;
}
.el-input {
  margin-left: 20px;
  width: 160px;
}
</style>