import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./router/authority";
import store from "./store";

import "./mock";
import "./styles/global.less";

import Antd from "ant-design-vue";
Vue.use(Antd);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
