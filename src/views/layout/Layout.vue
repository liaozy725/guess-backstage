<template>
  <div class="app-wrapper">
    <Sidebar class="sidebar-container"></Sidebar>
    <div class="main-container">
      <nav-bar></nav-bar>
      <tabs-view></tabs-view>
      <lay-main></lay-main>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/views/layout/Sidebar";
import NavBar from "@/views/layout/NavBar";
import TabsView from "@/views/layout/TabsView";
import LayMain from "@/views/layout/LayMain";
export default {
  data() {
    return {};
  },
  components: { Sidebar, NavBar, TabsView, LayMain }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  .sidebar-container {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 1000;
    width: 200px;
  }
  .main-container {
    min-height: 100%;
    margin-left: 200px;
  }
}
</style>

