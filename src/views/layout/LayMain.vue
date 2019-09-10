<template>
  <div class="nav-main">
    <keep-alive>
      <transition name="fade-transform" mode="out-in">
        <router-view v-if="$route.meta.keepAlive" :key="key"></router-view>
      </transition>
    </keep-alive>
    <transition name="fade-transform" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + new Date() : this.$route + new Date();
    }
  }
};
</script>
<style lang="scss" scoped>
.nav-main {
  min-height: 100%;
  padding: 20px;
}
</style>