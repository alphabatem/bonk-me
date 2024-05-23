<template>
  <div class="flex justify-between items-end sm:gap-4">
    <label class="field-group text-secondary" label="Per Page">
      <select v-model="perPage" class="input max-w-20">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </select>
    </label>

    <article class="flex items-end">
      <button
        @click="prev"
        :disabled="disablePrevButton"
        class="btn text-white bi-chevron-left"
      ></button>

      <label class="field-group text-secondary" label="Page">
        <div class="input-group input w-auto">
          <input
            @change="setPage"
            v-model="page"
            class="input"
            type="number"
            value="1"
          />

          <span class="min-w-14">
              of {{ getTotalPages }}
          </span>
        </div>
      </label>

      <button
        @click="next"
        :disabled="disableNextButton"
        class="btn text-white bi-chevron-right"
      ></button>
    </article>
  </div>
</template>

<script>
export default {
  name: "ListCarouselButton",
  props: {
    length: Number,
  },
  data: () => {
    return {
      page: 1,
      perPage: 5,
    };
  },
  watch: {
    getStartAndEndIndex() {
      this.change();
    },
  },
  computed: {
    getTotalPages() {
      return Math.ceil(this.length / this.perPage);
    },
    getStartAndEndIndex() {
      let end = this.page * this.perPage;
      const start = end - this.perPage;

      if (end > this.length) {
        end = this.length;
      }

      return { start, end };
    },
    disablePrevButton() {
      const { start } = this.getStartAndEndIndex;

      return start === 0;
    },
    disableNextButton() {
      const { end } = this.getStartAndEndIndex;

      return end >= this.length;
    },
  },
  methods: {
    setPage() {
      if (this.page > this.getTotalPages) {
        this.page = this.getTotalPages;
      }
      if (this.page < 1) {
        this.page = 1;
      }
    },
    next() {
      this.page = Number(this.page) + 1;
    },
    prev() {
      this.page = Number(this.page) - 1;
    },
    change() {
      this.$emit("change", this.getStartAndEndIndex);
    },
  },
};
</script>

<style>
.input-group {
  flex-wrap: nowrap!important;
}
</style>
