<template>
  <el-pagination
    background :small="flag" :page-size="pageSize" :total="totalSize" :page-count="totalPages" :current-page="pageNum"
    layout=" prev, pager, next, jumper"
    hide-on-single-page
    @size-change="sizePageChange"
    @current-change="currentChange"
    @prev-click="prePage"
    @next-click="nextPage">
  </el-pagination>
</template>

<script>
    export default {
        name: 'pagination',
        props: {
            pageNum: {
                type: Number,
                required:true
            },
            pageSize: {
                type: Number,
                required:true
            },
            totalSize: {
                type: Number,
                required:true
            },
            totalPages: {
                type: Number,
                required:true
            }
        },
        data() {
            return {
                flag: true
            }
        },
        methods: {
            sizePageChange(curSize) {
                // console.log("当前页数:" + curSize)
            },
            currentChange(cPage) {
                // console.log("当前页:" + cPage)
            },
            prePage(cPage) {
                // console.log("当前页:" + cPage)
            },
            nextPage(cPage) {
                // console.log("当前页:" + cPage)
            }
        }
    }
</script>
