<template>
  <div class="entry-background">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'entry-layout'
}
</script>

<style>
.entry-background {
  min-height: 100vh;
  background: -webkit-linear-gradient(135deg, rgb(177, 191, 220), rgb(34, 45, 75), rgb(70, 97, 167));
  background: -moz-linear-gradient(135deg, rgb(177, 191, 220), rgb(34, 45, 75), rgb(70, 97, 167));
  background: linear-gradient(135deg, rgb(177, 191, 220), rgb(34, 45, 75), rgb(70, 97, 167));
}
</style>