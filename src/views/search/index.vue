<template>
  <el-row class="content-wrapper">
    <TagList />
    <el-row v-loading="loading" class="flex-content">
      <ListPage
        :books="list"
        :search-list="select"
        :title="`搜索：${keyword}`"
        :total="total"
      />
    </el-row>
  </el-row>
</template>

<script>
import TagList from '@/components/TagList'
import ListPage from '@/components/ListPage'
import { getSearchBookList } from '@/api/search'
import { Message } from 'element-ui'
export default {
  name: 'Search',
  components: {
    TagList,
    ListPage
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      select: []
    }
  },
  computed: {
    keyword() {
      return this.$route.params.keyword
    }
  },
  created() {
    this.getSearchBookList()
  },
  methods: {
    getSearchBookList() {
      const params = {
        keyword: this.keyword,
        ...this.$route.query
      }
      this.loading = true
      getSearchBookList(params)
        .then(res => {
          this.list = res.data.map(item => {
            item.path = `/book/detail/${item.name}/${item.uuid}`
            return item
          })
          this.total = res.total
          this.loading = false
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取列表失败')
          this.loading = false
        })
    }
  }
}
</script>
