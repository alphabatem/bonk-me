<template>
  <nav
    class="navbar navbar-expand-lg navbar-dark bg-dark gradient-primary py-1 z-[1]"
  >
    <div class="container-fluid container-xl">
      <router-link class="navbar-brand py-0" to="/">
        <h5 class="logo-name">Bonk Me</h5>
      </router-link>
      <button
        id="toggle"
        class="navbar-toggler collapsed"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse text-center"
        id="navbarSupportedContent"
      >
        <ul class="navbar-nav ms-auto mb-lg-0">
          <li class="nav-item d-flex align-items-center">
            <router-link
              class="nav-link"
              to="/stats"
              aria-label="Settings"
              ><i class="fa fa-crown nav-icon me-1"></i
              ><span>LEADERBOARD</span></router-link
            >
          </li>
          <li class="nav-item d-flex align-items-center">
            <router-link
              class="nav-link"
              to="/app/settings"
              aria-label="Settings"
              ><i class="fa fa-cog nav-icon me-1"></i
              ><span>SETTINGS</span></router-link
            >
          </li>
          <li
            class="nav-item d-flex align-items-center justify-content-center"
            v-if="!isDevice() || $store.state.wallet.connected"
          >
            <MultiWallet
              @connected="onWalletConnect"
              class="login wow fadeIn ms-0 ms-md-4"
            ></MultiWallet>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import MultiWallet from "@/components/wallet/MultiWallet.vue";

export default {
  name: "Navbar",
  components: { MultiWallet },
  data() {
    return {
      interval: null,
    };
  },
  methods: {
    logout: function (e) {
      e.preventDefault();
      this.$store.commit("wallet/clear_wallet");
      localStorage.removeItem("walletName");
    },
    onWalletConnect: function () {
      console.log("Navbar::onWalletConnect");
      this.refreshBalance();
    },
    refreshBalance: function () {
      if (!this.$store.state?.wallet?.connected) return;

      this.$store.dispatch("cache/refreshUserBalance");
    },
    closeNav: function () {
      document.querySelector("#toggle").classList.toggle("collapsed");
      const content = document.querySelector("#navbarSupportedContent");
      content.classList.toggle("collapsing");
      content.classList.remove("show");
    },
    isDevice: function () {
      return window.innerWidth < 992;
    },
  },
  mounted() {
    this.interval = setInterval(() => this.refreshBalance(), 20000);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
  beforeRouteUpdate() {
    console.log("route update");
    this.closeNav();
  },
};
</script>

<style scoped>
.nav-icon {
  transform: scale(0.8);
}
.collapse {
  visibility: visible;
}
</style>
