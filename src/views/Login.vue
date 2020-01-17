<template>
  <v-container>
    <v-flex xs12>
      <v-img :src="require('../assets/CQ_-Logo.png')" class="my-3" contain height="200"></v-img>
    </v-flex>

    <v-row class="mb-6" justify="center" no-gutters>
      <v-col cols="9">
        <v-form ref="form">
          <v-text-field v-model="username" label="Username" required></v-text-field>
          <v-text-field v-model="password" label="Password" :type="'password'" required></v-text-field>

          <v-btn color="warning" @click="login">OK</v-btn>
          <router-link to="/">
            <div class="mt-12 text-center">Noch kein Account?</div>
          </router-link>
        </v-form>
      </v-col>
    </v-row>
    <v-alert v-show="alert == true" type="error">{{alertMsg}}</v-alert>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: "",
    password: "",
    alert: false,
    alertMsg: ""
  }),
  methods: {
    async login() {
      let res = await axios.post("http://localhost:5555/anmelden", {
        username: this.username,
        password: this.password
      });
      console.log(res);
      //wenn alles gut token zur auth in localstorage gespeichert
      if (res.status == 200) {
        localStorage.setItem("token", res.data.token);
        this.$router.push("/Startseite");
      } else if (res.status == 401) {
        this.alert = true;
        this.alertMsg = "Daten stimmen nicht";
      } else if (res.status == 400) {
        this.alert = true;
        this.alertMsg = "User existiert nicht";
      }
      //   console.log(res.data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>