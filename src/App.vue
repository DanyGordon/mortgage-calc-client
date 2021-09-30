<template>
  <div id="app">
    <Loader v-if="loading" />
    <component v-else :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import EntryLayout from '@/layouts/EntryLayout.vue';

export default {
  data: () => ({
    loading: false,
    noConnection: false,
  }),
  mounted() {
    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
  },
  computed: {
    layout() {
      return (this.$route.meta.layout || 'Entry') + '-Layout';
    }
  },
  methods: {
    offlineHandler() {
      this.loading = true;
      setTimeout(() => {
        if(this.loading) {
          this.noConnection = true;
          this.loading = false;
        }
      }, 10000);
    },
    onlineHandler() {
      this.loading = false;
      this.noConnection = false;
    }
  },
  components: {
    MainLayout, EntryLayout
  },
  destroyed() {
    window.removeEventListener('offline', this.offlineHandler);
    window.removeEventListener('online', this.onlineHandler);
  }
}
</script>

<style>
@import '~materialize-css/dist/css/materialize.min.css';
@import './assets/index.css';
@import './assets/responsive.css';
</style>
