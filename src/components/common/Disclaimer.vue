<template>
  <div class="disclaimer" v-show="show">
    <div class="container-fluid">
      <div class="col-12 col-md-8 col-lg-6 mx-auto">
        <div class="card animate__animated animate__fadeIn">
          <div class="card-header text-center">
            <h1>Disclaimer</h1>
          </div>
          <div class="card-body">
            <p>
              Fluxbeam.xyz hosts a non-custodial web dApp that allows access to
              several smart contracts deployed on the Solana Blockchain; it is
              not a regulated financial or payment service of any kind and in
              any jurisdiction. Any term including but not limited to "swap",
              "exchange", "asset", "liquidity", "pool", "fee" found in this
              website or in the dApp are used only as a basic reference, without
              any effective or legal meaning of the same terms in a regulated
              and/or traditional financial environment. The Fluxbeam smart
              contracts do not support usage or work at all with security tokens
              of any kind. Fluxbeam does not allow, process or facilitate in any
              way user-to-user transfer of any token or other assets or values,
              nor third party payments of any kind. As explained and confirmed
              in greater detail in the Terms of Use accessible from this
              website, remember that using Fluxbeam involves various risks,
              including, but not limited to, malicious computer attacks, failure
              of the software, and losses due to the fluctuation of the price of
              the tokens; any such risks might lead to losses that can be total
              and final. The informational material available on this website
              and/or on the dApp/user interface is not solicitation, advice or
              recommendation to buy, trade or sell any digital assets.
            </p>
          </div>
          <div class="card-footer">
            <button class="btn btn-solid-primary w-100" @click="accept">
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Disclaimer",
  data() {
    return {
      show: localStorage.getItem("fluxbeam:disclaimer:accept") === null,
    };
  },
  methods: {
    accept: function () {
      localStorage.setItem("fluxbeam:disclaimer:accept", "1");
      this.show = !this.show;
    },
  },
};
</script>

<style scoped>
.disclaimer {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 99;
  background: rgba(0, 0, 0, 0.6);
  top: 0;
  left: 0;
}

.container-fluid {
  margin-top: 15vh;
}

.card-body {
  max-height: 60vh;
  overflow-y: scroll;
}
</style>
