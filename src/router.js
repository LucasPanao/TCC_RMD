import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    /* AUTENTICAÇÃO */
    {
      path: "/",
      name: "login",
      component: () => import("./views/auth/Login.vue")
    },
    {
      path: "/criarconta",
      name: "criarconta",
      component: () => import("./views/auth/CreateAccount.vue")
    },

    /* DASHBOARD */
    {
      path: "/home",
      name: "home",
      component: () => import("./views/Home.vue")
    },
    {
      path: "/logout",
      name: "logout",
      component: () => import("./views/Logout.vue")
    },

    /* INFORMAÇÕES DO PROJETO */
    {
      path: "/projectinfo",
      name: "projectinfo",
      component: () => import("./views/projeto/ProjectDetails.vue")
    },
    {
      path: "/newrisk",
      name: "newrisk",
      component: () => import("./views/projeto/NewRisk.vue")
    },
    {
      path: "/riskidentify",
      name: "riskidentify",
      component: () => import("./views/projeto/RiskIdentify.vue")
    },
    {
      path: "/risklist",
      name: "risklist",
      component: () => import("./views/projeto/RiskList.vue")
    },
    {
      path: "/analyze",
      name: "analyze",
      component: () => import("./views/projeto/Analyze.vue")
    }
  ]
});
