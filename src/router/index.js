import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import store from '../store';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Management',
    component: Home,
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'entry',
      auth: false,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      layout: 'entry',
      auth: false,
    }
  },
  {
    path: '/bank',
    name: 'Bank',
    component: () => import('@/views/Bank.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('../views/Calculator.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/history/:bankId',
    name: 'Records',
    component: () => import('@/views/Records.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/history/:bankId/:id',
    name: 'Computation',
    component: () => import('@/views/Computation.vue'),
    meta: {
      layout: 'main',
      auth: true,
    }
  },
  {
    path: '/error',
    name: 'ErrorAPI',
    component: () => import('@/components/Error.vue'),
  },
  {
    path: '*',
    redirect: {
      path: '/',
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.auth);
  const isAuth = await store.dispatch('checkUserAuth');
  if(to.name !== 'ErrorAPI') {
    if(typeof isAuth === 'string' && isAuth.includes('Failed to fetch')) {
      next('/error');
      return;
    }

    if(requireAuth && !isAuth) {
      next('/login');
    } else {
      next();
    }

    if(!requireAuth && isAuth) {
      next('/');
    } else {
      next();
    }
  } else {
    if(typeof isAuth !== 'string' || !isAuth.includes('Failed to fetch')) {
      next('/');
    } else {
      next();
    }
  }
});

export default router