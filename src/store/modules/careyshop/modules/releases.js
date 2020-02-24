import axios from 'axios'
import semver from 'semver'
import util from '@/utils/util'

export default {
  namespaced: true,
  state: {
    // 最新版本的信息
    latest: {},
    // 是否有新版本
    update: false
  },
  actions: {
    /**
     * @description 检查版本更新
     * @param {Object} param context
     */
    checkUpdate({ state, commit }) {
      axios.get('https://raw.githubusercontent.com/dnyz520/careyshop-admin/master/package.json')
        .then(res => {
          const update = semver.lt(process.env.VUE_APP_VERSION, res.version)
          if (update) {
            util.log.capsule('CareyShop Admin', `New version ${res.version}`)
            console.log(`版本号: ${res.version} | 详情 ${process.env.VUE_APP_GITHUB_URL}`)
            commit('updateSet', true)
          }
          commit('latestSet', res)
        })
        .catch(err => {
          console.log('checkUpdate error', err)
        })
    }
  },
  mutations: {
    /**
     * @description 显示版本信息
     */
    versionShow() {
      util.log.capsule('CareyShop Admin', `v${process.env.VUE_APP_VERSION}`)
      console.log('Web https://www.careyshop.cn/')
      console.log('Doc https://doc.careyshop.cn/')
    },
    /**
     * @description 设置是否有新的 CareyShop Admin 版本
     * @param {Object} state state
     * @param {Boolean} update can update
     */
    updateSet(state, update) {
      // store 赋值
      state.update = update
    },
    /**
     * @description 设置最新版本的信息
     * @param {Object} state state
     * @param {Object} latest releases value
     */
    latestSet(state, latest) {
      // store 赋值
      state.latest = latest
    }
  }
}
