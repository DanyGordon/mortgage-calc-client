<template>
  <div>
    <div class="page-title">
      <h3>Calculator</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!loading && !banks.length" class="center">You have no banks. <router-link to='/bank'>Add now.</router-link></p>

    <div v-else class="calculator-container">

      <div class="left">
        <div class="calculator-params__container">
          <div class="calculator-params__image">
            <img class="image" src="https://cdn.pixabay.com/photo/2019/08/22/15/21/modern-4423814_960_720.png" alt="Home Icons">
          </div>
          <form class="calculator-params__form" @submit.prevent="">
            <div class="params-form__price">
              <div class="price__title row align-center">
                <div class="input-field col s6">
                  <input class="calculator-input prepended" type="text" v-model="homePrice"
                    :class="{ invalid: ($v.homePrice.$dirty && !$v.homePrice.required) || ($v.homePrice.$dirty && !$v.homePrice.numeric) || 
                    ($v.homePrice.$dirty && !$v.homePrice.between) }">
                  <div class="icon-prepend icon-bold">$</div>
                  <span class="helper-text invalid" v-if="$v.homePrice.$dirty && !$v.homePrice.required">
                    Field Initial loan is Required!  
                  </span>
                  <span class="helper-text invalid" v-if="$v.homePrice.$dirty && !$v.homePrice.numeric">
                    Field Initial loan must be numeric!  
                  </span>
                  <span class="helper-text invalid" v-if="$v.homePrice.$dirty && !$v.homePrice.between">
                    Initial loan must be between {{ minLoan }} and {{ maxLoan }}!  
                  </span>
                </div>
                <div class="separator col s1"></div>
                <span class="col s4">Initial loan</span>
              </div>
              <div class="price__range">
                <input class="calculator-range" type="range" :min="minLoan" :max="maxLoan" v-model="homePrice">
              </div>
            </div>
            <div class="params-form__inputes row">
              <div class="input-field col s8">
                <input class="validate prepended" type="text" v-model="minPayment"
                  :class="{ invalid: ($v.minPayment.$dirty && !$v.minPayment.required) || ($v.minPayment.$dirty && !$v.minPayment.numeric) || 
                    ($v.minPayment.$dirty && !$v.minPayment.minValue) }">
                <div class="icon-prepend icon-bold">$</div>
                <span class="helper-text invalid" v-if="$v.minPayment.$dirty && !$v.minPayment.required">
                  Field Down payment is Required!  
                </span>
                <span class="helper-text invalid" v-if="$v.minPayment.$dirty && !$v.minPayment.numeric">
                  Field Down payment must be numeric!  
                </span>
                <span class="helper-text invalid" v-if="$v.minPayment.$dirty && !$v.minPayment.minValue">
                  Field Down payment value must greater than {{ Math.floor(homePrice * minDownPaymentPercent / 100) }}!  
                </span>
                <label>Down payment</label>
              </div>
              <div class="input-field col s4">
                <input class="validate appended" type="text" v-model="minDownPaymentPercent"
                  :class="{ invalid: ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.required) || 
                    ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.decimal) || 
                    ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.minValue) ||
                    ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.maxValue) }">
                <div class="icon-append icon-bold">%</div>
                <span class="helper-text invalid" v-if="$v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.required">
                  Field Down payment(%) is Required!  
                </span>
                <span class="helper-text invalid" v-if="$v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.decimal">
                  Field Down payment(%) must be decimal!  
                </span>
                <span class="helper-text invalid" 
                  v-if="($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.minValue) || ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.maxValue)">
                  Field Down payment(%) value must be between {{ this.bank.minDownPaymentPercent }}% and 100%!  
                </span>
              </div>
              <div class="input-field col s12">
                <select ref="bankList" v-model="currentBank">
                  <option disabled selected>Choose a Bank</option>
                  <option 
                    v-for="bank in banks" 
                    :value="bank.name" 
                    :key="bank.id"
                  >{{ bank.name }}</option>
                </select>
                <label>Bank</label>
              </div>
            </div>
            <button class="waves-effect waves-light btn" @click.prevent="calculatePayment">Calculate</button>
          </form>
        </div>
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
import { required, minValue, maxValue, numeric, decimal, between } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    loading: false,
    dataSet: [
      { value: 0, color: '#4d64ff', label: 'Principal & interest' },
      { value: 0, color: '#7bd896', label: 'Homeowner\'s insurance' },
      { value: 0, color: '#d97f9f', label: 'Property tax' },
    ],
    banks: [],
    bank: null,
    homePrice: 70000,
    minLoan: 70000,
    maxLoan: 0,
    loanTerm: 0,
    minPayment: 0,
    minDownPaymentPercent: 0,
    interestRate: 0,
    principalAndInterest: 0,
    taxPercentPerYear: 0,
    propertyTax: 0,
    insurance: 0,
    currentBank: '',
    select: null
  }),
  validations() {
    return {
      homePrice: { 
        required, 
        numeric, 
        between: between(this.minLoan, this.maxLoan),
      },
      minPayment: { 
        required, 
        numeric,
        minValue: minValue(Math.floor(this.homePrice * this.minDownPaymentPercent / 100))
      },
      minDownPaymentPercent: { 
        required, 
        decimal, 
        minValue: minValue(this.bank.minDownPaymentPercent), 
        maxValue: maxValue(100) 
      }
    }
  },
  async mounted() {
    this.loading = true;
    this.banks = await this.$store.dispatch('getAllBanks');
    if(this.banks.length) {
      this.currentBank = this.$route.query.bank || this.banks[0].name;
      this.updateValues();
      this.calculatePayment();
      setTimeout(() => this.select = M.FormSelect.init(this.$refs.bankList), 0);
      setTimeout(() => M.updateTextFields(), 0);
    }
    this.loading = false;
  },
  computed: {
    monthlyPayment() {
      return this.principalAndInterest + this.propertyTax + this.insurance / 12;
    }
  },
  watch: {
    currentBank() {
      this.updateValues();
    },
    minDownPaymentPercent() {
      this.calculateMinPayment();
    },
    homePrice() {
      this.calculateMinPayment();
    }
  },
  methods: {
    updateValues() {
      this.banks
        .filter(bank => this.currentBank === bank.name)
        .map(bank => {
            this.bank = bank;
            Object.keys(bank).filter(k => k !== 'id' && k !== 'name')
              .forEach(k => this[k] = bank[k])
          }
        )
      this.calculateMinPayment();
    },
    calculateBaseSum() {
      return (this.homePrice - this.minPayment) * (
        ((this.interestRate / 100 / 12) * (1 + this.interestRate / 100 / 12)**(this.loanTerm * 12)) / 
        ((1 + this.interestRate / 100 / 12)**(this.loanTerm * 12) - 1));
    },
    calculatePropertyTaxForMonth() {
      return (this.homePrice * this.taxPercentPerYear / 100) / 12;
    },
    calculatePayment() {
      this.principalAndInterest = this.calculateBaseSum();
      this.propertyTax = this.calculatePropertyTaxForMonth();
      const values = [this.principalAndInterest, this.insurance / 12, this.propertyTax];
      this.dataSet.forEach((data, indx) => data.value = values[indx]);
    },
    calculateMinPayment() {
      this.minPayment = Math.floor(this.homePrice * this.minDownPaymentPercent / 100);
    },
    async saveComputation() {
      if(this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      const bankId = this.bank.id;

      const formData = {
        bankname: this.bank.name,
        date: new Date(),
        total: +this.monthlyPayment,
        basesum: +this.calculateBaseSum(),
        tax: +this.taxPercentPerYear,
        insurance: +this.insurance,
        initialloan: +this.homePrice,
        imprest: +this.minPayment,
        imprestpercent: +this.minDownPaymentPercent,
        term: +this.loanTerm,
        interestrate: +this.interestRate,
      };

      await this.$store.dispatch('createRecord', { bankId, formData});

      this.$v.$reset();
      this.homePrice = this.minLoan;
      this.minDownPaymentPercent = this.bank.minDownPaymentPercent;
      this.minPayment = Math.floor(this.homePrice * this.minDownPaymentPercent / 100);
      this.calculatePayment();
    }
  },
  components: {
    Chart
  },
  destroyed() {
    if(this.select) {
      this.select.destroy();
    }
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

  .calculator-params__image {
    width: 100%;
    margin-bottom: 2rem;
  }

  .image {
    width: 100%;
  }

  .align-center {
    display: flex;
    align-items: center;
  }

  .right {
    width: 72%;
  }

  input.appended {
    padding-right: 1rem;
    width: calc(100% - 1rem);
  }

  input.prepended {
    padding-left: 1rem;
    width: calc(100% - 1rem);
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