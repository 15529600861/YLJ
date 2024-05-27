<template>
	<view class="content">
		<view class="top-bar">
			<view class="more-left" @tap="backOne()">
				<!-- <image src="../../static/images/sign/return.png" mode="" class="back-img"></image> -->
				<view class="text">取消</view>
			</view>
			<view class="top-bar-center" style="width: 75%;">
				<view class="title">创建群聊</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="top">
				<!-- 群头像 -->
				<view class="group-img">
					<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" mode="" class="img" @tap="upload"></image>
				</view>
				<!-- 群名 -->
				<view class="group-name">
					<input type="text" placeholder="请输入一个群名" class="group-name-input" @blur="isinput" value=""
						v-model="name" />
				</view>
				<view class="title">好友</view>
			</view>

			<!-- 选择好友 -->
			<view class="friends">
				<view class="user" v-for="(item,index) in friends" :key="index" @tap="choose(index)">
					<view class="selected" :class="{isselected:item.selected}">
						<image src="../../static/images/group/choose.png" mode="" v-if="item.selected"></image>
					</view>
					<image class="user-img" :src="item.imgurl" mode=""></image>
					<view class="name">{{item.name}}</view>
				</view>
			</view>
		</view>
		<view class="buttom-bar">
			<view class="buttom-btn" :class="{'btn': isbtn && isipt}" @tap="subimt">创建群聊({{selectionNober}})</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/uni_modules/ling-imgcropper/components/ling-imgcropper/ling-imgcropper.vue"
	export default {
		data() {
			return {
				uid: '',
				token: '',
				gimgurl: '/group/group.png',
				friends: [], // 全部好友数组
				user: [], // 已选择好友的id数组
				name: '',
				// 群头像
				tempFilePath: '',
				headimg: '',
				cropFilePath: '../../static/images/index/DefaultAvatar.png',
				selectionNober: 0, // 选择的好友个数
				isbtn: false, // 控制创建群聊按钮是否可以点击(选择好友)
				isipt: false, // 控制创建群聊按钮是否可以点击(群名)
			};
		},
		components: {
			ImageCropper
		},
		onReady() {

		},
		onLoad() {
			// this.selectionNober();
			this.getStorages();
			this.getFriends();
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					var value = uni.getStorageSync('user');
					console.log(value);
					if (value) {
						this.uid = value.id;
						// this.imgurl = this.serverUrl + '/user/' + value.imgurl;
						this.token = value.token;
					} else {
						// 找不到用户缓存，跳转到登陆页面
						uni.navigateTo({
							url: '/pages/signin/signin',
						})
					}
				} catch (e) {

				}
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
							if (res.length > 0) {
								// this.noone = false;
								for (var i = 0; i < res.length; i++) {
									res[i].imgurl = this.serverUrl + res[i].imgurl;
									// res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl;
									if (res[i].markname) {
										res[i].name = res[i].markname;
									}
									this.friends.push(res[i]);
									console.log(this.friends);
								}
							} else {
								// this.noone = true;
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
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 头像裁剪
			upload() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
			},

			confirm(e) {
				this.tempFilePath = ''
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;

				uni.uploadFile({
					url: this.serverUrl + '/files/upload',
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					formData: {
						url: 'group',
						name: this.uid + new Date().getTime(),
						token: this.token,
					}, //传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						console.log(backstr);
						// 获取群头像路径
						this.gimgurl = backstr;
					},
					complete() {

					},
					fail(e) {
						console.log("this is errormes" + e.message);
					}
				});
			},
			cancel() {
				console.log('canceled')
			},
			// 选择好友勾选
			choose: function(e) {
				this.friends[e].selected = !this.friends[e].selected;
				this.selectionNober = 0;
				for (var i = 0; i < this.friends.length; i++) {
					if (this.friends[i].selected) {
						this.selectionNober++;
					}
				}
				console.log(this.selectionNober);
				if (this.selectionNober > 0) {
					this.isbtn = true;
				} else {
					this.isbtn = false;
				}
				console.log(this.isbtn);
				return this.selectionNober;
			},
			// 群名输入框有内容
			isinput: function(e) {
				console.log(e.detail);
				if (e.detail.cursor > 0) {
					this.isipt = true;
				} else {
					this.isipt = false;
				}
				console.log(this.isipt);
			},
			// 创建群聊
			subimt: function() {
				if (this.isbtn && this.isipt) {
					// console.log('/group/creategroup');
					for (var i = 0; i < this.friends.length; i++) {
						if (this.friends[i].selected) {
							this.user.push(this.friends[i].id);
							// console.log(this.user);
						}
					}
					// 创建群
					uni.request({
						url: this.serverUrl + '/group/creategroup',
						data: {
							uid: this.uid,
							token: this.token,
							name: this.name,
							imgurl: this.gimgurl,
							user: this.user,
						},
						method: 'POST',
						success: (data) => {
							// this.refresh = true;
							var status = data.data.status;
							// console.log(data.data.result);
							if (status === 200) {
								var res = data.data.result;
								// 创建成功返回首页
								uni.navigateTo({
									url: '/pages/index/index',
								})
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
				} else {
					console.log('no');
				}
			},
		},
	}
</script>

<style lang="scss">
	@import url("../../commons/css/mycss.scss");

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid rgba(39, 40, 50, 0.1);
		display: flex;
		flex-direction: row;
		justify-content: space-between;

		.more-left {
			padding-left: 20rpx;

			// image {
			// 	width: 52rpx;
			// 	height: 52rpx;
			// 	padding: 18rpx 0 0 18rpx;
			// }
			.text {
				text-align: center;
				width: 100rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: rgba(39, 40, 50, 1);
				line-height: 88rpx;
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

		display: flex;
		flex-direction: column;
		justify-content: space-between;

		.top {
			padding-top: 118rpx;
			position: fixed;
			background-color: #fff;
			width: 100%;
			z-index: 100;
			display: flex;
			flex-direction: column;
			align-items: center;

			.group-img {
				width: 198rpx;
				height: 198rpx;
				background: #ffe431;
				box-shadow: 0 18rpx 20rpx 0 rgba(39, 40, 50, 0.1);
				border-radius: 40rpx;

				.img {
					width: 100%;
					height: 100%;
					border-radius: 40rpx;
				}
			}

			.group-name {
				padding: 62rpx 40rpx 0;

				.group-name-input {
					text-align: center;
					height: 92rpx;
					background: #f3f4f6;
					border-radius: 46rpx;
					font-size: 32rpx;
					color: rgba(39, 40, 50, 1);
				}
			}

			.title {
				font-size: 44rpx;
				font-weight: 600;
				color: rgba(39, 40, 50, 1);
				line-height: 60rpx;
				padding-top: 20rpx;
			}
		}



		.friends {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			padding: 600rpx 40rpx 100rpx;
			width: 85%;


			.user {
				display: flex;
				flex-direction: row;
				align-items: center;
				height: 120rpx;

				.selected {
					margin-right: 30rpx;
					width: 48rpx;
					height: 48rpx;
					background: rgba(255, 228, 49, 0.5);
					border-radius: 24rpx;
					text-align: center;

					image {
						width: 80%;
						height: 80%;
						padding-top: 10%;
					}
				}

				.isselected {
					background: rgba(255, 228, 49, 1);
				}

				.user-img {
					background: rgba(255, 228, 49, 1);
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}

				.name {
					font-size: 36rpx;
					color: rgba(39, 40, 50, 1);
					padding-left: 32rpx;
					// 超出一行省略
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}
		}
	}

	.buttom-bar {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 104rpx;
		box-sizing: border-box;
		padding: 12rpx 32rpx;
		background: rgba(255, 255, 255, 0.96);
		border-top: 1px solid rgba(39, 40, 50, 0.1);

		.buttom-btn {
			text-align: center;
			line-height: 80rpx;
			background: rgba(222, 222, 222, 1.0);
			// width: 684rpx;
			height: 80rpx;
			border-radius: 20rpx;
			font-size: 32rpx;
			color: rgba(39, 40, 50, 1);
		}

		.btn {
			background: rgba(255, 228, 49, 1);
		}
	}
</style>