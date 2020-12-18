const cookieparser = process.server ? require('cookieparser') : undefined

// 服务器端渲染期间运行的是同一实列
// 避免冲突，务必将 state 定义为一个函数，返回数据对象
export const state = () => {
  return {
    // 当前用户登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // 一个特殊的 actions 服务器端自动调用
  // 作用：初始化容器数据传给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null

    // 如果请求头中有 Cookie
    if (req.headers.cookie) {
      // 使用 cookieparser 把 cookie 字符串转为 JavaScript 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }  
}