<template>
  <WalletMultiButton
    :openOnboardingUrls="false"
    :connecting="connecting"
    @copy="onCopy"
    @error="onWalletError"
    @connect="onConnected"
    @disconnect="onDisconnect"
    :wallets="custom_wallets"
    :auto-connect="true"
    :featured="3"
    dark
  ></WalletMultiButton>
</template>

<script>
import { WalletMultiButton } from "@alphabatem/vue2-wallet-adapter";

export default {
  name: "MultiWallet",
  components: {
    WalletMultiButton,
  },
  props: {
    button_text: {
      type: String,
      default: function () {
        return "Connect Wallet";
      },
    },
  },
  data() {
    return {
      key: 0,
      attempts: 0,
      connecting: false,
      custom_wallets: [
        //
      ],
    };
  },
  watch: {
    "$store.state.wallet.wallet"() {
      console.log("MultiWallet::Force update");
      this.$forceUpdate();
    },
  },
  methods: {
    onDisconnect() {
      console.log("onDisconnect");
      this.$toastr.e("Wallet disconnected");
      this.$store.dispatch("wallet/walletDisconnected");
      localStorage.removeItem("walletName");
    },

    onCopy(addr) {
      this.$toastr.s(addr, "Address copied to clipboard");
    },

    onWalletError(e) {
      // console.error("Wallet error", e)
      this.$toastr.e(e, "Wallet Error");
    },

    async onConnected(wallet) {
      if (!wallet) return;

      console.log("onConnected Wallet", wallet.adapter);

      await wallet.adapter.connect();

      if (!this.$store.state.wallet.connected)
        this.$toastr.s(wallet.adapter?.publicKey || "", "Wallet connected!");

      setTimeout(() => {
        this.$store.commit("wallet/set_wallet", wallet.adapter);
        this.$store.commit(
          "wallet/set_wallet_address",
          wallet.adapter?.publicKey
        );

        this.$emit("connected", true);
        this.$store.dispatch("wallet/walletConnected");
        this.$store.dispatch("cache/refreshUserBalance");
      }, 1200);

      window.gtag("event", "wallet_connect");
    },
  },
};
</script>

<style>
.swv-dropdown-list li {
  font-size: 0.9rem !important;
}
</style>