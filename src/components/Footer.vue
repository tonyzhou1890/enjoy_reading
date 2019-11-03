<template>
  <el-row class="footer-wrapper">
    <el-divider />
    <el-row>
      <router-link :to="{ path: '/about' }">
        关于本站
      </router-link>
      <el-divider direction="vertical" />
      <a href="https://tony93.top" target="_blank">
        个人博客
      </a>
      <el-divider direction="vertical" />
      <a :href="registerHrefPrefix" target="_blank">
        注册中心
      </a>
    </el-row>
  </el-row>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      registerHrefPrefix: this.$store.state.app.registerPrefix
    }
  }
}
</script>

<style lang="less" scoped>
.footer-wrapper {
  text-align: center;
  padding-bottom: 10px;
}
</style>
