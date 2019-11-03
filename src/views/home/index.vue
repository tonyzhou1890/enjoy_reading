<template>
  <div class="home content-wrapper">
    <TagList />
    <el-row class="flex-content">
      <!-- 头部--banner/通知 -->
      <el-row
        ref="homeHeader"
        class="home-header"
        :style="{ height: homeHeaderHeight }"
      >
        <!-- banner -->
        <el-carousel
          :height="homeHeaderHeight"
          class="banner-wrapper"
        >
          <el-carousel-item
            v-for="(item, index) in bannerList"
            :key="index"
            style="height: 100%;"
          >
            <router-link
              v-if="item.href"
              :to="item.href"
            >
              <el-image
                :title="item.title"
                :src="storePrefix + item.image"
                fit="fill"
                class="banner-item"
              />
            </router-link>
            <el-image
              v-else
              :title="item.title"
              :src="storePrefix + item.image"
              fit="fill"
              class="banner-item"
            />
          </el-carousel-item>
          <el-carousel-item
            v-if="bannerList.length === 0"
            class="banner-logo-wrapper"
          >
            <svg-icon
              icon-class="enjoy_reading logo"
              class-name="banner-logo"
            />
          </el-carousel-item>
        </el-carousel>
        <!-- 通知 -->
        <el-row
          class="latest-info"
        >
          <h3>最新通知：</h3>
          <p>本网站只是个人练习用的……</p>
        </el-row>
      </el-row>
      <!-- 内容 -->
      <el-row class="main-content">
        <!-- 最新书籍 -->
        <Books
          text="最新上架"
          path="/latest"
          :books="latestList"
        />
        <!-- 打折书籍 -->
        <Books
          text="打折书籍"
          path="/discount"
          :books="discountList"
        />
        <!-- 免费书籍 -->
        <Books
          text="免费书籍"
          path="/free"
          :books="freeList"
        />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { maxWidth } from '@/style/variables.less'
import { getBannerList, getLatestList, getDiscountList, getFreeList } from '@/api/home'
import { Message } from 'element-ui'
import TagList from '@/components/TagList'
import Books from './components/Books'
export default {
  name: 'Home',
  components: {
    TagList,
    Books
  },
  data() {
    return {
      bannerList: [],
      latestList: [],
      discountList: [],
      freeList: [],
      storePrefix: this.$store.state.app.storePrefix
    }
  },
  computed: {
    // banner&通知区域 高度
    homeHeaderHeight() {
      const coreWidth = this.$store.state.app.width
      let height = 400
      const maxWidthNumber = Number(maxWidth.split('px')[0])
      const ratio = height / (maxWidthNumber - 190 * 2)
      height = (coreWidth - 190 * 2) * ratio
      return height + 'px'
    }
  },
  created() {
    this.getBannerList()
    this.getLatestList()
    this.getDiscountList()
    this.getFreeList()
  },
  methods: {
    // 获取banner
    getBannerList() {
      getBannerList()
        .then(res => {
          this.bannerList = res.data
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取banner失败')
        })
    },
    // 获取最新书籍列表
    getLatestList() {
      getLatestList({
        rows: 10
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(14).fill('')).slice(0, 14)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/latest',
                label: '最新上架'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.latestList = temp
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取最新书籍失败')
        })
    },
    // 获取打折书籍列表
    getDiscountList() {
      getDiscountList({
        rows: 10
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(14).fill('')).slice(0, 14)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/discount',
                label: '打折书籍'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.discountList = temp
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取打折书籍失败')
        })
    },
    // 获取免费书籍列表
    getFreeList() {
      getFreeList({
        rows: 10
      })
        .then(res => {
          let temp = Array.isArray(res.data) ? res.data : []
          temp = temp.concat(new Array(14).fill('')).slice(0, 14)
          temp.map(item => {
            if (item) {
              const temp = {
                path: '/free',
                label: '免费书籍'
              }
              item.path = `/book/detail/${item.name}/${item.uuid}?parent=${encodeURIComponent(JSON.stringify(temp))}`
            }
          })
          this.freeList = temp
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取免费书籍失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.home {
  display: flex;
  .flex-content {
    .home-header {
      width: 100%;
      display: flex;
      .banner-wrapper, .banner-item {
        width: calc(100% - 190px);
        height: 100%;
      }
      .banner-item {
        width: 100%;
      }
      .banner-logo-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: @lightgray;
        .banner-logo {
          font-size: 150px;
          color: gray;
        }
      }
      .latest-info {
        padding: 0 10px;
        width: 190px;
        overflow: auto;
        background-color: #fff;
      }
    }
  }
}
</style>
