<template>
  <div>
    <div class="page-title">
      <h3>Calculator</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <div v-else class="calculator-container">

      <div class="left">
        <CalculatorInput
          ref="input"
          :banks="banks"
          :bank="bank"
          @total="setMonthlyPayment"
          @setComputation="getComputation"
          @updateChart="updateChart"
          @changeCurrent="updateCurrent"
        />
      </div>
      
      <div class="right">

        <div class="calculator-output__container">
          <div class="calculator-output__result">
            <div class="output-result__title">
              <h4>{{ monthlyPayment | currency }}</h4>
              <div class="separator ml-1"></div>
              <p>Your estimated monthly payment</p>
            </div>
          </div>
        </div>

        <div class="calculator-details__container">
          <div class="calculator-details__chart">
            <Chart :chartData="dataSet" :key="dataSet[0].value" />
          </div>
          <div class="calculator-details__info">
            <h6 class="info-title">How is my monthly payment calculated?</h6>
            <table>
              <tbody>
                <tr v-for="(data, index) in dataSet" :key="index">
                  <td><div class="color" :style="{ 'background-color': data.color }"></div>{{ data.label }}</td>
                  <td style="text-align: right;">{{ data.value | currency }}</td>
                </tr>
              </tbody>
              <tfoot>
                <td>Total monthly payment = {{ monthlyPayment | currency }}</td>
              </tfoot>
            </table>
          </div>
        </div>

        <div class="button-container">
          <button class="waves-effect waves-light btn" @click.prevent="saveComputation">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from '@/components/calculator/Chart.vue'
import CalculatorInput from '@/components/calculator/CalculatorInput.vue';

export default {
  data: () => ({
    loading: false,
    dataSet: [
      { value: 0, color: '#4d64ff', label: 'Principal & interest', key: 'baseSum' },
      { value: 0, color: '#7bd896', label: 'Homeowner\'s insurance', key: 'insurance' },
      { value: 0, color: '#d97f9f', label: 'Property tax', key: 'tax' },
    ],
    banks: [],
    bank: {},
    computation: null,
    monthlyPayment: 0
  }),
  async mounted() {
    this.loading = true;
    this.banks = await this.$store.dispatch('getAllBanks');
    if(this.banks.length) {
      const currentBank = this.$route.query.bank || this.banks[0].name;
      this.bank = this.banks.find(bank => bank.name === currentBank);
    }
    this.loading = false;
  },
  
  
  methods: {
    setMonthlyPayment(sum) {
      this.monthlyPayment = sum;
    },
    updateChart(data) {
      this.dataSet.forEach(d => d.value = data.find(v => v.key === d.key).value);
    },
    updateCurrent(current) {
      this.bank = this.banks.find(bank => bank.name === current);
    },
    getComputation(computation) {
      this.computation = computation;
    },
    async saveComputation() {
      if(!this.$refs.input.checkValidations()) {
        return;
      }

      const bankId = this.bank.id;
      const formData = { ...this.computation };
      await this.$store.dispatch('createRecord', { bankId, formData});
      this.$refs.input.reset();
    }
  },
  components: {
    Chart, CalculatorInput
  }
}
</script>

<style scoped>
  .color {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin-right: 1rem;
  }

  .calculator-container {
    margin: 5rem 15rem;
    width: calc(100% - 30rem);
    display: flex;
    justify-content: space-between;
  }

  .left {
    width: 25%;
    padding: .5rem 3rem .5rem 0;
    border-right: 1px solid #cacaca;
  }

  .right {
    width: 72%;
  }

  .calculator-output__container {
    margin-bottom: 2rem;
    padding: 0 5rem;
    display: flex;
    justify-content: center;
  }

  .calculator-output__result {
    width: 70%;
  }

  .output-result__title {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .output-result__title p {
    width: 175px;
  }

  .calculator-details__container {
    display: flex;
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-top: 1px solid #cacaca;
    border-bottom: 1px solid #cacaca;
  }

  .calculator-details__chart {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60%;
    min-height: 300px;
  }

  .calculator-details__info {
    width: 40%;
  }

  .button-container {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .info-title {
    font-size: 1.2;
    font-weight: 500;
  }

  .ml-1 {
    margin-left: .5rem;
  }
</style>