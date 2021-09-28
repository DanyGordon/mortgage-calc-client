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
  {
    path: '*',
<<<<<<< HEAD
    redirect: { 
      path: '/'
=======
    redirect: {
      path: '/',
>>>>>>> 835710a41cd1fce6df0ea4612d21f3258066db2b
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  const requireAuth = to.matched.some(record => record.meta.auth);
  let response;
  try {
    const res = await fetch('http://localhost:3000/api/v1/account/validateJWT', { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
    response = await res.json();
  } catch(err) {
    console.log(err.message);
  }
  if(requireAuth && (!response || !response['uid'])) {
    next('/login');
  } else {
    next()
  }

  if(!requireAuth && response && response['uid']) {
    next('/');
  } else {
    next();
  }
});

export default router
