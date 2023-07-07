<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
export default {
	onLaunch: function() {
		let data = {};
		this.$u.get('/store').then(res => {
			data = res[0];
			console.log(data);
			this.$store.commit('SET_STORE', data);
		});
		let user = uni.getStorageSync('USERINFO');
		// console.log(user);
		// if (user._id) {
		// 	let userInfo = this.$u.get(`/user/${user._id}`).then(res => {
		// 		console.log(res);
		// 		this.$store.commit('SET_MEMBER', res);
		// 		uni.setStorageSync('USERINFO', res);
		// 	});
		// } else {
		// 	this.$store.commit('SET_MEMBER', user || {});
		// }
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
.uni-picker-action-confirm {
	color: #adb838 !important;
}
@import '~@/static/style/app.scss';
@import 'uview-ui/index.scss';
/*每个页面公共css */
</style>
