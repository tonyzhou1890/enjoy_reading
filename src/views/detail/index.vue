<template>
  <el-row class="detail-wrapper">
    <!-- 面包屑 -->
    <MyBreadcrumb :breadcrumbs="breadcrumb" />
    <!-- 内容 -->
    <el-row class="detail-content-wrapper">
      <!-- 书籍信息 -->
      <el-col class="detail-content">
        <el-row class="detail-content-top">
          <!-- 封面 -->
          <el-col class="detail-cover-wrapper">
            <el-image
              v-if="detail.frontCoverPath"
              fit="fill"
              :src="`${storePrefix}${detail.frontCoverPath}`"
              class="detail-cover"
            />
            <DefaultCover
              v-else
              :width="294"
              :height="410"
              :text="detail.name"
            />
          </el-col>
          <!-- 书籍信息 -->
          <el-col class="detail-text-wrapper">
            <p class="name">{{ detail.name }}</p>
            <p>作者：{{ detail._author }}</p>
            <p>书号：{{ detail.ISBN }}</p>
            <p>上架时间：{{ detail._createTime }}</p>
            <p>书籍大小：{{ detail.bookSize }}K</p>
            <p>
              <span
                class="score"
              >{{ detail.free ? '免费' : detail.discount ? detail.discountScore + scoreUnit : detail.score + scoreUnit }}</span>
              <span
                v-if="!(detail.free || !detail.discount)"
                class="old-score"
              >{{ detail.score + scoreUnit }}</span>
            </p>
            <p>标签：
              <span
                v-for="(item, index) in detail._tag"
                :key="index"
              >
                <router-link
                  :to="{ path: `/tag/${item}` }"
                  class="detail-tag-item"
                >
                  {{ item }}
                </router-link>
                <span
                  v-if="index !== detail._tag.length - 1"
                >、</span>
              </span>
            </p>
            <p class="detail-action">
              <el-button
                v-if="!detail.has && !detail.free && !inShoppingCart()"
                type="primary"
                :loading="buyLoading"
                @click="handleBuy"
              >立即购买</el-button>
              <el-button
                v-if="!detail.has && !detail.free"
                :disabled="inShoppingCart()"
                :loading="addShoppingCartLoading"
                @click="handleAddShoppingCart"
              >
                {{ inShoppingCart() ? '已在购物车': '加入购物车' }}
              </el-button>
              <el-button
                v-if="detail.has || detail.free"
                type="primary"
                @click="handleRead"
              >阅读</el-button>
            </p>
          </el-col>
        </el-row>
        <!-- 简介 -->
        <el-row class="detail-summary-wrapper">
          <p>简介：</p>
          <p class="detail-summary">{{ detail.summary || '暂无' }}</p>
        </el-row>
      </el-col>
      <!-- 推荐书籍 -->
      <el-col class="detail-recommend-wrapper">
        <p class="detail-recommend-text">推荐书籍</p>
        <ListBook
          v-for="(item, index) in recommend"
          :key="index"
          :book="item"
          class="detail-recommend-book"
        />
        <Empty
          v-if="recommend.length === 0"
        />
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
import { getBookDetail, getBookRecommend } from '@/api/detail'
import { shoppingCartAdd, shoppingCartSettle } from '@/api/shoppingCart'
import { Message, MessageBox } from 'element-ui'
import MyBreadcrumb from './components/MyBreadcrumb'
import DefaultCover from '@/components/DefaultCover'
import ListBook from '@/components/ListBook'
import Empty from '@/components/Empty'
export default {
  name: 'Detail',
  components: {
    MyBreadcrumb,
    DefaultCover,
    ListBook,
    Empty
  },
  data() {
    return {
      name: '', // 书籍名称
      uuid: '', // 书籍uuid
      loading: false, // 页面加载
      detail: {}, // 书籍详情
      recommend: [], // 推荐书籍
      parent: null, // 父级面包屑
      breadcrumb: [], // 面包屑
      storePrefix: this.$store.state.app.storePrefix, // 静态资源地址
      scoreUnit: this.$store.state.app.scoreUnit, // 积分单位
      buyLoading: false, // 立即购买按钮loading
      addShoppingCartLoading: false // 加入购物车loading
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.resolvePath()
    this.getBookDetail()
    this.getBookRecommend()
  },
  methods: {
    // 解析url路径参数
    resolvePath() {
      this.name = this.$route.params.name
      this.uuid = this.$route.params.uuid
      // 第一个是首页
      const breadcrumb = [
        {
          label: '首页',
          path: '/'
        }
      ]
      // 尝试解析父级--第二个
      if (this.$route.query.parent) {
        let parent = null
        try {
          parent = decodeURIComponent(this.$route.query.parent)
          parent = JSON.parse(parent)
        } catch (e) {
          console.error(e)
        }
        if (parent && Object.keys(parent).length) {
          this.parent = parent
          breadcrumb.push({
            label: parent.label,
            path: parent.path
          })
        }
      }
      // 当前页
      breadcrumb.push({
        label: this.name
      })
      this.breadcrumb = breadcrumb
    },
    // 获取书籍详情
    getBookDetail() {
      this.loading = true
      getBookDetail({
        uuid: this.uuid
      })
        .then(res => {
          // 处理数据
          res.data._author = res.data.author ? res.data.author.replace(/,/g, '、') : ''
          res.data._createTime = res.data.createTime ? res.data.createTime.split(' ')[0] : ''
          res.data._tag = res.data.tag ? res.data.tag.split(',') : []
          this.detail = res.data
          // 如果页面路径不含parent信息，则用书籍第一个标签作为parent
          if (!this.parent) {
            this.parent = {
              path: '/tag/' + res.data.tag.split(',')[0],
              label: res.data.tag.split(',')[0]
            }
            const temp = JSON.parse(JSON.stringify(this.breadcrumb))
            temp.splice(1, 0, this.parent)
            this.breadcrumb = temp
          }
          this.loading = false
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取书籍详情失败')
          this.loading = false
        })
    },
    // 获取推荐书籍
    getBookRecommend() {
      getBookRecommend({
        uuid: this.uuid
      })
        .then(res => {
          this.recommend = res.data.map(item => {
            item.path = `/book/detail/${item.name}/${item.uuid}`
            return item
          })
        })
        .catch(e => {
          Message.error(e.errorMsg || '获取推荐书籍失败')
        })
    },
    // 处理立即购买
    handleBuy() {
      // 如果另一个按钮loading，也不处理
      if (this.addShoppingCartLoading) return

      if (!this.userInfo) {
        this.handleNotLogin()
      } else {
        // 弹框确认
        this.$confirm(`确定购买《${this.name}》吗？`, '提示', {
          confirmButtonText: '购买',
          cancelButtonText: '取消',
          type: 'info'
        })
          .then(() => { // 确定购买
            this.buyLoading = true
            shoppingCartSettle({
              uuid: this.uuid,
              buy: true
            })
              .then(res => {
                this.buyLoading = false
                this.$message.success('购买成功')
                this.detail.has = 1
              })
              .catch(e => {
                this.buyLoading = false
                this.$message.error(e.errorMsg || '购买失败')
              })
          })
          .catch(() => {
            console.log('取消')
          })
      }
      console.log('buy')
    },
    // 处理加入购物车
    handleAddShoppingCart() {
      // 如果另一个按钮loading，也不处理
      if (this.buyLoading) return

      if (!this.userInfo) {
        this.handleNotLogin()
      } else {
        this.addShoppingCartLoading = true
        shoppingCartAdd({
          uuid: this.detail.uuid
        })
          .then(res => {
            this.$store.dispatch('user/getInfo')
              .then(infoRes => {
                this.addShoppingCartLoading = false
                this.$message.success('加入购物车成功')
              })
              .catch(e => {
                this.$message.error(e.errorMsg || '获取用户信息失败')
                this.addShoppingCartLoading = false
              })
          })
          .catch(e => {
            this.$message.error(e.errorMsg || '加入购物车失败')
            this.addShoppingCartLoading = false
          })
      }
    },
    // 处理阅读
    handleRead() {
      console.log('read')
    },
    // 处理未登录
    handleNotLogin() {
      MessageBox.confirm('你尚未登录, 是否登录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        window.open(`${this.$store.state.app.registerPrefix}/#/?from=${encodeURI(window.location.href)}`)
      }).catch(() => {
        console.log('cancel')
      })
    },
    // 书籍是否在购物车中
    inShoppingCart() {
      const temp = this.detail && this.userInfo && this.userInfo.shoppingCart && this.userInfo.shoppingCart.includes(this.detail.uuid)
      return Boolean(temp)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.detail-wrapper {
  padding: 50px 20px 0;
  .detail-content-wrapper {
    padding: 15px 0 0 0;
    display: flex;
    .detail-content {
      flex: 1;
      .detail-content-top {
        display: flex;
        .detail-cover-wrapper {
          width: 300px;
          .detail-cover {
            width: 294px;
            height: 410px;
          }
        }
        .detail-text-wrapper {
          flex: 1;
          padding-left: 64px;
          color: @gray;
          .name {
            font-size: 28px;
            font-weight: bold;
            color: #333;
          }
          p {
            .score {
              color: #333;
            }
            .old-score {
              text-decoration: line-through;
            }
            .detail-tag-item {
              &:hover {
                color: @primary;
              }
            }
          }
        }
      }
      .detail-summary-wrapper {
        padding: 10px 40px 0;
        .detail-summary {
          text-indent: 2em;
        }
      }
    }
    .detail-recommend-wrapper {
      width: 210px;
      .detail-recommend-text {
        font-size: 20px;
      }
      .detail-recommend-book {
        padding: 10px 25px;
      }
    }
  }
}
</style>
