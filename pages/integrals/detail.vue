<template>
	<view class="container position-relative">
		<view style="padding-bottom: 150rpx;">
			<template>
				<view class="coupon-box">
					<view class="coupon">
						<image src="/static/images/integrals/ticket.png" mode="center"></image>
						<view class="intro">
							<view class="goods-name">{{ pointGood.name }}</view>
							<view class="expire">有效期：领券当日开始90天内有效</view>
						</view>
					</view>
				</view>
				<view class="points-and-stocks">
					<view class="points">
						<view class="font-size-lg text-color-primary font-weight-bold mr-10">{{ pointGood.consume }}</view>
						<view class="font-size-sm text-color-base">积分</view>
					</view>
					<view class="stocks font-size-sm text-color-base">
						剩余
						<text class="text-color-primary">{{ pointGood.count }}</text>
						件
					</view>
				</view>
				<view class="w-100 bg-white" style="padding: 30rpx;">
					<view class="d-flex align-items-center font-size-lg font-weight-bold line-height-2">兑换须知</view>
					<view class="font-size-base text-color-assist">
						兑换规则：会员可凭{{ pointGood.consume }}积分兑换“{{ pointGood.name }}券”1件，售后服务：虚拟券不支持退换货服务，请先确认后兑换。
					</view>
					<view class="d-flex align-items-center font-size-lg font-weight-bold line-height-2">使用须知</view>
					<view class="font-size-base text-color-base line-height-2 d-flex align-items-center" v-for="(item, index) in useTips" :key="index">
						<view>{{ item.title }}：</view>
						<view class="font-weight-bold">{{ item.value }}</view>
					</view>
				</view>
			</template>

			<view v-if="member" class="btn-box">
				<button type="primary" @click="duihuan" :disabled="member.consum < pointGood.consume">{{ member.consum < pointGood.consume ? '积分不足' : '立即兑换' }}</button>
			</view>
		</view>
	</view>
</template>

<script>
// import { mapState, mapGetters } from 'vuex';
export default {
	computed: {
		// ...mapState(['member']),
		// ...mapGetters(['isLogin'])
	},
	data() {
		return {
			pointGood: {},
			useTips: [
				{ title: '使用条件', value: '' },
				{ title: '优惠形式', value: '免最高1件' },
				{ title: '有效期', value: '领券当日开始90天内有效' },
				{ title: '使用时段', value: '00:00:00~23:59:59' },
				{ title: '使用限制', value: '不限制' },
				{ title: '兑换限制', value: '不限制' },
				{ title: '活动商品', value: '不限制商品' },
				{ title: '是否与其他优惠共享', value: '否' },
				{ title: '使用场景', value: '仅外卖、堂食可用' }
			],
			show: false,
			member: null
		};
	},
	onLoad({ id }) {
		this.id = id;
		this.getUserInfo();
		this.getCoupon();
	},
	methods: {
		async getUserInfo() {
			this.member = await this.$u.get('/userinfo');
		},
		async getCoupon() {
			let coupon = await this.$u.get(`/coupon/${this.id}`);
			this.pointGood = coupon;
			this.useTips[0].value = this.pointGood.enough ? '满立减' : '无门槛';
			console.log(this.pointGood);
		},
		duihuan() {
		
			uni.showModal({
				title: '提示',
				confirmColor: '#adb838',
				content: '是否立即兑换？',
				success: async res => {
					if (res.confirm) {
						await this.$u.put('/coupon', { couponId: this.pointGood._id });
						this.getCoupon();
						this.getUserInfo();
						uni.showToast({ title: '兑换成功！', icon: 'success' });
					}
				}
			});
		},
		async confirm() {}
	}
};
</script>

<style lang="scss" scoped>
.duihuan {
	text-align: center;
	padding: 20rpx 0;
}
.btn-box {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 150rpx;
	padding: 30rpx;
	z-index: 10;
	background-color: #ffffff;
	box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);

	button {
		border-radius: 50rem !important;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}

.coupon-box {
	width: 100%;
	padding: 30rpx 50rpx;

	.coupon {
		background-color: #ffffff;
		padding: 40rpx;
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		position: relative;

		image {
			width: 180rpx;
			height: 120rpx;
			margin-right: 30rpx;
		}

		.intro {
			flex: 1;
			display: flex;
			flex-direction: column;

			.goods-name {
				font-size: $font-size-lg;
				color: $text-color-base;
				margin-bottom: 10rpx;
			}

			.expire {
				font-size: 22rpx;
				color: $text-color-assist;
			}
		}

		@mixin arch {
			content: ' ';
			position: absolute;
			background-color: $bg-color;
			width: 40rpx;
			height: 40rpx;
			z-index: 10;
			border-radius: 100%;
		}

		&::before {
			@include arch;
			left: -20rpx;
		}

		&::after {
			@include arch;
			right: -20rpx;
		}
	}
}

.points-and-stocks {
	padding: 0 50rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30rpx;

	.points {
		display: flex;
		align-items: baseline;
	}
}
</style>
