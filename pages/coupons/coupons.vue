<template>
	<view class="container w-100 h-100">
		<view class="d-flex flex-column w-100" style="padding: 30rpx; padding-bottom: 150rpx; margin-bottom: 150rpx;">
			<view
				class="d-flex align-items-center bg-white"
				style="padding: 30rpx; height: 220rpx; margin-bottom: 34rpx; border-radius: 8rpx;"
				v-for="(item, index) in packages"
				:key="index"
				@tap="pay(item)"
			>
				<image src="/static/images/integrals/ticket.png" style="width: 200rpx; height: 160rpx; "></image>
				<view class="d-flex flex-fill flex-column justify-content-between" style="height: 160rpx;">
					<view class="font-size-lg text-color-base">{{ item.id.name }}</view>
					<view class="d-flex justify-content-between align-items-center">
						<view class="font-size-sm">{{ item.id.desc }}</view>
						<button type="primary" size="mini" plain class="pay-btn">立即使用</button>
					</view>
				</view>
			</view>
		</view>

		<view class="d-flex position-fixed bg-base fixed-bottom text-color-primary font-size-base align-items-center just-content-center w-100" style="height: 150rpx;">
			<!-- <text >去兑换</text -->
			<button @tap="noUse" v-if="type === 'pay'" type="primary" size="default" plain class="bottom-btn">不使用优惠券</button>
			<button @tap="toIntegrals" type="primary" size="default" plain class="bottom-btn">去兑换</button>
		</view>
	</view>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
	data() {
		return {
			packages: [{ title: 'xxx', id: 'xx', amount: 'xxaas' }],
			type: ''
		};
	},
	async onLoad({ type }) {
		this.type = type;
		let { coupons } = await this.$u.get('/mycoupons');
		console.log(coupons);
		this.packages = coupons;
	},

	methods: {
		...mapMutations(['SET_COUPON']),
		noUse() {
			this.SET_COUPON({});
			uni.navigateBack();
		},
		pay(item) {
			if (this.type === 'pay') {
				this.SET_COUPON({ couponId: item._id, name: item.id.name, value: item.id.value });
				uni.navigateBack();
			} else {
				uni.switchTab({
					url: '/pages/menu/menu'
				});
			}
		},
		toIntegrals() {
			uni.navigateTo({
				url: '/pages/integrals/integrals'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding-bottom: -150rpx;
}
.bottom-btn {
	height: 60rpx;
	width: 200rpx;
	font-size: $font-size-sm;
	border-radius: 60rpx;
	padding: 0;
	line-height: 60rpx;
	text-align: center;
	margin: 0 10rpx;
}
.pay-btn {
	height: 50rpx;
	width: 120rpx;
	font-size: $font-size-sm;
	border-radius: 50rpx;
	padding: 0;
	line-height: 50rpx;
	text-align: center;
}
</style>
