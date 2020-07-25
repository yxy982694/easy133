<template>
  <el-card class="box-card">
    <el-row>
      <el-input
        placeholder="按职位名称搜索 ..."
        v-model.trim="keywords"
        clearable
        @keyup.enter.native="search(keywords)"
      ></el-input>
      <el-button icon="el-icon-search" circle size="mini" @click="search(keywords)"></el-button>
    </el-row>
    <el-divider></el-divider>
    <div class="long" style="width: 50%;">
      <el-button type="primary" plain @click="openDraw($event)" size="mini" comp="createjob">创建职位</el-button>
      <el-button type="success" plain @click="openDraw($event)" size="mini" comp="canceljob">注销职位</el-button>
      <el-button type="primary" plain @click="openDraw($event)" size="mini" comp="editjob">修改职位</el-button>
      <el-button type="warning" plain @click="openDraw($event)" size="mini" comp="copyjob">复制职位</el-button>
    </div>
    <span class="table" style="width: 70%;">
      <el-table
        ref="singleTable"
        :data="tableData"
        highlight-current-row
        :row-class-name="tableRowClassName"
        @current-change="handleCurrentChange"
        @row-click="rowClick"
        size="mini"
        :show-header="true"
        height="240"
        style="width: 100%;"
      >
        <el-table-column type="index" :index="0" v-if="false"> </el-table-column>
        <el-table-column align="left" prop="jobName" label="职位名称"></el-table-column>
        <el-table-column align="left" prop="name" label="英文名"></el-table-column>
        <el-table-column align="left" prop="institution" label="所在机构"></el-table-column>
        <el-table-column align="left" prop="desc" label="职位描述"></el-table-column>
        <el-table-column align="left" prop="jobType" label="职位类型"></el-table-column>
        <el-table-column align="left" prop="jobTypeCode" label="职位编码" v-if="false"></el-table-column>
      </el-table>
    </span>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      ref="drawerdiv"
      direction="rtl"
      :destroy-on-close="true"
      size="50%"
    >
      <div id="drawerdiv">
        <component v-bind:is="currentComponent" :drawer="objdrawer" :passContent="passContent" @operateJob="operateJob"></component>
      </div>
      <!-- <createjob :openDrawer='drawer'></createjob> -->
    </el-drawer>
  </el-card>
</template>
<script>
import createjob from "./subVue/createJob";
import editjob from "./subVue/editJob";
import copyjob from "./subVue/copyJob";
export default {
  components: {
    createjob,
    editjob,
    copyjob
  },
  data() {
    return {
      keywords: "",
      passContent: {},
      drawer: false,
      objdrawer: this.$refs,
      drawerTitle: "",
      direction: "rtl",
      currentComponent: null,
      tableData: [
        {
          jobName: "总经理",
          name: "manager",
          institution: "网络部",
          desc: "aaaaaaaaaaaaaaaaaaaaa",
          jobType: "正职",
          jobTypeCode: 1
        },
        {
          jobName: "副总经理",
          name: "deputy",
          institution: "网管中心",
          desc: "bbbbbbbbbbbbbbbbbbbb",
          jobType: "副职",
          jobTypeCode: 2
        },
        {
          jobName: "机房综合管理员",
          name: "jf-admin",
          institution: "郑州分公司",
          desc: "cccccccccccccccccc",
          jobType: "一般工作人员",
          jobTypeCode: 3
        },
        {
          jobName: "机房综合员",
          name: "jfstaff",
          institution: "安阳分公司",
          desc: "dddddddddddddddddddd",
          jobType: "正职",
          jobTypeCode: 1
        },
        {
          jobName: "OPM",
          name: "OPM",
          institution: "客户服务中心",
          desc: "eeeeeeeeeeeeee",
          jobType: "一般工作人员",
          jobTypeCode: 3
        },
        {
          jobName: "GPRS专家",
          name: "GPRS-expert",
          institution: "计划建设部",
          desc: "",
          jobType: "一般工作人员",
          jobTypeCode: 3
        },
        {
          jobName: "华为IP专家",
          name: "huawei-IP-expert",
          institution: "综合部",
          desc: "",
          jobType: "一般工作人员",
          jobTypeCode: 3
        },
        {
          jobName: "东软短信网关专家",
          name: "dr",
          institution: "济源分公司",
          desc: "",
          jobType: "一般工作人员",
          jobTypeCode: 3
        },
        {
          jobName: "系统管理员",
          name: "sys-admin",
          institution: "市场经营部",
          desc: "",
          jobType: "副职",
          jobTypeCode: 2
        }
      ],
      currentRow: null
    };
  },
  methods: {
    search(keywords) {
      // 根据关键字，进行数据的搜索
      // console.log("====================" + keywords);
      if (keywords === "") {
        this.tableData = [
          {
            jobName: "总经理",
            name: "manager",
            institution: "网络部",
            desc: "",
            jobType: "正职",
            jobTypeCode: 1
          },
          {
            jobName: "副总经理",
            name: "deputy",
            institution: "网管中心",
            desc: "",
            jobType: "副职",
            jobTypeCode: 2
          },
          {
            jobName: "机房综合管理员",
            name: "jf-admin",
            institution: "郑州分公司",
            desc: "",
            jobType: "一般工作人员",
            jobTypeCode: 3
          },
          {
            jobName: "机房综合员",
            name: "jfstaff",
            institution: "安阳分公司",
            desc: "",
            jobType: "正职",
            jobTypeCode: 1
          },
          {
            jobName: "OPM",
            name: "OPM",
            institution: "客户服务中心",
            desc: "",
            jobType: "一般工作人员",
            jobTypeCode: 3
          },
          {
            jobName: "GPRS专家",
            name: "GPRS-expert",
            institution: "计划建设部",
            desc: "",
            jobType: "一般工作人员",
            jobTypeCode: 3
          },
          {
            jobName: "华为IP专家",
            name: "huawei-IP-expert",
            institution: "综合部",
            desc: "",
            jobType: "一般工作人员",
            jobTypeCode: 3
          },
          {
            jobName: "东软短信网关专家",
            name: "dr",
            institution: "济源分公司",
            desc: "",
            jobType: "一般工作人员",
            jobTypeCode: 3
          },
          {
            jobName: "系统管理员",
            name: "sys-admin",
            institution: "市场经营部",
            desc: "",
            jobType: "副职",
            jobTypeCode: 2
          }
        ];
      } else {
        this.tableData = this.tableData.filter(item => {
          // if(item.name.indexOf(keywords) != -1)
          // 注意 ： ES6中，为字符串提供了一个新方法，叫做  String.prototype.includes('要包含的字符串')
          //  如果包含，则返回 true ，否则返回 false
          if (item.jobName.includes(keywords)) {
            return item;
          }
        });
      }
      // return newList
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      // console.log("=====================currentRow======="+this.currentRow)
    },
    rowClick(row, column, event) {
      this.passContent = row;
    },
    openDraw(event) {
      let el = event.currentTarget;
      if (el.attributes["comp"].nodeValue === "canceljob") {
        this.$message({
          message: "注销职位功能暂定！",
          type: "warning"
        });
        return;
      }
      if ( el.attributes["comp"].nodeValue === "editjob" || el.attributes["comp"].nodeValue === "copyjob" ) {
        // 如果没有选择的数据
        if(Object.keys(this.passContent).length == 0){
          this.$message({
            message: "请选择要修改或者复制的数据！",
            type: "warning"
          });
          return;
        }
      }
      this.drawer = true; //打开drawer
      this.drawerTitle = el.innerText;
      this.currentComponent = el.attributes["comp"].nodeValue;
    },
    operateJob(object) {
      this.tableData.unshift(object)
    },
    tableRowClassName({row, rowIndex}) {
      row.index = rowIndex;
    }
  }
};
</script>
<style >
.box-card {
  font-family: Helvetica, sans-serif;
  text-align: center;
  width: 60%;
  margin: 10px auto;
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
  width: 200px;
}
</style>