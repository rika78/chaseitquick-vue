<template>
  <v-app>
    <p class="error">{{ error }}</p>
    <div class="mx-auto mt-12 pt-25">
      <p>{{hinweise[gefunden]}}</p>
      <p>{{gefunden}} /6</p>

      
      <p>Last Result: {{result}}</p>
    </div>

    <!-- Kamera wird nachgefragt -->
    <qrcode-stream v-show="isShowingCamera" @decode="onDecode" @init="onInit" />

    <v-bottom-navigation background-color="transparent" fixed>
      <v-btn to="/startseite" class="ml-0">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn @click="openCamera" class="mr-12">
        <v-icon>mdi-camera-iris</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>
  
<script>
import { QrcodeStream } from "vue-qrcode-reader";
import axios from "axios";

export default {
  components: { QrcodeStream },

  data() {
    return {
      result: "",
      error: "",
      isShowingCamera: false,
      gefunden: 0,
      username: "",
      email: "",
      hinweise: [
        "Im ganzen Schulhaus sind QR-Codes verteilt. Ihr müsst nun rumgehen und sie einsammeln.",
        "Der nächste QR Code ist im..",
        "...",
        "???",
        "???",
        "Zu guter Letzt",
        "Sie haben gewonnen"
      ],
      punkte: 0,
      time: ""
    };
  },
  mounted() {
    axios
      .get("http://localhost:5555/profil", {
        headers: { token: localStorage.getItem("token") }
      })
      .then(res => {
        (this.username = res.data.user.username),
          (this.email = res.data.user.email);
      });
  },
  created() {
    //User nicht auth
    if (localStorage.getItem("token") == null) {
      this.$router.push("/anmelden");
    }
  },
  methods: {
    openCamera() {
      // console.log(this.isShowingCamera);
      if (this.isShowingCamera == false) {
        this.isShowingCamera = true;
      } else {
        this.isShowingCamera = false;
      }
    },

    async onDecode(result) {
      this.result = result;

      let res = await axios.get("http://localhost:5555/qrcodes/alle");
      let qrcode = res.data; //alle qr codes
      console.log(res.data);

      //Array mit dem richtigen objekt
      let qr = qrcode.filter(el => el.qrcontent == result);
      console.log(qr[0].qid);

      //Get history
      let his = await axios.post("http://localhost:5555/qrcodes/found", {
        username: this.username
      });
      let history = his.data;
      this.gefunden = history.length;
      console.log(history);
      // console.log(history.filter(el => el.qid == qr[0].qid));
      // wenn alle qr codes gefunden auf andere seite
      if (this.gefunden == 6) {
        this.isShowingCamera = false;
      }
      //wenn qr code noch nicht eingescannt
      else if (history.filter(el => el.qid == qr[0].qid).length == 0) {
        let log = await axios.post("http://localhost:5555/qrcodes/gefunden", {
          username: this.username,
          qid: qr[0].qid
        });
        console.log(log);
        this.gefunden = log.data.length;
        if (this.gefunden == 2) {
          this.getTime();
        }
        this.isShowingCamera = false;
      } else {
        this.getTime();
        console.log("wurde schon eingescannt");

        this.isShowingCamera = false;
      }

      // //if decoded ist in Datenbank

      // //wenn qid noch nicht im log

      // console.log(log);

      // let history = log.data; // Alle gefundenen
      // console.log(history);

      // this.gefunden = history.length;
      // console.log(history.filter(el => el.qid == qr[0].qid)); //?

      // if (!history.filter(el => el.qid == qr[0].qid)) {
      //   //kamera schließen und zähler hoch
      //   if (qrcode.filter(el => el.qrcontent == result)) {
      //     let res = await axios.post("http://localhost:5555/qrcodes/gefunden", {
      //       username: this.username,
      //       qid: qr[0].qid
      //     });

      //     console.log(res);
      //

      //     console.log(history);
      //     this.isShowingCamera = false;

      //   }
      // } else {
      //   console.log("wurde schon eingescannt");
      // }
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERROR: you need to grant camera access permisson";
        } else if (error.name === "NotFoundError") {
          this.error = "ERROR: no camera on this device";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERROR: secure context required (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERROR: is the camera already in use?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERROR: installed cameras are not suitable";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERROR: Stream API is not supported in this browser";
        }
      }
    },
    async getTime() {
      console.log('hi');
      let res = await axios.post("http://localhost:5555/qrcodes/found/time", {
        username: this.username
      });
      // res.data
      let t1t2 = res.data;
      console.log(t1t2);
    }
  }
};

/*
In der datenbank gespeichert format:
2020-01-17 03:02:27.726202

Nehmen nur Uhr Zeit, wie?


Uhrzeit von QrCode2 - Uhrzeit von QrCode 1 = Zeitabstand in den anderen QrCodes gescanned werden müssen


*/
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>


