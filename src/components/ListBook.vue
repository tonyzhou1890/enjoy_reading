<template>
  <el-row class="book-wrapper">
    <router-link
      v-if="book"
      :to="{ path: book.path }"
    >
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
    </router-link>
    <el-row
      v-else
      class="book-cover"
    >
      <svg-icon icon-class="enjoy_reading logo" class="no-book-logo" />
    </el-row>
    <router-link
      :to="{ path: book.path }"
    >
      <p class="name">{{ book && book.name }}</p>
    </router-link>
    <p class="no-wrap author">{{ book && book.author }}</p>
    <p v-if="book" class="no-wrap">
      <span
        class="score"
      >{{ book.free ? '免费' : book.discount ? book.discountScore + scoreUnit : book.score + scoreUnit }}</span>
      <span
        v-if="!(book.free || !book.discount)"
        class="old-score"
      >{{ book.score + scoreUnit }}</span>
    </p>
  </el-row>
</template>

<script>
import DefaultCover from '@/components/DefaultCover'
export default {
  name: 'ListBook',
  components: {
    DefaultCover
  },
  props: {
    book: {
      required: true,
      type: [Object, String]
    }
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      scoreUnit: this.$store.state.app.scoreUnit
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.book-wrapper {
  padding: 10px 42px;
  padding-bottom: 25px;
  // width: 160px;
  width: 224px;
  height: 375px;
  overflow: hidden;
  .book-cover {
    width: 140px;
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
  .name {
    font-size: 16px;
    line-height: 18px;
    height: 36px;
    overflow: hidden;
    word-break: break-all;
    &:hover {
      color: @primary;
    }
  }
  .author {
    font-size: 14px;
    color: @gray;
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
