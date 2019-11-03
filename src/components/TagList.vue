<template>
  <el-row
    class="tag-list-wrapper"
  >
    <el-row
      class="tag-list-header no-wrap"
    >图书标签：</el-row>
    <el-input
      v-model="filter"
      placeholder="筛选标签"
      clearable
      size="small"
      class="tag-list-filter-input"
    />
    <el-row
      v-for="(item, index) in filterTagList"
      :key="index"
      :class="[curTag === item.tag ? 'checked' : '', 'tag-item']"
      :title="item.tag"
    >
      <router-link
        :to="{ path: `/tag/${item.tag}` }"
      >
        <p
          class="no-wrap"
        >{{ item.tag }}</p>
      </router-link>
    </el-row>
    <Empty
      v-if="filterTagList.length === 0"
    />
  </el-row>
</template>

<script>
import { getTagList } from '@/api/home'
import Empty from '@/components/Empty'
import { Message } from 'element-ui'
export default {
  name: 'TagList',
  components: {
    Empty
  },
  data() {
    return {
      tagList: [],
      filter: ''
    }
  },
  computed: {
    // 筛选过的列表
    filterTagList() {
      // return this.tagList.filter(item => item.tag.includes(this.filter))
      return this.$store.state.app.tagList.filter(item => item.tag.includes(this.filter))
    },
    // 当前列表
    curTag() {
      return this.$route.params && this.$route.params.tag || ''
    }
  },
  created() {
    // this.getTagList()
  },
  methods: {
    // 获取标签列表
    getTagList() {
      getTagList()
        .then(res => {
          Array.isArray(res.data) ? this.tagList = res.data : []
        })
        .catch(e => {
          Message.error('获取标签列表失败')
        })
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
