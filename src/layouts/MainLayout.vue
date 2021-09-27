<template>
  <div>
    <div class="app-main__layout">
      <Navbar />

      <main class="app-content">
        <router-view></router-view>
      </main>

    </div>
  </div>
</template>

<script>
import Navbar from '@/components/layout-components/Navbar.vue';

export default {
  name: 'main-layout',
  components: {
    Navbar
  }
}
</script>

<style>
.app-content {
  padding: 2rem;
}
</style>