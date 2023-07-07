<template>
	<view class="">
		<view v-if="!orders.length" class="d-flex w-100 h-100 flex-column just-content-center align-items-center">
			<image src="/static/images/loading.gif" class="drinks-img"></image>
			<view class="tips d-flex flex-column align-items-center font-size-base text-color-assist">
				<view>您还没有点单</view>
				<view>快去犒劳一下自己吧~</view>
			</view>
			<button type="primary" class="drink-btn" size="default" @tap="menu">去点餐</button>
			<view class="font-size-sm text-color-primary" @tap="ordersMore">查看历史订单</view>
		</view>
		<template v-else>
			<view class="orders-box">
				<view class=" order-box" v-for="(item, index) in orders" :key="index">
					<view class="bg-white">
						<view class="section">
							<!-- store info begin -->

							<list-cell :hover="false" v-if="item.isOrderOut">
								<view class="w-100 d-flex align-items-center">
									<view class="d-flex flex-column w-60">
										<view class="w-100 font-size-lg text-color-base text-truncate mb-10">{{ item.orderOut.name }} - {{ item.orderOut.phone }}</view>
										<view class="w-100 d-flex align-items-center overflow-hidden">
											<image src="/static/images/order/location.png" class="flex-shrink-0" style="width: 30rpx; height: 30rpx;"></image>
											<view class="text-truncate font-size-sm text-color-assist">{{ item.orderOut.address }}</view>
										</view>
									</view>
									<view class="d-flex justify-content-end align-items-center w-40">
										<!-- <image src="/static/images/order/mobile.png" style="width: 60rpx; height: 60rpx;margin-right: 30rpx;"></image> -->
										<image src="/static/images/order/navigation.png" style="width: 60rpx; height: 60rpx;"></image>
									</view>
								</view>
							</list-cell>
							<list-cell :hover="false" v-else>
								<view class="w-100 d-flex align-items-center">
									<view class="d-flex flex-column w-60">
										<view class="w-100 font-size-lg text-color-base text-truncate mb-10">{{ store.name }}</view>
										<!-- 	<view class="w-100 d-flex align-items-center overflow-hidden">
									<image src="/static/images/order/location.png" class="flex-shrink-0" style="width: 30rpx; height: 30rpx;"></image>
									<view class="text-truncate font-size-sm text-color-assist">华软</view>
								</view> -->
									</view>
									<view class="d-flex justify-content-end align-items-center w-40">
										<image src="/static/images/order/mobile.png" style="width: 60rpx; height: 60rpx;margin-right: 30rpx;"></image>
										<!-- <image src="/static/images/order/navigation.png" style="width: 60rpx; height: 60rpx;"></image> -->
									</view>
								</view>
							</list-cell>

							<!-- store info end -->
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="d-flex align-items-center just-content-center" v-if="item.orderNumber > 0">
										<view class="sort-num">{{ item.orderNumber }}</view>
									</view>

									<!-- goods begin -->
									<view class="w-100 d-flex flex-column position-relative mt-30" style="margin-bottom: -40rpx;">
										<view class="w-100 d-flex align-items-center mb-40" v-for="good in item.goods" :key="good._id">
											<view class="d-flex flex-column w-60 overflow-hidden">
												<view class="font-size-lg text-color-base mb-10 text-truncate">{{ good.name }}</view>
												<view class="font-size-sm text-color-assist text-truncate">{{ good.props_text }}</view>
											</view>
											<view class="d-flex w-40 align-items-center justify-content-between pl-30">
												<view class="font-size-base text-color-base">x{{ good.number }}</view>
												<view class="font-size-base text-color-base font-weight-bold">￥{{ good.price }}</view>
											</view>
										</view>
									</view>
									<!-- goods end -->
								</view>
							</list-cell>
						</view>
						<view class="section">
							<!-- payment and amount begin -->
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="pay-cell" v-if="item.discount && item.discount.value">
										<view>优惠金额</view>
										<view class="font-weight-bold">￥{{ item.discount.value }}</view>
									</view>
									<view class="pay-cell">
										<view>金额总计</view>
										<view class="font-weight-bold">￥{{ item.priceTotal }}</view>
									</view>
									<view class="pay-cell">
										<view>支付方式</view>
										<view class="font-weight-bold">{{ item.channel }}</view>
									</view>
								</view>
							</list-cell>
							<!-- payment and amount end -->
						</view>
						<view class="section">
							<!-- order info begin -->
							<list-cell :hover="false" padding="50rpx 30rpx">
								<view class="w-100 d-flex flex-column">
									<view class="pay-cell">
										<view>下单时间</view>
										<view class="font-weight-bold">{{ new Date(item.createdAt).toLocaleString() }}</view>
									</view>

									<view class="pay-cell">
										<view>订单号</view>
										<view class="font-weight-bold">{{ item._id }}</view>
									</view>
								</view>
							</list-cell>
							<!-- order info end -->
						</view>
						<!-- order other info begin -->
						<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
							<view class="w-100 d-flex flex-column">
								<view class="pay-cell" v-if="!item.isOrderOut">
									<view>取单号</view>
									<view class="font-weight-bold">{{ item.orderNumber }}</view>
								</view>
								<view class="pay-cell">
									<view>享用方式</view>
									<view class="font-weight-bold">{{ item.isOrderOut ? '外卖' : '自取' }}</view>
								</view>
								<view class="pay-cell">
									<view>享用时间</view>
									<view class="font-weight-bold">{{ item.takeTime ? item.takeTime : '立即取餐' }}</view>
								</view>

								<view class="pay-cell">
									<view>备注</view>
									<view class="font-weight-bold">{{ item.remark }}</view>
								</view>
							</view>
						</list-cell>
						<!-- order other info end -->
					</view>
					<view class="position-relative w-100">
						<image src="/static/images/order/bottom.png" mode="widthFix" class="w-100"></image>
						<view class="invote-box"><view class="font-size-lg text-color-primary" @tap="successOrder(item)">确认收货</view></view>
					</view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import { mapState } from 'vuex';

export default {
	components: {},
	data() {
		return { orders: [], TokenKey: '' };
	},
	computed: {
		...mapState(['store'])
	},
	onShow() {
		this.TokenKey = uni.getStorageSync('TokenKey');
		if (this.TokenKey) {
			this.getOrders();
		} else {
			this.orders = [];
		}
	},

	methods: {
		async getOrders() {
			let orders = await this.$u.get('/orders');
			this.orders = orders.filter(i => i.postscript === '制作中');
			console.log(this.orders);
		},
		async successOrder(item) {
			item.postscript = '已完成';
			let orders = await this.$u.put(`/order/${item._id}`, { postscript: '已完成' });
			uni.showToast({
				title: '收货成功',
				icon: 'success'
			});
			this.getOrders();
			// uni.hideToast();
		},
		ordersMore() {
			if (!this.TokenKey) {
				uni.showModal({
					title: '提示',
					confirmColor: '#adb838',
					content: '即将前往登录页面',
					success: async res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			} else {
				uni.navigateTo({
					url: '/pages/orders/orders'
				});
			}
		},
		menu() {
			uni.switchTab({
				url: '/pages/menu/menu'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
/* #ifdef H5 */
page {
	min-height: 100%;
	background-color: $bg-color;
}

/* #endif */
.orders-box {
	padding: 40rpx 20rpx;
	/* #ifdef H5 */
	margin-bottom: 100rpx;
	/* #endif */
}
.order-box {
	margin-bottom: 40rpx;
}
.drinks-img {
	width: 260rpx;
	height: 260rpx;
}

.tips {
	margin: 60rpx 0 80rpx;
	line-height: 48rpx;
}

.drink-btn {
	width: 320rpx;
	border-radius: 50rem !important;
	margin-bottom: 40rpx;
	font-size: $font-size-base;
	line-height: 3;
}

.steps__text-column {
	display: flex;
	margin-bottom: 40rpx;

	.steps__text-column-item {
		flex: 1;
		display: inline-flex;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: $font-size-base;
		color: $text-color-assist;

		&.active {
			color: $text-color-base;
			font-weight: bold;

			.steps__column-item-line {
				background-color: $text-color-base;
			}
		}

		.steps__column-item-line {
			flex: 1;
			height: 2rpx;
			background-color: #919293;
			transform: scaleY(0.5);
		}

		.steps__text-column-item-text {
			margin: 0 8px;
		}
	}
}

@mixin arch {
	content: '';
	position: absolute;
	background-color: $bg-color;
	width: 30rpx;
	height: 30rpx;
	bottom: -15rpx;
	z-index: 10;
	border-radius: 100%;
}

.section {
	position: relative;

	&::before {
		@include arch;
		left: -15rpx;
	}

	&::after {
		@include arch;
		right: -15rpx;
	}
}

.pay-cell {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: $font-size-base;
	color: $text-color-base;
	margin-bottom: 40rpx;

	&:nth-last-child(1) {
		margin-bottom: 0;
	}
}

.sort-num {
	font-size: 64rpx;
	font-weight: bold;
	color: $text-color-base;
	line-height: 2;
}

.steps__img-column {
	display: flex;
	margin: 30rpx 0;

	.steps__img-column-item {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;

		image {
			width: 80rpx;
			height: 80rpx;
		}
	}
}
.bg-white {
	// margin-bottom: 60rpx;
}
.invote-box {
	position: absolute;
	width: 100%;
	left: 0;
	top: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	image {
		width: 30rpx;
		height: 30rpx;
	}
}
</style>
