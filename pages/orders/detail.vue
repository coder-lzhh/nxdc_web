<template>
	<view class="container" style="padding:20rpx;">
		<view style="padding-bottom: 100rpx;">
			<view class="bg-white">
				<view class="section">
					<list-cell :hover="false" v-if="order.isOrderOut">
						<view class="w-100 d-flex align-items-center">
							<view class="d-flex flex-column w-60">
								<view class="w-100 font-size-lg text-color-base text-truncate mb-10">{{ order.orderOut.name }} - {{ order.orderOut.phone }}</view>
								<view class="w-100 d-flex align-items-center overflow-hidden">
									<image src="/static/images/order/location.png" class="flex-shrink-0" style="width: 30rpx; height: 30rpx;"></image>
									<view class="text-truncate font-size-sm text-color-assist">{{ order.orderOut.address }}</view>
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

					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column position-relative" style="margin-bottom: -40rpx;">
							<view class="w-100 d-flex align-items-center mb-40" v-for="(good, index) in order.goods" :key="index">
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
					</list-cell>
				</view>
				<view class="section">
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>支付方式</view>
								<view class="font-weight-bold">{{ order.channel }}</view>
							</view>
							<view class="pay-cell" v-if="order.discount">
								<view>金额优惠</view>
								<view class="font-weight-bold">￥{{ order.discount.value }}</view>
							</view>
							<view class="pay-cell">
								<view>金额总计</view>
								<view class="font-weight-bold">￥{{ order.priceTotal }}</view>
							</view>
						</view>
					</list-cell>
				</view>
				<view class="section">
					<list-cell :hover="false" padding="50rpx 30rpx">
						<view class="w-100 d-flex flex-column">
							<view class="pay-cell">
								<view>下单时间</view>
								<view class="font-weight-bold">{{ new Date(order.createdAt).toLocaleString() }}</view>
							</view>

							<view class="pay-cell">
								<view>订单号</view>
								<view class="font-weight-bold">{{ order._id }}</view>
							</view>
						</view>
					</list-cell>
				</view>

				<list-cell :hover="false" padding="50rpx 30rpx 40rpx" last>
					<view class="w-100 d-flex flex-column">
						<view class="pay-cell" v-if="!order.isOrderOut">
							<view>取单号</view>
							<view class="font-weight-bold">{{ order.orderNumber }}</view>
						</view>

						<view class="pay-cell">
							<view>享用方式</view>
							<view class="font-weight-bold">{{ order.isOrderOut ? '外卖' : '自取' }}</view>
						</view>
						<view class="pay-cell">
							<view>享用时间</view>
							<view class="font-weight-bold">{{ order.takeTime ? order.takeTime : '立即取餐' }}</view>
						</view>

						<view class="pay-cell">
							<view class="remark">备注</view>
							<view class="font-weight-bold">{{ order.remark }}</view>
						</view>
					</view>
				</list-cell>
			</view>
			<view class="position-relative w-100">
				<view class="invote-box"></view>
				<!--	<image src="/static/images/order/bottom.png" mode="w idthFix" class="w-100"></image>
				<view class="invote-box" v-if="!order.invoice_status">
					<view class="font-size-base text-color-primary" @tap="goToInvoice">去开发票</view>
					<image src="/static/images/order/right.png"></image>
				</view> -->
			</view>
		</view>
		<view v-if="order.postscript == '已完成' && !order.evaluate" class="btn-box">
			<!-- <view class="item" v-if="order.invoice_status > 0"><button type="primary">查看发票</button></view> -->
			<view class="item"><button type="primary" plain @tap="review">去评价</button></view>
			<!-- <view class="item"><button type="primary">再来一单</button></view> -->
		</view>
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import listCell from '@/components/list-cell/list-cell';

export default {
	components: {
		listCell
	},
	data() {
		return {
			order: {},
			id: ''
		};
	},
	async onLoad({ id }) {
		this.id = id;
		// this.order = Orders.find(item => item.id == id);
		let order = await this.$u.get(`/order/${id}`);
		this.order = order;
		console.log(order);
	},
	computed: {
		...mapState(['orderType', 'address', 'store'])
	},
	methods: {
		review() {
			const date = this.order.completed_time.split(' ')[0];

			uni.navigateTo({
				url: '/pages/comment/comment?id=' + this.id
			});
		},
		goToInvoice() {
			uni.navigateTo({
				url: '/pages/invoice/invoice'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
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
	.remark {
		min-width: 40px;
	}
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

.btn-box {
	background-color: #ffffff;
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120rpx;
	box-shadow: 0 0 20rpx rgba($color: #000000, $alpha: 0.1);
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	z-index: 11;

	.item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 10rpx;
		flex: 1;
		flex-shrink: 0;

		button {
			width: 100%;
			border-radius: 50rem !important;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
		}
	}
}
</style>
