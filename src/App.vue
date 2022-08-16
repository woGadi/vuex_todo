<template>
  <div class="body-bg">
    <div id="app">
      <a-input placeholder="请输入任务" class="my_ipt" :value="inputValue" @change="handleInputValue" />
      <a-button type="primary" @click="addItemToList">添加事项</a-button>

      <!-- dataSource 是列表的数据源 -->
      <!-- 因为要按需展示列表，所以数据源是 showListByKey；原数据源是 list -->
      <a-list bordered :dataSource="showListByKey" class="dt_list">
        <a-list-item slot="renderItem" slot-scope="item">
          <!-- 复选框 -->
          <a-checkbox
            :checked="item.done"
            @change="
              (e) => {
                cbStatusChanged(e, item)
              }
            "
            >{{ item.info }}</a-checkbox
          >
          <!-- 删除链接 -->
          <a slot="actions" @click="removeItemById(item)">删除</a>
        </a-list-item>

        <!-- footer区域 -->
        <div slot="footer" class="footer">
          <!-- 未完成的任务个数 -->
          <span>{{ unDoneLength }}条剩余</span>
          <!-- 操作按钮 -->
          <a-button-group>
            <!-- 以下按钮用于切换列表视图 -->
            <a-button :type="viewKey === 'all' ? 'primary' : 'default'" @click="changeList('all')">全部</a-button>
            <a-button :type="viewKey === 'un_done' ? 'primary' : 'default'" @click="changeList('un_done')">未完成</a-button>
            <a-button :type="viewKey === 'done' ? 'primary' : 'default'" @click="changeList('done')">已完成</a-button>
          </a-button-group>
          <!-- 把已经完成的任务清空 -->
          <a @click="cleanDone">清除已完成</a>
        </div>
      </a-list>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  name: 'App',
  data() {
    return {}
  },
  created() {
    this.$store.dispatch('getList')
  },
  computed: {
    ...mapState(['inputValue', 'viewKey']),
    ...mapGetters(['unDoneLength', 'showListByKey'])
  },
  methods: {
    ...mapMutations(['setInputValue', 'addItem', 'removeItem', 'setChecked', 'cleanDoneItem', 'changeViewKey']),
    // 监听 input 内容的变化
    handleInputValue(e) {
      // e.target.value 可拿到输入的最新值
      this.setInputValue(e.target.value)
    },
    // 向列表中新增 item 项
    addItemToList() {
      // 判断用户输入是否为空
      if (this.inputValue.trim().length <= 0) {
        return this.$message.warning('请输入要添加的内容喔')
      }
      // 调用追加 newItem 处理函数
      this.addItem()
    },
    // 根据 id，删除 item 项
    removeItemById(item) {
      // removeItem 是按需导入使用的
      this.removeItem(item.id)
    },
    // 监听复选框的变化
    cbStatusChanged(e, item) {
      // 因为 mutations 里的函数只接收两个参数，所以这里用对象的形式传值
      const param = {
        id: item.id,
        status: e.target.checked
      }
      this.setChecked(param)
    },
    // 清除已完成
    cleanDone() {
      this.cleanDoneItem()
    },
    // 切换视图
    changeList(key) {
      this.changeViewKey(key)
    }
  }
}
</script>

<style scoped>
.body-bg {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow-y: auto;
  background-color: #1e1e1e;
}

#app {
  margin: 80px auto 0;
  padding: 10px;
  width: 640px;
  background-color: #fff;
  border: 10px solid rosybrown;
}

.my_ipt {
  width: 500px;
  margin-right: 10px;
}

.dt_list {
  width: 500px;
  margin-top: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
