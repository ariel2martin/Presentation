import Vue from 'vue';
import App from './views/Sorteo.vue';
//import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
Vue.use(PerfectScrollbar);
Vue.config.productionTip = false;
export const nuxt = new Vue({});
new Vue({

  store,
  vuetify,

  render: h => h(App)
}).$mount('#app');


