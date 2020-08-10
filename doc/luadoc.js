import Vue from 'vue'
import Documentation from './lib/Documentation.vue'
import './lib/style.scss'

window.luadoc = new Vue({
  el: '#app',
  render: h => h(Documentation)
})
