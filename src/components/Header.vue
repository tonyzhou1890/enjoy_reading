<template>
  <el-row
    class="wrapper"
  >
    <!-- logo -->
    <el-col
      class="logo-wrapper"
    >
      <router-link :to="{ path: '/' }">
        <el-image
          class="logo"
          :src="logo"
          fit="fill"
        />
      </router-link>
    </el-col>

    <!-- search -->
    <el-col
      class="search-wrapper"
    >
      <el-input
        v-model="keyword"
        placeholder="请输入书名"
        class="search-input"
        @keypress.enter.native="toSearch"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          :disabled="!keyword"
          @click="toSearch"
        />
      </el-input>
    </el-col>

    <!-- userInfo -->
    <!-- 已登录 -->
    <el-col
      v-if="userInfo"
      class="has-login-wrapper"
    >
      <router-link
        :to="{ path: '/baseInfo' }"
      >
        <el-avatar
          class="fl"
          shape="circle"
          :size="70"
          :src="storePrefix + userInfo.avatar"
        />
      </router-link>
      <router-link
        :to="{ path: '/baseInfo' }"
      >
        <el-col
          class="user-nickname fl"
        >
          {{ userInfo.nickname }}
        </el-col>
      </router-link>
      <el-dropdown class="dropdown">
        <span class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="handleLogout"
          >退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </el-col>
    <!-- 未登录 -->
    <el-col
      v-else
      class="not-login-wrapper"
    >
      <a
        :href="registerHrefPrefix + '/#/?from=' + fullPath"
        target="_blank"
      >登录</a>
      /
      <a
        :href="registerHrefPrefix + '/#/?to=register'"
        target="_blank"
      >注册</a>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      logo: require('@/assets/logo.png'),
      keyword: '',
      registerHrefPrefix: this.$store.state.app.registerPrefix,
      storePrefix: this.$store.state.app.storePrefix
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.userInfo
    },
    fullPath() {
      return encodeURI(window.location.href) || encodeURI(this.$route.fullPath)
    }
  },
  methods: {
    toSearch() {
      if (this.keyword) {
        this.$router.push({ path: `/search/${this.keyword}` })
      }
    },
    handleLogout() {
      console.log('logout')
      this.$store.dispatch('user/logout')
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');
.wrapper {
  width: 100%;
  height: 130px;
  position: relative;
  .logo-wrapper {
    width: auto;
    position: absolute;
    left: 0;
    top: 24px;
    .logo {
      width: 295px;
      height: 110px;
    }
    @media screen and (max-width: 1140px) {
      top: 35px;
      .logo {
        width: 200px;
        height: 74px;
      }
    }
  }
  .search-wrapper {
    width: 38.4%;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    top: 50px;
    .search-input {
      /deep/ .el-input__inner {
        border-bottom-left-radius: 20px;
        border-top-left-radius: 20px;
      }
      /deep/ .el-input-group__append {
        border-top-right-radius: 20px;
        border-bottom-right-radius: 20px;
        overflow: hidden;
      }
    }
  }
  .has-login-wrapper, .not-login-wrapper {
    width: 240px;
    height: 70px;
    position: absolute;
    top: 40px;
    right: 0;
  }
  .has-login-wrapper {
    .user-nickname {
      width: 125px;
      padding: 0 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 70px;
      font-size: 40px;
      color: @gray;
    }
    .dropdown {
      margin-top: 27px;
    }
    .el-dropdown-link {
      cursor: pointer;
    }
  }
  .not-login-wrapper {
    font-size: 38px;
    line-height: 70px;
    text-align: center;
    color: @gray;
    a {
      color: inherit;
      text-decoration: none;
      &:active, &:hover {
        color: inherit;
      }
    }
  }
}
</style>
