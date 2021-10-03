import { config } from "@/config/app.config";

export default {
  state: {
  },
  mutations: {
  },
  actions: {
    async getAllRecords({ commit }, { bankId }) {
      try {
        const res = await fetch(config.base + `/banks/${bankId}/history`, { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          return await res.json();
        } else {
          return null;
        }
      } catch (err) {
        commit('setError', err);
        return null;
      }
    },
    async getRecordById({ commit }, { bankId, id }) {
      try {
        const res = await fetch(config.base + `/banks/${bankId}/history/${id}`, { headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
        if(res.ok) {
          return await res.json();
        } else {
          return null;
        }
      } catch (err) {
        commit('setError', err);
        return null;
      }
    },
    async createRecord({ commit }, { bankId, formData }) {
      try {
        const body = JSON.stringify(formData);
        const res = await fetch(config.base + `/banks/${bankId}/history`, { 
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
    async deleteRecord({ commit }, { bankId, id }) {
      try {
        const res = await fetch(config.base + `/banks/${bankId}/history/${id}`, { method: 'DELETE', headers: { "Authorization": 'Bearer ' + localStorage.getItem('token') } });
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