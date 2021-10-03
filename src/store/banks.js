import { config } from "../config/app.config"

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    async getAllBanks({ commit }) {
      try {
        const res = await fetch(config.base + '/banks', { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          return await res.json();
        } else {
          return null;
        }
      } catch(err) {
        commit('setError', err);
        return null;
      }
    },
    async getBankById({ commit }, { id }) {
      try {
        const res = await fetch(config.base + `/banks/${id}`, { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          return await res.json();
        } else {
          return null;
        }
      } catch(err) {
        commit('setError', err);
        return null;
      }
    },
    async createNewBank({ commit }, formData) {
      try {
        const body = JSON.stringify(formData);
        const res = await fetch(config.base + '/banks', { 
          method: 'POST', 
          headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json;charset=utf-8' 
          },
          body
        });
        if(res.ok) {
          return true;
        }
      } catch (err) {
        commit('setError', err);
        return null;
      }
    },
    async updateBank({ commit }, { id, ...formData }) {
      try {
        const body = JSON.stringify(formData);
        const res = await fetch(config.base + `/banks/${id}`, { 
          method: 'PATCH', 
          headers: {
            "Authorization": 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json;charset=utf-8' 
          },
          body
        });
        if(res.ok) {
          return await res.json();
        }
      } catch (err) {
        commit('setError', err);
        return null;
      }
    },
    async deleteBank({ commit }, { id }) {
      try {
        const res = await fetch(config.base + `/banks/${id}`, { method: 'DELETE', headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          return true;
        }
      } catch (err) {
        commit('setError', err);
        return null;
      }
    }
  },
  modules: {
  },
  getters: {
  }
}