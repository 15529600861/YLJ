<template>
	<view class="content">
		<view class="top-bar">
			<view class="more-left" @tap="backOne()">
				<image src="../../static/images/sign/return.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-center" style="width: 75%;">
				<view class="title">详情</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
			</view>
		</view>
		<view class="main">
			<view class="colume heads">
				<view class="row head">
					<view class="title">头像</view>
					<view class="user-head" v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" mode="" class="user-img" @tap="upload"></image>
					</view>
					<view class="more" v-if="id == uid">></view>
					<image :src="cropFilePath" mode="" class="user-img" v-if="id!=uid"></image>
				</view>

				<view class="row" @tap="modify('签名', user.explain , false,'explain')" v-if="id==uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
					<view class="more">></view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">签名</view>
					<view class="cont">
						{{user.explain}}
					</view>
				</view>

				<view class="row">
					<view class="title">注册</view>
					<view class="cont">
						{{changTime(user.time)}}
					</view>
				</view>
			</view>

			<view class="colume">
				<view class="row" @tap="modify('昵称', user.name , false,'name')" v-if="id==uid">
					<view class="title">昵称</view>
					<view class="cont">
						{{user.name}}
					</view>
					<view class="more">></view>
				</view>
				<view class="row" v-if="id!=uid" @tap="modify('昵称', markname , false,'markname')">
					<view class="title">昵称</view>
					<view class="cont">
						{{markname}}
					</view>
					<view class="more">></view>
				</view>


				<view class="row">
					<view class="title">性别</view>
					<view class="cont">
						<picker mode="selector" :range="array" @change="bindPickerChange" :value="index" v-if="id==uid">
							<view class="uni-input">{{array[index]}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{array[index]}}</view>
					</view>
					<view class="more" v-if="id==uid">></view>
				</view>

				<view class="row">
					<view class="title">生日</view>
					<view class="cont">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange"
							v-if="id==uid">
							<view class="uni-input">{{date}}</view>
						</picker>
						<view class="uni-input" v-if="id!=uid">{{date}}</view>
					</view>
					<view class="more" v-if="id==uid">></view>
				</view>

				<view class="row" @tap="modify('电话', user.phone , false, 'phone')" v-if="id==uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
					<view class="more" v-if="id==uid">></view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">电话</view>
					<view class="cont">
						{{user.phone}}
					</view>
				</view>


				<view class="row" @tap="modify('邮箱', user.email , true, 'email')" v-if="id==uid">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
					<view class="more" v-if="id==uid">></view>
				</view>
				<view class="row" v-if="id!=uid">
					<view class="title">邮箱</view>
					<view class="cont">
						{{user.email}}
					</view>
				</view>
			</view>

			<view class="colume" v-if="id==uid" @tap="modify('密码', '' , true, 'psw')">
				<view class="row">
					<view class="title">密码</view>
					<view class="cont">
						********
					</view>
					<view class="more">></view>
				</view>
			</view>

			<view class="btn" v-if="id==uid" @tap="quit">退出登录</view>
			<view class="btn" v-if="id!=uid" @tap="removeFriend">删除好友</view>
		</view>
		<!-- 修改信息的弹出层 -->
		<view class="modify" :style="{bottom: -+widHeight+'px'}" :animation='animationDat'>
			<view class="modify-header">
				<view class="close" @tap="modify">取消</view>
				<view class="title"></view> <!-- 需要修改的部分（动态的） -->
				<view class="define" @tap="modifyStbmit()">确定</view>
			</view>
			<view class="modify-main">
				<input :style="{display:ispwd}" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码"
					placeholder-style="color:#bbb; font-weight:200;"></input>
				<textarea v-model="data" class="modify-content" placeholder="输入新内容"></textarea>
			</view>
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/uni_modules/ling-imgcropper/components/ling-imgcropper/ling-imgcropper.vue"
	import myfun from '@/commons/js/myfun.js'
	export default {
		data() {
			// 日期选择器
			const currentDate = this.getDate({
				format: true
			});
			return {
				id: '',
				uid: '',
				myname: '',
				token: '',
				user: '',
				markname: '',
				oldData: '', //好友原始昵称
				cropFilePath: '../../server/data/user/user.png',
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				headimg: '',
				modifyTitle: '', // 修改标题
				data: '', // 文本框的修改内容
				ispwd: 'none', // 是否显示输入原始密码框
				pwd: undefined, // 原始密码
				type: '', // 修改项
				isModify: false, // 动画开关
				animationDat: {}, // 动画
				widHeight: '1000', // 页面高度
			};
		},
		// 日期选择器起始时间
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			}
		},
		components: {
			ImageCropper
		},
		onReady() {
			this.getElementStyle();
		},
		onLoad(e) {
			this.id = e.id;
			this.getStorages();
			this.getUser();
			this.getMarkName();
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
							this.cropFilePath = this.serverUrl + res.imgurl;
							// this.cropFilePath = this.serverUrl + '/user/' + res.imgurl;
							// 处理简介
							if (res.explain == undefined) {
								res.explain = '什么也没有';
							}
							// 处理生日
							if (res.birth == undefined) {
								this.date = 'null';
							} else {
								this.date = myfun.detialTime1(res.birth);
							}
							// 处理电话
							if (res.phone == undefined) {
								res.phone = 'null';
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
			// 获取好友昵称
			getMarkName: function() {
				if (this.id != this.uid) {
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
				}
			},
			// 性别
			sexJudge: function(e) {
				if (e == 'female') {
					// 女性
					this.index = 1;
				} else if (e == 'male') {
					// 男性
					this.index = 0;
				} else {
					// 未知
					this.index = 2;
				}
			},
			// 返回上一页
			backOne: function() {
				uni.navigateBack({
					delta: 1
				});
			},
			// 时间处理
			changTime: function(date) {
				return myfun.detialTime(date)
			},
			// 性别选择器
			bindPickerChange: function(e) {
				console.log(e.target.value);
				var oldIndex = this.index;
				this.index = e.target.value;
				if (this.index != oldIndex) {
					var sex = 'asexual';
					if (this.index == 0) {
						// 男
						sex = 'male';
					} else if (this.index == 1) {
						// 女
						sex = 'female';
					}
					this.update(sex, 'sex', undefined);
				}
			},
			// 日期选择器
			bindDateChange: function(e) {
				var oldDate = this.date;
				this.date = e.detail.value;
				if (this.date != oldDate) {

					this.update(this.date, 'birth', undefined);
				}
			},
			getDate(type) {
				const date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var day = date.getDate();

				if (type === 'start') {
					year = year - 100;
				} else if (type === 'end') {
					year = year + 0;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
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
					url: this.serverUrl + '/files/upload', // 后端文件上传地址
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					formData: {
						url: 'user',
						name: this.uid,
						token: this.token,
					}, // 传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						// 本地存储用户信息修改
						try {
							uni.setStorageSync('user', {
								'id': this.uid,
								'name': this.myname,
								'imgurl': backstr,
								'token': this.token
							})
						} catch (e) {
							console.log('数据存储失败');
						}
						// 修改头像存到数据库
						this.update(backstr, 'imgurl', undefined);
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
			// 修改数据
			update: function(datas, types, psw) {
				uni.request({
					url: this.serverUrl + '/user/update',
					data: {
						id: this.uid,
						data: datas,
						token: this.token,
						pwd: psw,
						type: types,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						var title = data.data.title;
						if (status === 200) {
							// 修改实时更新
							this.user[types] = datas;
							// 密码修改成功需要重新登录，并清楚缓存
							if (types == 'psw') {
								uni.removeStorage({
									key: 'user',
									success(res) {
										console.log('success');
									}
								});
								uni.navigateTo({
									url: '/pages/signin/signin'
								});
							}
							uni.showToast({
								title: '修改成功',
								icon: 'none',
								duration: 1500, //提示显示的时间 ms
							});
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								icon: 'none',
								duration: 1500, //提示显示的时间 ms
							});
						} else if (status === 400) {
							// 密码匹配失败
							uni.showToast({
								title: title,
								icon: 'none',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},

			// 获取页面高度
			getElementStyle: function() {
				var query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
					console.log("得到布局位置信息" + JSON.stringify(data));
					console.log("节点离页面顶部的距离为" + data.top);
					this.widHeight = data.height;
				}).exec();
			},

			// 修改项弹框
			modify: function(type, data, ispwd, t) {
				if (ispwd) {
					this.ispwd = 'block';
					this.pwd = '';
				} else {
					this.ispwd = 'none';
					this.pwd = undefined;
				};
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
							this.update(this.data, this.type, this.pwd);
						} else {
							uni.showToast({
								title: '邮箱格式错误',
								icon: 'none',
								duration: 2000,
							})
						}
					} else {
						this.update(this.data, this.type, this.pwd);
					}
				};
				this.modify();
			},
			// 修改好友备注
			updeteFriendName: function() {
				if (this.data.length > 0 && this.data != this.oldData) {
					uni.request({
						url: this.serverUrl + '/user/updatemarkname',
						data: {
							uid: this.uid,
							fid: this.id,
							token: this.token,
							name: this.data,
						},
						method: 'POST',
						success: (data) => {
							var status = data.data.status;
							if (status === 200) {
								uni.showToast({
									title: '修改成功',
									icon: 'none',
									duration: 1500, //提示显示的时间 ms
								});
							} else if (status === 500) {
								uni.showToast({
									title: '网络状态不好，请稍等！！！',
									icon: 'none',
									duration: 1500, //提示显示的时间 ms
								});
							};
						},
					})
				}
			},
			// 退出登录
			quit: function() {
				uni.removeStorage({
					key: 'user',
					success(res) {
						console.log('success');
					}
				});
				uni.navigateTo({
					url: '/pages/signin/signin'
				});
			},
			// 删除好友
			removeFriend: function() {
				uni.showModal({
					title: '是否删除好友',
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
		}
	}
</script>

<style lang="scss">
	@import url('../../commons/css/mycss.scss');

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
		padding-top: 118rpx;
		display: flex;
		flex-direction: column;
		align-items: center;

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

			.more {
				flex: none;
				height: 112rpx;
				display: flex;
				align-items: center;
				width: 80rpx;
				height: 28rpx;
			}
		}

		.btn {
			margin-top: 160rpx;
			// margin-left: 0 auto;
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