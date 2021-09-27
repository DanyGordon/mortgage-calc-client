export default {
  bind(el, { value }) {
    value
    M.Modal.init(el);
  },
  unbind(el) {
    const modal = M.Modal.getInstance(el);
    
    if(modal && modal.destroy) {
      modal.destroy();
    }
  }
};