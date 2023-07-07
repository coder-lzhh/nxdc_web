<template>
	<view class="container d-flex flex-column">
		<view class="flex-fill form">
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">昵称</view>
					<view class="input flex-fill"><input type="text" placeholder="请填写昵称" placeholder-class="text-color-assist font-size-base" v-model="member.nikeName" /></view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">手机号码</view>
					<view class="input flex-fill"><input type="text" v-model="member.userPhone" disabled /></view>
				</view>
			</list-cell>
			<list-cell :hover="false">
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">性别</view>
					<view class="input flex-fill">
						<view class="radio-group">
							<view class="radio" :class="{ checked: member.sex == '1' }" style="margin-right: 10rpx;" @tap="member.sex = 1">先生</view>
							<view class="radio" :class="{ checked: member.sex == '0' }" @tap="member.sex = 0">女士</view>
						</view>
					</view>
				</view>
			</list-cell>
			<list-cell :hover="false" last>
				<view class="form-input w-100 d-flex align-items-center">
					<view class="label">入会时间</view>
					<view class="input flex-fill"><input type="text" v-model="member.createdAt" disabled /></view>
				</view>
			</list-cell>
		</view>
		<view class="btn-box d-flex align-items-center just-content-center"><button type="primary" class="save-btn" @tap="save">保存</button></view>
	</view>
</template>

<script>
import listCell from '@/components/list-cell/list-cell';

export default {
	components: {
		listCell
	},
	data() {
		return {
			member: { sex: 3, nikeName: '', userPhone: '', createdAt: null }
		};
	},
	onLoad() {
		this.getUserInfo();
	},
	methods: {
		async getUserInfo() {
			let res = await this.$u.get('/userinfo');
			console.log(res);
			this.member.sex = res.sex ;
			this.member.nikeName = res.nikeName || '';
			this.member.userPhone = res.userPhone;
			this.member.createdAt = (res.createdAt && new Date(res.createdAt).toLocaleDateString()) || new Date().toLocaleDateString();
			console.log(this.member);
		},
		async save() {
			uni.showLoading({ title: '加载中' });
			await this.$u.put('/userinfo', { sex: this.member.sex, nikeName: this.member.nikeName });
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	height: 100%;
}

.container {
	padding: 20rpx 30rpx;
}

.form {
	border-radius: 8rpx;
}

.form-input {
	.label {
		width: 160rpx;
		font-size: $font-size-base;
		color: $text-color-base;
	}

	.input {
	}

	.radio-group {
		display: flex;
		justify-content: flex-start;

		.radio {
			padding: 10rpx 30rpx;
			border-radius: 6rpx;
			border: 2rpx solid $text-color-assist;
			color: $text-color-assist;
			font-size: $font-size-base;

			&.checked {
				background-color: $color-primary;
				color: $text-color-white;
				border: 2rpx solid $color-primary;
			}
		}
	}
}

.btn-box {
	height: calc((100vh - 40rpx) / 2);
}

.save-btn {
	width: 90%;
	border-radius: 50rem !important;
	font-size: $font-size-lg;
}
</style>
