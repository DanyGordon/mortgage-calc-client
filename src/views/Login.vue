<template>
  <div class="card card-login">
    <div class="logo-container">
      <h3>Mortgage Calculator</h3>
      <h4>Login</h4>
    </div>
    <form>
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
      <button type="submit" class="waves-effect waves-light btn" @click.prevent="submitForm">Sign In</button>
    </form>
    <router-link to="/register" tag="a" class="flow-link bottom-right">Sign Up<i class="material-icons">arrow_forward</i></router-link>
  </div>
</template>

<script>
import { required, minLength, email } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    email: null,
    password: null
  }),
  validations: {
    email: { required, email },
    password: { required, minLength: minLength(8) }
  },
  methods: {
    async submitForm() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      
      const formData = { email: this.email, password: this.password };

      try {
        await this.$store.dispatch('login', formData);
        this.$router.push('/');
      } catch (error) {
        console.log(error);
      }
    }
  }
}
</script>