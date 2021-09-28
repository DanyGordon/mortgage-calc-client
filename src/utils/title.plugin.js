export default {
  install(Vue) {
    Vue.prototype.$title = function(titleKey) {
      const appName = 'Morgage Calc';
      return `${titleKey} | ${appName}`;
    }
  }
}