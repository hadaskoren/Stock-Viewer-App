import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex';
import {store} from './store/store';
import Highcharts from 'highcharts';
import VueHighcharts from 'vue-highcharts';
import vueToastr from 'vue-toastr';

Vue.use(Vuex);
Vue.use(VueHighcharts);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
