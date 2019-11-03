<template>
  <el-row
    class="tag-list-wrapper"
  >
    <el-row
      class="tag-list-header no-wrap"
    >个人中心：</el-row>
    <el-row
      v-for="(item, index) in asyncRoutes"
      :key="index"
      :class="[$route.name === item.name ? 'checked' : '', 'tag-item']"
      :title="item.meta && item.meta.title"
    >
      <router-link
        :to="{ path: item.path }"
      >
        <p
          class="no-wrap"
        >{{ item.meta && item.meta.title }}</p>
      </router-link>
    </el-row>
  </el-row>
</template>

<script>
import { asyncRoutes } from '@/router'
export default {
  name: 'Sidebar',
  data() {
    return {
      asyncRoutes: asyncRoutes.filter(item => item.path !== '*'),
      filter: ''
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.tag-list-wrapper {
  width: 190px;
  height: 100%;
  overflow: auto;
  .tag-list-header, .tag-item {
    width: 100%;
    height: 40px;
    line-height: 40px;
  }
  .tag-list-filter-input {
    width: 100%;
    padding: 5px 0;
  }
  .tag-list-header {
    background-color: @primary;
    text-align-last: left;
    padding: 0 7px;
    font-weight: bold;
  }
  .tag-item {
    position: relative;
    &:hover, &.checked {
      color: @primary;
      &::after {
        content: '';
        width: 5px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        background-color: @primary;
      }
    }
    p {
      padding: 0 7px;
      margin: 0;
    }
  }
}
</style>
