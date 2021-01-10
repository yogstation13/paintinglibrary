import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Library from "@/views/Library.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:id?",
    name: "Library",
    component: Library
  }
];

const router = new VueRouter({
  routes
});

export default router;
