<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar"
			style="background: #fff; border-bottom: rgba(39,40,50,0.1); box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);">
			<view class="more-left" @tap="backOne">
				<image src="../../static/images/sign/return.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">好友请求</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="requester" v-for="(item,index) in requesters" :key="index">
				<view class="requester-top">
					<view class="reject btn" @tap="refuse(item.id)">拒绝</view>
					<view class="header-img">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="aggree btn" @tap="agree(item.id)">同意</view>
				</view>
				<view class="requester-center">
					<view class="title">{{item.name}}</view>
					<view class="time">{{changTime(item.lastTime)}}</view>
				</view>
				<view class="notic">
					<text>留言：</text>
					{{item.msg}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				requesters: [],
				uid: '',
				myname: '',
				token: '',
			};
		},
		onLoad() {
			this.getStorages();
			this.friendRequest();
		},
		methods: {
			// 好友申请
			friendRequest: function() {
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						token: this.token,
						state: 1,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							for (var i = 0; i < res.length; i++) {
								res[i].imgurl = this.serverUrl + res[i].imgurl;
								// res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl;
								this.getLeave(res, i)
							};
							this.requesters = res;
							console.log(res);
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 留言
			getLeave: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						token: this.token,
						fid: arr[i].id
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							var e = arr[i];
							e.msg = res.message;
							arr.splice(i, 1, e);
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 获取缓存数据
			getStorages: function() {
				try {
					var value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
						this.token = value.token;
						this.myname = value.name;
					} else {
						// 找不到用户缓存，跳转到登陆页面
						uni.navigateTo({
							url: '/pages/signin/signin',
						})
					}
				} catch (e) {
					console.log(e);
				}
			},
			// 拒绝好友申请
			refuse: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/deletefriend',
					data: {
						uid: this.uid,
						token: this.token,
						fid: fid,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							for (var i = 0; i < this.requesters.length; i++) {
								if (this.requesters[i].id == fid) {
									this.requesters.splice(i, 1);
								}
							};
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 同意好友申请
			agree: function(fid) {
				uni.request({
					url: this.serverUrl + '/friend/updatefriendstate',
					data: {
						uid: this.uid,
						token: this.token,
						fid: fid,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							for (var i = 0; i < this.requesters.length; i++) {
								if (this.requesters[i].id == fid) {
									this.requesters.splice(i, 1);
								}
							};
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 返回上一页
			backOne: function() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			// 获取时间修改
			changTime: function(date) {
				return myfun.dateTime(date)
			},

		},
	}
</script>

<style lang="scss">
	@import url(@/commons/css/mycss.scss);

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.more-left {
			padding-left: 14rpx;
			padding-right: 30rpx;

			image {
				width: 52rpx;
				height: 52rpx;
				padding: 18rpx 0 0 18rpx;
			}
		}

		.top-bar-center {
			text-align: center;

			.title {
				text-align: center;
				font-size: 40rpx;
				line-height: 80rpx;
			}
		}

		.top-bar-right {
			padding-left: 30rpx;
			padding-right: 14rpx;

			.pice {
				width: 52rpx;
				height: 52rpx;
				padding: 18rpx 0 0 18rpx;
			}
		}
	}

	.main {
		padding: 108rpx $uni-spacing-col-base;

		.requester {
			// width: 686rpx;
			margin-top: 112rpx;
			padding: $uni-spacing-col-base;
			background: rgba(255, 255, 255, 1);
			box-shadow: 0 24rpx 64rpx -8rpx rgba(0, 0, 0, 0.1);
			border-radius: $uni-border-radius-base;
		}

		.requester-top {
			display: flex;
			flex-direction: row;

			.btn {
				text-align: center;
				flex: auto;
				width: 160rpx;
				height: 64rpx;
				background: rgba(255, 93, 91, 0.1);
				border-radius: 40rpx;
				font-size: $uni-font-size-lg;
				line-height: 64rpx;
			}

			.reject {
				color: $uni-color-error;
				background-color: rgba(255, 93, 91, 0.1);
			}

			.aggree {
				color: $uni-text-color;
				background-color: $uni-color-primary;
			}

			.header-img {
				margin-top: -104rpx;
				flex: auto;
				text-align: center;

				image {
					width: 144rpx;
					height: 144rpx;
					border-radius: 50%;
					background-color: $uni-color-primary;
				}
			}
		}

		.requester-center {
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 40rpx;

			.title {
				font-size: 36rpx;
				color: $uni-text-color;
				line-height: 50rpx;
			}

			.time {
				font-size: $uni-font-size-sm;
				color: $uni-text-color-disable;
				line-height: 34rpx;
			}
		}

		.notic {
			padding: $uni-spacing-row-sm $uni-spacing-col-base;
			border-radius: $uni-border-radius-base;
			background-color: $uni-bg-color-grey;
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 40rpx;

		}
	}
</style>