<template>
  <el-row class="content-wrapper">
    <Sidebar />
    <el-row class="flex-content">
      <el-row class="avatar-wrapper">
        <el-avatar
          class="fl"
          shape="circle"
          :size="70"
          :src="storePrefix + userInfo.avatar"
        />
        <el-col
          class="user-nickname fl"
        >
          {{ userInfo.nickname }}
        </el-col>
      </el-row>
      <el-row class="info-wrapper">
        <el-row class="info-item">
          <span class="info-item-label">入驻日期：</span>
          <span class="info-item-value">{{ userInfo.createTime.split(' ')[0] }}</span>
        </el-row>
        <el-row class="info-item">
          <span class="info-item-label">积分：</span>
          <span class="info-item-value">{{ userInfo.score }}</span>
        </el-row>
        <el-row class="info-item">
          <span class="info-item-label">空间容量：</span>
          <span class="info-item-value">{{ `${(userInfo.privateSpace + userInfo.storeSpace).toFixed(0)}/${userInfo.totalSpace}(Mb)` }}</span>
        </el-row>
        <el-row class="info-item">
          <span class="info-item-label">个人空间：</span>
          <span class="info-item-value">{{ `${userInfo.privateSpace}(Mb)` }}</span>
        </el-row>
        <el-row class="info-item">
          <span class="info-item-label">公共空间：</span>
          <span class="info-item-value">{{ `${userInfo.storeSpace}(Mb)` }}</span>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import Sidebar from '@/components/Sidebar'
export default {
  name: 'BaseInfo',
  components: {
    Sidebar
  },
  data() {
    return {
      storePrefix: this.$store.state.app.storePrefix
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.content-wrapper {
  .flex-content {
    padding: 33px 72px;
    .avatar-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 40px;
      .user-nickname {
        padding-left: 20px;
        font-size: 40px;
        color: @gray;
      }
    }
    .info-wrapper {
      font-size: 20px;
      line-height: 54px;
    }
  }
}
</style>
