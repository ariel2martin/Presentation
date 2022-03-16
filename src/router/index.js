import Vue from "vue";
import VueRouter from "vue-router";

import GraficoDinamico from "@/views/GraficoDinamico.vue";
import GraficoEjemplo from "@/views/GraficoEjemplo.vue";
import FileSelect from "@/views/FileSelect.vue";
import sorteo from "@/views/Sorteo.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/FileSelect",
    name: "FileSelect",
    component: FileSelect,
  },
  {
    path: "/GraficoEjemplo",
    name: "GraficoEjemplo",
    component: GraficoEjemplo,
  },

  {
    path: "/graficoDinamico",
    name: "GraficoDinamico",
    component: GraficoDinamico,
  },
  {
    path: "/",
    name: "home",
    component: sorteo,
  },
  {
    path: "/Tabla",
    name: "tabla",
    component: () =>
      import(/* webpackChunkName: "datos"*/ "../views/Tabla.vue"),
  }, {
    path: "/asign",
    name: "asign",
    component: () =>
      import(/* webpackChunkName: "datos"*/ "../views/Asign.vue"),
  }, {
    path: "/sorteo",
    name: "sorteo",
    component: () =>
      import(/* webpackChunkName: "datos"*/ "../views/Sorteo.vue"),
  },];

const router = new VueRouter({
  mode: "history",
  base: "/",
  routes,
});

export default router;
