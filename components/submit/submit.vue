<template>
	<view>
		<view class="submit">
			<view class="submit-chat">
				<view class="bt-img" @tap="records">
					<image :src="toc" mode=""></image>
				</view>
				<textarea name="" id="" cols="30" rows="10" class="chat-send btn" auto-height="true"
					:class="{displaynone:isrecord}" @input="inputs" v-model="msg" @focus="focus"></textarea>
				<view class="record btn" :class="{displaynone:!isrecord}" @touchstart="touchstart" @touchend="touchend"
					@touchmove="touchmove">
					按住说话</view>
				<view class="bt-img" @tap="emoji">
					<image src="../../static/images/submit/bq.png" mode=""></image>
				</view>
				<view class="bt-img" @tap="moreFun">
					<image src="../../static/images/submit/Add.png" mode=""></image>
				</view>
			</view>
			<view class="emoji" :class="{displaynone:isemoji}">
				<view class="emoji-send">
					<view class="emoji-send-det" @tap="emojiDet">
						<image src="../../static/images/submit/back.png" mode=""></image>
					</view>
					<view class="emoji-send-bt" @tap="emojiSend">发送</view>
				</view>
				<emoji @emotion="emotion" :height="230"></emoji>
			</view>

			<view class="more" :class="{displaynone:ismore}">
				<view class="more-list" @tap="sendImg('album')">
					<image src="../../static/images/submit/zp.png" mode=""></image>
					<view class="more-list-title">照片</view>
				</view>
				<view class="more-list" @tap="sendImg('camera')">
					<image src="../../static/images/submit/xj.png" mode=""></image>
					<view class="more-list-title">相机</view>
				</view>
				<view class="more-list" @tap="chooseLocation">
					<image src="../../static/images/submit/dw.png" mode=""></image>
					<view class="more-list-title">位置</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/wj.png" mode=""></image>
					<view class="more-list-title">文件</view>
				</view>
				<view class="more-list">
					<image src="../../static/images/submit/sp.png" mode=""></image>
					<view class="more-list-title">视频</view>
				</view>
			</view>
		</view>
		<view class="voice-bg" :class="{displaynone:isbg}">
			<view class="voice-bg-len">
				<view class="voice-bg-time" :style="{width: voiceTime /0.6 + '%'}">{{voiceTime}}"</view>
			</view>
			<view class="voice-del">上滑取消</view>
		</view>
	</view>
</template>

<script>
	import emoji from "./emoji/emoji.vue";
	// 录音配置
	const recorderManager = uni.getRecorderManager();
	// const innerAudioContext = uni.createInnerAudioContext();

	// innerAudioContext.autoplay = true;
	export default {
		data() {
			return {
				isrecord: false,
				toc: "../../static/images/submit/yy.png",
				isemoji: true,
				ismore: true,
				isbg: true,
				msg: '',
				timer: '',
				voiceTime: 0, // 接收录音时长
				pageY: 0, // 接收点击按住说话初始位置
			}
		},
		// onLoad() {
		// 	let self = this;
		// 	recorderManager.onStop(function(res) {
		// 		console.log('recorder stop' + JSON.stringify(res));
		// 		self.voicePath = res.tempFilePath;
		// 	});
		// },
		components: {
			emoji,
		},
		methods: {
			// 获取底部菜单高度
			getElementHeight: function() {
				var query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.$emit('heights', data.height);
				}).exec();
			},
			// 语音文字切换
			records: function() {
				// 关闭其他项
				this.isemoji = true;
				this.ismore = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 10);
				if (this.isrecord) {
					this.isrecord = false;
					this.toc = '../../static/images/submit/yy.png';
				} else {
					this.isrecord = true;
					this.toc = '../../static/images/submit/jp.png'
				}
			},
			// 表情
			emoji: function() {
				this.isemoji = !this.isemoji;
				// 关闭其他项
				this.ismore = true;
				this.isrecord = false;
				this.toc = '../../static/images/submit/yy.png';
				setTimeout(() => {
					this.getElementHeight();
				}, 10);
			},
			// 接收表情
			emotion: function(e) {
				console.log(e);
				this.msg = this.msg + e;
			},
			// 文字发送
			inputs: function(e) {
				// console.log(e);
				var chatm = e.detail.value;
				var pos = chatm.indexOf('\n');
				if (pos != -1 && chatm.length > 1) {
					this.send(this.msg, 0);
				}
			},
			// 输入框聚焦
			focus: function() {
				this.isemoji = true;
				// 关闭其他项
				this.ismore = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 10);
			},
			// 表情页面发送按钮
			emojiSend: function(e) {
				var chatm = e.detail.value;
				if (chatm != '') {
					this.send(this.msg, 0);
				}
			},
			// 表情页面退格删除按钮
			emojiDet: function(e) {
				var chatm = e.detail.value;
				setTimeout(() => {
					this.msg = this.msg.substring(0, this.msg.length - 1)
				}, 0)
			},
			// 更多
			moreFun: function() {
				this.ismore = !this.ismore;
				// 关闭其他项
				this.isemoji = true;
				setTimeout(() => {
					this.getElementHeight();
				}, 0);
			},
			// 照片
			sendImg: function(e) {
				var count = 9;
				if (e == 'album') {
					count = 9;
				} else {
					count = 1;
				};
				uni.chooseImage({
					count: count, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: [e], //从相册选择 album ; camera 使用相机
					success: (res) => {
						console.log(res);
						console.log(JSON.stringify(res.tempFilePaths));
						var filePaths = res.tempFilePaths;
						for (var i = 0; i < filePaths.length; i++) {
							this.send(filePaths[i], 1)
						}
					}
				});
			},
			// 音频
			// 开始录音
			startRecord() {
				console.log('开始录音');

				recorderManager.start();
			},
			// 结束录音
			endRecord() {
				console.log('录音结束');
				recorderManager.stop();
			},
			// 音频开始
			touchstart: function(e) {
				this.pageY = e.changedTouches[0].pageY;
				// 录音背景
				this.isbg = false;
				//录音
				var i = 0;
				this.timer = setInterval(() => {
					i++;
					// console.log(i);
					if (i >= 60) {
						// 结束计时
						clearInterval(this.timer);
						this.touchend();
					};
					this.voiceTime = i;

				}, 1000)
				this.startRecord();
			},
			// 音频结束
			touchend: function() {
				console.log('jieshu');


				// 录音
				clearInterval(this.timer);
				this.endRecord();
				// 获取录音地址
				recorderManager.onStop((res) => {
					if (this.voiceTime == 0) {
						this.voiceTime = 1;
					};
					var data = {
						voice: res.tempFilePath,
						time: this.voiceTime
					};
					// 进行判断是否终止语音
					if (!this.isbg) {
						this.send(data, 2);
					};
					// 录音背景
					this.isbg = true;
					// 时长归位
					this.voiceTime = 0;
					console.log('recorder stop' + JSON.stringify(res));
					// this.voicePath = res.tempFilePath;
				});
			},
			// 终止录音
			touchmove: function(e) {
				console.log(e);
				if (this.pageY - e.changedTouches[0].pageY > 100) {
					console.log('0000');
					// 关闭录音背景层
					this.isbg = true;
				}
			},
			// 定位chooseLocation
			chooseLocation: function() {
				uni.chooseLocation({
					success: (res) => {
						var data = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						};
						// json转成字符串
						var stringData = JSON.stringify(data)
						this.send(stringData, 3);
						// console.log('位置名称：' + res.name);
						// console.log('详细地址：' + res.address);
						// console.log('纬度：' + res.latitude);
						// console.log('经度：' + res.longitude);
					},
				});
			},
			// 发送
			send: function(msg, type) {
				var data = {
					message: msg,
					types: type,
				};
				this.$emit('inputs', data);
				setTimeout(() => {
					this.msg = '';
				}, 0)
			},
		},
	}
</script>

<style lang="scss">
	.submit {
		background: rgba(244, 244, 244, 1);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		// height: 100rpx;
		position: fixed;
		bottom: 0;
		z-index: 1002;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.displaynone {
		display: none;
	}

	.submit-chat {
		width: 100%;
		display: flex;
		align-items: flex-end;
		box-sizing: border-box;
		padding: 14rpx 15rpx;

		image {
			width: 56rpx;
			height: 56rpx;
			margin: 0 10rpx;
			flex: auto;
		}

		.btn {
			flex: auto;
			background-color: #fff;
			border-radius: 10rpx;
			padding: 20rpx;
			max-height: 44rpx;
			margin: 0 10rpx;
		}

		.chat-send {
			text-align: left;
			line-height: 44rpx;
		}

		.record {
			line-height: 44rpx;
			text-align: center;
			font-size: 32rpx;
			color: $uni-text-color-grey;
		}
	}

	.emoji {
		height: 100%;
		height: 460rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);

		.emoji-send {
			width: 280rpx;
			height: 104rpx;
			padding-top: 24rpx;
			background-color: rgba(236, 237, 238, 0.6);
			position: fixed;
			bottom: env(safe-area-inset-bottom);
			right: 0;
			display: flex;

			.emoji-send-bt {
				flex: 1;
				margin: 0 32rpx 0 20rpx;
				// width: 120rpx;
				bottom: 0;
				height: 80rpx;
				background: rgba(255, 228, 49, 1);
				font-size: 30rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
			}

			.emoji-send-det {
				flex: 1;
				margin-left: 24rpx;
				// width: 120rpx;
				height: 76rpx;
				background: rgba(227, 227, 227, 0.7);
				font-size: 30rpx;
				text-align: center;
				line-height: 80rpx;
				border-radius: 12rpx;
				padding-top: 4rpx;

				image {
					width: 42rpx;
					height: 40rpx;

				}
			}
		}
	}

	.more {
		height: 100%;
		height: 436rpx;
		background: rgba(236, 237, 238, 1);
		box-shadow: 0 -1rpx 0 0 rgba(0, 0, 0, 0.1);
		bottom: env(safe-area-inset-bottom);
		padding: 20rpx;
		box-sizing: border-box;

		.more-list {
			width: 25%;
			text-align: center;
			float: left;
			padding-top: 32rpx;

			image {
				width: 72rpx;
				height: 72rpx;
				padding: 24rpx;
				background: rgba(255, 255, 255, 1);
				border-radius: 24rpx;
			}

			.more-list-title {
				font-size: 30rpx;
				color: rgba(39, 40, 50, 0.5);
				line-height: 34rpx;

			}
		}
	}

	.voice-bg {
		height: 100%;
		width: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 1001;

		.voice-bg-len {
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255, 255, 255, 0.2);
			border-radius: 42rpx;
			text-align: center;
		}

		.voice-bg-time {
			line-height: 84rpx;
			background-color: #ffe431;
			border-radius: 42rpx;
			min-width: 120rpx;
			display: inline-block;
		}

		.voice-del {
			position: absolute;
			bottom: 148rpx;
			margin-bottom: env(safe-area-inset-bottom);
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: 28rpx;
		}
	}
</style>