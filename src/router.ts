import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    base:'/weixin',
    routes: [
    {
      path: '/',
      name: '',
      redirect: '/bindUser',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/Home.vue'),
      children: [
        {
          path: '/bindUser',
          name: 'bindUser',
          component: () => import('./components/bindUser.vue'),
        },
      ],
    },
  ],
});
