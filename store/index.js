import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		store: {},
		cart: [],
		orderType: 'takein',
		address: {},
		addresses: {},
		member: {},
		order: {},
		coupon: {},

	},
	getters: {
		isLogin: state => Object.keys(state.member).length > 0 //是否登录
	},
	mutations: {
		SET_ORDER_TYPE(state, type) {
			state.orderType = type
		},
		SET_MEMBER(state, member) {
			state.member = member
		},
		SET_COUPON(state, coupon) {
			state.coupon = coupon
		},
		SET_ADDRESS(state, address) {
			console.log(address);
			state.address = address
		},
		SET_ADDRESSES(state, addresses) {

			if (addresses._id) {
				let index = state.member.addresses.findIndex(i => i._id === addresses._id)
				console.log(index);
				console.log(addresses);
				state.member.addresses.splice(index, 1, addresses)
			} else {
				state.member.addresses.push(addresses)
			}
		},
		REMOVE_ADDRESSES(state, id) {


			let index = state.member.addresses.findIndex(i => i._id === id)
			console.log(index);
			state.member.addresses.splice(index, 1)

		},
		SET_STORE(state, store) {
			state.store = store
		},
		SET_CART(state, cart) {
			state.cart = cart
		},
		REMOVE_CART(state) {
			state.cart = []
		},
		SET_ORDER(state, order) {
			state.order = order
		}
	},
	actions: {
		// async getStore({commit}) {
		// 	const store = await api('store')
		// 	commit('SET_STORE', store)
		// }
	}
})

export default store
