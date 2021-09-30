<template>
  <div class="row">
    <div class="page-title">
      <h3>History</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <div v-else class="col s12 page-content">
      <ul class="collection">
        <li class="collection-item avatar flex hide-on-med-and-down" v-for="bank of items" :key="bank.id">
          <i class="material-icons circle">account_balance</i>
          <div class="description">
            <span class="title">{{ bank.name }}</span>
            <p>History Your Computation Mortage to {{ bank.name }}</p>
          </div>
          <router-link :to="'/history/' + bank.id" class="secondary-content">
            <i class="small material-icons">send</i>
          </router-link>
        </li>
        <router-link 
          tag="li" 
          class="collection-item avatar flex hide-on-large-only" 
          v-for="(bank, index) in items" :key="index"
          :to="'/history/' + bank.id"
        >
          <i class="material-icons circle">account_balance</i>
          <div class="description">
            <span class="title">{{ bank.name }}</span>
            <p>History Your Computation Mortage to {{ bank.name }}</p>
          </div>
        </router-link>
      </ul>

      <Paginate 
        v-if="allItems.length > 1"
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back'"
        :next-text="'Forward'"
        :container-class="'pagination center'"
        :page-class="'waves-effect'"
        :active-class="'blue-grey lighten-1'"
      />
    </div>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'

export default {
  metaInfo() { 
    return {
      title: this.$title('History'),
      meta: [
        { name: 'Description', content: 'Simple Application to calculate Mortgage.' },
      ]
    }
  },
  mixins: [paginationMixin],
  data: () => ({
    loading: false,
    banks: []
  }),
  async mounted() {
    this.loading = true;
    this.banks = await this.$store.dispatch('getAllBanks');
    this.setup();
    this.loading = false;
  },
  methods: {
    setup() {
      this.setupPagination(this.banks);
    }
  }
}
</script>

<style scoped>
  .flex {
    display: flex;
    align-items: center;
  }

  .title {
    font-size: 1.2rem;
    font-weight: 500;
  }
</style>