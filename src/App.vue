<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import MainLayout from '@/layouts/MainLayout.vue';
import EntryLayout from '@/layouts/EntryLayout.vue';
export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'Entry') + '-Layout';
    }
  },
  components: {
    MainLayout, EntryLayout
  }
}
</script>

<style>
@import '~materialize-css/dist/css/materialize.min.css';
@import './assets/index.css';
</style>
