import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: '',
		component: () => import(/* webpackChunkName: "home" */ '../layouts/DefaultLayout.vue'),
		children: [
			{
				path: '/',
				name: 'Home',
				component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue')
			},
			{
				path: '/bonks/:id',
				name: 'Bonks',
				component: () => import(/* webpackChunkName: "bonk" */ '../views/BonkView.vue')
			},
			{
				path: 'stats',
				name: 'Stats',
				component: () => import(/* webpackChunkName: "settings" */ '../views/StatsView.vue')
			},
			{
				path: 'latest',
				name: 'Latest',
				component: () => import(/* webpackChunkName: "latest" */ '../views/LatestView.vue')
			},
			{
				path: '/auth/login',
				name: 'Login',
				component: () => import(/* webpackChunkName: "auth" */ '../views/auth/Login.vue')
			},
		]
	},
	{
		path: '/app',
		name: '',
		component: () => import(/* webpackChunkName: "auth_app" */ '../layouts/AuthenticatedLayout.vue'),
		children: [
			{
				path: 'settings',
				name: 'Settings',
				component: () => import(/* webpackChunkName: "settings" */ '../views/SettingView.vue')
			},
		]
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior() {
		return {top: 0}
	},
	routes
})

export default router
