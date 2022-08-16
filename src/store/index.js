import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 所有的任务列表数据
    list: [],
    // input 的内容
    inputValue: '',
    // 视图的关键字
    viewKey: 'all'
  },
  getters: {
    // 统计 done: false 的复选框个数，将统计结果渲染到页面上；只是对数据进行包装展示，因此定义在 getters 节点下。
    unDoneLength(state) {
      return state.list.filter((item) => item.done === false).length
    },
    // 根据用户点击哪个按钮，来按需展示列表数据
    showListByKey(state) {
      if (state.viewKey === 'all') {
        return state.list
      }
      if (state.viewKey === 'un_done') {
        return state.list.filter((item) => !item.done)
      }
      if (state.viewKey === 'done') {
        return state.list.filter((item) => item.done)
      }
      return state.list
    }
  },
  mutations: {
    initList(state, res) {
      state.list = res
    },
    // 将 input 输入的值 赋给 state.inputValue
    setInputValue(state, newValue) {
      state.inputValue = newValue
    },
    // 为 list 列表追加新的 item 项
    addItem(state) {
      const newItem = {
        // 数组的长度刚好就是下一项的 id
        id: state.list.length,
        info: state.inputValue,
        // 事项添加默认未完成，所以为 false
        done: false
      }
      state.list.push(newItem)
      state.inputValue = ''
    },
    // 根据 id 删除对应事项
    removeItem(state, id) {
      // 1、将 list 数组中每一项的 id，和传进来的 id，进行比较；返回比较结果，没有匹配的就返回 -1
      const i = state.list.findIndex((x) => x.id === id)
      // 2、找到了对应的 id 项，根据 id 来截取数组
      if (i !== -1) return state.list.splice(i, 1)
    },
    // 复选框的变化
    setChecked(state, param) {
      const i = state.list.findIndex((x) => x.id === param.id)
      if (i !== -1) {
        state.list[i].done = param.status
      }
    },
    // 清除已完成的事项
    cleanDoneItem(state) {
      state.list = state.list.filter((item) => item.done === false)
    },
    // 修改视图按钮的关键字
    changeViewKey(state, key) {
      // 将用户点击的视图按钮，对应的 key 值，赋值给 state
      state.viewKey = key
    }
  },
  actions: {
    getList(context) {
      // json 文件的路径能直接以 / 访问到，是因为 public 文件夹？
      axios.get('/list.json').then(({ data: res }) => {
        context.commit('initList', res)
      })
    }
  },
  modules: {}
})
