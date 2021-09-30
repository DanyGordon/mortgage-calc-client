<template>
<div class="calculator-params__container">
  <div class="calculator-params__image">
    <img class="image" src="https://cdn.pixabay.com/photo/2019/08/22/15/21/modern-4423814_960_720.png" alt="Home Icons" width="303" height="165">
  </div>
  <form class="calculator-params__form" @submit.prevent="calculatePayment">
    <div class="params-form__price">
      <div class="price__title row align-center">
        <div class="input-field col s6">
          <input id="initial-loan" class="calculator-input prepended" type="number" v-model="homePrice"
            :class="{ invalid: ($v.homePrice.$dirty && !$v.homePrice.required) || ($v.homePrice.$dirty && !$v.homePrice.numeric) || 
            ($v.homePrice.$dirty && !$v.homePrice.between) }">
          <label for="initial-loan">Home Price</label>
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
        <span class="col s4 info-title">Initial loan</span>
      </div>
      <div class="price__range">
        <input class="calculator-range" type="range" :min="minLoan" :max="maxLoan" step="50" v-model.number="homePrice">
      </div>
    </div>
    <div class="params-form__inputes row">
      <div class="input-field col s8">
        <input id="down-payment" class="validate prepended" type="number" v-model="minPayment"
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
        <label for="down-payment">Down payment</label>
      </div>
      <div class="input-field col s4">
        <input id="down-payment-percent" class="validate appended" type="number" min="0" step="0.01" max="100" v-model="minDownPaymentPercent"
          :class="{ invalid: ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.required) || 
            ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.decimal) || 
            ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.minValue) ||
            ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.maxValue) }">
        <label for="down-payment-percent">Down percent</label>
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
        <select id="bank" ref="bankList" v-model="currentBank">
          <option disabled selected>Choose a Bank</option>
          <option 
            v-for="bank in banks" 
            :value="bank.name" 
            :key="bank.id"
          >{{ bank.name }}</option>
        </select>
        <label for="bank">Bank</label>
      </div>
    </div>
    <button class="btn waves-effect waves-light" @click.prevent="calculatePayment">Calculate</button>
  </form>
</div>
</template>

<script>
import { required, minValue, maxValue, numeric, decimal, between } from 'vuelidate/lib/validators'

export default {
  props: {
    banks: {
      type: Array,
      required: true
    },
    bank: {
      required: true
    }
  },
  data: () => ({
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
    _bank: {},
    computation: {},
    select: null,
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
        minValue: minValue(this._bank?.minDownPaymentPercent || 0), 
        maxValue: maxValue(100) 
      }
    }
  },
  mounted() {
    if(this.banks.length) {
      this.currentBank = this.$route.query.bank || this.banks[0].name;
      this._bank = this.bank;
      this.updateValues();
      this.calculatePayment();
      setTimeout(() => this.select = M.FormSelect.init(this.$refs.bankList), 0);
      setTimeout(() => M.updateTextFields(), 0);
    }
  },
  computed: {
    monthlyPayment() {
      return this.principalAndInterest + this.propertyTax + this.insurance / 12;
    }
  },
  methods: {
    calculatePayment() {
      if(this.$v.$invalid) {
        this.$v.$touch();
        return this.monthlyPayment;
      }
      this.principalAndInterest = this.calculateBaseSum();
      this.propertyTax = this.calculatePropertyTaxForMonth();
      const data = [
        { key: 'baseSum', value: this.principalAndInterest },
        { key: 'insurance', value: this.insurance / 12 }, 
        { key: 'tax', value: this.propertyTax }
      ];
      this.setComputation();
      this.$emit('getComputation', this.getComputation());
      this.$emit('updateChart', data);
    },
    updateValues() {
      this.banks.filter(bank => this.currentBank === bank.name).map(bank => {
        this._bank = bank;
        Object.keys(bank).filter(k => k !== 'id' && k !== 'name')
          .forEach(k => this[k] = bank[k])
      });
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
    calculateMinPayment() {
      this.minPayment = Math.floor(this.homePrice * this.minDownPaymentPercent / 100);
    },
    calculateMinPaymentPercent() {
      this.minDownPaymentPercent = Math.round(parseFloat(this.minPayment / this.homePrice * 100) * 100) / 100;
    },
    setComputation() {
      this.computation = {
        bankname: this._bank.name,
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
    },
    getComputation() {
      return this.computation;
    },
    reset() {
      this.$v.$reset();
      this.homePrice = this.minLoan;
      this.minDownPaymentPercent = this._bank.minDownPaymentPercent;
      this.minPayment = Math.floor(this.homePrice * this.minDownPaymentPercent / 100);
      this.calculatePayment();
    }
  },
  watch: {
    currentBank() {
      this.updateValues();
      this.$emit('changeCurrent', this.currentBank);
    },
    minPayment() {
      this.calculateMinPaymentPercent();
    },
    minDownPaymentPercent() {
      this.calculateMinPayment();
    },
    homePrice() {
      this.calculateMinPayment();
    },
    monthlyPayment() {
      this.$emit('total', this.monthlyPayment);
    }
  },
  destroyed() {
    if(this.select) {
      this.select.destroy();
    }
  }
}
</script>

<style scoped>
  .calculator-params__image {
    width: 100%;
    margin-bottom: 2rem;
  }
  .image {
    max-width: 303px;
    width: 100%;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
  .align-center {
    display: flex;
    align-items: center;
  }
  @media only screen and (max-width: 620px) {
    .btn {
      width: 100%;
    }
  }
  @media only screen and (min-width: 620px) and (max-width: 900px) {
    .btn {
      display: block;
      width: 80%;
      margin-right: auto;
      margin-left: auto;
    }
  }
</style>