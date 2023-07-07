<template>
	<view class="w-100 h-100">
		<view class="box"><button @tap="out" type="primary" size="default" plain class="bottom-btn">退出登录</button></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			name: 'xxxx'
		};
	},
	methods: {
		out() {
			uni.showModal({
				title: '提示',
				confirmColor:'#adb838',
				content: '确定要退出登录？',
				success: async res => {
					if (res.confirm) {
						uni.removeStorageSync('TokenKey');
						uni.removeStorageSync('cart');
						uni.switchTab({
							url: '/pages/index/index'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.box {
	margin: 20px 10px;
	display: flex;
	justify-content: center;
}
.bottom-btn {
	height: 100rpx;
	width: 100vw;
	font-size: $font-size-lg;
	border-radius: 100rpx;
	padding: 0;
	line-height: 100rpx;
	text-align: center;
	margin: 0 10rpx;
}
</style>
