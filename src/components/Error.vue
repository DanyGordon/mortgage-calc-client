<template>
  <div class="card">
    <div v-if="failedApi">
      <div class="card-header">
        <h2>Failed connection with API :(</h2>
      </div>
      <div class="card-body">
        <p>We sorry very much, but API is failed now and app isn't working. You can <a href="#" @click.prevent="reload">try again</a> later.</p>
      </div>
    </div>
    <div v-if="noConnection">
      <div class="card-header">
        <h2>Failed connection :(</h2>
      </div>
      <div class="card-body">
        <p>Check your network state and <a href="#" @click.prevent="reload">try again</a>.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  data: () => ({
    failedApi: null,
    noConnection: null
  }),
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  mounted() {
    this.error === 'No connection' ? this.noConnection = true : this.failedApi = true;
  },
  methods: {
    reload() {
      window.location.reload();
    }
  }
}
</script>