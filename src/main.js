import Vue from 'vue'
import App from './App.vue'
import router from './router'
import '@/assets/css/reset.css'
import '@/assets/css/global.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
import treeTable from 'vue-table-with-tree-grid'
// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 时间线
// import Timeline from '@/utils/timeline/index.js'
// import TimelineItem from '@/utils/timeline-item/index.js'

// Vue.use(Timeline)
// Vue.use(TimelineItem)

Vue.use(ElementUI)
Vue.use(VueQuillEditor)
Vue.prototype.$http = axios
// 注册树形表格，组件直接使用
Vue.component('tree-table', treeTable)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
