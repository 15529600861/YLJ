<template>
	<view>
		<!-- 用来测试的页面 -->
		<view class="upload" @tap="upload">上传图片</view>
		<image :src="item" mode="" v-for="(item,index) in isimg" :key="index"></image>
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun';
	// 生成随机的字符串
	function random(lens) {
		lens = lens || 32;
		var $chars =
			'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		var maxPos = $chars.length;
		var pwd = '';
		for (var i = 0; i < lens; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	};
	var img = []; // 上传图片数组
	export default {
		data() {
			return {
				isimg: [],
			};
		},
		methods: {
			upload: function() {
				var urls = myfun.fileName(new Date()).toString(); // 当前日期文件夹
				var id = random(32);
				uni.chooseImage({
					// 选择图片
					count: 9, // 最多选择的图片数量
					sizeType: ['original', 'compressed'], // 选择是原图还是压缩图
					sourceType: ['album', 'camera'], // 从相册选择
					success: (chooseImageRes) => {
						console.log(urls);
						var tempFilePaths = chooseImageRes.tempFilePaths;
						for (var i = 0; i < tempFilePaths.length; i++) {
							var uploadTask = uni.uploadFile({
								url: this.serverUrl + '/files/upload',
								filePath: tempFilePaths[i], // 上传的图片路径； tempFilePaths 路径数组
								name: 'file',
								formData: {
									'url': 'user',
									'name': new Date().getTime() + i + id,
								},
								success: (uploadFileRes) => {
									console.log(uploadFileRes);
									var path = this.serverUrl + '/user/' + uploadFileRes.name;
									// var path = this.serverUrl + '/' + uploadFileRes.data;
									// path = path.replaceAll(new RegExp(String.raw`\\`), "/");
									path = path.replace(/\\/g, "/");
									// console.log(path);
									this.isimg.push(path);
									// console.log(this.isimg);
									// console.log(uploadFileRes.data);
								}
							});

							uploadTask.onProgressUpdate((res) => {
								console.log('上传进度' + res.progress);
								console.log('已经上传的数据长度' + res.totalBytesSent);
								console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);

								// 测试条件，取消上传任务。
								// if (res.progress > 50) {
								// 	uploadTask.abort();
								// }
							});
						};
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	.upload {
		text-align: center;
		padding-top: 40rpx;
	}
</style>