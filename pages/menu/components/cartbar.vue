<template>
	<view>
		<uni-transition :mode-class="['slide-bottom']" :show="!!cartNum" :styles="cartBarStyles">
			<view class="left">
				<view class="detail-action" @tap="isShowPopup">
					<image src="/static/images/menu/cart.png" class="shopbag-btn"></image>
					<view class="badge">{{ cartNum }}</view>
				</view>
				<view class="price">￥{{ cartPrice }}</view>
			</view>
			<button type="primary" class="right" @tap="pay">结算</button>
		</uni-transition>
		<uni-popup ref="popup" type="bottom" @change="change">
			<view class="cart-popup">
				<view class="header">
					<view class="order-type"></view>
					<view class="d-flex align-items-center" @tap="clear">
						<image src="/static/images/menu/delete.png" class="delete-btn"></image>
						<view>清空购物车</view>
					</view>
				</view>
				<scroll-view scroll-y class="content">
					<view class="wrapper">
						<view class="list">
							<view class="item" v-for="(item, index) in cart" :key="index">
								<view class="left">
									<view class="name">{{ item.name }}</view>
									<view class="props">{{ item.props_text }}</view>
								</view>
								<view class="center">
									<text>￥{{ item.price }}</text>
								</view>
								<view class="right">
									<button type="default" plain size="mini" @tap="minus(index)" class="btn" hover-class="none"><view class="iconfont iconsami-select"></view></button>
									<view class="number">{{ item.number }}</view>
									<button type="primary" class="btn" @tap="add(index)" size="min" hover-class="none"><view class="iconfont iconadd-select"></view></button>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
		<!-- <cart-popup :cart="cart" ref="cartPopup" @add="" @minus="" @clear="clear"></cart-popup> -->
	</view>
</template>

<script>
import uniTransition from '@/components/uni-transition/uni-transition.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
// import cartPopup from '../cart-popup/cart-popup.vue'

export default {
	name: 'CartBar',
	components: {
		uniPopup,
		uniTransition
	},
	props: {
		cart: {
			type: Array,
			default: () => []
		}
	},
	computed: {
		cartNum() {
			//计算购物车总数
			return this.cart.reduce((acc, cur) => acc + cur.number, 0);
		},
		cartPrice() {
			//计算购物车总价
			return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0);
		}
	},
	data() {
		return {
			cartBarStyles: {
				position: 'fixed',
				bottom: 0,
				// #ifdef H5
				bottom: 'var(--window-bottom)',
				// #endif
				width: '100%',
				'z-index': '995',
				height: '100rpx',
				'background-color': '#f0f0f1',
				'border-bottom': '2rpx solid #c8c7cc',
				display: 'flex',
				'justify-content': 'space-between',
				'align-items': 'stretch'
			},
			show: false
		};
	},
	methods: {
		details() {
			// this.$refs['cartPopup'].open()
		},
		open() {
			this.$refs['popup'].open();
		},
		isShowPopup() {
			this.show ? this.close() : this.open();
		},
		close() {
			this.$refs['popup'].close();
		},
		change({ show }) {
			this.show = show;
		},
		add(index) {
			this.$emit('add', index);
		},
		minus(index) {
			this.$emit('minus', index);
		},
		clear() {
			this.$emit('clear');
		},
		minus(product) {
			this.$emit('minus', product);
		},
		clear() {
			this.$emit('clear');
		},
		pay() {
			this.$emit('pay');
		}
	},
	watch: {
		cartNum(val) {
			if (!val) {
				// this.$refs['cartPopup'].close()
				console.log('xxx');
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.left {
	display: flex;
	align-items: center;

	.detail-action {
		height: 100%;
		border-radius: 100%;
		background-color: #ffffff;
		box-shadow: 0 10rpx 10rpx 0 rgba($color: $border-color, $alpha: 0.2);
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100rpx;
		height: 100rpx;
		margin-top: -20rpx;
		margin-right: 20rpx;
		margin-left: 20rpx;

		.shopbag-btn {
			width: 70rpx;
			height: 70rpx;
		}

		.badge {
			background-color: $color-primary;
			font-size: $font-size-sm;
			color: #ffffff;
			line-height: 1rem;
			width: 1rem;
			text-align: center;
			border-radius: 100%;
			position: absolute;
			right: 0;
			top: 0;
		}
	}

	.price {
		font-size: $font-size-lg;
		font-weight: bold;
		color: $text-color-base;
	}
}

.right {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 70rpx;
	border-radius: 0 !important;
	font-size: $font-size-lg;
}

.cart-popup {
	background-color: #fff;
	padding-bottom: 100rpx;
}

.header {
	padding: 0 30rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	border-bottom: 1rpx solid rgba($color: $border-color, $alpha: 0.6);
	font-size: $font-size-sm;
	color: #adb838;
	background-color: #e8eacf;
	.order-type {
		display: flex;
		align-items: center;
		font-size: $font-size-sm;
		color: $text-color-base;

		.extra {
			margin-right: 10rpx;
			border: 2rpx solid $color-primary;
			font-size: 18rpx;
			padding: 2rpx 10rpx;
			color: $color-primary;
			margin-left: 10rpx;
		}
	}

	.delete-btn {
		width: 46rpx;
		height: 46rpx;
		margin-right: 10rpx;
	}
}

.content {
	max-height: calc(100vh - 600rpx);

	.wrapper {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.list {
		display: flex;
		flex-direction: column;
		margin-bottom: 30rpx;

		.item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 30rpx 0;
			position: relative;

			&::after {
				content: ' ';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				background-color: $border-color;
				height: 2rpx;
				transform: scaleY(0.6);
			}

			.left {
				flex: 1;
				display: flex;
				flex-direction: column;
				overflow: hidden;
				margin-right: 30rpx;

				.name {
					font-size: $font-size-sm;
					color: $text-color-base;
				}
				.props {
					color: $text-color-assist;
					font-size: 24rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}

			.center {
				// margin-right: 120rpx;
				font-size: $font-size-base;
			}

			.right {
				display: flex;
				align-items: center;
				justify-content: space-between;

				.btn {
					width: 46rpx;
					height: 46rpx;
					border-radius: 100%;
					padding: 0;
					text-align: center;
					line-height: 46rpx;
				}

				.number {
					font-size: $font-size-base;
					width: 46rpx;
					height: 46rpx;
					text-align: center;
					line-height: 46rpx;
				}
			}
		}
	}
}
</style>
