<template>
	<view class="box">
		<view class="title">您对商家/菜品满意吗？</view>
		<view class="store_name">奈思的茶(华软店)</view>
		<view class="">
			<view class="total score">
				<text>总体</text>
				<u-rate :count="count" size="66" active-color="#adb838" v-model="total"></u-rate>
			</view>
			<view class="score">
				<text>口味</text>
				<u-rate :count="count" size="50" gutter="24" active-color="#adb838" v-model="taste"></u-rate>
			</view>
			<view class="score">
				<text>服务</text>
				<u-rate :count="count" size="50" gutter="24" active-color="#adb838" v-model="serve"></u-rate>
			</view>
		</view>
		<view class="input_box">
			<textarea v-model="content" placeholder="口味赞,服务好,推荐给大家" />

			<view class="pre-box" v-if="!showUploadList">
				<view class="pre-item" v-for="(item, index) in lists" :key="index">
					<image class="pre-item-image" :src="item.url" mode="aspectFill"></image>
					<view class="u-delete-icon" @tap.stop="deleteItem(index)"><u-icon name="close" size="20" color="#adb838"></u-icon></view>
					<u-line-progress v-if="item.progress > 0 && !item.error" :show-percent="false" height="16" class="u-progress" :percent="item.progress"></u-line-progress>
				</view>
			</view>

			<u-upload
				ref="uUpload"
				:custom-btn="customBtn"
				:show-upload-list="showUploadList"
				:action="action"
				:auto-upload="autoUpload"
				:file-list="fileList"
				:show-progress="showProgress"
				:deletable="deletable"
				:max-count="maxCount"
				@on-list-change="onListChange"
				:header="header"
				@on-uploaded="uploadSuccess"
			>
				<view v-if="customBtn" slot="addBtn" class="slot-btn btn_color" hover-class="slot-btn__hover" hover-stay-time="150">
					<u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon>
				</view>
			</u-upload>
		</view>
		<view class=""></view>
		<view class=" "><button @tap="commit" class="btn" type="default">提交评论</button></view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			count: 5,
			total: 0,
			taste: 0,
			serve: 0,

			action: 'http://localhost:3000/web/api/upload',
			// 预置上传列表
			fileList: [],
			// fileList: [{
			// 	url: 'http://pics.sc.chinaz.com/files/pic/pic9/201912/hpic1886.jpg',
			// 	error: false,
			// 	progress: 100
			// }],
			showUploadList: true,
			customBtn: false,
			autoUpload: false,
			showProgress: true,
			deletable: true,
			customStyle: false,
			maxCount: 3,
			lists: [], // 组件内部的文件列表
			header: {
				Authorization: uni.getStorageSync('TokenKey') || ''
			},
			content: ''
		};
	},
	onLoad({ id }) {
		this.orderId = id;
	},
	methods: {
		deleteItem(index) {},
		onListChange(lists) {
			this.lists = lists;
		},
		commit(e) {
			console.log(e);
			this.$refs.uUpload.upload();
		},
		async uploadSuccess() {
			let url = this.$refs.uUpload.lists.map(i => {
				return { url: i.response.url };
			});

			console.log(url);

			let order = await this.$u.post('/comment', {
				orderId: this.orderId,
				ratePics: url,
				content: this.content,
				totalScore: this.total,
				tasteScore: this.taste,
				serveScore: this.serve
			});
			uni.showToast({
				title: '评价成功',
				icon: 'success'
			});
			setTimeout(() => {
				uni.navigateBack();
				// uni.hideToast();
			}, 1000);
		}
	}
};
</script>

<style lang="scss">
.btn_color {
	border-bottom: 1px solid #adb838;
}
/deep/ .slot-btn {
	background: rgb(244, 245, 246);
}
.btn {
	margin: 20rpx 0;
	// border: ;
	color: #adb838;
}
.box {
	background-color: #ffffff;
	margin: 20rpx 10rpx;
	padding: 10rpx;
	border-radius: 20rpx;
	text {
		padding-right: 20rpx;
	}
	.title {
		font-weight: bold;
		font-size: 16px;
		border-bottom: 1px solid #eee;
		padding: 20rpx;
	}
	.store_name {
		font-size: 16px;
		padding: 20rpx;
	}
	.score {
		padding: 10rpx;
		display: flex;
		align-items: center;
	}
	.total {
		font-weight: bold;
	}

	.input_box {
		margin-top: 20rpx;
		padding: 20rpx;
		border-radius: 20rpx;
		background-color: #f5f5f5;
		textarea {
			height: 160rpx;
		}
	}
}
</style>
