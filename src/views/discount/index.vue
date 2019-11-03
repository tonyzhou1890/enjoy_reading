<template>
  <el-row class="content-wrapper">
    <TagList />
    <el-row v-loading="loading" class="flex-content">
      <ListPage
        :books="list"
        :search-list="select"
        :title="`打折书籍`"
        :total="total"
      />
    </el-row>
  </el-row>
</template>

<script>
import TagList from '@/components/TagList'
import ListPage from '@/components/ListPage'
import { getDiscountList } from '@/api/home'
import { Message } from 'element-ui'
export default {
  name: 'Discount',
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
          key: 'sort',
          value: this.$route.query.sort || 1,
          label: '排序',
          list: [
            {
              label: '默认',
              value: 1
            },
            {
              label: '价格由低到高',
              value: 2
            },
            {
              label: '价格由高到低',
              value: 3
            }
          ]
        }
      ]
    }
  },
  created() {
    this.getDiscountList()
  },
  methods: {
    getDiscountList() {
      const params = {
        ...this.$route.query
      }
      this.loading = true
      getDiscountList(params)
        .then(res => {
          this.list = res.data.map(item => {
            const temp = {
              path: '/discount',
              label: '打折书籍'
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
