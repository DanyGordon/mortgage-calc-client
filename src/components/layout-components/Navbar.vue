<template>
  <div>
    <nav class="blue-grey darken-2">
      <div class="nav-wrapper">
        <router-link to="/" class="brand-logo">
          Mortgage Calc
        </router-link>
        <a href="#" data-target="nav-mobile" class="sidenav-trigger"><i class="material-icons">menu</i></a>
        <ul class="right hide-on-med-and-down">
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

    <ul id="nav-mobile" class="sidenav" ref="sidenav">
      <router-link to="/" tag="li" class="blue-grey darken-2">
        <a href="" class="waves-effect waves-indigo pointer white-text" @click="closeSidenav">Mortgage Calc</a>
      </router-link>
      <router-link
        v-for="link in links"
        :key="link.url"
        tag="li"
        active-class="active"
        :to="link.url"
        :exact="link.exact"
      >
        <a href="" class="waves-effect waves-indigo pointer" @click="closeSidenav">{{ link.title }}</a>
      </router-link>
      <li><a href="#" class="waves-effect waves-indigo pointer" @click.prevent="logout"><i class="material-icons right">exit_to_app</i>Exit</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data: () => {
    return {
      sidenav: null,
      links: [
        { title: 'Management', url: '/', exact: true },
        { title: 'Calculator', url: '/calculator' },
        { title: 'History', url: '/history', exact: true },
      ]
    }
  },
  mounted() {
    this.sidenav = M.Sidenav.init(this.$refs.sidenav);
  },
  methods: {
    closeSidenav() {
      this.sidenav.close();
    },
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/login');
    }
  },
  destroyed() {
    if(this.sidenav) {
      this.sidenav.destroy();
    }
  }
}
</script>