<template>
  <div class="content-radius">
    <div class="section-title">
      <p class="section-title-name">待办列表</p>
    </div>
    <div class="upcom-table">
      <el-table :data="tableData">
        <el-table-column
        v-for="column in columns"
        :prop="column.prop"
        :label="column.label"
        :key="column.prop"
        header-align="center"
        align="center"
        :min-width="column.minWidth">
        </el-table-column>
      </el-table>
    </div>
    <div class="upcom-page">
      <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          >
        </el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        data() {
            return {
                flag: true,
                tableData: [],
                currentPage: 1,// 当前显示页码
                pageSize: 6,// 每页显示条数
                total: 0,// 总共多少条数据
                columns: [
                {prop:"sheetid", label:"工单流水号"},
                {prop:"sheetname", label:"工单类型"},
                {prop:"title", label:"工单主题", minWidth: '150px'},
                {prop:"statename", label:"工单状态"},
                ]
            }
        },
        computed: {
          operProFlag: {
            get: function () {
              return this.$store.state.menu.operProFlag
            },
            set: function () {}
          },
          sheetType: {
            get: function () {
              return this.$store.state.menu.sheetType
            },
            set: function () {}
          },
        },
        watch: {
          operProFlag: function () {
            this.currentPage = 1
            this.loadListData(this.currentPage,'')
          },
          sheetType: function () {
            this.currentPage = 1
            this.loadListData(this.currentPage,this.sheetType)
          }
        },
        methods: {
            loadListData: function (currentPage,sheetType) {
                let jsonObj = {
                  currentPage: currentPage,
                  sheetType: sheetType
                }
                let jsonStr = JSON.stringify(jsonObj)
                this.$api.home.getUpComList(jsonStr).then((res) => {
                    // console.log(res)
                    this.tableData = res.data
                    this.total = Number.parseInt(res.total)?Number.parseInt(res.total):0
                })
            },
            handleCurrentChange: function (currentPage) {
              this.currentPage = currentPage
              this.loadListData(currentPage,this.sheetType)
            },
        },
        mounted() {  //  在 created 中，data 和 methods 都已经被初始化好了！如果要调用 methods 中的方法，或者操作 data 中的数据，最早，只能在 created 中操作return axios({
          this.loadListData(this.currentPage,this.sheetType)
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/variable"
  @import "../../../common/stylus/mixin"
   .content-radius
     //max-height: 352px
     height: 352px
     position: relative
     overflow: hidden
   .upcom-table
     margin: 0 18px
     box-sizing: border-box
     font-size: $font-size-small
   table,tr
     width: 100%
   thead
     background-color: #fafafa
   tr
     border-bottom: 1px solid $color-border
   th,td
     text-align: center
     height: 39px
     line-height: 39px
     no-wrap()
   th
     font-weight: bold
   th:nth-child(1)
     width: 25%
   th:nth-child(2)
     width: 20%
   th:nth-child(3)
     width: 40%
   th:nth-child(4)
     width: 15%
   .upcom-page
     position: absolute
     right: 18px
     bottom: 17px
     //float: right
     //margin: 12px 18px 17px 0
     //margin: 12px 18px 0 0
   .upcom-td
    display: flex
    justify-content: center
    align-items: center
   .upcom-tab
     width: 14px
     height: 14px
     border-radius: 50%
     font-size: $font-size-small
     display: flex
     justify-content: center
     align-items: center
   @media screen and (min-height: 980px)
     .content-radius
       height: 530px
</style>
