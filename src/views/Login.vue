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
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  data: () => ({
    username: "",
    password: ""
  }),
  methods: {
    async login() {
      let res = await axios.post("http://127.0.0.1:3000/anmelden", {
        username: this.username,
        password: this.password
      });
      console.log(res);
      //wenn alles gut token zur auth in localstorage gespeichert
      if (res.status == 200) {
        localStorage.setItem("token", res.data.token);
        this.$router.push("/Startseite");
      }
      //   console.log(res.data);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>