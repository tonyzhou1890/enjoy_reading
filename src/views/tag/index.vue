<template>
  <el-row class="content-wrapper">
    <TagList />
    <el-row v-loading="loading" class="flex-content">
      <ListPage
        :books="list"
        :search-list="select"
        :title="`标签：${tag}`"
        :total="total"
      />
    </el-row>
  </el-row>
</template>

<script>
import TagList from '@/components/TagList'
import ListPage from '@/components/ListPage'
import { getTagBookList } from '@/api/tag'
import { Message } from 'element-ui'
export default {
  name: 'Tag',
  components: {
    TagList,
    ListPage
  },
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      select: [
        {
          key: 'filter',
          value: this.$route.query.filter || 1,
          label: '筛选',
          list: [
            {
              label: '全部',
              value: 1
            },
            {
              label: '免费',
              value: 2
            },
            {
              label: '付费',
              value: 3
            }
          ]
        }
      ]
    }
  },
  computed: {
    tag() {
      return this.$route.params.tag
    }
  },
  created() {
    this.getTagBookList()
  },
  methods: {
    getTagBookList() {
      const params = {
        tag: this.tag,
        ...this.$route.query
      }
      this.loading = true
      getTagBookList(params)
        .then(res => {
          this.list = res.data.map(item => {
            const temp = {
              path: this.$route.path,
              label: this.tag
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
      // 设定页面title
      this.$store.commit('app/SET_DATA', {
        metaTitle: `享阅·标签·${this.tag}`
      })
    }
  }
}
</script>
