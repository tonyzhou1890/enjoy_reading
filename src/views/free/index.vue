<template>
  <el-row class="content-wrapper">
    <TagList />
    <el-row v-loading="loading" class="flex-content">
      <ListPage
        :books="list"
        :search-list="select"
        :title="`免费书籍`"
        :total="total"
      />
    </el-row>
  </el-row>
</template>

<script>
import TagList from '@/components/TagList'
import ListPage from '@/components/ListPage'
import { getFreeList } from '@/api/home'
import { Message } from 'element-ui'
export default {
  name: 'Free',
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
  created() {
    this.getFreeList()
  },
  methods: {
    getFreeList() {
      const params = {
        ...this.$route.query
      }
      this.loading = true
      getFreeList(params)
        .then(res => {
          this.list = res.data.map(item => {
            const temp = {
              path: '/free',
              label: '免费书籍'
            }
            item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
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
