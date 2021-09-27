import Vue from 'vue';
import Vuelidate from 'vuelidate';
import Paginate from 'vuejs-paginate';
import App from './App.vue';
import router from './router';
import store from './store';
import currencyFilter from '@/filters/currency.filter';
import dateFilter from '@/filters/date.filter';
import modalDirective from '@/directives/modal.directive';
import Loader from '@/components/Loader';
import 'materialize-css/dist/js/materialize.min';

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);
Vue.directive('modal-target', modalDirective);
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
