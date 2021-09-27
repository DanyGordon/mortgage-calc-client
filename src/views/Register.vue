<template>
  <div class="card card-login">
    <div class="logo-container">
      <h3>Mortgage Calculator</h3>
      <h4>Registration</h4>
    </div>
    <form @submit.prevent="submitForm">
      <div class="input-field col s12">
        <input type="text" class="validate" v-model="email"
          :class="{ invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email) }">
        <label>Email</label>
        <span class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">
          Field Email is Required!  
        </span>
        <span class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.email">
          Field Email must be email like!  
        </span>
      </div>
      <div class="input-field col s12">
        <input type="text" class="validate" v-model="name"
          :class="{ invalid: ($v.name.$dirty && !$v.name.required) || ($v.name.$dirty && !$v.name.minLength) }">
        <label>Name</label>
        <span class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.required">
          Field Name is Required!  
        </span>
        <span class="helper-text invalid" v-if="$v.name.$dirty && !$v.name.minLength">
          Field Name must have as least 2 char length!  
        </span>
      </div>
      <div class="input-field col s12">
        <input type="password" class="validate" v-model="password"
          :class="{ invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength) }">
        <label>Password</label>
        <span class="helper-text invalid" v-if="$v.password.$dirty && !$v.password.required">
          Field Password is Required!  
        </span>
        <span class="helper-text invalid" v-if="$v.password.$dirty && !$v.password.minLength">
          Field Password must have as least 8 char length!  
        </span>
      </div>
      <button type="submit" class="waves-effect waves-light btn" @click.prevent="submitForm">Sign Up</button>
    </form>
    <router-link to="/login" tag="a" class="flow-link bottom-right">Sign In<i class="material-icons">arrow_forward</i></router-link>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  name: 'Registr',
  data: () => ({
    email: '',
    name: '',
    password: ''
  }),
  validations: {
    email: { required, email },
    name: { required, minLength: minLength(2) },
    password: { required, minLength: minLength(8) }
  },
  methods: {
    async submitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      
      const formData = { email: this.email, name: this.name, password: this.password };

      try {
        await this.$store.dispatch('register', formData);
        this.$router.push('/login');
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>