<template>
  <div id="app">
    <Loader v-if="loading" />
    <Error v-else-if="isError" />
    <component v-else :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import EntryLayout from '@/layouts/EntryLayout.vue';
import Error from '@/components/Error.vue';

export default {
  data: () => ({
    noConnection: false,
    isError: null,
    loading: false,
  }),
  mounted() {
    window.addEventListener('offline', this.offlineHandler);
    window.addEventListener('online', this.onlineHandler);
    this.loading = !this.$route.meta.layout;
    setTimeout(() => this.checkState(), 700);
  },
  computed: {
    error() {
      return this.$store.getters.error;     
    },
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
          this.$store.commit('setError', 'No connection');
        }
      }, 10000);
    },
    onlineHandler() {
      this.loading = false;
      this.noConnection = false;
      this.$store.commit('clearError');
      window.location.reload();
    },
    checkState() {
      this.loading = !this.$route.meta.layout && !this.$store.getters.error;
      if(this.loading) {
        setTimeout(() => this.checkState(), 2000);
      }
    }
  },
  watch: {
    error() {
      if(this.$store.getters.error === 'Failed to fetch') {
        this.isError = true;
      }
    }
  },
  components: {
    MainLayout, EntryLayout, Error
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
