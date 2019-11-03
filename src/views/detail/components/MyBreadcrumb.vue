<template>
  <el-row class="breadcrumb-wrapper">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbs"
        :key="index"
      >
        <router-link
          v-if="item.path"
          :to="item.path"
        >
          <span>{{ item.label }}</span>
        </router-link>
        <span v-else>{{ item.label }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </el-row>

</template>

<script>
export default {
  name: 'MyBreadcrumb',
  props: {
    breadcrumbs: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.breadcrumb-wrapper {
  font-size: 20px;
  /deep/ .el-breadcrumb {
    font-size: 20px;
    .el-breadcrumb__inner a, .el-breadcrumb__inner.is-link {
      font-weight: normal;
    }
  }
}
</style>
