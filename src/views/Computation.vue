<template>
  <div>
    <Loader v-if="loading" />

    <div v-else>
      <div class="page-title">
        <h3>Computation {{ recordId }} | {{ bankname }}</h3>
      </div>

      <div class="page-content">
        <div class="card card-paddined">
          <header class="card-header">
            <div class="left">
              <h6 class="info-title">Bank for which the calculation was made - {{ bankname }}</h6>
            </div>
            <div class="right">
              <h6 class="info-title">Date: {{ date | date('datetime') }}</h6>
            </div>
          </header>
          <main class="card-body">
            <div class="params-container">
              <h6 class="info-title">General Params to calculate:</h6>
              <table>
                <tbody>
                  <tr>
                    <td>Interest Rate</td>
                    <td style="text-align: right;">{{ interestrate }}%</td>
                  </tr>
                  <tr>
                    <td>Down Payment Percent</td>
                    <td style="text-align: right;">{{ imprestpercent }}%</td>
                  </tr>
                  <tr>
                    <td>Term of loan</td>
                    <td style="text-align: right;">{{ term }} Years</td>
                  </tr>
                  <tr>
                    <td>Tax Property Percent</td>
                    <td style="text-align: right;">{{ tax }}%</td>
                  </tr>
                  <tr>
                    <td>Insurance per Year</td>
                    <td style="text-align: right;">{{ insurance | currency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="values-conatiner">
              <h6 class="info-title">Values to calculate:</h6>
              <table>
                <tbody>
                  <tr>
                    <td>Initial Loan</td>
                    <td style="text-align: right;">{{ initialloan | currency }}</td>
                  </tr>
                  <tr>
                    <td>Donw Payment</td>
                    <td style="text-align: right;">{{ imprest | currency }}</td>
                  </tr>
                  <tr>
                    <td>Balance of Debt</td>
                    <td style="text-align: right;">{{ initialloan - imprest | currency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="output-container">
              <h6 class="info-title">Monthly payment calculated with next output values:</h6>
              <table>
                <tbody>
                  <tr>
                    <td>Principal and interest</td>
                    <td style="text-align: right;">{{ basesum | currency }}</td>
                  </tr>
                  <tr>
                    <td>Homeowner's insurance</td>
                    <td style="text-align: right;">{{ insurance / 12 | currency }}</td>
                  </tr>
                  <tr>
                    <td>Property tax</td>
                    <td style="text-align: right;">{{ initialloan * tax / 100 / 12 | currency }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </main>
          <footer class="card-footer">
            <h6 class="info-title">Total monthly payment = {{ total | currency }}</h6>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  metaInfo() { 
    return {
      title: this.$title(`${this.bankname} Computation ${this.recordId}`),
      meta: [
        { name: 'Description', content: 'Simple Application to calculate Mortgage.' },
      ]
    }
  },
  data: () => ({
    loading: null,
    record: null,
    bankId: null,
    recordId: null,
    bankname: '',
    date: '',
    total: 0,
    basesum: 0,
    tax: 0,
    insurance: 0,
    initialloan: 0,
    imprest: 0,
    imprestpercent: 0,
    term: 0,
    interestrate: 0,
  }),
  async mounted() {
    this.loading = true;
    this.bankId = this.$route.params.bankId;
    this.recordId = this.$route.params.id;
    this.record = await this.$store.dispatch('getRecordById', { bankId: this.bankId, id: this.recordId });
    if(!this.record || this.record.status >= 400) {
      this.$router.push(`/history/${this.bankId}`);
    }
    this.updateValues();
    this.loading = false;
  },
  methods: {
    updateValues() {
      Object.keys(this.record).forEach(k => this[k] = this.record[k]);
    }
  }
}
</script>

<style scoped>
  .card {
    max-width: 1200px;
    min-width: 300px;
    margin: 1rem auto;
    display: flex;
    flex-direction: column;
  }

  .card-paddined {
    padding: 2rem;
  }

  .card-header {
    margin-bottom: .5rem;
    padding-bottom: .5rem;
    border-bottom: 1px solid #cacaca;
  }

  .card-body {
    margin: 1rem 0;
    display: flex;
    justify-content: space-around;
    align-items: stretch;
  }

  .params-container {
    flex-grow: 2;
  }

  .values-conatiner {
    flex-grow: 3;
    border-left: 1px solid #cacaca;
    border-right: 1px solid #cacaca;
  }

  .output-container {
    flex-grow: 1;
  }

  .params-container,
  .values-conatiner,
  .output-container {    
    padding: 1rem;
  }

  .info-title {
    font-size: 1.2;
    font-weight: 500;
  }
  
  .card-footer {
    margin-top: 1rem;
    padding-top: .5rem;
    border-top: 1px solid #cacaca;
    display: flex;
    justify-content: flex-end;
  }
</style>