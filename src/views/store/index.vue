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
          <el-col class="title no-wrap">{{ `书库(${total})` }}</el-col>
          <!-- search -->
          <el-col class="search-area">
            <!-- 位置搜索 -->
            <el-col
              class="search-wrapper"
            >
              <span class="search-label">筛选：</span>
              <el-select
                size="small"
                :value="searchParams.position"
                class="search-field"
                @change="(val) => selectChange(val)"
              >
                <el-option
                  v-for="(option, optionIndex) in filterList"
                  :key="optionIndex"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-col>
            <!-- 书名搜索 -->
            <el-col
              class="search-wrapper"
            >
              <span class="search-label">搜索：</span>
              <el-input
                v-model="searchParams.keyword"
                placeholder="请输入书名"
                size="small"
                class="search-field"
                @keypress.enter.native="getStoreList"
              />
            </el-col>
          </el-col>
        </el-row>
        <ThinDivider />
        <!-- books -->
        <el-row v-if="list.length" class="books">
          <Book
            v-for="(book, index) in list"
            :key="index"
            :book="book"
            :get-book-list="getStoreList"
          />
        </el-row>
        <!-- pagination -->
        <el-row v-if="list.length" class="pagination-wrapper">
          <el-pagination
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="rows"
            :current-page="page"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
        <Empty v-if="!list.length" />
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { getStoreBookList } from '@/api/store'
import Sidebar from '@/components/Sidebar'
import ThinDivider from '@/components/ThinDivider'
import Book from './components/book'
import Empty from '@/components/Empty'
export default {
  name: 'Store',
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
      loading: false,
      filterList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '个人空间',
          value: 1
        },
        {
          label: '书城',
          value: 2
        }
      ],
      searchParams: {
        keyword: '',
        position: 0
      },
      rows: 10,
      page: 1
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getStoreList()
  },
  methods: {
    // 获取书库书籍列表
    getStoreList(params = {}) {
      this.loading = true
      getStoreBookList({
        ...this.searchParams,
        page: this.page,
        rows: this.rows,
        ...params
      })
        .then(res => {
          this.total = res.total
          this.list = res.data
          this.loading = false
          this.page = params.page || this.page
          this.rows = params.rows || this.rows
          this.searchParams.position = params.position === undefined ? this.searchParams.position : params.position
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '获取书籍列表失败')
          this.loading = false
        })
    },
    // 筛选过滤
    selectChange(val) {
      this.getStoreList({ position: val, page: 1 })
    },
    // 页码变化
    handleCurrentChange(val) {
      this.getStoreList({ page: val })
    },
    // 每页数量变化
    handleSizeChange(val) {
      this.getStoreList({ rows: val })
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
          min-width: 480px;
          padding-right: 10px;
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
