<template>
  <div class="row">
    <div class="page-title">
      <h3>Management</h3>
      <button class="btn hide-on-med-and-down"><router-link class="white-text" to="/bank">Add new Bank</router-link></button>
    </div>
    
    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <section class="col s12 page-content" v-else>
      <table class="responsive-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Banks Name</th>
            <th>Interest rate</th>
            <th>Maximum loan</th>
            <th>Minimum down payment</th>
            <th>Loan term</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody ref="table">
          <tr v-for="bank in items" :key="bank.id">
            <td>{{ bank.orderNumber }}</td>
            <td>{{ bank.name }}</td>
            <td>{{ bank.interestRate }}%</td>
            <td>{{ bank.maxLoan | currency }}</td>
            <td>{{ bank.minDownPaymentPercent }}%</td>
            <td>{{ bank.loanTerm }} years</td>
            <td class="actions hide-on-med-and-down">
              <router-link 
                :to="`/bank?action=edit&bank=${bank.name}`" 
                class="btn-floating action grey mr-1 ml-1"
                v-tooltip="'Edit this bank'"
              >
                <i class="material-icons">edit</i>
              </router-link>
              <a 
                class="btn-floating action red accent-4 modal-trigger mr-1 ml-1" 
                :href="`#${bank.name}`"
                v-tooltip="'Delete this bank'"
                @click.prevent="targetDelete(bank.name)"
              >
                <i class="material-icons">delete</i>
              </a>
              <router-link 
                :to="`/calculator?bank=${bank.name}`" 
                class="btn-floating action mr-1 ml-1"
                v-tooltip="'Calculate to this bank'"
              >
                <i class="material-icons">arrow_forward</i>
              </router-link>
            </td>
            <td class="hide-on-large-only">
              <a href="#" :data-target="'dropdown' + bank.name" class="dropdown-trigger btn">Actions</a>
            </td>
          </tr>
        </tbody>
      </table>

      <ul v-for="bank of banks" :key="bank.id" :id="'dropdown' + bank.name" class='dropdown-content'>
        <li>
          <router-link
            :to="`/bank?action=edit&bank=${bank.name}`" 
          >
            Edit this Bank
          </router-link>
        </li>
        <li>
          <a 
            class="modal-trigger" 
            :href="`#${bank.name}`" 
            @click.prevent="targetDelete(bank.name)"
          >
            Delete this Bank
          </a>
        </li>
        <li>
          <router-link
            :to="`/calculator?bank=${bank.name}`"
          >
            Calculate
          </router-link>
        </li>
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
    </section>
    
    <div v-if="!loading && banks.length" class="col s12 hide-on-large-only center">
      <button class="btn btn-large">
        <router-link class="white-text" to="/bank">Add new Bank</router-link>
      </button>
    </div>

    <div class="fixed-action-btn hide-on-med-and-down" data-position="left" v-tooltip="'Add new Bank'">
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
        <a href="#" class="modal-close waves-effect waves-green btn-flat" @click.prevent="closeDeleteModale">Close</a>
        <a href="#" class="modal-close waves-effect waves-green btn-flat" @click.prevent="confirmDelete">Agree</a>
      </div>
    </div>
  </div>
</template>

<script>
import paginationMixin from '@/mixins/pagination.mixin'

export default {
  metaInfo() { 
    return {
      title: this.$title('Management'),
      meta: [
        { name: 'Description', content: 'Simple Application to calculate Mortgage.' },
      ]
    }
  },
  name: 'Management',
  mixins: [paginationMixin],
  data: () => ({
    toDelete: null,
    loading: false,
    dropdowns: null,
    banks: []
  }),
  async mounted() {
    this.loading = true;
    this.banks = await this.$store.dispatch('getAllBanks');
    if(this.banks.length) {
      this.banks.forEach((bank, indx) => bank.orderNumber = indx + 1);
      this.setup();
    }
    this.loading = false;
    setTimeout(() => {
      if(this.banks.length) {
        const dropdowns = this.$refs.table.querySelectorAll('.dropdown-trigger');
        if(dropdowns && dropdowns.length) {
          this.dropdowns = M.Dropdown.init(dropdowns, { constrainWidth: false, coverTrigger: false });
        }
      }
    }, 0);
  },
  methods: {
    setup() {
      this.setupPagination(this.banks);
    },
    targetDelete(name) {
      this.toDelete = name;
    },
    closeDeleteModale() {
      this.toDelete = null;
    },
    async confirmDelete() {
      const bank = this.banks.find(bank => bank.name === this.toDelete);
      const isSuccess = await this.$store.dispatch('deleteBank', { id: bank.id });
      if(isSuccess) {
        M.toast({ html: `Successfully deleted ${this.toDelete}!` });
        this.toDelete = null;
        this.banks = await this.$store.dispatch('getAllBanks');
        this.setup();
      }
    }
  },
  destroyed() {
    if(this.dropdowns && this.dropdowns.destroy) {
      this.dropdowns.destroy();
    }
  }
}
</script>

<style scoped>
  /*table {
    margin: 2rem 10rem;
    width: calc(100% - 20rem);
  }*/
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
.btn-large {
  margin-top: 2rem;
  width: 60%;
}
.btn-list {
  display: flex;
  flex-flow: column;
  align-items: stretch;
}
.btn-list button {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.btn-list button .material-icons,
.btn-list a .material-icons {
  margin-left: .5rem;
}
</style>