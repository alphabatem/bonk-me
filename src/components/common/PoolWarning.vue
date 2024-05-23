<template>
  <div class="disclaimer">
    <div class="container-fluid">
      <div class="col-10 col-md-6 col-lg-4 mx-auto">
        <div class="card animate__animated animate__fadeIn">
          <div class="card-header text-center">
            <h1>Warning</h1>
          </div>
          <div class="card-body">
            <p class="text-center">
              This trade has high price impact or low liquidity resulting in a
              bad price.
            </p>
            <p class="text-center">
              Are you sure you want to continue with this trade?
            </p>

            <table class="table my-4">
              <tbody>
                <tr>
                  <td>Liquidity:</td>
                  <td class="text-end">${{ liquidity.toFixed(2) }}</td>
                </tr>
                <tr>
                  <td>Price Impact:</td>
                  <td class="text-end">{{ priceImpact.toFixed(2) }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer">
            <button class="btn btn-danger w-100" @click="accept">Accept</button>
            <button class="btn btn-white w-100 mt-2" @click="cancel">
              Cancel
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
  props: {
    liquidity: {
      type: Number,
    },
    priceImpact: {
      type: Number,
    },
  },
  methods: {
    accept: function () {
      this.$emit("accept");
    },
    cancel: function () {
      this.$emit("close");
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
  margin-top: 25vh;
}

.card-body {
  max-height: 60vh;
  overflow-y: scroll;
}
</style>
