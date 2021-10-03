<template>
  <div class="row">
    <div class="page-title">
      <h3>Calculator</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <div v-else class="col s12 calculator-container">

      <div class="left">
        <CalculatorInput
          ref="input"
          :banks="banks"
          :bank="bank"
          @total="setMonthlyPayment"
          @getComputation="getComputation"
          @updateChart="updateChart"
          @changeCurrent="updateCurrent"
        />
      </div>
      
      <div class="right">

        <div class="calculator-output__container">
          <div class="calculator-output__result">
            <div class="output-result__title">
              <h4>{{ monthlyPayment | currency }}</h4>
              <div class="separator ml-1 hide-on-med-and-down"></div>
              <p>Your estimated monthly payment</p>
            </div>
          </div>
        </div>

        <div class="calculator-details__container">
          <div class="calculator-details__chart">
            <Chart :chartData="dataSet" :key="dataSet[0].value" />
          </div>
          <section class="calculator-details__info">
            <h6 class="info-title">How is my monthly payment calculated?</h6>
            <table>
              <tbody>
                <tr v-for="(data, index) in dataSet" :key="index">
                  <td><div class="color" :style="{ 'background-color': data.color }"></div>{{ data.label }}</td>
                  <td style="text-align: right;">{{ data.value | currency }}</td>
                </tr>
              </tbody>
              <tfoot class="hide-on-med-and-down">
                <td>Total monthly payment = {{ monthlyPayment | currency }}</td>
              </tfoot>
            </table>
          </section>
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
  metaInfo() { 
    return {
      title: this.$title('Calculator'),
      meta: [
        { name: 'Description', content: 'Simple Application to calculate Mortgage.' },
      ]
    }
  },
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
      const bankId = this.bank.id;
      const formData = { ...this.computation };
      await this.$store.dispatch('createRecord', { bankId, formData});
      M.toast({ html: `Successfully save Computation!` });
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

  .row .col.s12.calculator-container {
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

  @media only screen and (max-width: 700px) {
    .row .col.s12.calculator-container {
      width: 100%;
      margin: 0;
      margin-left: auto;
      left: auto;
      right: auto;
    }
  }

  @media only screen and (max-width: 1095px) {
    .row .col.s12.calculator-container {
      flex-direction: column;
    }
  }

  @media only screen and (min-width: 700px) and (max-width: 1700px) {
    .row .col.s12.calculator-container {
      width: calc(100% - 10rem);
      margin: 2.5rem 5rem;
    }
  }

  @media only screen and (max-width: 900px) {
    .button-container {
      justify-content: center;
    }

    .button-container button {
      width: 80%;
    }
  }

  @media only screen and (max-width: 1095px) {
    .left {
      width: 100%;
      padding: 0;
      border-right: none;
    }

    .right {
      width: 100%;
      margin-top: 2rem;
    }

    .calculator-output__container {
      margin-top: 1rem;
      padding: 0 2rem;
    }

    .calculator-details__container {
      padding: 0 2rem;
      flex-direction: column;
    }

    .calculator-output__result {
      width: 100%;
    }

    .output-result__title {
      flex-direction: column;
    }

    .output-result__title p {
      width: 100%;
      text-align: center;
    }

    .calculator-details__container {
      padding: 0;
    }

    .calculator-details__chart {
      width: 100%;
      order: 1;
    }

    .calculator-details__info {
      width: 100%;
    }
  }

  @media only screen and (min-width: 993px) {
    .output-result__title {
      flex-direction: row;
    }

    .output-result__title p {
      width: 175px;
    }
  }

  @media only screen and (min-width: 1096px) and (max-width: 1241px) {
    .left {
      width: 37%;
    }

    .right {
      width: 60%;
    }
  }

  @media only screen and (min-width: 1241px) and (max-width: 1450px) {
    .left {
      width: 30%;
    }

    .right {
      width: 67%;
    }
  }
</style>