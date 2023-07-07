<template>
	<view class="container">
		<view class="orders-list d-flex flex-column w-100" style="padding: 20rpx; padding-bottom: 0;">
			<view class="order-item" v-for="(item, index) in orders" :key="index" style="margin-bottom: 30rpx;" @tap="detail(item._id)">
				<list-cell :hover="false">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column">
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;" v-if="item.isOrderOut">
								<view class="">{{ item.orderOut.address }}</view>
								<view class="font-size-base">{{ item.orderOut.name }} - {{ item.orderOut.phone }}</view>
							</view>
							<view class="font-size-lg text-color-base" style="margin-bottom: 20rpx;" v-else>第一饭堂</view>
							<view class="font-size-sm text-color-assist">订单编号：{{ item._id }}</view>
						</view>
						<view class="font-size-lg text-color-primary">{{ item.postscript }}</view>
					</view>
				</list-cell>
				<list-cell :hover="false" last>
					<view class="w-100 d-flex flex-column">
						<view class="w-100 text-truncate font-size-lg text-color-base" style="margin-bottom: 20rpx;">{{ orderGoodsName(item.goods) }}</view>
						<view class="d-flex justify-content-between align-items-center" style="margin-bottom: 30rpx;">
							<view class="font-size-sm text-color-assist">{{ new Date(item.createdAt).toLocaleString() }}</view>
							<view class="d-flex font-size-sm text-color-base align-items-center">
								<view style="margin-right: 10rpx;">共{{ item.goods | amount }}件商品，实付</view>
								<view class="font-size-lg">￥{{ item.priceTotal }}</view>
							</view>
						</view>
						<view class="d-flex align-items-center justify-content-end">
							<!-- 		<view style="margin-right: 10rpx;">
								<button type="primary" plain size="mini" v-if="item.invoice_status > 0">查看发票</button>
								<button type="primary" plain size="mini" v-else @tap.stop="goToInvoice">开发票</button>
							</view> -->
							<view>
								<button type="primary" plain size="mini" v-if="item.postscript === '制作中'" @tap.stop="successOrder(item)">确认收货</button>
								<button type="primary" plain size="mini" v-if="item.postscript === '已完成' && !item.evaluate" @tap.stop="comment(item)">去评价</button>
								<button type="primary" plain size="mini" v-if="item.postscript === '已完成' && item.evaluate">已评价</button>
							</view>
						</view>
					</view>
				</list-cell>
			</view>
		</view>
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
			page: 1,
			pageSize: 5,
			orders: []
		};
	},
	filters: {
		amount(goods) {
			return goods.reduce((acc, cur) => acc + cur.number, 0);
		}
	},
	computed: {
		orderGoodsName() {
			return goods => {
				let arr = [];
				goods.forEach(good => arr.push(good.name + '*' + good.number));
				return arr.join('，');
			};
		}
	},
	onShow() {
		this.getOrders(false);
	},

	methods: {
		async getOrders(isRefresh = false) {
			uni.showLoading({
				title: '加载中'
			});
			// console.log(this.$store);
			let orders = await this.$u.get('/orders');
			this.orders = orders;
			console.log(orders);
			uni.hideLoading();
		},
		detail(id) {
			uni.navigateTo({
				url: '/pages/orders/detail?id=' + id
			});
		},
		async successOrder(item) {
			item.postscript = '已完成';
			let orders = await this.$u.put(`/order/${item._id}`, { postscript: '已完成' });
			uni.showToast({
				title: '收货成功',
				icon: 'success'
			});
		},
		comment(order) {
			console.log(order);
			uni.navigateTo({
				url: '/pages/comment/comment?id=' + order._id
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

<style lang="scss" scoped></style>
