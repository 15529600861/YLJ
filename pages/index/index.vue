<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<navigator :url="'/pages/userhome/userhome?id='+uid" class="top-bar-left">
				<image :src="imgurl" mode=""></image>
			</navigator>
			<view class="top-bar-center" style="z-index: -1;">
				<!-- <image src="../../static/images/index/Logo.png" mode="" class="logo"></image> -->
				<view class="logo"></view>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/index/Searching.png" mode=""></image>
				</view>
				<view class="add" @tap="buildGroup">
					<image src="../../static/images/index/Add.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 主体内容部分（好友申请，我的朋友，我的群聊） -->
		<view class="main">
			<view class="refresh" v-if="!refresh">
				<image src="../../static/images/index/refresh.png" mode=""></image>
				<view class="ref-title">下拉刷新</view>
			</view>
			<view class="noone" v-if="noone">
				<image src="../../static/images/index/noone.png" mode="aspectFill"></image>
				<view class="no-title">没有好友，快去添加好友！！！</view>
				<view class="search-bt" @tap="toSearch">搜索好友</view>
			</view>
			<view class="firends" v-if="requestData>0" @tap="goRequset">
				<!-- 好友申请 -->
				<view class="firends-list">
					<view class="firends-list-left">
						<text class="tip">{{requestData}}</text>
						<image src="../../static/images/index/AddingFriends.png" mode=""></image>
					</view>
					<view class="firends-list-right">
						<view class="top">
							<view class="name">
								好友申请
							</view>
							<view class="time">
								{{changTime(requestTime)}}
							</view>
						</view>
						<view class="news">
							你好！！！
						</view>
					</view>
				</view>
			</view>
			<view class="firends">
				<!-- 好友(本质是个列表) -->
				<view class="firends-list" v-for="(item,index) in friends" :key="index" @tap="goChat(item)">
					<view class="firends-list-left">
						<text class="tip" v-if="item.tip>0">{{item.tip}}</text>
						<image :src="item.imgurl" mode=""></image>
						<view class="groupm" v-if="item.type == 1"></view>
					</view>
					<view class="firends-list-right">
						<view class="top">
							<view class="name">
								{{item.name}}
							</view>
							<view class="time">
								{{changTime(item.lastTime)}}
							</view>
						</view>
						<view class="news">
							{{item.msg}}
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	// 引入公共的js文件(自己写好的js代码)
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';


	export default {
		data() {
			return {
				friends: [], // 好友
				groups: [], // 群
				uid: '', // 用户id
				imgurl: '', // 用户头像
				token: '', // token
				myname: '',
				requestData: 0, //好友申请数
				requestTime: '', //好友申请最后一个的时间
				refresh: false, // 下拉刷新
				noone: false, // 是否存在好友
			}
		},
		onLoad() {
			this.getStorages();
			this.friendRequest();
			this.getFriends();
			this.getGroup();
			this.join(this.uid);
			// this.sockettest();
			this.receiveSocketMsg();
			// this.receiveSocketMsg('groupMsg');
			this.groupSocket();
			this.leaveChatr();
		},
		onPullDownRefresh() {
			this.friends = [];
			this.getStorages();
			this.friendRequest();
			this.getFriends();
			setTimeout(() => {
				uni.stopPullDownRefresh();
			}, 1000);
		},
		// 在Vue实例中
		// created() {
		// 	this.showCurrentUrl(); // 在Vue实例创建时调用，可以在控制台看到当前页面URL
		// },
		methods: {






			// showCurrentUrl() {
			// 	this.cur(); // 调用获取当前页面URL的方法
			// },


			changTime: function(date) {
				return myfun.dateTime(date)
			},
			// 获取缓存数据
			getStorages: function() {
				try {
					var value = uni.getStorageSync('user');
					console.log(value);
					if (value) {
						this.uid = value.id;
						this.imgurl = this.serverUrl + value.imgurl;
						// this.imgurl = this.serverUrl + '/user/' + value.imgurl;
						this.token = value.token;
						this.myname = value.name;
					} else {
						// 找不到用户缓存，跳转到登陆页面
						uni.navigateTo({
							url: '/pages/signin/signin',
						})
					}
				} catch (e) {

				}
			},

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
						this.refresh = true;
						var status = data.data.status;
						var res = data.data.result;
						this.requestData = res.length;
						if (status === 200) {
							this.noone = false;
							if (res.length > 0) {
								this.requestTime = res[0].lastTime;
								for (var i = 0; i < res.length; i++) {
									if (this.requestTime < res[i].lastTime) {
										this.requestTime = res[i].lastTime;
									}
								};
							} else {
								this.noone = true;
							}
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 获取好友
			getFriends: function() {
				console.log(this.uid);
				uni.request({
					url: this.serverUrl + '/index/getfriend',
					data: {
						uid: this.uid,
						token: this.token,
						state: 0,
					},
					method: 'POST',
					success: (data) => {
						this.refresh = true;
						var status = data.data.status;
						// console.log(data.data.result);
						if (status === 200) {
							var res = data.data.result.result;
							console.log(res);
							// console.log(res.result);
							if (res.length > 0) {
								this.noone = false;
								for (var i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									// res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl;
									if (res[i].markname) {
										res[i].name = res[i].markname;
									}
									this.friends.push(res[i]);
								}
								this.isOk(this.groups)
							} else {
								this.noone = true;
							}
							// 群列表
							// this.getGroup();
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 获取群
			getGroup: function() {
				uni.request({
					url: this.serverUrl + '/index/getgroup',
					data: {
						uid: this.uid,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data);
						var status = data.data.status;
						// console.log(data.data.result);
						if (status === 200) {
							// console.log(this.uid);
							var res = data.data.result;
							console.log(res);
							if (res.length > 0) {
								for (var i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									// res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl;
									this.groups.push(res[i]);
									this.socket.emit('group', res[i].id);
								}
							}
							this.isOk(this.friends)
							// this.friends = myfun.paixu(this.friends, 0);
							// console.log(this.groups);
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},

			// 群与好友排序
			isOk: function(e) {
				if (e.length > 0) {
					// 群与好友数组拼接
					this.friends = this.friends.concat(this.groups);
					// 排序
					this.friends = myfun.paixu(this.friends, 0);
				}
				console.log(this.friends);
			},




			// 获取最后一条消息
			getLastMsg: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/getlastmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							if (res.types == 0) {
								// 文字

							} else if (res.types == 1) {
								// 图片
								res.message = '[图片]'
							} else if (res.types == 2) {
								// 音频
								res.message = '[语音]'
							} else if (res.types == 3) {
								// 位置
								res.message = '[位置]'
							}
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
			// 未读消息数
			getUnread: function(arr, i) {
				uni.request({
					url: this.serverUrl + '/index/unreadmsg',
					data: {
						uid: this.uid,
						fid: arr[i].id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							var e = arr[i];
							e.tip = res;
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
			// socket模块
			// 用户登录socket注册
			join: function(uid) {
				this.socket.emit('login', uid);
			},
			// socket聊天数据接收
			receiveSocketMsg: function() {
				// console.log(11);
				this.socket.on('msg', (msg, fromid) => {
					var nmsg = '';
					if (msg.types == 0) {
						// 文字
						nmsg = msg.message;
					} else if (msg.types == 1) {
						// 图片
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						// 语音
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						// 位置
						nmsg = '[位置]'
					}
					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fromid) {
							var e = this.friends[i];
							e.lastTime = new Date();
							e.msg = nmsg;
							e.tip++; // 未读消息数
							// 删除原来的数据
							this.friends.splice(i, 1);
							// 新的数据插入最上面
							this.friends.unshift(e);
						}
					}
				})
			},

			// 接收群消息
			groupSocket: function() {
				this.socket.on('groupMsg', (msg, fromid, gid, name) => {
					// console.log(msg);
					var nmsg = '';
					if (msg.types == 0) {
						// 文字
						nmsg = msg.message;
					} else if (msg.types == 1) {
						// 图片
						nmsg = '[图片]'
					} else if (msg.types == 2) {
						// 语音
						nmsg = '[语音]'
					} else if (msg.types == 3) {
						// 位置
						nmsg = '[位置]'
					}
					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == gid) {
							var e = this.friends[i];
							e.lastTime = new Date();
							if (fromid == this.uid) {
								e.msg = nmsg;
							} else {
								e.msg = name + '：' + nmsg;
							}
							e.tip++; // 未读消息数
							// 删除原来的数据
							this.friends.splice(i, 1);
							// 新的数据插入最上面
							this.friends.unshift(e);
						}
					}
				})
			},

			// 告知离开聊天页
			leaveChatr: function() {
				this.socket.on('leavechatr', (uid, fid) => {
					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].id == fid) {
							var e = this.friends[i];
							e.lastTime = new Date();
							// if (fromid == this.uid) {
							// 	e.msg = nmsg;
							// } else {
							// 	e.msg = name + '：' + nmsg;
							// }
							e.tip = 0; // 未读消息数
							// 替换原来的数据
							this.friends.splice(i, 1, e);
						}
					}
					// console.log(this.friends);
				})
			},

			// 跳转到搜索页
			toSearch: function() {
				uni.navigateTo({
					url: '/pages/search/search',
				})
			},
			// 跳转到新建群页
			buildGroup: function() {
				uni.navigateTo({
					url: '/pages/buildgroup/buildgroup',
				})
			},
			// 跳转到好友申请页面
			goRequset: function() {
				uni.navigateTo({
					url: '/pages/friendrequest/friendrequest',
				})
			},
			// 跳转到聊天页
			goChat: function(data) {
				// console.log(data.id);
				this.updateMsg(data);
				uni.navigateTo({
					url: '/pages/chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&img=' + data
						.imgurl + '&type=' + data.type,
				})
			},

			// 好友消息修改为已读
			updateMsg: function(data) {
				uni.request({
					url: this.serverUrl + '/index/updatemsg',
					data: {
						uid: this.uid,
						fid: data.id,
						// state: 1,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							console.log('111');
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
		}
	}
</script>

<style lang="scss">
	@import url("@/uni.scss");
	// 头部标签栏
	@import url("@/commons/css/mycss.scss");

	.content {
		display: flex;
	}

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		width: 100%;
		height: 88rpx;
		padding-top: var(--status-bar-height); //解决手机App顶部手机覆盖问题
		padding-bottom: 20rpx;
		position: fixed;
		z-index: 1001;
		top: 0;
		left: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: stretch;

		.top-bar-left {
			// float: left;
			padding-left: 32rpx;

			image {
				padding-top: 10rpx;
				width: 68rpx;
				height: 68rpx;
				border-radius: 20rpx;
			}
		}

		.top-bar-center {
			// text-align: center;

			.logo {
				width: 42rpx;
				height: 42rpx;
				padding-top: 19rpx;
				// border-radius: ;
			}
		}

		.top-bar-right {
			// float: right;
			padding-right: 14rpx;

			.search {
				display: inline-block;
				width: 88rpx;
				height: 88rpx;
				// border: 1rpx solid #ff0000;
				// float: left;
			}

			.add {
				width: 88rpx;
				height: 88rpx;
				display: inline-block;
				// float: right;
			}

			image {
				// padding-top: 10rpx;
				width: 52rpx;
				height: 52rpx;
				padding: 18rpx 0 0 18rpx;
			}
		}
	}

	// 主体内容部分（好友申请，我的朋友，我的群聊）
	.main {
		padding-top: 170rpx;
		width: 100%;
		padding-bottom: $uni-spacing-col-base;
	}

	.refresh {
		text-align: center;
		padding-top: 800rpx;

		image {
			width: 32rpx;
			height: 32rpx;
		}

		.ref-title {
			padding-top: 10rpx;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}
	}

	.noone {
		text-align: center;
		padding-top: 400rpx;

		image {
			height: 250rpx;
			width: 158rpx;
		}

		.no-title {
			padding: 32rpx 0;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 0.4);
			line-height: 40rpx;
		}

		.search-bt {
			display: inline-block;
			width: 240rpx;
			height: 96rpx;
			background: rgba(255, 228, 49, 1);
			box-shadow: 0 52rpx 36rpx -32rpx rgba(255, 228, 49, 0.4);
			border-radius: 48rpx;
			font-size: 28rpx;
			color: rgba(39, 40, 50, 1);
			line-height: 96rpx;
		}
	}

	.firends-list {
		// width: 96rpx;
		height: 96rpx;
		padding: 20rpx 40rpx;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;

		&:active {
			background-color: $uni-bg-color-grey;
		}

		.firends-list-left {
			position: relative;
			padding-right: 20rpx;
			// float: left;

			image {
				width: 96rpx;
				height: 96rpx;
				border-radius: $uni-border-radius-base;
				background-color: $uni-color-primary;
			}

			.tip {
				position: absolute;
				top: -6rpx;
				left: 68rpx;
				min-width: 20rpx;
				height: 36rpx;
				background: $uni-color-warning;
				z-index: 10;
				border-radius: 18rpx;
				padding: 0 8rpx;
				font-size: $uni-font-size-sm;
				color: $uni-text-color-inverse;
				line-height: 36rpx;
				text-align: center;
			}

			.groupm {
				position: absolute;
				bottom: 8rpx;
				right: 20rpx;
				width: 16rpx;
				height: 16rpx;
				background: rgba(255, 71, 71, 1);
				z-index: 10;
				border-radius: 8rpx;
				opacity: 0.8;
				box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.8);
			}
		}

		.firends-list-right {
			width: 100%;
			display: flex;
			flex-direction: column;
			flex-wrap: nowrap;
			// padding-left: 128rpx;
			// float: right;

			.top {
				width: 100%;
				display: flex;
				flex-direction: row;
				flex-wrap: nowrap;

				.name {
					width: 80%;
					// float: left;
					// height: 50rpx;
					font-size: 36rpx;
					font-weight: 400;
					color: $uni-text-color;
					line-height: 50rpx;
				}

				.time {
					// float: right;
					// height: 50rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-disable;
					line-height: 50rpx;
				}
			}
		}

		.news {
			font-size: $uni-font-size-base;
			color: $uni-text-color-grey;
			line-height: 40rpx;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			overflow: hidden;
		}
	}
</style>