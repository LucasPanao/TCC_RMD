import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import VueSession from 'vue-session';
import money from 'v-money';
import EventBus from './EventBus';

Vue.prototype.$bus = EventBus

Vue.use(VueSession)
Vue.use(money, {precision: 4})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");