<template>
  <!--页面导航-->
  <el-collapse v-model="activeNames">
    <el-collapse-item :title="title" :name="name" ><!--v-for="navMenu"-->
      <span  class="board-item">
        <li v-for="element in list" :key="element.id">
          <a class="" @click="subAddTab(element.name)">{{ element.name }}</a>
        </li>
      </span>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
    export default {
        components: {

        },
        data() {
            return {
                title: '页面导航',
                name: '1',
                activeNames: ['1'],
                navMenu: [1, 2],
                list: [
                    { name: '新建工单', id: 1 },
                    { name: '工单查询', id: 2 },
                    { name: '未接工单', id: 3 },
                    { name: '已接工单', id: 4 },
                    { name: '已派', id: 5 },
                    { name: '已处理', id: 6 },
                    { name: '草稿', id: 7 }
                ]
            };
        },
        methods: {
            subAddTab(targetName) {
                this.$emit('addTab', targetName)
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
            }
        }
    };
</script>

<style scoped lang="scss">
  .el-collapse{
    border: 1px solid #EBEEF5 !important;
    border-bottom-width: 10px!important;
  }
  /*.el-collapse-item{
    font-size: 12px!important;
    padding: 1px 1px 15px 1px!important;
  }*/
  .board-item {
    cursor: pointer;
    margin: 6px 0px 10px 2px;
    display: block;
  }
  .board-item li {
    float: left;
    width: 20%;
    border: 1px solid #e9e9e9;
    margin: -1px 0 0 -2px;
    position: relative;
    background: #fff;
    list-style-type:none;
    height: 70px;
    text-align: center;
    line-height: 70px;
  }

  a {
    color: #1296db;
  }

</style>
