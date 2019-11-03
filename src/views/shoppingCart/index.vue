<template>
  <el-row class="content-wrapper">
    <Sidebar />
    <el-row class="flex-content">
      <el-row
        v-loading="loading"
        class="list-page-wrapper"
      >
        <!-- header -->
        <el-row class="header">
          <!-- 标题 -->
          <el-col class="title no-wrap">{{ `购物车` }}</el-col>
          <!-- search -->
        </el-row>
        <ThinDivider />
        <!-- books -->
        <el-row class="books">
          <!-- table list -->
          <el-table
            :data="list"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              prop="name"
              label="书名"
            />
            <el-table-column
              prop="author"
              label="作者"
            />
            <el-table-column
              prop="score"
              label="积分"
              :formatter="(row, column, value, index) => row.discount === 1 ? row.discountScore : value"
            />
            <el-table-column
              width="220px"
            >
              <!-- header -->
              <template slot="header">
                <el-button
                  :disabled="!selectedRows.length"
                  size="mini"
                  type="primary"
                  @click="handleSettle"
                >结算</el-button>
                <el-button
                  :disabled="!selectedRows.length"
                  size="mini"
                  type="danger"
                  @click="handleDelete"
                >删除</el-button>
              </template>
              <!-- buttons -->
              <template slot-scope="scope">
                <!-- view -->
                <el-button
                  size="mini"
                  @click="handleView(scope.$index, scope.row)"
                >查看</el-button>
                <!-- delete -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { getShoppingCartList, shoppingCartSubtract, shoppingCartSettle } from '@/api/shoppingCart'
import Sidebar from '@/components/Sidebar'
import ThinDivider from '@/components/ThinDivider'
export default {
  name: 'ShoppingCart',
  components: {
    Sidebar,
    ThinDivider
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      list: [],
      total: 0,
      loading: false,
      // 删除
      deleteItem: {
        content: '' // 提示内容
      },
      // 结算
      settleItem: {
        content: ''
      },
      selectedRows: []
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getShoppingCartList()
  },
  methods: {
    // 获取购物车书籍列表
    getShoppingCartList() {
      this.loading = true
      getShoppingCartList()
        .then(res => {
          this.list = res.data
          this.loading = false
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '获取购物车列表失败')
          this.loading = false
        })
    },
    // 多选框
    handleSelectionChange(val) {
      this.selectedRows = val
    },
    // 结算
    handleSettle() {
      const uuids = this.selectedRows.map(item => item.uuid)
      this.settleItem.content = `确认计算吗？`

      this.$msgbox({
        title: '结算',
        message: this.settleItem.content,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            shoppingCartSettle({
              uuid: uuids
            })
              .then(res => {
                instance.confirmButtonLoading = false
                done()
                this.$message.success('操作成功')
                this.selectedRows = this.selectedRows.filter(item => !uuids.includes(item.uuid))

                this.getShoppingCartList()
                this.$store.dispatch('user/getInfo')
              })
              .catch(e => {
                console.log(e)
                instance.confirmButtonLoading = false
                done()
                this.$message.error(e.errorMsg || '操作失败')
              })
          } else {
            done()
          }
        }
      })
    },
    // 删除
    handleDelete(rowIndex, row) {
      let uuids = null
      if (!row) {
        uuids = this.selectedRows.map(item => item.uuid)
        this.deleteItem.content = `确认从购物车删除选中书籍吗？`
      } else {
        this.deleteItem.content = `确定从购物车删除《${row.name}》吗？`
      }

      this.$msgbox({
        title: '删除',
        message: this.deleteItem.content,
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            shoppingCartSubtract({
              uuid: uuids || row.uuid
            })
              .then(res => {
                instance.confirmButtonLoading = false
                done()
                this.$message.success('操作成功')
                // 去除已经删除成功的
                if (row) {
                  this.selectedRows = this.selectedRows.filter(item => item.uuid !== row.uuid)
                } else {
                  this.selectedRows = this.selectedRows.filter(item => !uuids.includes(item.uuid))
                }

                this.getShoppingCartList()
                this.$store.dispatch('user/getInfo')
              })
              .catch(e => {
                console.log(e)
                instance.confirmButtonLoading = false
                done()
                this.$message.error(e.errorMsg || '操作失败')
              })
          } else {
            done()
          }
        }
      })
    },
    // 查看
    handleView(rowIndex, row) {
      this.$router.push({ path: `/book/detail/${row.name}/${row.uuid}` })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.content-wrapper {
  .flex-content {
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
      }
      .books {
        // display: flex;
        // flex-wrap: wrap;
        min-height: calc(100vh - 294px);
        padding: 0 10px;
        overflow: auto;
      }
    }
  }
}
</style>
