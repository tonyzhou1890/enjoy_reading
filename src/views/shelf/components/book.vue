<template>
  <el-row class="book-wrapper fl">
    <!-- 封面 -->
    <el-row class="book-cover-wrapper">
      <el-image
        v-if="book.frontCoverPath"
        fit="fill"
        class="book-cover"
        :src="storePrefix + book.frontCoverPath"
        :title="book.name"
      />
      <DefaultCover
        v-else
        :text="book.name"
        :title="book.name"
      />
    </el-row>
    <!-- 信息 -->
    <el-row class="book-info-wrapper">
      <p :title="book.name" class="no-wrap name">{{ book.name }}</p>
      <p class="no-wrap author">{{ book.author }}</p>
      <p class="no-wrap time">上次阅读：{{ book.updateTime.split(' ')[0] }}</p>
      <p class="no-wrap time">阅读进度：{{ showReadingPercent(book.percent) }}</p>
      <el-row class="action">
        <el-button
          type="primary"
          size="small"
          @click="read(book)"
        >阅读</el-button>
        <el-button
          v-if="!book.onShelf"
          :loading="subtractLoading"
          type="success"
          size="small"
          @click="subtractShelf(book)"
        >移除</el-button>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { readingInfoUpdate } from '@/api/book'
import DefaultCover from '@/components/DefaultCover'
export default {
  name: 'StoreBook',
  components: {
    DefaultCover
  },
  props: {
    book: {
      required: true,
      type: [Object, String]
    },
    getBookList: {
      required: true,
      type: Function
    }
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      scoreUnit: this.$store.state.app.scoreUnit,
      readLoading: false,
      subtractLoading: false
    }
  },
  methods: {
    read(book) {
      console.log(book)
    },
    subtractShelf(book) {
      this.subtractLoading = true
      readingInfoUpdate({
        uuid: book.uuid,
        onShelf: 0
      })
        .then(res => {
          this.$message.success('成功从书架移除')
          this.subtractLoading = false
          this.getBookList()
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '操作失败')
          this.subtractLoading = false
        })
    },
    showReadingPercent(percent) {
      if (!percent) {
        return '未开始'
      }
      if (percent >= 100) {
        return '已读完'
      }
      return `${percent}%`
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.book-wrapper {
  padding: 10px 0px;
  padding-bottom: 25px;
  // width: 160px;
  width: 50%;
  overflow: hidden;
  display: flex;
  .book-cover-wrapper {
    width: 140px;
  }
  .book-cover {
    width: 100%;
    height: 198px;
    background-color: @lightgray;
    display: flex;
    justify-content: center;
    align-items: center;
    .no-book-logo {
      font-size: 40px;
      color: @primary;
    }
  }
  .book-info-wrapper {
    flex: 1;
    color: @gray;
    padding: 0 16px;
  }
  .name {
    font-size: 16px;
    // line-height: 18px;
    margin-top: 5px;
    color: #333;
    // &:hover {
    //   color: @primary;
    // }
  }
  .score, .old-score {
    font-size: 14px;
  }
  .old-score {
    padding-left: 10px;
    color: @gray;
    text-decoration: line-through;
  }
}
</style>
