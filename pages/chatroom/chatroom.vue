<template>
	<view class="content">
		<view class="top-bar">
			<view class="more-left" @tap="backOne()">
				<image src="../../static/images/sign/return.png" mode="" class="back-img"></image>
			</view>
			<view class="top-bar-center" style="width: 75%;">
				<view class="title">{{fname}}</view>
			</view>
			<view class="top-bar-right">
				<view class="pice"></view>
				<view class="group-img" v-if="type == 1" @tap="togrouphome">
					<image :src="fimgurl" mode=""></image>
				</view>
			</view>
		</view>
		<scroll-view scroll-y="true" class="chat" :scroll-with-animation="swa" :scroll-into-view="scrollToView"
			@scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom:inputh+'px'}">
				<view class="loading" :animation="animationData" :class="{displaynone:isloading}">
					<image src="../../static/images/chatroom/loading.png" class="loading-img" mode=""></image>
				</view>
				<!-- 中间消息主体内容（头像，消息内容，图片....） -->
				<view class="chat-ls" v-for="(item,index) in msgs" :key="index" :id="'msg' + item.id">
					<view class="chat-time" v-if="item.time !=''">{{changeTime(item.time)}}</view>
					<!-- 左边消息和头像 -->
					<view class="msg-m msg-left" v-if="item.fromId !=uid"> <!-- 定义聊天模拟信息中b为自己 -->
						<image :src="item.imgurl" mode="" class="user-img" @tap="touserhome(item.fromId)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" mode="widthFix" class="msg-img" @tap="previewImg(item.message)">
							</image>
						</view>
						<!-- 语音 -->
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time * 3 + 'px'}"
								@tap="playVoice(item.message.voice)">
								<image src="../../static/images/chatroom/yyleft.png" mode="" class="voice-img"></image>
								{{item.message.time}}"
							</view>
						</view>
						<!-- 定位 -->
						<view class="message" v-if="item.types == 3">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src="../../static/images/chatroom/map.jpg" mode="aspectFill" class="map-img">
								</image>
								<!-- <map :latitude="item.message.latitude" :longitude="item.message.longitude"
									:markers="covers(item.message)" class="map"></map> -->
							</view>
						</view>
					</view>
					<!-- 右边消息和头像 -->
					<view class="msg-m msg-right" v-if="item.fromId ==uid"> <!-- 定义b为自己 -->
						<image :src="item.imgurl" mode="" class="user-img" @tap="touserhome(item.fromId)"></image>
						<!-- 文字 -->
						<view class="message" v-if="item.types == 0">
							<view class="msg-text">{{item.message}}</view>
						</view>
						<!-- 图片 -->
						<view class="message" v-if="item.types == 1">
							<image :src="item.message" mode="widthFix" class="msg-img" @tap="previewImg(item.message)">
							</image>
						</view>
						<!-- 语音 -->
						<view class="message" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time * 3 + 'px'}"
								@tap="playVoice(item.message.voice)">
								{{item.message.time}}"
								<image src="../../static/images/chatroom/yyright.png" mode="" class="voice-img"></image>
							</view>
						</view>
						<!-- 定位 -->
						<view class="message" v-if="item.types == 3">
							<view class="msg-map" @tap="openLocation(item.message)">
								<view class="map-name">{{item.message.name}}</view>
								<view class="map-address">{{item.message.address}}</view>
								<image src="../../static/images/chatroom/map.jpg" mode="aspectFill" class="map-img">
								</image>
								<!-- <map :latitude="item.message.latitude" :longitude="item.message.longitude"
									:markers="covers(item.message)" class="map"></map> -->
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="padbt"></view>
		</scroll-view>
		<submit @inputs="inputs" @heights="heights"></submit>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js";
	import myfun from "../../commons/js/myfun.js";
	import submit from "../../components/submit/submit.vue";


	export default {
		data() {
			return {
				uid: '',
				uimgurl: '',
				token: '',
				uname: '',
				fid: '',
				fname: '',
				type: '', // 1为群，0为好友
				fimgurl: '',
				msgs: [], // 装datas.js中聊天内容信息
				imgMsg: [], // 装聊天内容中的图片信息
				oldTime: 0,
				scrollToView: '', // 用来设置进入聊天页面保证在最后一条消息
				inputh: '72', // 解决底部菜单遮挡问题
				animationData: {}, // 下拉加载动画
				nowpage: 0, // 聊天页显示内容的页码
				pagesize: 10, // 一页十条消息
				loading: '',
				isloading: true,
				swa: true,
				begin: true, // 防止多次加载
			};
		},
		onLoad(e) {
			this.fid = e.id;
			this.fname = e.name;
			this.type = e.type;
			this.fimgurl = e.img;
			this.getStorages();
			this.getMsg();
			this.receiveSocketMsg();
			this.groupSocket();
			this.getGroupMsg();
			// this.nextPage();
		},
		components: {
			submit,
		},
		methods: {
			// 获取缓存数据
			getStorages: function() {
				try {
					var value = uni.getStorageSync('user');
					console.log(value);
					if (value) {
						this.uid = value.id;
						this.uimgurl = this.serverUrl + value.imgurl;
						this.imgurl = this.serverUrl + value.imgurl;
						this.token = value.token;
						this.uname = value.name;
					} else {
						// 找不到用户缓存，跳转到登陆页面
						uni.navigateTo({
							url: '/pages/signin/signin',
						})
					}
				} catch (e) {

				}
			},
			// 跳转到群详细页
			togrouphome: function() {
				uni.navigateTo({
					url: '/pages/grouphome/grouphome?gid=' + this.fid + '&gimg=' + this.fimgurl
				})
			},
			// 跳转到用户主页
			touserhome: function(id) {
				uni.navigateTo({
					url: '/pages/userhome/userhome?id=' + id
				})
			},
			// 返回上一页
			backOne: function() {
				// 告知离开当前聊天页面
				this.socket.emit('leaveChatr', this.uid, this.fid);
				uni.navigateBack({
					delta: 1
				})
			},
			// 处理时间
			changeTime: function(date) {
				return myfun.dateTime1(date);
			},
			// 下拉加载历史消息动画
			nextPage: function() {
				if (this.nowpage > 0 && this.begin) {
					// 出现加载
					this.isloading = false;
					// 禁止重复加载
					this.begin = false;
					var animation = uni.createAnimation({
						duration: 1000,
						timingFunction: 'step-start',
					})

					this.animation = animation

					// this.animationData = animation.export()
					var i = 1;
					this.loading = setInterval(function() {
						animation.rotate(i * 10).step()
						this.animationData = animation.export()
						i++;
						// 获取聊天数据
						if (i > 20) {
							this.getMsg(this.nowpage);
							this.getGroupMsg(this.nowPage);
						}
					}.bind(this), 100)
				}
			},
			// 获取聊天数据
			getMsg: function(page) {
				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid: this.fid,
						nowPage: this.nowpage,
						pageSize: this.pagesize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						if (status === 200) {
							var msg = data.data.result;
							// 将数组倒序
							msg.reverse();
							if (msg.length > 0) {
								var oldtime = msg[0].time;
								// console.log(msg[0].time);
								var imgarr = [];
								for (var i = 0; i < msg.length; i++) {
									msg[i].imgurl = this.serverUrl + msg[i].imgurl;
									// 时间间隔
									if (i < msg.length - 1) {
										// 让之前聊天的最后一条消息不参与时间间隔匹配
										var t = myfun.spaceTime(oldtime, msg[i].time);
										if (t) {
											this.oldtime = t;
										};
										msg[i].time = t;
									};
									// 匹配最大时间
									if (this.nowpage == 0) {
										if (msg[i].time > this.oldTime) {
											this.oldTime = msg[i].time;
										}
									}
									// 补充图片地址
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl + msg[i].message;
										// this.imgMsg.unshift(msg[i].message);;
										imgarr.push(msg[i].message);
									};
									// 字符串还原（位置会用到）
									if (msg[i].types == 3) {
										msg[i].message = JSON.parse(msg[i].message);
									};
									// 倒叙插入聊天信息
									// this.msgs.unshift(msg[i]);
									console.log(this.msg);
								};
								console.log(this.msgs);
								this.msgs = msg.concat(this.msgs);
								this.imgMsg = imgarr.concat(this.imgMsg);
							}
							// 判断nowPage
							if (msg.length == 10) {
								this.nowpage++;
							} else {
								// 数据获取完毕
								this.nowpage = -1;
							}
							// 设置进入聊天页面的位置
							this.$nextTick(function() {
								this.swa = false;
								console.log(msg);
								this.scrollToView = 'msg' + this.msgs[msg.length - 1].id;
							});
							clearInterval(this.loading);
							// 隐藏加载
							this.isloading = true;
							// 开启加载
							this.begin = true;
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},
			// 预览图片
			previewImg: function(e) {
				var index = 0;
				// 在数组 imgMsg 中匹配点击的是第几张图片
				for (var i = 0; i < this.imgMsg.length; i++) {
					if (this.imgMsg[i] == e) {
						index = i;
					};
				};
				uni.previewImage({
					current: index,
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) +
								'张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},

			// 音频播放
			playVoice: function(e) {
				console.log(e);
				var innerAudioContext = uni.createInnerAudioContext(); // 音频变量
				innerAudioContext.autoplay = true;
				innerAudioContext.src = e;
				innerAudioContext.onPlay(() => {
					console.log('开始播放');
				});

			},
			// 定位地图预览显示
			covers: function(e) {
				var map = [{
					latitude: e.latitude,
					longitude: e.longitude,
					iconPath: '../../static/images/chatroom/dw.png',
				}]
				return (map);
			},
			openLocation: function(e) {
				uni.openLocation({
					latitude: e.latitude,
					longitude: e.longitude,
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					}
				});

			},
			// 接收输入框的内容
			inputs: function(e) {
				this.receiveMsg(e, this.uid, this.imgurl, 0);
			},
			//	接收消息
			receiveMsg: function(e, id, img, tip) {
				// tip == 0 表示自己发的消息;
				// socket 提交
				if (e.types == 0 || e.types == 3) {
					// 文字/表情 0 ; 位置 3
					this.sendSocket(e)
				}
				if (e.types == 1) {
					// 图片
					this.imgMsg.push(e.message)
					var urls = myfun.fileName(new Date()).toString(); // 当前日期文件夹
					var random = Math.ceil(Math.random() * 10); //随机数
					var uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message, // 上传的图片路径； tempFilePaths 路径数组
						name: 'file',
						formData: {
							'url': urls,
							'name': new Date().getTime() + this.uid + random,
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							var data = {
								message: uploadFileRes.data,
								types: e.types,
							};
							this.sendSocket(data);
						}
					});
				};
				if (e.types == 2) {
					// 音频
					var urls = myfun.fileName(new Date()).toString(); // 当前日期文件夹
					var random = Math.ceil(Math.random() * 10); //随机数
					var uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: e.message.voice, // 上传的图片路径； tempFilePaths 路径数组
						name: 'file',
						formData: {
							'url': urls,
							'name': new Date().getTime() + this.uid + random,
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							var data = {
								message: uploadFileRes.data,
								types: e.types,
							};
							this.sendSocket(data);
						}
					});

					// uploadTask.onProgressUpdate((res) => {
					// 	console.log('上传进度' + res.progress);
					// 	console.log('已经上传的数据长度' + res.totalBytesSent);
					// 	console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

					// });
				};


				this.swa = true;
				var len = this.msgs.length;
				// 时间间隔
				var nowTime = new Date();
				// 让之前聊天的最后一条消息不参与时间间隔匹配
				var t = myfun.spaceTime(this.oldTime, nowTime);
				if (t) {
					this.oldTime = t;
				};

				nowTime = t;

				// 把字符串转换为json
				if (e.types == 3) {
					e.message = JSON.parse(e.message);
				}

				var data = {
					fromId: id, // 发送者id
					imgurl: img,
					message: e.message,
					types: e.types, // 内容类型(0为文字，1为图片链接，2为音频链接)
					time: nowTime, //发送时间
					id: len,
				};
				// console.log(data);
				this.msgs.push(data);
				this.$nextTick(() => {
					this.scrollToView = 'msg' + len
				});


				// console.log(e);
			},
			// 聊天数据发送到后端
			sendSocket: function(e) {
				if (this.type == 0) {
					// 好友一对一聊天
					this.socket.emit('msg', e, this.uid, this.fid);
				} else {
					// 群
					this.socket.emit('groupMsg', e, this.uid, this.fid, this.uname, this.uimgurl);
				}
			},
			// socket聊天数据接收
			receiveSocketMsg: function() {
				// console.log(11);
				// tip用来判断自己和好友（0为好友，1为自己）
				this.socket.on('msg', (msg, fromid, tip) => {
					if (fromid == this.fid && tip == 0) {
						this.swa = true;
						var len = this.msgs.length;
						// 时间间隔
						var nowTime = new Date();
						// 让之前聊天的最后一条消息不参与时间间隔匹配
						var t = myfun.spaceTime(this.oldTime, nowTime);
						if (t) {
							this.oldTime = t;
						};
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message;
						};
						nowTime = t;

						var data = {
							fromId: fromid, // 发送者id
							imgurl: this.fimgurl,
							message: msg.message,
							types: msg.types, // 内容类型(0为文字，1为图片链接，2为音频链接)
							time: nowTime, //发送时间
							id: len,
						};
						this.msgs.push(data);
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						this.$nextTick(() => {
							this.scrollToView = 'msg' + len
						});
					}
					// console.log(msg + ":" + fromid);
				})
			},


			// socket群聊天数据接收
			groupSocket: function() {
				// console.log(11);
				// tip用来判断自己和好友（0为好友，1为自己）
				this.socket.on('groupMsg', (msg, fromid, gid, name, img, tip) => {
					if (gid == this.fid && tip == 0) {
						this.swa = true;
						var len = this.msgs.length;
						// 时间间隔
						var nowTime = new Date();
						// 让之前聊天的最后一条消息不参与时间间隔匹配
						var t = myfun.spaceTime(this.oldTime, nowTime);
						if (t) {
							this.oldTime = t;
						};
						if (msg.types == 1 || msg.types == 2) {
							msg.message = this.serverUrl + msg.message;
						};
						nowTime = t;

						var data = {
							fromId: fromid, // 发送者id
							imgurl: img,
							message: msg.message,
							types: msg.types, // 内容类型(0为文字，1为图片链接，2为音频链接)
							time: nowTime, //发送时间
							id: len,
						};
						this.msgs.push(data);
						if (msg.types == 1) {
							this.imgMsg.push(msg.message)
						}
						this.$nextTick(() => {
							this.scrollToView = 'msg' + len
						});
					}
					// console.log(msg + ":" + fromid);
				})
			},

			// 获取群消息
			// 获取聊天数据
			getGroupMsg: function(page) {
				uni.request({
					url: this.serverUrl + '/chat/groupmsg',
					data: {
						uid: this.uid,
						gid: this.fid,
						nowPage: this.nowpage,
						pageSize: this.pagesize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						var status = data.data.status;
						console.log(data.data.result);
						if (status === 200) {
							var msg = data.data.result;
							// 将数组倒序
							msg.reverse();
							if (msg.length > 0) {
								var oldtime = msg[0].time;
								// console.log(msg[0].time);
								var imgarr = [];
								for (var i = 0; i < msg.length; i++) {
									msg[i].imgurl = this.serverUrl + msg[i].imgurl;
									// 时间间隔
									if (i < msg.length - 1) {
										// 让之前聊天的最后一条消息不参与时间间隔匹配
										var t = myfun.spaceTime(oldtime, msg[i].time);
										if (t) {
											this.oldtime = t;
										};
										msg[i].time = t;
									};
									// 匹配最大时间
									if (this.nowpage == 0) {
										if (msg[i].time > this.oldTime) {
											this.oldTime = msg[i].time;
										}
									}
									// 补充图片地址
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl + msg[i].message;
										// this.imgMsg.unshift(msg[i].message);;
										imgarr.push(msg[i].message);
									};
									// 字符串还原（位置会用到）
									if (msg[i].types == 3) {
										msg[i].message = JSON.parse(msg[i].message);
									};
									// 倒叙插入聊天信息
									// this.msgs.unshift(msg[i]);
									console.log(this.msg);
								};
								console.log(this.msgs);
								this.msgs = msg.concat(this.msgs);
								this.imgMsg = imgarr.concat(this.imgMsg);
							}
							// 判断nowPage
							if (msg.length == 10) {
								this.nowpage++;
							} else {
								// 数据获取完毕
								this.nowpage = -1;
							}
							// 设置进入聊天页面的位置
							this.$nextTick(function() {
								this.swa = false;
								console.log(msg);
								this.scrollToView = 'msg' + this.msgs[msg.length - 1].id;
							});
							clearInterval(this.loading);
							// 隐藏加载
							this.isloading = true;
							// 开启加载
							this.begin = true;
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					},
				})
			},


			// 接收底部菜单栏的高度
			heights: function(e) {
				console.log(e);
				this.inputh = e;
				this.goBottom();
			},
			// 滚动到底部
			goBottom: function() {
				this.swa = true;
				this.scrollToView = '';
				this.$nextTick(() => {
					var len = this.msgs.length - 1;
					this.scrollToView = 'msg' + this.msgs[len].id;
				});
			},
		}
	}
</script>

<style lang="scss">
	@import url('@/commons/css/mycss.scss');

	page {
		height: 100%;
	}

	.content {
		height: 100%;
		background: rgba(225, 225, 225, 0.5);
	}

	.top-bar {
		background: rgba(244, 244, 244, 1);
		border-bottom: 1px solid $uni-border-color;
		display: flex;
		flex-direction: row;
		align-items: center;

		.group-img {
			position: absolute;
			bottom: 10rpx;
			right: 32rpx;
			width: 68rpx;
			height: 68rpx;

			image {
				width: 68rpx;
				height: 68rpx;
				border-radius: 16rpx;
			}
		}

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
		}
	}

	.displaynone {
		display: none;
	}

	.chat {
		height: 100%;

		.padbt {
			height: env(safe-area-inset-bottom);
			width: 100%;
		}

		.loading {
			text-align: center;

			.loading-img {
				width: 40rpx;
				height: 40rpx;

			}
		}

		.chat-main {
			padding-left: 32rpx;
			padding-right: 32rpx;
			padding-top: 100rpx;
			// padding-bottom: 120rpx;
			display: flex;
			flex-direction: column;
		}

		.chat-ls {
			.chat-time {
				font-size: 24rpx;
				line-height: 34rpx;
				color: rgba(39, 40, 50, 0.3);
				padding: 20rpx 0;
				text-align: center;
			}

			.msg-m {
				display: flex;
				padding: 20rpx 0;

				.user-img {
					flex: none;
					width: 80rpx;
					height: 80rpx;
					border-radius: 20rpx;
					background-color: rgba(255, 228, 49, 0.8);
				}

				.message {
					flex: none;
					max-width: 480rpx;
				}

				.msg-text {
					font-size: 32rpx;
					line-height: 44rpx;
					color: rgba(39, 40, 50, 1);
					padding: 18rpx;
				}

				.msg-img {
					max-width: 400rpx;
					border-radius: 20rpx;
				}

				.msg-map {
					background: #fff;
					width: 464rpx;
					height: 284rpx;
					overflow: hidden;

					.map-name {
						font-size: 32rpx;
						line-height: 44rpx;
						color: rgba(39, 40, 50, 1);
						padding: 18rpx 24rpx 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-address {
						font-size: 24rpx;
						// line-height: 44rpx;
						color: rgba(39, 40, 50, 0.4);
						padding: 0 24rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}

					.map-img {
						padding-top: 8rpx;
						width: 480rpx;
						height: 180rpx;
					}
				}

				.voice {
					min-width: 80rpx;
					max-width: 400rpx;
				}

				.voice-img {
					width: 28rpx;
					height: 36rpx;
				}
			}

			.msg-left {
				flex-direction: row;

				.msg-text {
					margin-left: 16rpx;
					background-color: #fff;
					border-radius: 0 20rpx 20rpx 20rpx;
				}

				.msg-img {
					margin-left: 26rpx;
				}

				.msg-map {
					margin-left: 16rpx;
					border-radius: 0 20rpx 20rpx 20rpx;
				}

				.voice {
					text-align: right;
				}

				.voice-img {
					float: left;
					padding-top: 4rpx;
					width: 28rpx;
					height: 36rpx;
				}
			}

			.msg-right {
				flex-direction: row-reverse;

				.msg-text {
					margin-right: 16rpx;
					background-color: rgba(255, 228, 49, 0.8);
					border-radius: 20rpx 0 20rpx 20rpx;
				}

				.msg-img {
					margin-right: 26rpx;
				}

				.msg-map {
					margin-right: 16rpx;
					border-radius: 20rpx 0 20rpx 20rpx;
				}

				.voice {
					text-align: left;
				}

				.voice-img {
					float: right;
					padding-top: 4rpx;
					width: 28rpx;
					height: 36rpx;
				}
			}
		}
	}
</style>