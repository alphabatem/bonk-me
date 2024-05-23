import Vue from "vue";
import "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// @ts-ignore
import VueToastr from "vue-toastr";
import PortalVue from "portal-vue";

import "animate.css";

import "@/assets/css/tailwindcss.css";
import "@/assets/css/wallet_adapter.css";
import "@/assets/css/wallet_adapter_custom.css";
import "@chrissgon/perfectui/dist/perfectui.css";
import { setThemeColor, setMode } from "@chrissgon/perfectui";
import "@/assets/css/bonk_override.css";

setMode("dark")

setThemeColor({
  50: [239, 254, 253],
  100: [199, 255, 252],
  200: [142, 255, 251],
  300: [73, 250, 247],
  400: [26, 228, 231],
  500: [1, 197, 203],
  600: [0, 156, 164],
  700: [3, 122, 130],
  800: [8, 96, 103],
  900: [12, 80, 85],
  950: [0, 46, 52],
});

Vue.config.productionTip = false;

Vue.use(PortalVue);

Vue.use(VueToastr, {
  defaultProgressBar: true,
  defaultPosition: "toast-bottom-left",
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
