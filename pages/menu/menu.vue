<template>
	<view class="box">
		<view class="nav">
			<view class="left" @tap="changeAddres">
				<image src="/static/images/order/location.png" style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
				<text>{{ orderType === 'takein' ? '第一饭堂' : address.address }}</text>
				<view class="iconfont iconarrow-right"></view>
			</view>
			<view class="right">
				<view class="dinein" :class="{ active: orderType == 'takein' }" @tap="SET_ORDER_TYPE('takein')"><text>自取</text></view>
				<view class="takeout" :class="{ active: orderType == 'takeout' }" @tap="takout"><text>外卖</text></view>
			</view>
		</view>

		<view class="u-tabs-box">
			<u-tabs-swiper activeColor="#d0de4c" ref="tabs" :list="list" :current="tabIndex" @change="tabChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
		</view>

		<swiper class="home-swiper" @change="swiperChange" :current="tabIndex">
			<swiper-item class="swiper-item">
				<view class="u-menu-wrap">
					<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop" :scroll-into-view="itemId">
						<view v-for="(item, index) in tabbar" :key="index" class="u-tab-item" :class="[current == index ? 'u-tab-item-active' : '']" @tap.stop="swichMenu(index)">
							<text class="u-line-name">{{ item.name }}</text>
						</view>
					</scroll-view>
					<scroll-view :scroll-top="scrollRightTop" scroll-y scroll-with-animation class="right-box" @scroll="rightScroll">
						<view class="page-view">
							<view class="class-item" :id="'item' + index" v-for="(item, index) in tabbar" :key="index">
								<view class="item-title">
									<text>{{ item.name }}</text>
								</view>
								<view class="item-container">
									<view class="good" v-for="(item1, index1) in item.children" :key="index1">
										<image :src="item1.image" @tap="showGoodDetailModal(item1)" class="image"></image>
										<view class="right">
											<text class="name">{{ item1.name }}</text>
											<text class="tips">{{ item1.desc }}</text>
											<view class="price_and_action">
												<text class="price">
													￥{{ item1.price }}
													<text style="color: #e04141;">{{ item1.isShow ? '' : '(售罄)' }}</text>
												</text>
												<view class="btn-group" v-if="item1.property.length">
													<button type="primary" class="btn property_btn" hover-class="none" @tap="showGoodDetailModal(item1)" size="mini">选规格</button>
													<view class="dot" v-show="goodCartNum(item1._id)">{{ goodCartNum(item1._id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(item1._id)" @tap="reduceCart(item1)" plain class="btn reduce_btn" size="mini" hover-class="none">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(item1._id)">{{ goodCartNum(item1._id) }}</view>
													<button type="primary" class="btn add_btn" @tap="addCart(item1, 1)" size="min" hover-class="none"><view class="iconfont iconadd-select"></view></button>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
			<swiper-item class="swiper-item">
				<uni-load-more v-if="loading" status="loading" iconType="snow"></uni-load-more>
				<view class="u-menu-wrap-pinglun">
					<scroll-view scroll-y scroll-with-animation>
						<view class="header_box d-flex">
							<view class="store_score  d-flex">
								<view class="total_score">{{ totalScore }}</view>
								<view class="">
									<text>商家评分</text>
									<view class=""><u-rate :count="5" size="35" active-color="#d0de4c" v-model="totalScore"></u-rate></view>
								</view>
							</view>
							<view class="right_score d-flex">
								<view class="serve_score">
									<text>服务</text>
									<view class="score_color">{{ serveScore }}</view>
								</view>
								<view class="taste_score">
									<text>口味</text>
									<view class="score_color">{{ tasteScore }}</view>
								</view>
							</view>
						</view>

						<view class="comment">
							<view class="d-flex">
								<view class="all_score" :class="{ select_score_type: scoreIndex === 0 }" @click="selectScoreType(0)">全部</view>
								<view class="good_score" :class="{ select_score_type: scoreIndex === 1 }" @click="selectScoreType(1)">好评</view>
								<view class="bad_score" :class="{ select_score_type: scoreIndex === 2 }" @click="selectScoreType(2)">差评</view>
								<view class="">{{ comment.length }}</view>
							</view>

							<view class="" v-for="item in comment" :key="item._id">
								<view class="user  d-flex">
									<view class=""><image src="../../static/images/logo.png" class="img" mode="scaleToFill"></image></view>
									<view class="rate">
										<view class="">匿名用户</view>
										<view class=" "><u-rate :count="5" size="30" active-color="#d0de4c" v-model="item.totalScore"></u-rate></view>
									</view>
									<view class="">{{ $u.timeFormat(item.createdAt, 'yyyy-mm-dd') }}</view>
								</view>
								<view class="">{{ item.content }}</view>
								<view v-if="item.ratePics.length"><image v-for="img in item.ratePics" :key="img.url" :src="img.url" class="food_img" mode=""></image></view>
							</view>
						</view>
					</scroll-view>
				</view>
			</swiper-item>
		</swiper>
		<u-modal v-model="goodDetailModalVisible" class="good-detail-modal" width="90%" :show-title="false" :show-confirm-button="false">
			<view class="cover">
				<image v-if="good.image" :src="good.image" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ good.name }}</view>
						<view class="tips">{{ good.desc }}</view>
					</view>
					<view class="properties" v-if="good.property && good.property.length">
						<view class="property" v-for="(item, index) in good.property" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.values" :key="key" :class="{ default: value.is_default }" @tap="changePropertyDefault(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">
						￥{{ good.price }}
						<text style="color: #e04141;">{{ good.isShow ? '' : '(售罄)' }}</text>
					</view>
					<view class="props" v-if="good.property && good.property.length">{{ getGoodSelectedProps(good) }}</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" @tap="handlePropertyReduce"><view class="iconfont iconsami-select"></view></button>
					<view class="number">{{ good.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" @tap="handlePropertyAdd"><view class="iconfont iconadd-select"></view></button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal"><view>加入购物车</view></view>
		</u-modal>
		<cart-bar ref="cartBar" :cart="cart" @pay="toPay" @add="handleCartItemAdd" @minus="handleCartItemReduce" @clear="handleCartClear" />
		<!-- <Modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" width="90%" custom padding="0rpx" radius="12rpx">

		</Modal> -->
	</view>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from 'vuex';
import Modal from '@/components/modal/modal';
import CartBar from './components/cartbar.vue';
export default {
	components: {
		CartBar,
		Modal
	},
	data() {
		return {
			list: [
				{
					name: '点餐'
				},
				{
					name: '评价'
				}
			],
			tabIndex: 0,
			scrollTop: 0, //tab标题的滚动条位置
			oldScrollTop: 0,
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			itemId: '', // 栏目右边scroll-view用于滚动的id
			tabbar: [],
			menuItemPos: [],
			arr: [],
			scrollRightTop: 0, // 右边栏目scroll-view的滚动条高度
			timer: null, // 定时器
			cart: [],
			vcart: [],
			good: {},
			goodDetailModalVisible: false,
			comment: '',
			serveScore: 0,
			tasteScore: 0,
			totalScore: 0,

			scoreIndex: 0,
			loading: false,
			commentData: [],
			isLogin: ''
		};
	},
	onLoad() {
	
	},
	onShow() {
		this.isLogin = uni.getStorageSync('TokenKey');
			this.getGoodsList();
		this.getcomment();
	},
	onReady() {
		this.getMenuItemTop();

		console.log(this.$store.state);
	},
	computed: {
		...mapState(['orderType', 'address', 'store']),
		goodCartNum() {
			//计算单个饮品添加到购物车的数量
			return id =>
				this.cart.reduce((acc, cur) => {
					if (cur.goodId === id) {
						return (acc += cur.number);
					}
					return acc;
				}, 0);
		}
	},

	methods: {
		changeAddres() {
			if (this.orderType == 'takein') return;
			console.log('xxx');
			uni.navigateTo({
				url: '/pages/address/address?is_choose=true'
			});
		},
		selectScoreType(type) {
			this.scoreIndex = type;
			console.log();
			if (type === 0) {
				this.comment = JSON.parse(JSON.stringify(this.commentData));
			} else if (type === 1) {
				this.comment = this.commentData.filter(i => i.totalScore >= 4);
			} else if (type === 2) {
				this.comment = this.commentData.filter(i => i.totalScore <= 3);
			}
		},
		async getcomment() {
			let res = await this.$u.get('/comment');
			let length = res.length;
			this.totalScore = (res.reduce((total, score) => (total += score.totalScore), 0) / length).toFixed(1);
			this.serveScore = (res.reduce((total, score) => (total += score.serveScore), 0) / length).toFixed(1);
			this.tasteScore = (res.reduce((total, score) => (total += score.tasteScore), 0) / length).toFixed(1);
			this.commentData = res;
			this.comment = JSON.parse(JSON.stringify(this.commentData));
		},
		...mapMutations(['SET_ORDER_TYPE']),
		takout() {
			if (this.orderType == 'takeout') return;

			if (!this.isLogin) {
				uni.showModal({
					title: '提示',
					confirmColor: '#adb838',
					content: '即将前往登录页面',
					success: async res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
			} else {
				uni.navigateTo({
					url: '/pages/address/address?is_choose=true'
				});
			}
		},
		showGoodDetailModal(item) {
			this.good = JSON.parse(JSON.stringify({ ...item, number: 1 }));

			this.good.property.forEach(i => {
				this.$set(i.values[0], 'is_default', 1);
			});
			console.log(this.good);
			this.goodDetailModalVisible = true;
		},
		closeGoodDetailModal() {
			//关闭饮品详情模态框
			this.goodDetailModalVisible = false;
			// this.category = {}
			this.good = {};
		},
		changePropertyDefault(index, key) {
			//改变默认属性值
			this.good.property[index].values.forEach(value => this.$set(value, 'is_default', 0));
			this.good.property[index].values[key].is_default = 1;
			this.good.number = 1;
		},
		getGoodSelectedProps(good) {
			//计算当前饮品所选属性

			let props = [];

			console.log(good);
			good.property.forEach(({ values }) => {
				values.forEach(value => {
					if (value.is_default) {
						props.push(value.value);
					}
				});
			});
			return props.join('，');

			// return 'xxxx';
		},
		handleCartClear() {
			//清空购物车
			uni.showModal({
				title: '提示',
				confirmColor: '#adb838',
				content: '确定清空购物车么',
				success: ({ confirm }) => {
					if (confirm) {
						this.$refs.cartBar.close();
						this.cart = [];
					}
				}
			});
		},
		handlePropertyAdd() {
			this.good.number += 1;
		},
		handlePropertyReduce() {
			if (this.good.number === 1) return;
			this.good.number -= 1;
		},
		handleCartItemAdd(index) {
			this.cart[index].number += 1;
		},
		handleCartItemReduce(index) {
			if (this.cart[index].number === 1) {
				this.cart.splice(index, 1);
			} else {
				this.cart[index].number -= 1;
			}
			if (!this.cart.length) {
				this.$refs.cartBar.close();
			}
		},
		handleAddToCartInModal() {
			const product = Object.assign({}, this.good, { props_text: this.getGoodSelectedProps(this.good) });
			this.addCart(product, this.good.number);
			this.closeGoodDetailModal();
		},

		addCart(item, num) {
			if (!item.isShow) {
				uni.showToast({
					title: '该商品已售罄',
					duration: 3000,
					icon: 'none'
				});
				return;
			}

			console.log(item);
			console.log(this.cart);
			const index = this.cart.findIndex(good => {
				console.log(good);
				if (item.property.length) {
					return good.goodId === item._id && good.props_text === item.props_text;
				} else {
					return good.goodId === item._id;
				}
			});
			console.log(index);
			if (index !== -1) {
				this.cart[index].number += num;
			} else {
				this.cart.push({
					goodId: item._id,
					name: item.name,
					props_text: item.props_text,
					number: num,
					price: item.price
				});
			}
		},
		reduceCart(item) {
			let index = this.cart.findIndex(i => i.goodId === item._id);
			this.cart[index].number -= 1;
			if (this.cart[index].number <= 0) {
				this.cart.splice(index, 1);
			}
		},
		toPay() {
			if (!this.isLogin) {
				uni.showModal({
					title: '提示',
					confirmColor: '#adb838',
					content: '即将前往登录页面',
					success: async res => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/login/login'
							});
						}
					}
				});
				return;
			}
			uni.setStorageSync('cart', JSON.parse(JSON.stringify(this.cart)));

			uni.navigateTo({
				url: '/pages/pay/pay'
			});
		},
		async getGoodsList() {
			let res = await this.$u.get('/category');
			this.tabbar = res;
			console.log(res);
		},
		// SET_ORDER_TYPE(type) {
		// 	this.orderType = type;
		// },

		tabChange(index) {
			this.tabIndex = index;
			if (index === 1) {
				this.vcart = JSON.parse(JSON.stringify(this.cart));
				this.cart = [];
			}
			if (index === 0) {
				this.cart = JSON.parse(JSON.stringify(this.vcart));
				this.vcart = [];
			}
		},
		swiperChange(e) {
			const { current } = e.detail;
			this.tabIndex = current;
		},
		// 点击左边的栏目切换
		async swichMenu(index) {
			if (this.arr.length == 0) {
				await this.getMenuItemTop();
			}
			if (index == this.current) return;
			this.scrollRightTop = this.oldScrollTop;
			this.$nextTick(function() {
				this.scrollRightTop = this.arr[index];
				this.current = index;
				this.leftMenuStatus(index);
			});
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields(
						{
							size: true
						},
						res => {
							// 如果节点尚未生成，res值为null，循环调用执行
							if (!res) {
								setTimeout(() => {
									this.getElRect(elClass);
								}, 10);
								return;
							}
							this[dataVal] = res.height;
							resolve();
						}
					)
					.exec();
			});
		},
		// 观测元素相交状态
		async observer() {
			this.tabbar.map((val, index) => {
				let observer = uni.createIntersectionObserver(this);
				// 检测右边scroll-view的id为itemxx的元素与right-box的相交状态
				// 如果跟.right-box底部相交，就动态设置左边栏目的活动状态
				observer
					.relativeTo('.right-box', {
						top: 0
					})
					.observe('#item' + index, res => {
						if (res.intersectionRatio > 0) {
							let id = res.id.substring(4);
							this.leftMenuStatus(id);
						}
					});
			});
		},
		// 设置左边菜单的滚动状态
		async leftMenuStatus(index) {
			this.current = index;
			// 如果为0，意味着尚未初始化
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight');
				await this.getElRect('u-tab-item', 'menuItemHeight');
			}
			// 将菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取右边菜单每个item到顶部的距离
		getMenuItemTop() {
			new Promise(resolve => {
				let selectorQuery = uni.createSelectorQuery();
				selectorQuery
					.selectAll('.class-item')
					.boundingClientRect(rects => {
						// console.log(rects);
						// 如果节点尚未生成，rects值为[](因为用selectAll，所以返回的是数组)，循环调用执行
						if (!rects.length) {
							setTimeout(() => {
								this.getMenuItemTop();
							}, 10);
							return;
						}
						rects.forEach(rect => {
							// 这里减去rects[0].top，是因为第一项顶部可能不是贴到导航栏(比如有个搜索框的情况)
							this.arr.push(rect.top - rects[0].top);
							resolve();
						});
					})
					.exec();
			});
		},
		// 右边菜单滚动
		async rightScroll(e) {
			this.oldScrollTop = e.detail.scrollTop;
			if (this.arr.length == 0) {
				await this.getMenuItemTop();
			}
			if (this.timer) return;
			if (!this.menuHeight) {
				await this.getElRect('menu-scroll-view', 'menuHeight');
			}
			setTimeout(() => {
				// 节流
				this.timer = null;
				// scrollHeight为右边菜单垂直中点位置
				let scrollHeight = e.detail.scrollTop + this.menuHeight / 2;
				for (let i = 0; i < this.arr.length; i++) {
					let height1 = this.arr[i];
					let height2 = this.arr[i + 1];
					// 如果不存在height2，意味着数据循环已经到了最后一个，设置左边菜单为最后一项即可
					if (!height2 || (scrollHeight >= height1 && scrollHeight < height2)) {
						this.leftMenuStatus(i);
						return;
					}
				}
			}, 10);
		}
	}
};
</script>

<style>
/* #ifndef H5 */
page {
	height: 100%;
	background-color: #f2f2f2;
}

/* #endif */
</style>

<style lang="scss" scoped src="./menu.scss"></style>

<style lang="scss" scoped>
.comment {
	background-color: #f1f8fa;
	padding: 30rpx;
	.select_score_type {
		background-color: #adb838 !important;
		font-weight: bold;
	}
	.all_score {
		background-color: #d0de4c;
		padding: 8rpx 15rpx;
		border-radius: 10rpx;
		margin: 0 10rpx;
	}
	.good_score {
		background-color: #d0de4c;
		padding: 8rpx 15rpx;
		border-radius: 10rpx;
		margin: 0 10rpx;
	}
	.bad_score {
		background-color: #ccc;
		padding: 8rpx 15rpx;
		border-radius: 10rpx;
		margin: 0 10rpx;
	}
}
.user {
	justify-content: center;
	align-items: center;
	padding: 15rpx 0;
}
.rate {
	flex: 1;
	padding-left: 20rpx;
	// display: flex;
}
.food_img {
	width: 120rpx;
	height: 120rpx;
	margin: 10rpx;
}
.img {
	width: 50rpx;
	height: 50rpx;
}
.header_box {
	background-color: #fff;
	padding: 30rpx 50rpx;
	border-top: 1rpx solid #eee;
	margin-bottom: 20rpx;
	.store_score {
		justify-content: center;
		align-items: center;
		margin-right: 100rpx;
		.total_score {
			font-size: 30px;
			padding: 10rpx 20rpx;
			font-weight: bold;
			color: #adb838;
		}
		text {
			color: $text-color-assist;
			padding-bottom: 10rpx;
		}
	}
	.right_score {
		justify-content: center;
		align-items: center;
		.score_color {
			font-weight: bold;
		}
		.taste_score {
			padding: 0 20rpx;

			text {
				color: $text-color-assist;
			}
		}
		.serve_score {
			text {
				color: $text-color-assist;
			}
		}
	}
}

.u-menu-wrap {
	// flex: 1;
	display: flex;
	height: 100%;
	// overflow-y: auto;
	overflow: hidden;
}
.u-menu-wrap-pinglun {
	display: flex;
	flex-direction: column;
	height: 100%;
	// overflow-y: auto;
	overflow: auto;
}

.u-search-inner {
	background-color: rgb(234, 234, 234);
	border-radius: 100rpx;
	display: flex;
	align-items: center;
	padding: 10rpx 16rpx;
}

.u-search-text {
	font-size: 26rpx;
	color: $u-tips-color;
	margin-left: 10rpx;
}

.u-tab-view {
	width: 200rpx;
	height: 100%;
}

.u-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
	&:nth-last-child(1) {
		padding-bottom: 100rpx;
		box-sizing: content-box;
	}

	.u-line-name {
		width: 200rpx;
		text-align: center;
	}
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
}

.u-tab-item-active::before {
	content: '';
	position: absolute;
	border-left: 4px solid $color-primary;
	height: 32rpx;
	left: 0;
	top: 39rpx;
}

.u-tab-view {
	height: 100%;
}

.right-box {
	background-color: rgb(250, 250, 250);
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.class-item:last-child {
	margin-bottom: 100rpx;
}

.item-title {
	font-size: 26rpx;
	color: $u-main-color;
	font-weight: bold;
}

.item-menu-name {
	font-weight: normal;
	font-size: 24rpx;
	color: $u-main-color;
}

.item-container {
	width: 100%;
	display: flex;
	flex-direction: column;
}

.thumb-box {
	width: 33.333333%;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	margin-top: 20rpx;
}

.item-menu-image {
	width: 120rpx;
	height: 120rpx;
}
.menu-scroll-view {
	margin-bottom: 50px;
}
</style>
