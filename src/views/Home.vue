<template>
  <div>
    <div class="page-title">
      <h3>Management</h3>
      <button class="btn"><router-link class="white-text" to="/bank">Add new Bank</router-link></button>
    </div>
    
    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <section v-else>
      <table >
        <thead>
          <tr>
            <th>#</th>
            <th>Banks Name</th>
            <th>Interest rate</th>
            <th>Maximum loan</th>
            <th>Minimum down payment</th>
            <th>Loan term</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bank, index) in items" :key="bank.id">
            <td>{{ index + 1 }}</td>
            <td>{{ bank.name }}</td>
            <td>{{ bank.interestRate }}%</td>
            <td>{{ bank.maxLoan | currency }}</td>
            <td>{{ bank.minDownPaymentPercent }}%</td>
            <td>{{ bank.loanTerm }} years</td>
            <td class="actions">
              <router-link :to="`/bank?action=edit&bank=${bank.name}`" class="btn-floating action red mr-1 ml-1"><i class="material-icons">edit</i></router-link>
              <a class="btn-floating action darken-1 modal-trigger mr-1 ml-1" :href="`#${bank.name}`" @click.prevent="targetDelete(bank.name)"><i class="material-icons">delete</i></a>
              <router-link :to="`/calculator?bank=${bank.name}`" class="btn-floating action blue mr-1 ml-1"><i class="material-icons">arrow_forward</i></router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <Paginate 
        v-if="allItems.length > 1"
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back'"
        :next-text="'Forward'"
        :container-class="'pagination center'"
        :page-class="'waves-effect'"
      />
    </section>

    <div class="fixed-action-btn">
      <router-link 
        class="btn-floating btn-large blue-grey darken-2" 
        data-position="left" 
        to="/bank"
      >
        <i class="large material-icons">add</i>
      </router-link>
    </div>

    <div v-if="toDelete" :id="toDelete" class="modal" v-modal-target>
      <div class="modal-content">
        <h4>Delete {{ toDelete }}</h4>
        <p>Are you sure you want to delete {{ toDelete }}?</p>
      </div>
      <div class="modal-footer">
        <a href="#" class="modal-close waves-effect waves-green btn-flat">Close</a>
        <a href="#" class="modal-close waves-effect waves-green btn-flat" @click.prevent="confirmDelete">Agree</a>
      </div>
    </div>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'

export default {
  name: 'Management',
  mixins: [paginationMixin],
  data: () => ({
    toDelete: null,
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
    },
    targetDelete(name) {
      this.toDelete = name;
    },
    async confirmDelete() {
      const bank = this.banks.find(bank => bank.name === this.toDelete);
      await this.$store.dispatch('deleteBank', { id: bank.id });
      this.toDelete = null;
      this.banks = await this.$store.dispatch('getAllBanks');
      this.setup();
    }
  }
}
</script>

<style scoped>
  table {
    margin: 2rem 10rem;
    width: calc(100% - 20rem);
  }
</style>

<style>
.c3-chart-arcs-title {
  font-size: 32px;
}
.actions {
  display: flex;
  align-items: baseline;
  max-width: calc(45px * 3 + 1rem * 3);
}
.mr-1 {
  margin-right: .5rem;
}
.ml-1 {
  margin-left: .5rem;
}
/*rb.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.center a.action {
  line-height: 40px;
  padding: 0px 8px;
}*/
</style>