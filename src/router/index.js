import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "*",
    component: () => import("@/pages/404"),
    meta: { title: "404" }
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
