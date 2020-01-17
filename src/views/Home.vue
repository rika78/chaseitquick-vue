<template>
  <!-- <HelloWorld /> -->
  <div>
    <v-container>
      <v-layout text-center wrap>
        <v-flex xs12>
          <v-img :src="require('../assets/CQ_-Logo.png')" class="my-3" contain height="200"></v-img>
        </v-flex>

        <v-col cols="12" sm="12">
          <div class="text-center">
            <div class="my-2">
              <!-- FIX ME: Change Dark - primary Color, secondary etc. src/plugins/vuetify -->
              <v-btn rounded color="primary" dark to="/anmelden">Anmelden</v-btn>
            </div>
            <div class="my-2">
              <v-btn rounded color="primary" dark to="/registrieren">Registrieren</v-btn>
            </div>
          </div>
        </v-col>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
// import HelloWorld from '../components/HelloWorld';

export default {
  components: {
    // HelloWorld,
  }
};
</script>

<style >
</style>
