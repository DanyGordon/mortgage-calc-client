<template>
  <form class="row" @submit.prevent="submitForm">
    <div class="input-field col s12">
      <input placeholder="Bank Name" id="bankName" 
        type="text" class="validate" v-model.trim="name"
        :class="{ invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength) }">
      <label for="bankName">Bank Name</label>
      <span class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">
        Field Name is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.minLength">
        Field Name must have as least 2 char length!  
      </span>
    </div>
    <div class="input-field col s6 m8">
      <input placeholder="Maximum Loan" id="maxLoan" 
        type="number" class="validate" v-model="maxLoan"
        :class="{ invalid: ($v.maxLoan.$dirty && !$v.maxLoan.required) || ($v.maxLoan.$dirty && !$v.maxLoan.numeric) || ($v.maxLoan.$dirty && !$v.maxLoan.between) }">
      <label for="maxLoan">Maximum Loan</label>
      <span class="helper-text invalid" v-if="$v.maxLoan.$dirty && !$v.maxLoan.required">
        Field Maximum Loan is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.maxLoan.$dirty && !$v.maxLoan.numeric">
        Field Maximum Loan must be numeric!  
      </span>
      <span class="helper-text invalid" v-if="$v.maxLoan.$dirty && !$v.maxLoan.between">
        Field Maximum Loan value must be between 70K and 4M!  
      </span>
    </div>
    <div class="input-field col s6 m4">
      <input placeholder="Loan Term" id="loanTerm" 
        type="number" class="validate" v-model="loanTerm"
        :class="{ invalid: ($v.loanTerm.$dirty && !$v.loanTerm.required) || ($v.loanTerm.$dirty && !$v.loanTerm.numeric) || ($v.loanTerm.$dirty && !$v.loanTerm.between) }">
      <label for="loanTerm">Loan Term (Years)</label>
      <span class="helper-text invalid" v-if="$v.loanTerm.$dirty && !$v.loanTerm.required">
        Field Loan Term is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.loanTerm.$dirty && !$v.loanTerm.numeric">
        Field Loan Term must be numeric!  
      </span>
      <span class="helper-text invalid" v-if="$v.loanTerm.$dirty && !$v.loanTerm.between">
        Field Loan Term value must be between 5 and 30!  
      </span>
    </div>
    <div class="input-field col s6 m3">
      <input placeholder="Interest Rate" id="interestRate"
        type="number" step="0.01" min="0" max="100" class="validate" v-model="interestRate"
        :class="{ 
          invalid: ($v.interestRate.$dirty && !$v.interestRate.required) || 
            ($v.interestRate.$dirty && !$v.interestRate.decimal) || ($v.interestRate.$dirty && !$v.interestRate.between) 
        }">
      <label for="interestRate">Interest Rate (%)</label>
      <span class="helper-text invalid" v-if="$v.interestRate.$dirty && !$v.interestRate.required">
        Field Interest Rate is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.interestRate.$dirty && !$v.interestRate.decimal">
        Field Interest Rate must be decimal!  
      </span>
      <span class="helper-text invalid" v-if="$v.interestRate.$dirty && !$v.interestRate.between">
        Field Interest Rate value must be between 0 and 100!  
      </span>
    </div>
    <div class="input-field col s6 m3">
      <input placeholder="Down Payment" id="downPayment"
        type="number" step="0.01" min="0" max="100" class="validate" v-model="minDownPaymentPercent"
        :class="{ invalid: ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.required) || 
          ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.decimal) || 
          ($v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.between) 
        }">
      <label for="downPayment">Down Payment (%)</label>
      <span class="helper-text invalid" v-if="$v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.required">
        Field Down Payment is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.decimal">
        Field Down Payment must be decimal!  
      </span>
      <span class="helper-text invalid" v-if="$v.minDownPaymentPercent.$dirty && !$v.minDownPaymentPercent.between">
        Field Down Payment value must be between 0 and 100!  
      </span>
    </div>
    <div class="input-field col s6 m3">
      <input placeholder="Tax Property" id="taxProperty" 
        type="number" step="0.01" min="0" max="100" class="validate" v-model="taxPercentPerYear"
        :class="{ invalid: ($v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.required) || 
          ($v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.decimal) || ($v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.between) }">
      <label for="taxProperty">Tax Property (%)</label>
      <span class="helper-text invalid" v-if="$v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.required">
        Field Tax Property is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.decimal">
        Field Tax Property must be decimal!  
      </span>
      <span class="helper-text invalid" v-if="$v.taxPercentPerYear.$dirty && !$v.taxPercentPerYear.between">
        Field Tax Property value must be between 0 and 100!  
      </span>
    </div>
    <div class="input-field col s6 m3">
      <input placeholder="Insurance" id="insurance" 
        type="number" class="validate" v-model="insurance"
        :class="{ invalid: ($v.insurance.$dirty && !$v.insurance.required) || ($v.insurance.$dirty && !$v.insurance.numeric) || 
          ($v.insurance.$dirty && !$v.insurance.minValue) }">
      <label for="insurance">Insurance Cost</label>
      <span class="helper-text invalid" v-if="$v.insurance.$dirty && !$v.insurance.required">
        Field Insurance Cost is Required!  
      </span>
      <span class="helper-text invalid" v-if="$v.insurance.$dirty && !$v.insurance.numeric">
        Field Insurance Cost must be numeric!  
      </span>
      <span class="helper-text invalid" v-if="$v.insurance.$dirty && !$v.insurance.minValue">
        Field Insurance Cost value must be greater than 0!  
      </span>
    </div>
    <div class="btn-right col s12">
      <button type="submit" class="btn waves-effect waves-light" @click.prevent="submitForm">
        Create<i class="material-icons right">send</i>
      </button>
    </div>
  </form>
</template>

<script>
import { required, minValue, minLength, numeric, decimal, between } from 'vuelidate/lib/validators'

export default {
  name: 'BankCreate',
  data: () => ({
    name: '',
    maxLoan: 0,
    loanTerm: 0,
    interestRate: 0,
    minDownPaymentPercent: 0,
    taxPercentPerYear: 0,
    insurance: 0,
  }),
  validations: {
    name: { required, minLength: minLength(2) },
    maxLoan: { required, numeric, between: between(70000, 4000000) },
    loanTerm: { required, numeric, between: between(5, 30) },
    interestRate: { required, decimal, between: between(0, 100) },
    minDownPaymentPercent: { required, decimal, between: between(0, 100) },
    taxPercentPerYear: { required, decimal, between: between(0, 100) },
    insurance: { required, numeric, minValue: minValue(0) },
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async submitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      
      const formData = {
        name: this.name,
        maxLoan: this.maxLoan,
        loanTerm: this.loanTerm,
        interestRate: this.interestRate,
        minDownPaymentPercent: this.minDownPaymentPercent,
        taxPercentPerYear: this.taxPercentPerYear,
        insurance: this.insurance,
      };

      const isSuccess = await this.$store.dispatch('createNewBank', formData);

      if(isSuccess) {
        M.toast({ html: `Successfully created ${this.name}!` });
        this.$v.$reset();
        this.name = '';
        this.maxLoan = 0;
        this.loanTerm = 0;
        this.interestRate = 0;
        this.minDownPaymentPercent = 0;
        this.taxPercentPerYear = 0;
        this.insurance = 0;
      }
    }
  }
}
</script>