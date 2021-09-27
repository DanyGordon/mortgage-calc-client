<template>
  <nav class="blue-grey darken-2">
    <div class="nav-wrapper">
      <router-link tag="a" to="/" class="brand-logo">
        <a href="#" style="margin-left: 1rem;">Mortgage Calculator</a>
      </router-link>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <router-link
          v-for="link in links"
          :key="link.url"
          tag="li"
          active-class="active"
          :to="link.url"
          :exact="link.exact"
        >
          <a href="" class="waves-effect waves-indigo pointer">{{ link.title }}</a>
        </router-link>
        <li><a href="#" class="waves-effect waves-indigo pointer" @click.prevent="logout"><i class="material-icons right">exit_to_app</i>Exit</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => {
    return {
      dropdown: null,
      links: [
        { title: 'Management', url: '/', exact: true },
        { title: 'Calculator', url: '/calculator' },
        { title: 'History', url: '/history' },
      ]
    }
  },
  mounted() {
  },
  methods: {
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  }
}
</script>