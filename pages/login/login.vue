<template>
	<view class="container">
		<u-toast ref="uToast" />
		<view class="intro">
			<image src="/static/images/logo.png"></image>
			<view class="tips">
				一杯好茶，一口软欧包
				<br />
				在奈思遇见两种美好
			</view>
		</view>
		<view class="inp">
			<input type="text" v-model.tirm="user.userPhone" placeholder="手机号码" class="number" />
			<input type="password" v-model.tirm="user.password" :placeholder="placeText" class="pw" />
			<input v-if="!isLogin" type="password" v-model.tirm="user.confirmPassword" placeholder="再次确认密码" class="pw" />
		</view>

		<view class="bottom">
			<button type="primary" size="default" class="login-btn" @tap="login">{{ isLogin ? '登录' : '注册' }}</button>
			<text class="register" @click="changeMode">{{ isLogin ? '注册新账号' : '已有账号去登录' }}</text>
			<view class="d-flex flex-column justify-content-evenly align-items-center text-center" style="height: 30vh;">
				<view class="w-100 font-size-base text-color-assist">新用户登录即加入会员，享会员权益</view>
				<view class="w-100 row d-flex just-content-around align-items-center font-size-sm text-color-assist">
					<view class="grid">
						<image src="/static/images/mine/rhyl.png"></image>
						<view>入会有礼</view>
					</view>
					<view class="grid">
						<image src="/static/images/mine/jfdh.png"></image>
						<view>积分兑换</view>
					</view>
					<view class="grid">
						<image src="/static/images/mine/sjtq.png"></image>
						<view>升级特权</view>
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
				<view class="font-size-base text-color-primary">会员权益说明</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			user: {
				userPhone: '',
				password: '',
				confirmPassword: ''
			},
			isLogin: true
		};
	},
	computed: {
		placeText() {
			return this.isLogin ? '密码' : '请输入至少六位数的密码';
		}
	},
	methods: {
		changeMode() {
			this.isLogin = !this.isLogin;
			this.user = {
				userPhone: '',
				password: '',
				confirmPassword: ''
			};
		},

		async login() {
			if (!this.user.userPhone) {
				this.$refs.uToast.show({
					title: '手机号码不能为空',
					type: 'error'
				});
				return;
			}
			if (!this.user.password) {
				this.$refs.uToast.show({
					title: '请输入至少六位数的密码',
					type: 'error'
				});
				return;
			}
			if (this.isLogin) {
				let res = await this.$u.post('/login', this.user);

				if (res.code === 401) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'error'
					});
				} else {
					uni.setStorageSync('TokenKey', res.token);
					let userInfo = await this.$u.get('/userinfo');
					uni.showToast({
						title: '登录成功',
						icon: 'success'
					});

					setTimeout(() => {
						uni.navigateBack();
						uni.hideToast();
					}, 2000);
				}
			} else {
				if (this.user.password !== this.user.confirmPassword) {
					this.$refs.uToast.show({
						title: '密码不一致',
						type: 'error'
					});
					return;
				}
				let res = await this.$u.post('/register', this.user);
				console.log(res);
				if (res.code === 401) {
					this.$refs.uToast.show({
						title: res.message,
						type: 'error'
					});
				} else if (res.code === 200) {
					uni.showToast({
						title: res.message,
						icon: 'success',
						success: () => {
							this.isLogin = !this.isLogin;
							this.user.password = '';
							this.user.confirmPassword = '';
						}
					});
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.inp {
	padding: 20rpx 40rpx;
}
.number {
	padding-left: 2vw;
	height: 6vh;
	margin: 1vh 0;
	border: 1px solid #adb838;
	border-radius: 2vh;
	color: #adb838;
	&::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #adb838;
	}
}
.pw {
	padding-left: 2vw;
	height: 6vh;
	margin: 1vh 0;
	border: 1px solid #adb838;
	border-radius: 2vh;
	color: #adb838;
	&::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #adb838;
	}
}
.intro {
	width: 100%;
	height: 28vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-evenly;
	font-size: $font-size-base;
	color: $text-color-assist;

	image {
		width: 165rpx;
		height: 165rpx;
	}

	.tips {
		line-height: 72rpx;
		text-align: center;
	}
}

.bottom {
	height: 40vh;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	padding: 0 40rpx;

	.login-btn {
		width: 100%;
		border-radius: 50rem !important;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0;

		image {
			width: 36rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}
	}
	.register {
		text-align: center;
		padding-top: 2vh;
	}
	.row {
		.grid {
			width: 20%;
			image {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 10rpx;
			}
		}
	}
}
</style>
