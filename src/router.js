import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  // TODO:Routes
  routes: [{
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/registrieren",
      name: "Registrieren",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/Registrieren.vue")
    },
    {
      path: "/anmelden",
      name: "Anmelden",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/Login.vue")
    },
    {
      path: "/startseite",
      name: "Startseite",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/Startseite.vue")
    },
    {
      path: "/spiel/schnitzeljagd",
      name: "Schnitzeljagd",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import( /* webpackChunkName: "about" */ "./views/QrScanner.vue")
    }
  ]
})