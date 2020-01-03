<template>
  <!-- <div>
    <v-app-bar dense dark>
      <v-btn icon>
        <v-img :src="require('../assets/CQ_-Logo.png')" contain height="30"></v-img>
      </v-btn>
      <v-toolbar-title>Chaseitquick</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </v-app-bar>

    <v-container grid-list-md text-md-center fluid fill-height>
      <v-layout column>
        <v-flex md1 d-flex color="primary">
          <v-card dark color="primary">
            <v-card-text class="px-0">Header</v-card-text>
          </v-card>
        </v-flex>
        <v-flex md11 d-flex>
          <v-card dark color="primary">
            <v-card-text class="px-0">Body</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
  </v-container>-->

  <div id="app">
    <!-- Navigation -->
    <v-app id="test">
      <v-app-bar dense dark>
        <v-btn icon>
          <v-img :src="require('../assets/CQ_-Logo.png')" contain height="30"></v-img>
        </v-btn>
        <v-toolbar-title>Chaseitquick</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn @click="logout">Logout</v-btn>
      </v-app-bar>

      <v-container grid-list-sm text-sm-center fluid fill-height>
        <v-layout column>
          <!-- Profile -->
          <v-flex sm11 d-flex justify-center>
            <v-card dark color="#18AFBC" width="100%">
              <v-row justify="space-around">
                <v-avatar class="mt-12" color="indigo" width="200px" height="200px">
                  <v-icon size="50" dark>mdi-account-circle</v-icon>
                </v-avatar>
              </v-row>
              <v-card-text class="px-1">Hallo, {{username}}</v-card-text>
            </v-card>
          </v-flex>
          <!-- Modus -->
          <v-flex sm11 d-flex justify-center color="#333A46">
            <v-card dark color="#333A46" width="100%">
              <v-container class="mx-auto" grid-list-sm text-xm-center>
                <v-layout row wrap class="mt-12">
                  <v-flex sm6 xs6>
                    <v-btn to="/spiel/schnitzeljagd" x-large color="#18AFBC" dark>Schnitzejagd</v-btn>
                  </v-flex>
                  <v-flex sm6 xs6>
                    <v-btn x-large color="#18AFBC" dark disabled>___DISABLED___</v-btn>
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex sm6 xs6>
                    <v-btn x-large color="#18AFBC" dark disabled>___DISABLED___</v-btn>
                  </v-flex>
                  <v-flex sm6 xs6>
                    <v-btn x-large color="#18AFBC" dark disabled>___DISABLED___</v-btn>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-app>
  </div>
</template>


<script>
import axios from "axios";
export default {
  data() {
    return {
      username: "",
      email: ""
    };
  },
  created() {
    //User nicht auth
    if (localStorage.getItem("token") == null) {
      this.$router.push("/anmelden");
    }
  },
  mounted() {
    axios
      .get("http://localhost:3000/profil", {
        headers: { token: localStorage.getItem("token") }
      })
      .then(res => {
        (this.username = res.data.user.username),
          (this.email = res.data.user.email);
      });
  },
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push("/anmelden");
    }
  }
};
</script>

<style lang="scss" scoped>
</style>