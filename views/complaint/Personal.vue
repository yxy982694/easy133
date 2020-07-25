<template>
  <div>
    <aside-tab :leftList="leftList"></aside-tab>
  </div>
</template>

<script>
  import AsideTab from '@/components/AsideTab/AsideTab'
  import { leftListMixin } from '@/common/js/mixin.js'
  export default {
      mixins: [leftListMixin],
      data: function () {
        return {
          leftList:[]
        }
      },
      components:{
          AsideTab
      },
  }
</script>
