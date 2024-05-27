<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar"
			style="background: #fff; border-bottom: rgba(39,40,50,0.1); box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);">
			<view class="search-div">
				<image src="../../static/images/sign/search.png" class="search-img"></image>
				<input type="search" placeholder="搜索用户/群聊" class="search" @input="search"
					placeholder-style="color:#aaa;font-weight:400" />
			</view>
			<view class="top-bar-right">
				<view class="text" @tap="backOne()">
					取消
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userarr.length>0">用户</view>
				<view class="list user" v-for="(item,index) in userarr" :key="index">
					<navigator :url="'/pages/userhome/userhome?id='+item._id">
						<image :src="item.imgurl" mode=""></image>

						<view class="names">
							<view class="name" v-html="item.names"></view>
							<view class="email" v-html="item.emails"></view>
						</view>
					</navigator>


					<view class="right-bt send" v-if="item.tip==1" @tap="goChat(item)">发消息</view>
					<view class="right-bt add" v-if="item.tip==0" @tap="addFriendBtn(item._id)">加好友</view>
				</view>
			</view>
		</view>


		<!-- 点击加好友时弹出输入框 -->
		<view class="modify" :style="{bottom: -+widHeight+'px'}" :animation='animationDat'>
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title">添加好友 </view> <!-- 需要修改的部分（动态的） -->
				<view class="define" @tap="addSubmit">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="msg" class="modify-content"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas';
	export default {
		data() {
			return {
				userarr: [],
				uid: '',
				myname: '',
				token: '',
				isModify: false, // 动画开关
				animationDat: {}, // 动画
				widHeight: '', // 页面高度
				msg: '', // 好友申请信息
				fid: '', // 添加的好友的ID
			};
		},
		onLoad() {
			this.getStorages();
		},
		onReady() {
			this.getElementStyle();
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					var value = uni.getStorageSync('user');
					if (value) {
						this.uid = value.id;
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
			// 跳转到聊天页
			goChat: function(data) {
				uni.navigateTo({
					url: '/pages/chatroom/chatroom?id=' + data.id + '&name=' + data.name + '&img=' + data
						.imgurl + '&type=' + data.type,
				})
			},
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取关键词
			search: function(e) {
				this.userarr = [];
				var searchval = e.detail.value;
				if (searchval.length > 0) {
					this.searchUser(searchval);
				}
			},
			// 寻找关键词匹配的好友
			searchUser: function(e) {
				uni.request({
					url: this.serverUrl + '/search/user',
					data: {
						data: e,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							// 访问后端成功
							var arr = data.data.result;
							// var exp = eval("/" + e + "/g")
							for (var i = 0; i < arr.length; i++) {
								this.isFriend(arr[i], e);
								// if (arr[i].name.search(e) != -1 || arr[i].email.search(e) != -1) {
								// 	this.isFriend(arr[i], e);
								// }
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
			// 匹配搜索的用户是否为好友
			isFriend: function(arr, e) {
				var tip = 0;
				var exp = eval("/" + e + "/g")
				if (arr._id == this.uid) {
					tip = 2;
					arr.tip = tip;
					arr.imgurl = this.serverUrl + arr.imgurl;
					// arr.imgurl = this.serverUrl + '/user/' + arr.imgurl;
					// 搜索的关键词高亮显示
					arr.names = arr.name.replace(exp, "<span style='color:#4aaaff'>" +
						e + "</span>");
					arr.emails = arr.email.replace(exp,
						"<span style='color:#4aaaff'>" + e + "</span>");
					this.userarr.push(arr);
				} else {
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: arr._id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							var status = data.data.status;
							if (status == 200) {
								// 访问后端成功
								// 是好友
								tip = 1;
							} else if (status == 400) {
								// 不是好友

							} else if (status == 500) {
								uni.showToast({
									icon: 'none',
									title: '网络状态不好，请稍等！！！',
									duration: 1500, //提示显示的时间 ms
								});
							};
							arr.tip = tip;
							arr.id = arr._id;
							arr.type = 0;
							arr.imgurl = this.serverUrl + arr.imgurl;
							// arr.imgurl = this.serverUrl + '/user/' + arr.imgurl;
							// 搜索的关键词高亮显示
							arr.names = arr.name.replace(exp, "<span style='color:#4aaaff'>" +
								e + "</span>");
							arr.emails = arr.email.replace(exp,
								"<span style='color:#4aaaff'>" + e + "</span>");
							this.userarr.push(arr);
						},
					})
				}
			},
			// 获取页面高度
			getElementStyle: function() {
				var query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.widHeight = data.height;
				}).exec();
			},
			// 添加好友
			addFriendBtn: function(e) {
				this.msg = this.myname + '请求添加好友！！！';
				this.modify();
				this.fid = e;
			},
			// 修改项弹框
			modify: function(type, data, ispwd) {
				if (ispwd) {
					this.ispwd = 'block'
				} else {
					this.ispwd = 'none'
				};
				// this.ispwd = ispwd;
				this.modifyTitle = type;
				this.data = data;
				this.isModify = !this.isModify;
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				});


				if (this.isModify) {
					animation.bottom(0).step();
				} else {
					animation.bottom(-this.widHeight).step();
				}
				this.animationDat = animation.export();
			},
			//弹框修改确定
			modifyStbmit: function() {
				this.modify()
			},
			// 确定添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',
						data: {
							uid: this.uid,
							fid: this.fid,
							token: this.token,
							msg: this.msg,
						},
						method: 'POST',
						success: (data) => {
							var status = data.data.status;
							if (status == 200) {
								// 访问后端成功
								// 发送好友
								this.modifyStbmit();
								uni.showToast({
									icon: 'none',
									title: '好友请求发送成功',
									duration: 1500, //提示显示的时间 ms
								});
							} else if (status == 500) {
								uni.showToast({
									icon: 'none',
									title: '网络状态不好，请稍等！！！',
									duration: 1500, //提示显示的时间 ms
								});
							};
						}
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	@import url('@/commons/css/mycss.scss');

	.content {
		padding-top: var(--status-bar-height);
	}


	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		display: flex;
		align-items: center;
		justify-content: flex-end;

		.search-div {
			position: absolute;
			// top: 0;
			// left: 0;
			// float: left;
			width: 100%;
			box-sizing: border-box;
			z-index: -1;
			padding: 14rpx 118rpx 14rpx $uni-spacing-col-base;

			.search {
				padding: 0 60rpx 0 12rpx;
				// width: 600rpx;
				height: 60rpx;
				background: $uni-bg-color-grey;
				border-radius: 10rpx;
			}

			.search-img {
				position: absolute;
				right: 130rpx;
				top: 22rpx;
				width: 40rpx;
				height: 40rpx;
			}
		}

		.top-bar-right {
			padding-right: 30rpx;
		}

	}

	.main {
		padding: 88rpx $uni-spacing-col-base;

		.result {
			padding-top: 34rpx;

			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: $uni-text-color;
				line-height: 60rpx;
			}

			.list {
				width: 100%;
				// border: 1px solid red;
				height: 80rpx;
				padding: 20rpx 0;


				image {
					float: left;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					background-color: rgba(255, 228, 49, 1);
				}
			}

			.names {
				float: left;
				padding-left: $uni-spacing-col-base;
			}

			.name {
				font-size: 36rpx;
				line-height: 50rpx;
			}

			.right-bt {
				float: right;
				width: 120rpx;
				height: 48rpx;
				border-radius: 24rpx;
				font-size: 24rpx;
				font-weight: 400;
				line-height: 48rpx;
				text-align: center;
				margin: 0 auto;
			}

			.send {
				background-color: $uni-color-primary;
				color: $uni-text-color;
			}

			.add {
				background-color: rgba(74, 170, 255, 0.1);
				color: #4aaaff;
			}

			.email {
				font-size: 24rpx;
				color: $uni-text-color;
				line-height: 28rpx;
			}
		}
	}

	// 修改弹框
	.modify {
		position: fixed;
		z-index: 1002;
		// top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background-color: #fff;

		.modify-header {
			width: 100%;
			height: 88rpx;
			padding-top: var(--status-bar-height);
			display: flex;
			flex-direction: row;
			align-items: center;
			border-bottom: 1px solid $uni-border-color;

			.close {
				padding-left: 32rpx;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}

			.title {
				flex: auto;
				text-align: center;
				font-size: 40rpx;
				color: $uni-text-color;
				line-height: 88rpx;
			}

			.define {
				padding-right: $uni-spacing-col-base;
				font-size: $uni-font-size-lg;
				color: $uni-color-success;
				line-height: 44rpx;
			}
		}

		.modify-main {
			display: flex;
			padding: $uni-spacing-col-base;
			flex-direction: column;

			.modify-pwd {
				padding: 0 20rpx;
				box-sizing: border-box;
				width: 100%;
				flex: auto;
				margin-bottom: $uni-spacing-col-base;
				height: 88rpx;
				border-radius: $uni-border-radius-base;
				background: $uni-bg-color-grey;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 88rpx;
			}

			.modify-content {
				padding: 16rpx 20rpx;
				flex: auto;
				box-sizing: border-box;
				width: 100%;
				height: 386rpx;
				border-radius: $uni-border-radius-base;
				background: $uni-bg-color-grey;
				font-size: $uni-font-size-lg;
				color: $uni-text-color;
				line-height: 44rpx;
			}
		}
	}
</style>