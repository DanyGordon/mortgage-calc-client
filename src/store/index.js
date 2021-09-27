import Vue from 'vue'
import Vuex from 'vuex'
import Auth from './auth';
import Banks from './banks';
import History from './histoty';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    error: null,
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
  },
  getters: {
    error: s => s.error,
  },
  modules: {
    Auth, Banks, History
  }
})
