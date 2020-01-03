<template>
  <v-container>
    <v-flex xs12>
      <v-img :src="require('../assets/CQ_-Logo.png')" class="my-3" contain height="200"></v-img>
    </v-flex>

    <!-- TODO: Logic hinzufügen -->
    <v-row class="mb-6" justify="center" no-gutters>
      <v-col cols="9">
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-text-field
            v-model="username"
            :counter="15"
            :rules="nameRules"
            label="Username"
            required
          ></v-text-field>

          <v-text-field v-model="email1" :rules="emailRules" label="Email" required></v-text-field>

          <v-text-field
            v-model="email2"
            :rules="emailConfirmationRules"
            label="Email wiederholen"
            required
          ></v-text-field>

          <v-text-field
            v-model="password1"
            :rules="passwordConfirmation"
            :type="'password'"
            label="Passwort"
            required
          ></v-text-field>

          <v-text-field
            v-model="password2"
            :rules="passwordConfirmation"
            :type="'password'"
            label="Passwort wiederholen"
            required
          ></v-text-field>

          <v-btn to='' color="warning" @click="addUser">OK</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>



<script>
import axios from "axios";

export default {
  data: () => ({
    valid: true,
    username: "",
    nameRules: [
      v => !!v || "Username is required",
      v => (v && v.length <= 15) || "Name must be less than 10 characters"
      // FIX ME: Keine Sonderzeichen!
    ],
    email1: "",
    email2: "",
    password1: "",
    password2: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],

    select: null,
    checkbox: false,
    lazy: false
  }),
  computed: {
    emailConfirmationRules() {
      return [
        () => this.email1 === this.email2 || "E-mail must match",
        v => !!v || "Confirmation E-mail is required"
      ];
    },
    passwordConfirmation() {
      return [
        () => this.password1 === this.password2 || "Password must match",
        v => !!v || "Confirmation Password is required"
      ];
    }
  },
  methods: {
    async addUser() {
      let res = await axios.post("http://127.0.0.1:3000/registrieren", {
        username: this.username,
        email: this.email1,
        password: this.password1
      });
      console.log(res.data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
