<template>
  <div>
    <div class="page-title">
      <h3>Records - {{ name }}</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!loading && !records.length" class="center">You have no saved computations. <router-link :to="`/calculator?bank=${name}`">Make now.</router-link></p>

    <div v-else class="page-content">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Bank Name</th>
            <th>Date</th>
            <th>Sum of Loan</th>
            <th>Actions</th>
            <th>Open Details</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in items" :key="record.id">
            <td>{{ index + 1 }}</td>
            <td>{{ record.bankname }}</td>
            <td>{{ record.date | date }}</td>
            <td>{{ record.initialloan | currency }}</td>
            <td>
              <a class="btn-floating action darken-1 modal-trigger mr-1 ml-1" :href="`#${record.id}`" 
                @click.prevent="targetDelete(record.id)"
              >
                <i class="material-icons">delete</i>
              </a>
            </td>
            <td>
              <button class="btn-small btn" @click="$router.push(`/history/${bankId}/${record.id}`)">
                <i class="material-icons">open_in_new</i>
              </button>
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
    </div>

    <div v-if="toDelete" :id="toDelete" class="modal" v-modal-target>
      <div class="modal-content">
        <h4>Delete this Record</h4>
        <p>Are you sure you want to delete it?</p>
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
  mixins: [paginationMixin],
  data: () => ({
    loading: false,
    toDelete: null,
    bankId: null,
    bank: [],
    records: [],
    name: ''
  }),
  async mounted() {
    this.loading = true;
    this.bankId = this.$route.params.bankId;
    this.bank = await this.$store.dispatch('getBankById', { id: this.bankId });
    if(!this.bank || this.bank.status >= 400) {
      this.$router.push('/history');
    }
    this.name = this.bank.name;
    this.records = await this.$store.dispatch('getAllRecords', { bankId: this.bankId });
    if(this.records && this.records.length) {
      this.setup();
    }
    this.loading = false;
  },
  methods: {
    setup() {
      this.setupPagination(this.records);
    },
    targetDelete(id) {
      this.toDelete = id;
    },
    async confirmDelete() {
      this.loading = true;
      await this.$store.dispatch('deleteRecord', { bankId: this.bankId, id: this.toDelete });
      this.records = await this.$store.dispatch('getAllRecords', { bankId: this.bankId });
      this.setup();
      this.loading = false;
    }
  }
}
</script>
