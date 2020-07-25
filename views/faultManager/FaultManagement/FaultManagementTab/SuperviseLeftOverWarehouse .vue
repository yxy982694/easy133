<template>
  <center-menu :centerList="centerList"></center-menu>
</template>

<script>
    import CenterMenu from '@/components/AsideTab/SubAsideTab/CenterMenu'
    export default {
        data() {
            return {
                centerList:[
                ]
            }
        },
        components:{
          CenterMenu
        },
        computed: {
          centerMenu: {
            get: function () {
              return this.$store.state.centerMenu.centerMenu
            },
            set: function () {}
          },
          centerMenuId: {
            get: function () {
              return this.$store.state.centerMenu.centerMenuId
            },
            set: function () {}
          },
        },
        mounted: function () {
          // console.log(this.centerMenuId)
          // console.log(this.centerMenu)
          let arr = this.centerMenu[this.centerMenuId]
          let obj
          // console.log(arr)
          if (arr && arr.length>0) {
            for (var i=0;i<arr.length;i++) {
              obj = {
                id: arr[i].id,
                location: arr[i].location,
                label: arr[i].name
              }
              this.centerList.push(obj)
            }
          }
        }
    }
</script>
