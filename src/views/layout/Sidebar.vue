<template>
  <el-menu :default-active="$route.path" :collapse="isCollapse" mode="vertical" background-color="#304156" text-color="#ffffff" active-text-color="#ffc444" :unique-opened="true" menu-trigger="click">
    <div class="logo-box">
      <img src="../../assets/logo.png" alt="" class="logo">
    </div>
    <sidebar-item :routes="getRoutes.options.routes"></sidebar-item>
  </el-menu>
</template>

<script>
import router from '@/router/router.js'
import { mapGetters } from 'vuex'
import sidebarItem from '@/views/layout/SidebarItem'
export default {
  data(){
    return {
      getRoutes:router,
    }
  },
  components:{sidebarItem},
  computed: {
    ...mapGetters([
      'sidebar',
      'routers'
    ]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
}
</script>

<style lang="scss" scoped>
.logo-box{
  padding: 20px;
  .logo{
    width: 100%;
  }
}
.menu-wrapper{
  // overflow-y: auto;
  // overflow-x: hidden;
}
</style>

