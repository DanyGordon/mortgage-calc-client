import { config } from "@/config/app.config";

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      try {
        const body = JSON.stringify({ email, password });
        const res = await fetch(config.base + '/auth', { method: 'POST', headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body });
        if(res.ok) {
          const parsed = await res.json();
          const token = parsed.token;
          if(token) {
            localStorage.setItem('token', token);
            dispatch('getUserInfo');
          }
        }
      } catch (err) {
        console.log(err);
        commit('setError', err);
      }
    },
    async register({ commit }, { email, password, name }) {
      try {
        const body = JSON.stringify({ email, password, name });
        await fetch(config.base + '/account/register', { method: 'POST', headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body });
      } catch (err) {
        commit('setError', err);
      }
    },
    async getUserInfo({ commit }) {
      try {
        const res = await fetch(config.base + '/account', { method: 'POST', headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          const parsed = await res.json();
          const uid = parsed.uid;
          const name = parsed.name;
          localStorage.setItem('name', name);
          localStorage.setItem('uid', uid);
        }
      } catch (err) {
        console.log(err);
        commit('setError', err);
      }
    },
    async logout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      localStorage.removeItem('uid');
      commit('clearUserInfo');
    }
  },
  modules: {
  },
  getters: {
  }
}