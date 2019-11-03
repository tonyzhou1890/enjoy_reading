import { getTagList } from '@/api/home'
import { maxWidth } from '@/style/variables.less'
import { message } from 'element-ui'

const state = {
  device: 'desktop',
  tagList: [],
  // 版心宽度
  width: Number(maxWidth.split('px')[0]),
  // 注册中心地址
  registerPrefix: process.env.VUE_APP_REGISTER,
  // 资源网址
  storePrefix: process.env.VUE_APP_STORE,
  // 积分单位
  scoreUnit: '积分',
  // 页面标题
  metaTitle: ''
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_DATA: (state, payload) => {
    Object.keys(payload).map(key => {
      state[key] = payload[key]
    })
  }
}

const actions = {
  // 改变设备类型
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  // 获取标签列表
  getTagList({ commit, state }) {
    getTagList()
      .then(res => {
        commit('SET_DATA', {
          tagList: res.data,
          hasGetTagList: true
        })
      })
      .catch(e => {
        message.error(e.errorMsg || '获取标签列表失败')
      })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
