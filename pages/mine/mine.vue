<template>
	<view class="container">
		<view class="position-relative"><image src="https://img-shop.qmimg.cn/s16/images/2020/01/20/9a82219bedcae5c2.jpeg" class="bg"></image></view>

		<view style="padding: 0 30rpx;">
			<!-- user box begin -->
			<view class="d-flex flex-column bg-white user-box">
				<view class="d-flex align-items-center">
					<view class="avatar">
						<image src="/static/images/mine/default.png"></image>
						<view class="badge" v-if="isLogin"><image src="/static/images/mine/level.png"></image></view>
					</view>
					<view class="d-flex flex-column flex-fill overflow-hidden" style="margin-top: 20rpx;">
						<view v-if="isLogin" class="font-size-lg font-weight-bold d-flex justify-content-start align-items-center" @tap="userinfo">
							<view class="text-truncate">{{ member.nikeName || member.userPhone }}</view>
							<view class="iconfont iconarrow-right line-height-100"></view>
						</view>
						<view v-else class="font-size-lg font-weight-bold" @tap="login">请点击授权登录</view>
						<view class="font-size-sm text-color-assist"></view>
						<view class="w-100"><progress percent="0" activeColor="#ADB838" height="8rpx" :percent="growthValue" border-radius="8rpx" /></view>
					</view>
					<view class="level-benefit d-flex flex-shrink-0 align-items-center justify-content-end text-color-white bg-warning font-size-sm">
						<view>会员权益</view>
						<view class="iconfont iconarrow-right line-height-100"></view>
					</view>
				</view>
				<!-- user grid begin -->
				<view class="w-100 d-flex align-items-center just-content-center">
					<view class="user-grid" @tap="coupons">
						<view class="value font-size-extra-lg font-weight-bold text-color-base">{{ isLogin ? couponsNum || 0 : '***' }}</view>
						<view class="font-size-sm text-color-assist">奈思券</view>
					</view>
					<view class="user-grid" @tap="integrals">
						<view class="value font-size-extra-lg font-weight-bold text-color-base">{{ isLogin ? member.consum || 0 : '***' }}</view>
						<view class="font-size-sm text-color-assist">积分商城</view>
					</view>
				</view>
				<!-- user grid end -->
			</view>
			<view class="level-benefit-box" v-if="!isLogin">
				<view class="d-flex align-items-center justify-content-between font-size-base">
					<view class="text-color-base">新用户加入会员，享会员权益</view>
					<view class="text-color-primary" @tap="login">立即加入</view>
				</view>
				<view class="row">
					<view class="grid">
						<image src="/static/images/mine/rhyl.png"></image>
						<view>入会有礼</view>
					</view>
					<view class="grid">
						<image src="/static/images/mine/jfdh.png"></image>
						<view>积分兑换</view>
					</view>

					<view class="grid">
						<image src="/static/images/mine/srtq.png"></image>
						<view>生日特权</view>
					</view>
					<view class="grid">
						<image src="/static/images/mine/nxbz.png"></image>
						<view>奈思宝藏</view>
					</view>
				</view>
			</view>
			<!-- user box end -->
		</view>
		<!-- service box begin -->
		<view class="service-box" v-if="isLogin">
			<view class="font-size-lg text-color-base font-weight-bold" style="margin-bottom: 20rpx;">我的服务</view>
			<view class="row">
				<view class="grid" @tap="orders">
					<view class="image"><image src="/static/images/mine/wddd.png"></image></view>
					<view>我的订单</view>
				</view>
				<view class="grid" @tap="userinfo">
					<view class="image"><image src="/static/images/mine/wdzl.png"></image></view>
					<view>我的资料</view>
				</view>
				<view class="grid" @tap="addresses">
					<view class="image"><image src="/static/images/mine/shdz.png"></image></view>
					<view>收货地址</view>
				</view>
				<view class="grid" @tap="services">
					<view class="image"><image src="/static/images/mine/gdfw.png"></image></view>
					<view>更多服务</view>
				</view>
			</view>
		</view>
		<!-- service box end -->
		<!-- tips begin -->
		<view class="d-flex just-content-center align-items-center text-color-assist" style="padding: 30rpx 0; font-size: 22rpx;">最终解释权归奈思的茶所有</view>
		<!-- tisps end -->
	</view>
</template>

<script>
export default {
	data() {
		return {
			newIcon: 'https://img-shop.qmimg.cn/s16/images/2020/05/12/ffb0613dded704b6.png',
			couponsNum: 0,
			member: {}
		};
	},
	computed: {
		growthValue() {
			return 40;
		}
	},
	onLoad() {},
	async onShow() {
		this.isLogin = uni.getStorageSync('TokenKey');
		console.log(this.isLogin);

		if (this.isLogin) {
			console.log('xxxx');
			this.member = await this.$u.get('/userinfo');
			this.couponsNum = this.member.coupons.length;
			this.$forceUpdate();
		} else {
			this.couponsNum = 0;
			this.member = {};
		}
	},
	methods: {
		login() {
			uni.navigateTo({
				url: '/pages/login/login'
			});
		},

		addresses() {
			uni.navigateTo({
				url: '/pages/address/address'
			});
		},
		integrals() {
			if (!this.isLogin) return;
			uni.navigateTo({
				url: '/pages/integrals/integrals'
			});
		},
		orders() {
			uni.navigateTo({
				url: '/pages/orders/orders'
			});
		},
		coupons() {
			if (!this.isLogin) return;
			uni.navigateTo({
				url: '/pages/coupons/coupons?type=mine'
			});
		},
		userinfo() {
			uni.navigateTo({
				url: '/pages/mine/userInfo'
			});
		},
		services() {
			uni.navigateTo({
				url: '/pages/services/services'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	height: auto;
	min-height: 100%;
}

.bg {
	width: 100%;
	height: calc(410 / 594 * 750rpx);
}

.hym-btn {
	position: absolute;
	top: 40rpx;
	right: 40rpx;
	color: $color-primary;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 50rem;
	font-size: $font-size-sm;
	box-shadow: 0 0 20rpx rgba(66, 66, 66, 0.1);

	&::after {
		border: 0;
	}

	image {
		width: 30rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
}

.user-box {
	position: relative;
	border-radius: 8rpx;
	margin-bottom: 30rpx;
	margin-top: -115rpx;
	box-shadow: $box-shadow;
}

.avatar {
	position: relative;
	margin-top: -35rpx;
	margin-left: 35rpx;
	margin-right: 35rpx;
	width: 160rpx;
	height: 160rpx;
	border-radius: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
	box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

	image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 100%;
	}

	.badge {
		position: absolute;
		right: -10rpx;
		bottom: -10rpx;
		background-color: #ffffff;
		border-radius: 50rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: $color-warning;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.2);

		image {
			width: 30rpx;
			height: 30rpx;
		}
	}
}

.level-benefit {
	margin-left: 35rpx;
	padding: 10rpx 0 10rpx 30rpx;
	border-radius: 50rem 0 0 50rem;
}

.user-grid {
	width: 25%;
	padding: 30rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.value {
		margin-bottom: 20rpx;
	}
}

.level-benefit-box {
	border-radius: 8rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 10rpx 8rpx rgba($color: #878889, $alpha: 0.1);
	width: 100%;
	display: flex;
	padding: 30rpx;
	flex-direction: column;
	background-color: #ffffff;

	.row {
		display: flex;
		padding: 30rpx 0 20rpx;
		justify-content: space-around;
		align-items: center;

		.grid {
			width: 20%;
			display: flex;
			flex-direction: column;
			font-size: $font-size-sm;
			color: $text-color-assist;
			align-items: center;

			image {
				width: 80rpx;
				height: 80rpx;
				margin-bottom: 10rpx;
			}
		}
	}
}

.banner {
	width: 100%;
	border-radius: 8rpx;
	margin-bottom: 30rpx;
}

.service-box {
	width: 100%;
	background-color: #ffffff;
	padding: 32rpx 30rpx 10rpx;
	box-shadow: $box-shadow;

	.row {
		display: flex;
		flex-wrap: wrap;
		color: $text-color-assist;
		font-size: $font-size-sm;
		padding-bottom: -40rpx;

		.grid {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-bottom: 40rpx;
			width: 25%;
			position: relative;

			.image {
				image {
					width: 80rpx;
					height: 80rpx;
					margin-bottom: 20rpx;
				}
			}

			.new-badage {
				width: 40rpx;
				height: 40rpx;
				position: absolute;
				top: 0;
				right: 30rpx;
			}
		}
	}
}
</style>
