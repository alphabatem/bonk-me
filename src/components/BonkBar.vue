<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark gradient-primary pt-0 z-[1]">
    <div class="container-fluid px-0 bonk-bar">
      <div class="collapse navbar-collapse text-center" id="navbarSupportedContent">
        <ul class="navbar-nav">
          <li class="bonk-item d-flex align-items-center" v-for="(row, key) in rows" :key="key">
            <router-link class="small nav-link py-0" :to="`/bonks/${row.id}`" aria-label="Settings">
							<p class="mb-0">@{{row.target}}</p>
							<p class="xsmall mb-0">GOT BONKED!</p>
						</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>

export default {
  name: "BonkBar",
  data() {
    return {
      interval: null,
			rows: [],
    };
  },
  methods: {
		refresh: function() {
			this.getLatest().then(r => {
				this.rows = r
			})
		},
		getLatest: async function() {
			const resp = await fetch("https://bonk-api.fluxbeam.xyz/v1/stats/latest")
			if (resp.status !== 200) {
				throw resp.statusText
			}
			return await resp.json()
		}
  },
  mounted() {
		this.refresh()
		this.interval = setInterval(() => this.refresh(), 10_000)
  },
	beforeDestroy() {
		clearInterval(this.interval)
	}
};
</script>

<style scoped>
.bonk-item {
	border: 1px solid white;
	transition: background-color 0.3s linear;
}
.bonk-item:hover {
	background-color: rgba(255,255,255,0.3);
}

.collapse {
  visibility: visible;
}
</style>
