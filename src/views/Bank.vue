<template>
  <div class="row">
    <div class="page-title">
      <h3>Bank</h3>
    </div>

    <div class="col s12 page-content">
      <Loader v-if="loading" />

      <section v-else class="card">
        <header class="card-header">
          <h4>Select Action</h4>
          <div class="input-field col s12">
            <select ref="select" v-model="action">
              <option value="" disabled>Choose your action</option>
              <option value="Create" selected>Create New Bank</option>
              <option value="Edit" :disabled="disabled">Edit</option>
            </select>
          </div>
        </header>
        <main class="card-body">
          <component :is="current" :banks="banks" @updated="updateBanks"></component>
        </main>
      </section>
    </div>
  </div>
</template>

<script>
import BankCreate from '@/components/bank/BankCreate.vue';
import BankEdit from '@/components/bank/BankEdit.vue';

export default {
  metaInfo() { 
    return {
      title: this.$title('Bank'),
      meta: [
        { name: 'Description', content: 'Simple Application to calculate Mortgage.' },
      ]
    }
  },
  data: () => ({
    loading: false,
    actions: ['Create', 'Edit'],
    disabled: false,
    action: null,
    banks: [],
    select: null
  }),
  async mounted() {
    this.loading = true;
    this.action = this.capitalizeString(this.$route.query.action) || 'Create';
    this.banks = await this.$store.dispatch('getAllBanks');
    if(!this.banks.length) {
      this.disabled = true;
    }
    setTimeout(() => this.select = M.FormSelect.init(this.$refs.select), 0);
    this.loading = false;
  },
  computed: {
    current() {
      return 'Bank' + (this.action || 'Create');
    }
  },
  methods: {
    capitalizeString(string) {
      return string ? string[0].toUpperCase() + string.slice(1) : undefined;
    },
    async updateBanks(bank) {
      const indx = this.banks.findIndex(b => b.id === bank.id);
      this.banks = [
        ...this.banks.slice(0, indx),
        bank,
        ...this.banks.slice(indx + 1)
      ]
    }
  },
  components: {
    BankCreate, BankEdit
  },
  destroyed() {
    this.select.destroy();
  }
}
</script>

<style scoped>
 .card {
   max-width: 1000px;
   min-width: 300px;
   display: flex;
   flex-direction: column;
   margin: 1rem auto;
   padding: 2rem;
 }

 .card-header {
   margin: 1rem 1rem 2rem;
 }

 .card-body {
   margin: 0 1rem;
   padding: 1rem 0;
   border-top: 1px solid #bebebe;
 }
</style>