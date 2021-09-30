export default {
  bind(el) {
    M.Modal.init(el, { preventScrolling: false, startingTop: '50%' });
  },
  unbind(el) {
    const modal = M.Modal.getInstance(el);
    
    if(modal && modal.destroy) {
      modal.destroy();
    }
  }
};