<!-- 群 -->
<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<view class="more-left" @tap="backOne()">
				<image src="../../static/images/sign/return.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-right">
				<view class="more">
					<image src="../../static/images/userhome/more.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="bg">
			<image :src="gimg" mode="aspectFill" class="bg-img"></image>
		</view>
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="title">
						<view class="name">第一个</view>
						<view class="time">2024/05/17</view>
					</view>
					<view class="notice">123456789dsadsadsadddddddddddddddddd说的那话嗲是各地啊傻瓜八点八四大概是吧465asd</view>
				</view>
				<view class="member">
					<view class="top">
						<view class="text">群成员</view>
						<view class="top-one">
							<view class="more">管理群成员</view>
							<view class="more-img">></view>
						</view>
					</view>
					<view class="member-ls">
						<view class="member-li" v-for="(item,index) in groupmember" :key="index">
							<view class="imgs">
								<image src="../../static/images/group/delete.png" mode="aspectFill" class="delete">
								</image>
								<image :src="item.imgurl" mode="aspectFill" class="user-img"></image>
							</view>
							<view class="name">{{item.name}}</view>
						</view>
						<image src="../../static/images/submit/Add.png" mode="" class="add"></image>
					</view>
					<view class="clear"></view>
				</view>
				<view class="mitem">
					<view class="colume" @tap="modify('群名称', '第一个' , true, 'gname')">
						<view class="row">
							<view class="title">群名称</view>
							<view class="cont">
								第一个
							</view>
							<view class="more">></view>
						</view>
					</view>

					<view class="colume">
						<view class="row">
							<view class="title">群头像</view>
							<view class="cont">
								<view class="user-head  gimg">
									<image-cropper :src="tempFilePath" @confirm="confirm"
										@cancel="cancel"></image-cropper>
									<image :src="gimg" mode="" class="group-img" @tap="upload"></image>
								</view>
								<!-- <image :src="gimg" mode="aspectFill" class="group-img"></image> -->
							</view>
							<view class="more">></view>
						</view>
					</view>

					<view class="colume"
						@tap="modify('群公告', '123456789dsadsadsadddddddddddddddddd说的那话嗲是各地啊傻瓜八点八四大概是吧465asd' , true, 'gnotic')">
						<view class="row">
							<view class="title">群公告</view>
							<view class="cont">
								123456789dsadsadsadddddddddddddddddd说的那话嗲是各地啊傻瓜八点八四大概是吧465asd
							</view>
							<view class="more">></view>
						</view>
					</view>

					<view class="colume" @tap="modify('群内名称', 'hello' , true, 'giname')">
						<view class="row">
							<view class="title">群内名称</view>
							<view class="cont">
								hello
							</view>
							<view class="more">></view>
						</view>
					</view>

					<view class="colume">
						<view class="checked">
							<view class="title">消息免打扰</view>
							<view>
								<switch color="#FFCC33" @change="switchChange" />
							</view>
						</view>
					</view>
				</view>
				<view class="btn" v-if="id==uid" @tap="quit">解散群聊</view>
				<view class="btn" v-if="id!=uid" @tap="removeFriend">退出群聊</view>
			</view>
		</view>
		<!-- 修改信息的弹出层 -->
		<view class="modify" :style="{bottom: -+widHeight+'px'}" :animation='animationDat'>
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title"></view> <!-- 需要修改的部分（动态的） -->
				<view class="define" @tap="modifyStbmit()">确定</view>
			</view>
			<view class="modify-main">
				<textarea v-model="data" class="modify-content" placeholder="输入新内容"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/uni_modules/ling-imgcropper/components/ling-imgcropper/ling-imgcropper.vue"

	import datas from '../../commons/js/datas.js';
	export default {
		data() {
			return {
				gid: '',
				gimg: '../../static/images/img/01.jpg',
				groupmember: [], // 装群成员
				tempFilePath: '',
				modifyTitle: '', // 修改标题
				data: '', // 文本框的修改内容
				type: '', // 修改项
				isModify: false, // 动画开关
				animationDat: {}, // 动画
				widHeight: '1000', // 页面高度
				oldData: '', //好友原始昵称
			};
		},
		components: {
			ImageCropper
		},
		onLoad(e) {
			this.gid = e.gid;
			// this.gimg = e.gimg;
			this.getMember();
		},
		methods: {
			// 修改项弹框
			modify: function(type, data, ispwd, t) {
				// 获取修改项
				this.type = t;
				// this.ispwd = ispwd;
				this.modifyTitle = type;
				this.data = data;
				this.oldData = data;
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
				// 提交修改
				if (this.data.length > 0 && this.data != this.oldData) {
					if (this.type == 'markname') {
						this.updeteFriendName();
						this.markname = this.data;
					} else if (this.type == 'email') {
						var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
						if (reg.test(this.data)) {
							this.update(this.data, this.type);
						} else {
							uni.showToast({
								title: '邮箱格式错误',
								icon: 'none',
								duration: 2000,
							})
						}
					} else {
						this.update(this.data, this.type);
					}
				};
				this.modify();
			},
			// 群头像裁剪
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
				this.gimg = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;

				// uni.uploadFile({
				// 	url: this.serverUrl + '/files/upload', // 后端文件上传地址
				// 	filePath: this.headimg,
				// 	name: 'file',
				// 	fileType: 'image',
				// 	formData: {
				// 		url: 'user',
				// 		name: this.uid,
				// 		token: this.token,
				// 	}, // 传递参数
				// 	success: (uploadFileRes) => {
				// 		var backstr = uploadFileRes.data;
				// 		// 本地存储用户信息修改
				// 		try {
				// 			uni.setStorageSync('user', {
				// 				'id': this.uid,
				// 				'name': this.myname,
				// 				'imgurl': backstr,
				// 				'token': this.token
				// 			})
				// 		} catch (e) {
				// 			console.log('数据存储失败');
				// 		}
				// 		// 修改头像存到数据库
				// 		this.update(backstr, 'imgurl', undefined);
				// 	},
				// 	complete() {

				// 	},
				// 	fail(e) {
				// 		console.log("this is errormes" + e.message);
				// 	}
				// });
			},
			cancel() {
				console.log('canceled')
			},
			// 解散群聊
			quit: function() {
				uni.removeStorage({
					key: 'user',
					success(res) {
						console.log('success');
					}
				});
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			// 推出群
			removeFriend: function() {
				uni.showModal({
					title: '是否退出群聊',
					success: (res) => {
						if (res.confirm) {
							console.log('用户点击确定');
							uni.request({
								url: this.serverUrl + '/friend/deletefriend',
								data: {
									uid: this.uid,
									fid: this.id,
									token: this.token,
								},
								method: 'POST',
								success: (data) => {
									var status = data.data.status;
									if (status === 200) {
										uni.navigateTo({
											url: '/pages/index/index',
										})
									} else if (status === 500) {
										uni.showToast({
											title: '网络状态不好，请稍等！！！',
											icon: 'none',
											duration: 1500, //提示显示的时间 ms
										});
									};
								},
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			// 消息免打扰按钮
			switchChange: function(e) {
				console.log('switch 发生 change 事件，携带值为', e.detail.value)
			},
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 获取群成员（模拟）
			getMember: function() {
				var member = datas.frineds();
				for (var i = 0; i < member.length; i++) {
					member[i].imgurl = '../../static/images/img/' + member[i].imgurl;
					this.groupmember.push(member[i]);
				};
				// 	console.log(this.groupmember);
			},
		}
	}
</script>

<style lang="scss">
	@import url('../../commons/css/mycss.scss');

	.clear {
		clear: both;
	}

	.top-bar {
		background: rgba(255, 255, 255, 1);
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
		width: 100%;
		height: 100%;
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		.bg-img {
			width: 100%;
			height: 750rpx;
		}
	}

	.main {
		padding-top: 360rpx;

		.main-inner {
			width: 100%;
			min-height: 720rpx;
			background-color: #fff;
			border-radius: 40rpx 40rpx 0 0;
		}

		.inf {
			display: flex;
			flex-direction: column;
			box-sizing: border-box;
			border-bottom: 1px solid $uni-border-color;
			padding: 25rpx 25rpx 0 25rpx;

			.title {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				.name {
					width: 232rpx;
					height: 66rpx;
					font-size: 48rpx;
					color: #272832;
					letter-spacing: -0.41rpx;
				}

				.time {
					width: 142rpx;
					height: 40rpx;
					font-size: 28rpx;
					color: rgba(39, 40, 50, 0.50);
					letter-spacing: -0.24rpx;
				}
			}

			.notice {
				width: 682rpx;
				height: 106rpx;
				font-size: 28rpx;
				color: #272832;
				letter-spacing: -0.24rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;
			}
		}

		.member {
			padding: 25rpx 25rpx 0 25rpx;
			border-bottom: 1px solid $uni-border-color;

			.top {
				display: flex;
				justify-content: space-between;
				flex-direction: row;
				padding: 0 40rpx 0 40rpx;

				.text {
					width: 130rpx;
					height: 50rpx;
					font-size: 36rpx;
					color: #272832;
					letter-spacing: -0.62rpx;
				}

				.top-one {
					display: flex;
					justify-content: space-between;
					flex-direction: row;
				}

				.more {
					width: 160rpx;
					height: 44rpx;
					font-size: 32rpx;
					color: rgba(39, 40, 50, 0.60);
					letter-spacing: -0.55rpx;
				}

				.more-img {}
			}

			.member-ls {
				width: 100%;
				padding: 20rpx 16rpx;
				box-sizing: border-box;
			}

			.member-li {
				padding-bottom: 32rpx;
				width: 20%;
				float: left;
				text-align: center;

				.imgs {
					display: inline-block;
					position: relative;
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
					background-color: rgba(255, 228, 49, 1);
				}

				.user-img {
					width: 104rpx;
					height: 104rpx;
					border-radius: 20rpx;
				}

				.delete {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					top: -10rpx;
					right: -10rpx;
					z-index: 10;
				}

				.name {
					padding: 0 8rpx;
					font-size: 28rpx;
					color: #272832;
					letter-spacing: -0.24rpx;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 1;
					overflow: hidden;
				}
			}

			.add {
				width: 104rpx;
				height: 104rpx;
				border-radius: 20rpx;
				background-color: rgba(255, 228, 49, 1);
			}
		}

		.mitem {
			margin-bottom: 80rpx;
			border-bottom: 1px solid $uni-border-color;

			.colume {
				display: flex;
				flex-direction: column;
				padding-top: 12rpx;
				width: 100%;
				border-bottom: 1px solid $uni-border-color;

				.row {
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.checked {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: space-between;
				}

				.title {
					flex: none;
					padding: 0 $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 112rpx;
				}

				.head {
					display: flex;
					align-items: center;
					height: 148rpx;
				}

				.user-head {
					flex: auto;
				}

				.user-img {
					width: $uni-img-size-lg;
					height: $uni-img-size-lg;
					border-radius: $uni-border-radius-base;
				}

				.cont {
					flex: auto;
					// display: flex;
					// align-items: center;
					// padding-left: $uni-spacing-col-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color-grey;
					line-height: 112rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.gimg {
					display: flex;
					flex-direction: row;
					justify-content: flex-start;
					margin-left: 10rpx;
				}

				.group-img {
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
				}

				.more {
					flex: none;
					height: 112rpx;
					display: flex;
					align-items: center;
					width: 80rpx;
					height: 28rpx;
				}
			}
		}

		.btn {
			// margin-left: 0 auto;
			margin: 20rpx auto;
			text-align: center;
			line-height: 80rpx;
			background: $uni-color-primary;
			// width: 684rpx;
			height: 80rpx;
			width: 80%;
			border-radius: $uni-border-radius-base;
			font-size: $uni-font-size-lg;
			color: $uni-text-color;
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