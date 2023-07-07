<template>
	<view class="container_box">
		<view style="margin-bottom:130rpx;">
			<view class="section-1">
				<template v-if="orderType == 'takein'">
					<list-cell class="location">
						<view class="flex-fill d-flex justify-content-between align-items-center">
							<view class="store-name flex-fill">第一饭堂</view>
							<image src="/static/images/navigator-1.png" class="arrow"></image>
						</view>
					</list-cell>
				</template>
				<template v-else>
					<list-cell @click="chooseAddress">
						<view class="w-100 d-flex flex-column">
							<view class="d-flex align-items-center justify-content-between mb-10">
								<view class="font-size-extra-lg text-color-base">{{ address.address }}</view>
								<image src="/static/images/navigator-1.png" class="arrow"></image>
							</view>
							<view class="d-flex text-color-assist font-size-sm align-items-center">
								<view class="mr-10">{{ address.name || 'asd asd' }}</view>
								<view class="mr-10">{{ !address.sex ? '先生' : '女士' }}</view>
								<view>{{ address.phone || 15613513 }}</view>
							</view>
						</view>
					</list-cell>
				</template>
				<template v-if="orderType == 'takein'">
					<list-cell arrow class="meal-time">
						<view class="flex-fill d-flex justify-content-between align-items-center">
							<view class="title">取餐时间</view>

							<picker mode="time" class="picker" :value="time" :start="startTime" end="23:59" @change="bindTimeChange" @cancel="cancelTime">
								<!-- <view class="title">取餐时间</view> -->
								<view class="time">{{ time ? time : '立即取餐' }}</view>
							</picker>
						</view>
					</list-cell>
					<list-cell class="contact" last :hover="false">
						<view class="flex-fill d-flex justify-content-between align-items-center">
							<view class="title flex-fill">联系电话</view>
							<view class="time"><input class="text-right" placeholder="请输入手机号码" v-model.number="userPhone" /></view>
							<!-- <view class="contact-tip font-size-sm">自动填写</view> -->
						</view>
					</list-cell>
				</template>
				<template v-else>
					<list-cell arrow class="meal-time">
						<view class="flex-fill d-flex justify-content-between align-items-center">
							<view class="title">取餐时间</view>

							<picker mode="time" class="picker" :value="time" :start="startTime" end="23:59" @change="bindTimeChange" @cancel="cancelTime">
								<!-- <view class="title">取餐时间</view> -->
								<view class="time">{{ time ? time : '立即取餐' }}</view>
							</picker>
						</view>
					</list-cell>
				</template>
			</view>

			<!-- 购物车列表 begin -->
			<view class="section-2">
				<view class="cart d-flex flex-column">
					<list-cell last v-for="(item, index) in cart" :key="index">
						<view class="w-100 d-flex flex-column">
							<view class="d-flex align-items-center mb-10">
								<view class="name-and-props overflow-hidden">
									<view class="text-color-base font-size-lg">{{ item.name }}</view>
								</view>
								<view class="d-flex flex-fill justify-content-between align-items-center text-color-base font-size-lg">
									<view>x{{ item.number }}</view>
									<view>￥{{ item.price }}</view>
								</view>
							</view>
							<view class="text-truncate font-size-base text-color-assist">{{ item.props_text }}</view>
						</view>
					</list-cell>
					<template v-if="orderType == 'takeout'">
						<list-cell last v-if="store.packingFee > 0">
							<view class="w-100 d-flex font-size-base align-items-center justify-content-between">
								<view>包装费</view>
								<view>￥{{ parseFloat(store.packingFee) }}</view>
							</view>
						</list-cell>
						<list-cell last v-if="store.deliveryCost > 0">
							<view class="w-100 d-flex font-size-base align-items-center justify-content-between">
								<view>配送费</view>
								<view>￥{{ parseFloat(store.deliveryCost) }}</view>
							</view>
						</list-cell>
					</template>
				</view>
				<list-cell arrow @click="goToPackages">
					<view class="flex-fill d-flex justify-content-between align-items-center">
						<view class="text-color-base">奈思券</view>
						<view class="text-color-primary">{{ coupon.name ? coupon.name : '使用抵扣卡券' }}</view>
					</view>
				</list-cell>
				<list-cell last>
					<view class="flex-fill d-flex justify-content-end align-items-center">
						<view>总计￥{{ total }},实付</view>
						<view class="font-size-extra-lg font-weight-bold">￥{{ amount }}</view>
					</view>
				</list-cell>
			</view>
			<!-- 购物车列表 end -->
			<view class="d-flex align-items-center justify-content-start font-size-sm text-color-warning" style="padding: 20rpx 0;">
				<view class="iconfont iconhelp line-height-100"></view>
				<view>优惠券不与满赠、满减活动共享</view>
			</view>
			<!-- 支付方式 begin -->

			<view class="payment">
				<list-cell last :hover="false"><text>支付方式</text></list-cell>
				<list-cell>
					<view class="d-flex align-items-center justify-content-between w-100 " @tap="isZhifu = true">
						<view class="iconfont iconbalance line-height-100 payment-icon" style="color: #1c6ed4;"></view>
						<view class="flex-fill">支付宝支付</view>

						<view class="iconfont   line-height-100 checkbox   " :class="{ checked: isZhifu, 'iconradio-button-on': isZhifu, 'iconradio-button-off': !isZhifu }"></view>
					</view>
				</list-cell>
				<list-cell last>
					<view class="d-flex align-items-center justify-content-between w-100" @tap="isZhifu = false">
						<view class="iconfont iconwxpay line-height-100 payment-icon" style="color: #7EB73A;"></view>
						<view class="flex-fill">微信支付</view>
						<view class="iconfont  line-height-100 checkbox " :class="{ checked: !isZhifu, 'iconradio-button-on': !isZhifu, 'iconradio-button-off': isZhifu }"></view>
					</view>
				</list-cell>
			</view>
			<!-- 支付方式 end -->
			<!-- 备注 begin -->
			<view class="remark">
				<list-cell last>
					<view class="d-flex textarea_box ">
						<view class="flex-shrink-0 mr-20">备注:</view>
						<textarea class="input" v-model="remark" placeholder="订单备注" :rows="2"></textarea>
					</view>
				</list-cell>
			</view>
			<!-- 备注 end -->
		</view>
		<!-- 付款栏 begin -->
		<view class="w-100 pay-box position-fixed fixed-bottom d-flex align-items-center justify-content-between bg-white">
			<view class="font-size-sm" style="margin-left: 20rpx;">合计：</view>
			<view class="font-size-lg flex-fill">￥{{ amount }}</view>
			<view class="bg-primary h-100 d-flex align-items-center just-content-center text-color-white font-size-base" style="padding: 0 60rpx;" @tap="pay">付款</view>
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
	components: {},
	data() {
		return {
			cart: [],
			remark: '',
			isZhifu: false,
			userPhone: 0,
			time: '',
			startTime: '10:00'
			// startTime: this.$u.timeFormat(new Date(new Date().getTime() + 720000), 'hh:MM')
		};
	},
	computed: {
		...mapState(['orderType', 'address', 'store', 'member', 'coupon']),
		total() {
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
		},
		amount() {
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0) - (this.coupon.value || 0);
		}
	},
	onLoad(option) {
		// const {remark} = option
		this.cart = uni.getStorageSync('cart');
		this.getUserInfo();
	},
	methods: {
		...mapMutations(['SET_ORDER', 'SET_COUPON']),
		bindTimeChange(e) {
			this.time = e.detail.value;
		},
		cancelTime(e) {
			console.log(e);
			this.time = '';
		},
		async getUserInfo() {
			let res = await this.$u.get('/userinfo');
			this.userPhone = res.userPhone;
		},
		chooseAddress() {
			uni.navigateTo({
				url: '/pages/address/address?is_choose=true&scene=pay'
			});
		},
		goToPackages() {
			uni.navigateTo({
				url: '/pages/coupons/coupons?type=pay'
			});
		},
		// submit() {
		// 	if(this.orderType == 'takeout') {
		// 		this.ensureAddressModalVisible = true
		// 	} else {
		// 		this.pay()
		// 	}
		// },
		MathRand() {
			var Num = '';
			for (var i = 0; i < 4; i++) {
				Num += Math.floor(Math.random() * 10);
			}
			return Num;
		},
		async pay() {
			uni.showLoading({ title: '加载中' });

			let params = {
				takeTime: this.time ? this.time : '立即取餐',
				userPhone: this.userPhone,
				discount: this.coupon.value ? this.coupon : {},
				packingFee: this.orderType == 'takeout' ? this.store.packingFee : 0,
				deliveryCost: this.orderType == 'takeout' ? this.store.deliveryCost : 0,
				orderNumber: this.orderType == 'takeout' ? 0 : this.MathRand(),
				orderOut: this.orderType == 'takeout' ? this.address : null,
				isOrderOut: this.orderType == 'takeout' ? true : false,
				priceTotal: this.amount,
				remark: this.remark,
				channel: this.isZhifu ? '支付宝支付' : '微信支付',
				goods: this.cart
			};
			console.log(params);
			let order = await this.$u.post('/order', params);
			console.log(order);
			uni.reLaunch({
				url: '/pages/take-foods/take-foods'
			});
			this.SET_COUPON({});
			uni.hideLoading();
		}
	}
};
</script>

<style lang="scss" scoped>
.picker {
	z-index: 1000;
}
.remark {
	margin-bottom: 30rpx;

	.textarea_box {
		flex-direction: column;
		font-size: $font-size-sm;
		.input {
			height: 100rpx;
			padding-top: 1vh;
		}
	}
}
.container_box {
	padding: 30rpx;
}

.arrow {
	width: 50rpx;
	height: 50rpx;
	position: relative;
	margin-right: -10rpx;
}

.location {
	.store-name {
		font-size: $font-size-lg;
	}

	.iconfont {
		font-size: 50rpx;
		line-height: 100%;
		color: $color-primary;
	}
}

.section-1 {
	margin-bottom: 30rpx;
	.contact {
		.contact-tip {
			margin-left: 10rpx;
			border: 2rpx solid $color-primary;
			padding: 6rpx 10rpx;
			color: $color-primary;
		}
	}
}

.section-2 {
	.name-and-props {
		width: 65%;
	}
}

.payment {
	margin-bottom: 30rpx;

	.disabled {
		color: $text-color-grey;
	}

	.payment-icon {
		font-size: 44rpx;
		margin-right: 10rpx;
	}

	.checkbox {
		font-size: 36rpx;
		margin-left: 10rpx;
	}

	.checked {
		color: $color-primary;
	}
}

.pay-box {
	box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
	height: 100rpx;
}

.modal-content {
	.change-address-btn {
		line-height: 2;
		padding: 0 1em;
	}
	.pay_btn {
		width: 100%;
		border-radius: 50rem !important;
		line-height: 3;
	}
}
</style>
