<template>
  <div
    class="transaction-status-modal container-fluid"
    v-show="show"
    @click="close"
  >
    <div
      class="col-12 col-md-7 col-lg-6 col-xl-4"
      style="margin-left: auto; pointer-events: all"
    >
      <div
        class="card animate__animated animate__fadeIn"
        @click="(e) => e.stopPropagation()"
      >
        <div class="card-header">
          <div class="row">
            <div class="col"><h4 class="mb-0">Transactions</h4></div>
            <div class="col-auto" @click="close">
              <i class="fa fa-close close"></i>
            </div>
          </div>
        </div>
        <div class="card-body">
          <table class="table table-sm table-borderless">
            <SignatureStatus
              @success="onSuccess"
              @error="onError"
              v-for="sig in signatures"
              :signature="sig"
              :key="sig"
            ></SignatureStatus>
          </table>
        </div>
        <div class="card-footer text-end">
          <button
            @click="close"
            :class="isDone ? 'btn-success' : ''"
            class="btn btn-white py-0 btn-sm text-uppercase"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SignatureStatus from "@/components/transaction/SignatureStatus.vue";

export default {
  name: "SignatureStatusModal",
  components: { SignatureStatus },
  data() {
    return {
      //
      interval: null,
      successCount: 0,
      errorCount: 0,
      signatures: [],
    };
  },
  watch: {
    "$store.state.signatures.activeSignatureCount": function () {
      this.signatures = Object.keys(
        this.$store.state.signatures.activeSignatures
      );
    },
  },
  computed: {
    show: function () {
      return this.signatures.length > 0;
    },
    lastCheck: function () {
      return this.$store.state.signatures.lastCheck;
    },
    isDone: function () {
      return this.successCount + this.errorCount >= this.signatures.length;
    },
  },
  methods: {
    close: function () {
      this.$store.commit("signatures/clear_all");
    },
    onSuccess: function () {
      this.successCount++;
    },
    onError: function () {
      this.errorCount++;
    },
  },
  mounted() {
    //TODO this is bad
    this.interval = setInterval(() => {
      this.$store.dispatch("signatures/refresh");
    }, 1200);
  },
  beforeDestroy() {
    clearInterval(this.interval);
  },
};
</script>

<style scoped>
.card {
  width: 100%;
  animation-delay: 0.3s;
}

.close {
  cursor: pointer;
}
</style>
