import Vue from 'vue';
import Vuelidate from 'vuelidate';
import VueMeta from 'vue-meta'
import Paginate from 'vuejs-paginate';
import App from './App.vue';
import router from './router';
import store from './store';
import titlePlugin from '@/utils/title.plugin'
import currencyFilter from '@/filters/currency.filter';
import dateFilter from '@/filters/date.filter';
import tooltipDirective from '@/directives/tooltip.directive';
import modalDirective from '@/directives/modal.directive';
import Loader from '@/components/Loader';
import 'materialize-css/dist/js/materialize.min';

Vue.config.productionTip = false;

Vue.use(titlePlugin);
Vue.use(Vuelidate);
Vue.use(VueMeta);
Vue.filter('currency', currencyFilter);
Vue.filter('date', dateFilter);
Vue.directive('tooltip', tooltipDirective);
Vue.directive('modal-target', modalDirective);
Vue.component('Loader', Loader);
Vue.component('Paginate', Paginate);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
