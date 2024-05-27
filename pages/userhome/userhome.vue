<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar"
			style="background: #fff; border-bottom: rgba(39,40,50,0.1); box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);">
			<view class="more-left" @tap="backOne()">
				<image src="../../static/images/sign/return.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-right">
				<view class="more" v-if="relation == 0 || relation == 1" @tap="userDetial">
					<image src="../../static/images/userhome/more.png" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="bg">
			<view class="bg-bai"></view>
			<image :src="user.imgurl" class="bg-img" mode="aspectFill"></image>
		</view>
		<view class="main">
			<view class="user-header">
				<view class="sex" :style="{background:sexBg}" :animation='animationDat3'>
					<!-- 性别 -->
					<image :src="sex" mode=""></image>
				</view>
				<!-- 用户头像 -->
				<image :src="user.imgurl" mode="aspectFill" class="user-img" :animation='animationDat2'></image>
			</view>
			<view class="user-imf">
				<view class="name">{{markname}}</view> <!-- 姓名 -->
				<view class="nick">昵称：{{user.name}}</view> <!-- 昵称 -->
				<view class="intr">{{user.explain}}</view> <!-- 简介 -->
			</view>
		</view>
		<view class="buttom-bar">
			<view class="buttom-btn" @tap="addFriendBtn" v-if="relation == 2">加为好友</view>
			<view class="buttom-btn" v-if="relation == 1">发送消息</view>
		</view>
		<view class="add-misg" :style="{height:addHeight + 'px',bottom: '-' + addHeight + 'px'}"
			:animation='animationDat'>
			<view class="name">{{user.name}}</view>
			<textarea name="" id="" cols="30" rows="10" maxlength="200" v-model="msg" class="add-main"
				adjust-position="false"></textarea>
		</view>
		<view class="add-bt" :animation='animationDat1'>
			<view class="close" @tap="addFriendAnimat">取消</view>
			<view class="send" @tap="addSubmit">发送</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '', // 对象
				uid: '', // 用户id
				token: '',
				myname: '',
				markname: '',
				user: {},
				msg: '', // 请求好友发送的请求信息
				sex: '../../static/images/userhome/asexual.png', // 性别
				sexBg: 'rgba(206, 210, 213, 1.0)', // 性别颜色(底色)
				relation: '', // 用户关系（0自己，1表示好友，2表示陌生人）
				addHeight: '1000', // add 板块高度
				animationDat: {}, // 添加好友动画效果(主体内容模块)
				animationDat1: {}, // 添加好友动画效果(取消/发送按钮)
				animationDat2: {}, // 添加好友动画效果(头像转换)
				animationDat3: {}, // 背景样式透明度
				isAdd: false, // 监听动画是否完成
			};
		},
		onLoad(e) {
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.judgeFriend();
		},
		onReady: function() {
			this.getElementStyle()
		},
		methods: {
			userDetial: function() {
				uni.navigateTo({
					url: '/pages/userdetials/userdetials?id=' + this.id
				})
			},
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

			// 获取用户信息
			getUser: function() {
				uni.request({
					url: this.serverUrl + '/user/detial',
					data: {
						id: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							// 访问后端成功
							var res = data.data.result;
							// 处理头像连接
							res.imgurl = this.serverUrl + res.imgurl;
							// res.imgurl = this.serverUrl + '/user/' + res.imgurl;
							// 处理简介
							if (typeof(res.explain)) {
								res.explain = '什么也没有';
							}
							// 处理markname
							if (this.markname.length == 0) {
								this.markname = res.name;
							}
							this.sexJudge(res.sex);
							this.user = res;
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								icon: 'none',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 性别
			sexJudge: function(e) {
				if (e == 'female') {
					// 女性
					this.sex = '../../static/images/userhome/female.png';
					this.sexBg = 'rgba(255, 93, 91, 1)';
				} else if (e == 'male') {
					// 男性
					this.sex = '../../static/images/userhome/male.png';
					this.sexBg = 'rgba(0, 170, 255, 1.0)';
				} else {
					// 未知
					this.sex = '../../static/images/userhome/asexual.png';
					this.sexBg = 'rgba(206, 210, 213, 1.0)';
				}
			},
			// 判断用户关系
			judgeFriend: function() {
				if (this.id == this.uid) {
					this.relation = 0;
				} else {
					// 不是自己
					uni.request({
						url: this.serverUrl + '/search/isfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
						},
						method: 'POST',
						success: (data) => {
							var status = data.data.status;
							if (status === 200) {
								// 好友
								this.relation = 1;
								this.getMarkName();
							} else if (status === 400) {
								// 陌生人
								this.relation = 2;
								console.log(this.relation);
							} else if (status === 500) {
								uni.showToast({
									title: '网络状态不好，请稍等！！！',
									duration: 1500, //提示显示的时间 ms
								});
							};
						},
					})
				}
			},
			// 获取好友昵称
			getMarkName: function() {
				uni.request({
					url: this.serverUrl + '/user/getmarkname',
					data: {
						uid: this.uid,
						fid: this.id,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var res = data.data.result;
							if (res.markname != undefined) {
								// markname 存在
								this.markname = res.markname;
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
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取页面高度
			getElementStyle: function() {
				var query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
					// console.log("得到布局位置信息" + JSON.stringify(data));
					// console.log("节点离页面顶部的距离为" + data.top);
					this.addHeight = data.height - 186;
				}).exec();
			},
			// 添加好友动画
			addFriendAnimat: function() {
				this.isAdd = !this.isAdd;
				// 主体内容模块
				var animation = uni.createAnimation({
					duration: 400,
					timingFunction: 'ease',
				});
				// 取消/发送按钮
				var animation1 = uni.createAnimation({
					duration: 520,
					timingFunction: 'ease',
				});
				// 头像转换
				var animation2 = uni.createAnimation({
					duration: 520,
					timingFunction: 'ease',
				});
				// 背景样式透明度
				var animation3 = uni.createAnimation({
					duration: 520,
					timingFunction: 'ease',
				});
				if (this.isAdd) {
					animation.bottom(0).step();
					animation1.bottom(0).step();
					animation2.width(120).height(120).top(50).step();
					animation3.opacity(0).step();
				} else {
					animation.bottom(-this.addHeight).step();
					animation1.bottom(-100).step();
					animation2.width().height().top(0).step();
					animation3.opacity(1).step();
				}

				this.animationDat = animation.export();
				this.animationDat1 = animation1.export();
				this.animationDat2 = animation2.export();
				this.animationDat3 = animation3.export();
			},
			// 添加好友
			addFriendBtn: function(e) {
				this.msg = this.myname + '请求添加好友！！！';
				this.addFriendAnimat();
				this.fid = e;
			},
			// 确定添加好友
			addSubmit: function() {
				if (this.msg.length > 0) {
					uni.request({
						url: this.serverUrl + '/friend/applyfriend',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
							msg: this.msg,
						},
						method: 'POST',
						success: (data) => {
							var status = data.data.status;
							if (status == 200) {
								// 访问后端成功
								// 发送好友
								this.addFriendAnimat();
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
	@import url('../../commons/css/mycss.scss');

	// @import url('../../uni.scss');
	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.more-left {
			padding-left: 14rpx;

			image {
				width: 52rpx;
				height: 52rpx;
				padding: 18rpx 0 0 18rpx;
			}
		}

		.top-bar-right {
			// float: right;
			padding-right: 18rpx;

			image {
				// padding-top: 10rpx;
				width: 52rpx;
				height: 52rpx;
				padding: 18rpx 0 0 18rpx;
			}
		}
	}

	.bg {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -2;

		.bg-img {
			z-index: -1;
			opacity: 0.4;
			position: absolute;
			left: -10rpx;
			top: -10rpx;
			width: 110%;
			height: 110%;
			filter: blur(16px);
		}

		.bg-bai {
			width: 100%;
			height: 100%;
			// background-color: red;
		}
	}

	.main {
		text-align: center;
		// padding-top: 238rpx;

		.user-header {
			padding-top: 148rpx;
			position: relative;
			width: 412rpx;
			height: 412rpx;
			margin: 0 auto;

			.sex {
				position: absolute;
				bottom: 22rpx;
				right: 22rpx;
				width: 63rpx;
				height: 64rpx;
				// background: rgba(255, 93, 91, 1);
				border-radius: 36rpx;
				z-index: 11;

				image {
					width: 100%;
					height: 100%;
				}
			}

			.user-img {
				z-index: 10;
				top: 0;
				width: 400rpx;
				height: 400rpx;
				border-radius: 48rpx;
				border: 6rpx solid rgba(255, 255, 255, 1);
				box-shadow: 0 36rpx 40rpx 0 rgba(39, 40, 50, 0.1);
			}
		}

		.user-imf {
			padding-top: 42rpx;

			.name {
				font-size: 52rpx;
				color: $uni-text-color;
				line-height: 74rpx;
			}

			.nick {
				line-height: 42rpx;
				color: $uni-text-color;
				font-size: $uni-font-size-base;
			}

			.intr {
				padding: 20rpx 100rpx;
				// width: 552rpx;
				font-size: $uni-font-size-base;
				font-weight: 300;
				color: $uni-text-color;
				line-height: 48rpx;
			}
		}
	}

	.buttom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx $uni-spacing-col-base;
		// background-color: #eee;

		.buttom-btn {
			text-align: center;
			line-height: 80rpx;
			background: $uni-color-primary;
			// width: 684rpx;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
		}
	}

	.add-misg {
		position: fixed;
		bottom: 0;

		width: 100%;
		// height: 1252rpx;
		background: rgba(255, 255, 255, 1);
		border-radius: 40rpx 40rpx 0 0;
		padding: 0 56rpx;
		box-sizing: border-box;

		.name {
			padding: 168rpx 0 40rpx;
			color: $uni-text-color;
			line-height: 52rpx;
			font-size: 52rpx;
		}

		.add-main {
			padding: 18rpx 22rpx;
			box-sizing: border-box;
			width: 100%;
			height: 520rpx;
			border-radius: 20rpx;
			background: rgba(243, 244, 246, 1);
			font-size: $uni-font-size-base;
			color: $uni-text-color;
			line-height: 44rpx;
		}
	}

	.add-bt {
		position: fixed;
		bottom: -104rpx;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx $uni-spacing-col-base;
		z-index: 100;
		height: 104rpx;
		display: flex;
		// background-color: #eee;

		.send {
			flex: auto;
			margin-left: $uni-spacing-col-base;
			text-align: center;
			line-height: 80rpx;
			background: $uni-color-primary;
			// width: 684rpx;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
		}

		.close {
			width: 172rpx;
			// flex: auto;
			text-align: center;
			line-height: 80rpx;
			background: $uni-bg-color-hover;
			height: 80rpx;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
		}
	}
</style>