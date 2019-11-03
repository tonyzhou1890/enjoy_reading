<template>
  <el-row class="books-wrapper">
    <el-row class="paragraph-header">
      <el-col :span="12" class="no-wrap">{{ text }}</el-col>
      <el-col :span="12" class="more no-wrap">
        <router-link :to="{ path: path }">
          更多……
        </router-link>
      </el-col>
    </el-row>
    <ThinDivider />
    <el-row class="books">
      <ListBook
        v-for="(item, index) in books"
        :key="index"
        :book="item"
      />
    </el-row>
  </el-row>
</template>

<script>
import ThinDivider from '@/components/ThinDivider'
import ListBook from '@/components/ListBook'
export default {
  name: 'Books',
  components: {
    ThinDivider,
    ListBook
  },
  props: {
    text: {
      default: '',
      type: String
    },
    path: {
      default: '/',
      type: String
    },
    books: {
      default() {
        return []
      },
      type: Array
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.books-wrapper {
  .paragraph-header {
    font-size: 20px;
    vertical-align: bottom;
    padding: 25px 10px 0 20px;
    .more {
      font-size: 16px;
      text-align: right;
      padding-top: 4px;
      &:hover {
        color: @primary;
      }
    }
  }
  .books {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    height: 750px;
    overflow: hidden;
  }
}
</style>
