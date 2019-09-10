<template>
  <el-breadcrumb separator="/" class="nav-bar">
    <el-breadcrumb-item :replace="true" v-for="(item,index) in levelList" :key="index">
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
      <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    };
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const first = matched[0];
      if (first && first.name !== "首页") {
        matched = [{ name: "首页", path: "/" }].concat(matched);
      }
      this.levelList = matched;
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-bar.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
}
</style>

