import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Management',
    component: Home,
    meta: {
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      layout: 'entry',
      auth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      layout: 'entry',
      auth: false
    }
  },
  {
    path: '/bank',
    name: 'Bank',
    component: () => import('@/views/Bank.vue'),
    meta: {
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/calculator',
    name: 'Calculator',
    component: () => import('../views/Calculator.vue'),
    meta: {
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue'),
    meta: {
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/history/:bankId',
    name: 'Records',
    component: () => import('@/views/Records.vue'),
    meta: {
      layout: 'main',
      auth: true
    }
  },
  {
    path: '/history/:bankId/:id',
    name: 'Computation',
    component: () => import('@/views/Computation.vue'),
    meta: {
      layout: 'main',
      auth: true
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.auth);
  try {
    const response = await fetch('http://localhost:3000/api/v1/account/validateJWT', { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
    const parsed = await response.json();
    if(requireAuth && !parsed['uid']) {
      next('/login');
    } else {
      next()
    }

    if(!requireAuth && parsed['uid']) {
      next('/');
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    next('/login');
  }
});

export default router