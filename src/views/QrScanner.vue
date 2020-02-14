<template>
  <v-app>
    <p class="error">{{ error }}</p>
    <div class="mx-auto mt-12 pt-25">
      <p>{{hinweise[gefunden]}}</p>
      <p>{{gefunden}} /6</p>

      <p>Last Result: {{result}}</p>
      <p>Timer: {{min}} : {{sec}}</p>
      <p>Punkte {{punkte}}</p>
    </div>

    <!-- Kamera wird nachgefragt -->
    <qrcode-stream v-show="isShowingCamera" @decode="onDecode" @init="onInit" />

    <v-bottom-navigation background-color="transparent" fixed>
      <v-btn to="/startseite" class="ml-0">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <!-- Kamera wird geöffnet -->
      <v-btn @click="openCamera" class="mr-12">
        <v-icon>mdi-camera-iris</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
/*eslint-disable */
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
      time: {},
      timer: null,
      uid: 0,
      qrcodes: [],
      min: 0,
      sec: 0
    };
  },
  mounted() {
    axios
      .get("http://localhost:5555/profil", {
        headers: { token: localStorage.getItem("token") }
      })
      .then(res => {
        (this.username = res.data.user.username),
          (this.uid = res.data.user.uid),
          (this.email = res.data.user.email);
      });
  },
  created() {
    //User nicht auth
    if (localStorage.getItem("token") == null) {
      this.$router.push("/anmelden");
    }
    this.getQRCodes();
  },
  methods: {
    openCamera() {
      // console.log(this.isShowingCamera);
      if (this.isShowingCamera == false) {
        this.isShowingCamera = true;
      } else {
        this.isShowingCamera = false;
      }
    },
    async getQRCodes() {
      let res = await axios.get("http://localhost:5555/qrcodes/alle");
      this.qrcodes = res.data;
    },
    async addFound(qr) {
      let log = await axios.post(
        `http://localhost:5555/qrcodes/gefunden/${this.uid}`,
        {
          uid: this.uid,
          qid: qr
        }
      );
      console.log(log.data);
      this.gefunden = log.data.length;
      //TODO: Wenn es der zweite QRCode ist dann wird die Zeit geholt:
      if (log.data.length == 2) {
        this.getTime();
      }
    },

    async onDecode(result) {
      this.result = result;
      console.log(this.uid); // Jetziger angemeldeter uid

      let qr = this.qrcodes.filter(el => el.qrcontent == this.result); //alle qr codes werden mit dem verglichen

      //Get History von dem user
      let his = await axios.get(
        `http://localhost:5555/qrcodes/found/${this.uid}`
      );
      let history = his.data; //Alles was der user schon gefunden hat

      if (this.gefunden == 6) {
        // Wenn der user schon 6 QRCodes gefunden hat
        console.log("Neue Seite, sie haben gewonnen");
        this.isShowingCamera = false;
      } else if (
        history.filter(el => el.qid == qr[0].qid).length == 0 &&
        history.filter(el => el.qid == qr[0].qid).length < 6
      ) {
        //Wenn QR Code noch nicht im history dann wird er gespeichert und wenn weniger als 6 im history sind
        if (this.gefunden == 0) {
          if (qr[0].qid != 1) {
            console.log("Wrong QR Code");
          } else {
            this.addFound(qr[0].qid);
          }
        }
        // Nur der nachfolger vom letzten gespeicherten qrcode darf gespeichert werden:
        else if (this.gefunden > 0) {
          this.gefunden++;
          if (qr[0].qid != this.gefunden) {
            console.log(`${qr[0].qid},${this.gefunden}`);
            console.log("Wrong QR Code");
            this.isShowingCamera = false;
            this.gefunden--;
          } else {
            this.addFound(qr[0].qid);
            this.stopCountdown();
          }
        }

        this.isShowingCamera = false;
      } else {
        console.log("wurde schon eingescannt");
      }
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
      console.log("hi");
      let res = await axios.get(
        `http://localhost:5555/qrcodes/found/time/${this.uid}`
      );
      // res.data
      let t1t2 = res.data[0];
      console.log(t1t2.timediff);
      this.time = t1t2.timediff;
      this.startCountdown();
    },
    startCountdown() {
      let counter = 0;
      let minutes = this.time.minutes * 60; // Die Minuten in Sekunden
      let gesamtdauer = this.time.seconds + minutes; // Gesamter dauer

      this.timer = setInterval(() => {
        counter++; //Alle 1sek wird hochgezählt
        let gesamt = gesamtdauer - counter; //Alle

        this.min = Math.floor(gesamt / 60);
        this.sec = gesamt % 60;
      }, 1000);
    },
    //TODO: Countdown stoppen und
    stopCountdown(qid) {
      console.log("stop");
      clearInterval(this.timer);
      this.punktesystem();
      /*TODO: Pop-UP "Nice! Verdiente Punkte: punkte anzahl" -> nachdem okay button wird der Countdown wieder gestartet */
      this.min = 0;
      this.sec = 0;
      this.startCountdown();
    },
    //Done: punktsystem
    punktesystem() {
      console.log("punkte");
      let gespunkte = 1000;
      let gesamtdauer = this.time.seconds + this.time.minutes * 60; // Gesamter dauer
      let scanndauer = gesamtdauer - (this.sec + this.min * 60); // Dauer nach der gescannten QR Code
      console.log(`scanndauer:${scanndauer}, gesamtdauer:${gesamtdauer}`);
      /*Ausrechnen der punktewert*/
      let punktewert = (gespunkte / gesamtdauer) * 10; // Wv die Punkte wert sind pro 10 sek

      /*Ausrechnen der gesamtpunkte */

      if (scanndauer == 0) {
        this.punkte = gespunkte;
      } else if (scanndauer < 0) {
        // Negative Zahl umwandeln
        let posdauer = scanndauer * -1;
        this.punkte = this.punkte + Math.floor((posdauer / 10) * punktewert);
      } else if (scanndauer > 0) {
        this.punkte = this.punkte + Math.floor((scanndauer / 10) * punktewert);
      }
    }
  }
};

/*
In der datenbank gespeichert format:
2020-01-17 03:02:27.726202

Nehmen nur Uhr Zeit, wie?


Uhrzeit von QrCode2 - Uhrzeit von QrCode 1 = Zeitabstand in den anderen QrCodes gescanned werden müssen
Aufbau:
0:
timediff:
minutes: 1
seconds: 9
milliseconds: 803.233

*/
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>


