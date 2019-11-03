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
          <el-col class="title no-wrap">{{ `书库(${total})` }}</el-col>
          <!-- search -->
          <el-col class="search-area">
            <!-- 位置搜索 -->
            <el-col
              class="search-wrapper"
            >
              <span class="search-label">筛选：</span>
              <el-select
                size="small"
                :value="searchParams.position"
                class="search-field"
                @change="(val) => selectChange(val)"
              >
                <el-option
                  v-for="(option, optionIndex) in filterList"
                  :key="optionIndex"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-col>
            <!-- 书名搜索 -->
            <el-col
              class="search-wrapper"
            >
              <span class="search-label">搜索：</span>
              <el-input
                v-model="searchParams.keyword"
                placeholder="请输入书名"
                size="small"
                class="search-field"
                @keypress.enter.native="getStoreList"
              />
            </el-col>
          </el-col>
        </el-row>
        <ThinDivider />
        <!-- books -->
        <el-row class="books">
          <!-- 使用空间 -->
          <el-row class="progress">
            <el-progress
              :text-inside="true"
              :stroke-width="26"
              :percentage="(userInfo.privateSpace + userInfo.storeSpace).toFixed(0) / userInfo.totalSpace * 100"
              class="progress-bar"
            />
            <span class="space-info">
              {{ `${(userInfo.privateSpace + userInfo.storeSpace).toFixed(0)}/${userInfo.totalSpace}M(个人空间：${userInfo.privateSpace}M，书城：${userInfo.storeSpace}M)` }}
            </span>
          </el-row>
          <!-- table list -->
          <el-table
            :data="list"
          >
            <el-table-column
              prop="name"
              label="书名"
            />
            <el-table-column
              prop="position"
              label="位置"
              :formatter="(row, column, value, index) => value === 1 ? '个人空间' : '书城'"
            />
            <el-table-column
              prop="author"
              label="作者"
            />
            <el-table-column
              prop="bookSize"
              label="大小"
              :formatter="(row, column, value, index) => `${value}K`"
            />
            <el-table-column
              prop="createTime"
              label="时间"
            />
            <el-table-column
              width="220px"
            >
              <!-- header -->
              <template slot="header">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleCreate"
                >新增</el-button>
              </template>
              <!-- buttons -->
              <template slot-scope="scope">
                <!-- view -->
                <el-button
                  size="mini"
                  @click="handleView(scope.$index, scope.row)"
                >查看</el-button>
                <!-- edit -->
                <el-button
                  size="mini"
                  :loading="createItem.loading && createItem.rowIndex === scope.$index"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <!-- delete -->
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >{{ scope.row.position === 1 ? '删除' : '禁用' }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!-- pagination -->
        <el-row class="pagination-wrapper">
          <el-pagination
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="rows"
            :current-page="page"
            background
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </el-row>
      </el-row>
    </el-row>
    <!-- 新增/编辑对话框 -->
    <Add
      v-if="createItem.visible"
      ref="dialog"
      :visible="createItem.visible"
      :title="createItem.title"
      :cancel="cancel"
      :save="save"
      :loading="createItem.saveLoading"
    />
    <!-- 查看对话框 -->
    <ViewModel
      v-if="viewItem.visible"
      ref="viewDialog"
      :visible="viewItem.visible"
      :title="viewItem.title"
      :cancel="cancelView"
    />
  </el-row>
</template>

<script>
import { getSpaceBookList, spaceBookCreateOrUpdate, spaceBookDelete } from '@/api/space'
import Sidebar from '@/components/Sidebar'
import ThinDivider from '@/components/ThinDivider'
import Add from './components/add'
import ViewModel from './components/view'
export default {
  name: 'Space',
  components: {
    Sidebar,
    ThinDivider,
    Add,
    ViewModel
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix,
      list: [],
      total: 0,
      loading: false,
      filterList: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '个人空间',
          value: 1
        },
        {
          label: '书城',
          value: 2
        }
      ],
      searchParams: {
        keyword: '',
        position: 0
      },
      rows: 10,
      page: 1,
      // 新增
      createItem: {
        visible: false, // dialog 可见
        loading: false, // 编辑按钮 loading
        saveLoading: false, // dialog 保存 loading
        rowIndex: 0, // 当前行
        title: '' // dialog 标题
      },
      // 删除
      deleteItem: {
        loading: false, // 提示弹窗loading
        content: '' // 提示内容
      },
      // 查看
      viewItem: {
        visible: false,
        title: '查看'
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getSpaceBookList()
  },
  methods: {
    // 计算使用的空间
    calcUsedSpace() {

    },
    // 获取书库书籍列表
    getSpaceBookList(params = {}) {
      this.loading = true
      getSpaceBookList({
        ...this.searchParams,
        page: this.page,
        rows: this.rows,
        ...params
      })
        .then(res => {
          this.total = res.total
          this.list = res.data
          this.loading = false
          this.page = params.page || this.page
          this.rows = params.rows || this.rows
          this.searchParams.position = params.position === undefined ? this.searchParams.position : params.position
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '获取书籍列表失败')
          this.loading = false
        })
    },
    // 筛选过滤
    selectChange(val) {
      this.getSpaceBookList({ position: val, page: 1 })
    },
    // 页码变化
    handleCurrentChange(val) {
      this.getSpaceBookList({ page: val })
    },
    // 每页数量变化
    handleSizeChange(val) {
      this.getSpaceBookList({ rows: val })
    },
    // 新增
    handleCreate() {
      this.createItem = {
        ...this.createItem,
        title: '新增',
        visible: true
      }
      this.$nextTick(() => {
        if (this.$refs.dialog) {
          this.$refs.dialog.setData()
          this.$refs.dialog.clearValidate()
        }
      })
    },
    // 编辑
    handleEdit(rowIndex, row) {
      const temp = JSON.parse(JSON.stringify(row))
      temp.frontCover = temp.frontCoverPath ? [{
        name: 'frontCover',
        id: Date.now(),
        url: this.storePrefix + temp.frontCoverPath
      }] : []
      temp.backCover = temp.backCoverPath ? [{
        name: 'backCover',
        id: Date.now(),
        url: this.storePrefix + temp.backCoverPath
      }] : []
      temp.text = temp.textPath ? [{
        name: temp.name,
        id: Date.now(),
        url: temp.textPath
      }] : []
      temp.author = temp.author.split(',')
      temp.tag = temp.tag.split(',')
      this.createItem = {
        ...this.createItem,
        title: '编辑',
        rowIndex: rowIndex,
        visible: true
      }
      this.$nextTick(() => {
        this.$refs.dialog.setData(temp)
      })
    },
    // 新增/编辑保存
    save(item) {
      // 处理数据
      item.frontCover = item.frontCover[0] ? item.frontCover[0].url.replace(this.storePrefix, '') : ''
      item.backCover = item.backCover[0] ? item.backCover[0].url.replace(this.storePrefix, '') : ''
      item.text = item.text[0].url

      this.createItem.saveLoading = true

      spaceBookCreateOrUpdate(item)
        .then(res => {
          this.createItem.saveLoading = false
          this.createItem.visible = false
          this.createItem = {
            ...this.createItem,
            saveLoading: false,
            visible: false
          }
          // if (this.$refs.dialog) {
          //   this.$refs.dialog.resetForm()
          //   this.$refs.dialog.setData()
          // }

          this.$message.success(item.uuid ? '编辑书籍成功' : '新增书籍成功')
          this.getSpaceBookList()
          this.$store.dispatch('user/getInfo')
        })
        .catch(e => {
          console.log(e)
          this.createItem.saveLoading = false
          this.$message.error(e.errorMsg || (item.uuid ? '编辑书籍失败' : '新增书籍失败'))
        })
    },
    // 取消
    cancel() {
      this.createItem.visible = false
      // if (this.$refs.dialog) {
      //   this.$refs.dialog.setData()
      // }
    },
    // 删除
    handleDelete(rowIndex, row) {
      if (row.position === 1) {
        this.deleteItem.content = `确定删除《${row.name}》吗？`
      } else {
        this.deleteItem.content = `确定禁用《${row.name}吗？禁用后，书城将不展示此书，但占用空间不会释放，已经拥有此书的读者依然会拥有此书。》`
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
            spaceBookDelete({
              uuid: row.uuid
            })
              .then(res => {
                instance.confirmButtonLoading = false
                done()
                this.$message.success('操作成功')
                if (this.list.length === 1 && this.page > 1) {
                  this.getSpaceBookList({
                    page: this.page - 1
                  })
                } else {
                  this.getSpaceBookList()
                }

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
      const temp = JSON.parse(JSON.stringify(row))
      temp.frontCoverPath = temp.frontCoverPath ? this.storePrefix + temp.frontCoverPath : ''
      temp.backCoverPath = temp.backCoverPath ? this.storePrefix + temp.backCoverPath : ''
      temp.text = temp.textPath ? [{
        name: temp.name,
        id: Date.now(),
        url: temp.textPath
      }] : []
      temp.author = temp.author.split(',')
      temp.tag = temp.tag.split(',')
      this.viewItem = {
        ...this.viewItem,
        visible: true
      }
      this.$nextTick(() => {
        this.$refs.viewDialog.setData(temp)
      })
    },
    // 取消查看
    cancelView() {
      this.viewItem.visible = false
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
        .search-area {
          text-align: right;
          min-width: 480px;
          padding-right: 10px;
          .search-wrapper {
            float: right;
            width: auto;
            padding-left: 10px;
            .search-field {
              width: 150px;
            }
            .search-label {
              vertical-align: bottom;
              line-height: 32px;
            }
          }
        }
      }
      .books {
        // display: flex;
        // flex-wrap: wrap;
        min-height: calc(100vh - 294px);
        padding: 0 10px;
        overflow: auto;
        .progress {
          padding-bottom: 10px;
          .progress-bar {
            width: 350px;
            display: inline-block;
          }
          .space-info {
            line-height: 26px;
            display: inline-block;
            color: @primary;
          }
        }
      }
      .pagination-wrapper {
        text-align: right;
      }
    }
  }
}
</style>
