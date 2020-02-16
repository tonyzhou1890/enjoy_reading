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
          <el-col class="title no-wrap">{{ `积分记录` }}</el-col>
          <!-- search -->
          <el-col class="search-area">
            <!-- 位置搜索 -->
            <el-col
              class="search-wrapper"
            >
              <span class="search-label">筛选：</span>
              <el-select
                size="small"
                :value="searchParams.filter"
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
          </el-col>
        </el-row>
        <ThinDivider />
        <!-- record -->
        <el-row class="record">
          <el-table
            :data="list"
          >
            <el-table-column
              prop="score"
              label="积分"
              :formatter="(row, column, value, index) => {
                if (value > 0) {
                  return `+${value}`
                } else {
                  return value
                }
              }"
            />
            <el-table-column
              prop="way"
              label="项目"
            />
            <el-table-column
              prop="totalScore"
              label="余额"
            />
            <el-table-column
              prop="createTime"
              label="时间"
            />
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
  </el-row>
</template>

<script>
import { getScoreRecord } from '@/api/scoreRecord'
import Sidebar from '@/components/Sidebar'
import ThinDivider from '@/components/ThinDivider'
export default {
  name: 'ScoreRecord',
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
      filterList: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '获取',
          value: 2
        },
        {
          label: '消费',
          value: 3
        }
      ],
      searchParams: {
        filter: 1
      },
      rows: 10,
      page: 1
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  },
  created() {
    this.getScoreRecord()
  },
  methods: {
    // 获取积分记录列表
    getScoreRecord(params = {}) {
      this.loading = true
      getScoreRecord({
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
          this.searchParams.filter = params.filter === undefined ? this.searchParams.filter : params.filter
        })
        .catch(e => {
          this.$message.error(e.errorMsg || '获取积分记录失败')
          this.loading = false
        })
    },
    // 筛选过滤
    selectChange(val) {
      this.getScoreRecord({ filter: val, page: 1 })
    },
    // 页码变化
    handleCurrentChange(val) {
      console.log(val)
      this.getScoreRecord({ page: val })
    },
    // 每页数量变化
    handleSizeChange(val) {
      console.log(val)
      this.getScoreRecord({ rows: val })
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.content-wrapper {
  .flex-content {
    overflow: hidden;
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
      .record {
        min-height: calc(100vh - 294px);
        padding: 10px;
        overflow: auto;
      }
      .pagination-wrapper {
        text-align: right;
      }
    }
  }
}
</style>
