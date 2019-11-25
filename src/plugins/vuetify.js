import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

//TODO: Color
export default new Vuetify({
  icons: {
    iconfont: "mdi"
  },
  theme: {
    dark: {
      primary: "#18AFBC",
      secondary: "#333A46",
      accent: "#82B1FF",
      error: "#FF5252",
      info: "#2196F3",
      success: "#4CAF50",
      warning: "#FFC107"
    }
  }
});