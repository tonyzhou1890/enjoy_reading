<template>
  <el-row class="content-wrapper">
    <Sidebar />
    <el-row class="flex-content">
      <el-row
        v-loading="loading"
        class="list-page-wrapper"
      >
        <!-- header -->
        <el-row class="header">
          <!-- 标题 -->
          <el-col class="title no-wrap">{{ `书架(${total})` }}</el-col>
        </el-row>
        <ThinDivider />
        <!-- books -->
        <el-row v-if="list.length" class="books">
          <Book
            v-for="(book, index) in list"
            :key="index"
            :book="book"
            :get-book-list="getShelfList"
          />
        </el-row>
        <Empty v-if="!list.length" />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { getShelfBookList } from '@/api/shelf'
import Sidebar from '@/components/Sidebar'
import ThinDivider from '@/components/ThinDivider'
import Book from './components/book'
import Empty from '@/components/Empty'
export default {
  name: 'Shelf',
  components: {
    Sidebar,
    ThinDivider,
    Book,
    Empty
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      list: [],
      total: 0,
      loading: false
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getShelfList()
  },
  methods: {
    // 获取书架书籍列表
    getShelfList() {
      this.loading = true
      getShelfBookList()
        .then(res => {
          this.total = res.total
          this.list = res.data
          this.loading = false
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '获取书籍列表失败')
          this.loading = false
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.content-wrapper {
  .flex-content {
    .list-page-wrapper {
      .header {
        font-size: 20px;
        display: flex;
        justify-content: space-between;
        padding-top: 4px;
        .title {
          padding-left: 10px;
          line-height: 32px;
        }
        .search-area {
          text-align: right;
          min-width: 470px;
          .search-wrapper {
            float: right;
            width: auto;
            padding-left: 10px;
            .search-field {
              width: 150px;
            }
            .search-label {
              vertical-align: bottom;
              line-height: 32px;
            }
          }
        }
      }
      .books {
        // display: flex;
        // flex-wrap: wrap;
        min-height: calc(100vh - 294px);
        padding: 0 10px;
        overflow: auto;
      }
      .pagination-wrapper {
        text-align: right;
      }
    }
  }
}
</style>
