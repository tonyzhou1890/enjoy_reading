<template>
  <div id="app" ref="app">
    <Header />
    <div class="body">
      <router-view :key="$route.fullPath" />
    </div>
    <Footer />
  </div>
</template>

<script>
import { maxWidth, minWidth } from '@/style/variables.less'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name: 'App',
  components: {
    Header,
    Footer
  },
  created() {
    // this.getWidth()
    window.addEventListener('resize', this.getWidth)
    this.$store.dispatch('app/getTagList')
  },
  mounted() {
    this.getWidth()
  },
  metaInfo() {
    return {
      title: this.$store.state.app.metaTitle || '享阅'
    }
  },
  methods: {
    getWidth() {
      if (this.$refs.app) {
        let width = this.$refs.app.getBoundingClientRect().width
        if (width > Number(maxWidth.split('px')[0])) {
          width = Number(maxWidth.split('px')[0])
        }
        if (width < Number(minWidth.split('px')[0])) {
          width = Number(minWidth.split('px')[0])
        }
        this.$store.commit('app/SET_DATA', { width })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('~@/style/variables.less');

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  max-width: @maxWidth;
  min-width: @minWidth;
  height: 100%;
  margin: 0 auto;
  .body {
    width: 100%;
    min-height: calc(100% - 210px);
  }
}
</style>
