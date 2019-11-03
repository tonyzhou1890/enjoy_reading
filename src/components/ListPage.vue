<template>
  <el-row
    class="list-page-wrapper"
  >
    <!-- header -->
    <el-row class="header">
      <!-- 标题 -->
      <el-col class="title no-wrap">{{ title }}</el-col>
      <!-- select -->
      <el-col class="select">
        <el-col
          v-for="(item, index) in searchList"
          :key="index"
          class="select-wrapper"
        >
          <span class="select-label">{{ item.label }}</span>
          <el-select
            size="small"
            :value="item.value"
            class="select"
            @change="(val) => selectChange(item.key, val)"
          >
            <el-option
              v-for="(option, optionIndex) in item.list"
              :key="optionIndex"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-col>
      </el-col>
    </el-row>
    <ThinDivider />
    <!-- books -->
    <el-row v-if="books.length" class="books">
      <ListBook
        v-for="(item, index) in books"
        :key="index"
        :book="item"
      />
    </el-row>
    <!-- pagination -->
    <el-row v-if="books.length" class="pagination-wrapper">
      <el-pagination
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="Number($route.query.rows) || 10"
        :current-page="Number($route.query.page) || 1"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-row>
    <Empty v-if="!books.length" />
  </el-row>
</template>

<script>
import Empty from './Empty'
import ThinDivider from './ThinDivider'
import ListBook from './ListBook'
export default {
  name: 'ListPage',
  components: {
    Empty,
    ThinDivider,
    ListBook
  },
  props: {
    // 页头标题
    title: {
      type: String,
      default: ''
    },
    // 书籍列表
    books: {
      type: Array,
      default() {
        return []
      }
    },
    // 搜索条件
    searchList: {
      type: Array,
      default() {
        return []
      }
    },
    total: {
      type: Number,
      default: 0
    }
  },
  methods: {
    selectChange(key, value) {
      this.routeChange(key, value)
    },
    handleSizeChange(rows) {
      this.routeChange('rows', rows)
    },
    handleCurrentChange(page) {
      this.routeChange('page', page)
    },
    routeChange(key, value) {
      const query = JSON.parse(JSON.stringify(this.$route.query))
      query[key] = value
      this.$router.push({ query })
    }
  }
}
</script>

<style lang="less" scoped>
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
    .select {
      text-align: right;
      padding-right: 10px;
      .select-wrapper {
        float: right;
        .select {
          width: 150px;
        }
        .select-label {
          vertical-align: bottom;
          line-height: 32px;
        }
      }
    }
  }
  .books {
    display: flex;
    flex-wrap: wrap;
    min-height: calc(100vh - 294px);
  }
  .pagination-wrapper {
    text-align: right;
  }
}
</style>
