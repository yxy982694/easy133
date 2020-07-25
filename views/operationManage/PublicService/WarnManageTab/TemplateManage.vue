<template>
  <div class="component-container">
    <transition mode="out-in">
      <component :is="warnComponentWho"></component>
    </transition>
  </div>
</template>

<script>
  import '../../../../common/stylus/warnManage/templateManage.styl'
  export default {
    name: 'WarnManageTabTemplateManage',
    components:{
      'TemplateManageHome':() => import(/* webpackChunkName: "TemplateManageHome" */ '@/views/OperationManage/PublicService/WarnManageTab/TemplateManageHome'),
      'TemplateManageNewBuild':() => import(/* webpackChunkName: "TemplateManageNewBuild" */ '@/views/OperationManage/PublicService/WarnManageTab/TemplateManageNewBuild'),
    },
    computed: {
      warnComponentWho: {
        get: function () {
          return this.$store.state.warnManage.warnComponentWho
        },
        set: function () {}
      },
    },
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .component-container
    height: 100%
  // .v-enter
  // .v-leave-to
  //   opacity:0
  // .v-enter-active
  // .v-leave-active
  //   transition:all 0.5s
</style>
