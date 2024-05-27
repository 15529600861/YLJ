<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<view class="top-bar-right">
				<view class="search">
					<view class="text" @tap="toSignup">
						注册
					</view>
				</view>
			</view>
		</view>
		<!-- 图标LOGO -->
		<view class="logo">
			<image src="../../static/images/index/Logo.png" alt="" />
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="title">登录</view>
			<view class="slogn">你好，欢迎来到 NebulaChat--云聊界</view>
			<view class="inputs">
				<input type="text" placeholder="邮箱/手机号" placeholder-style="color:#bbb; font-weight:200;" v-model="email"
					class="user" />
				<input type="password" placeholder="密码" placeholder-style="color:#bbb; font-weight:200;" class="psw"
					v-model="password">
			</view>
			<view class="tips" :style="{display:tips}">
				账号或者密码错误！！！
			</view>
		</view>
		<view class="submit" @tap="login">
			登录
		</view>
	</view>
</template>

<script>
	// 添加cookie
	/**
	 * @param {*} cname key
	 * @param {*} cvalue value
	 * @param {*} exmin 单位：半小时
	 */
	function setCookie(cname, cvalue, exmin) {
		var d = new Date();
		// 半小时
		d.setTime(d.getTime() + (exmin * 30 * 60 * 1000));
		var expires = "expires=" + d.toGMTString();
		document.cookie = cname + "=" + cvalue + "; " + expires + ";path=/";
	}
	//删除cookie数据
	function deleteCookie(name) {
		setCookie(name, "", {
			expireDays: -1
		}); //将过期时间设置为过去来删除一个cookie
	}
	//获取cookie数据
	function getCookie(cookieName) {
		const strCookie = document.cookie
		const cookieList = strCookie.split(';')
		for (let i = 0; i < cookieList.length; i++) {
			const arr = cookieList[i].split('=')
			if (cookieName === arr[0].trim()) {
				return arr[1]
			}
		}
		return ''
	}
	var globalToken = ''; // 定义全局变量token
	export default {
		data() {
			return {
				email: '',
				password: '',
				// token: '',
				tips: 'none',
			}
		},
		onLoad(e) {
			console.log(e);
			if (e.user) {
				// this.email = e.email;
				uni.showToast({
					title: '注册成功请登录',
					duration: 1500,
				})
			}
		},
		methods: {
			// 跳转到注册页
			toSignup: function() {
				uni.navigateTo({
					url: '/pages/signup/signup',
				})
			},
			// 点击登录发送请求到服务端


			login: function() {
				uni.request({
					url: this.serverUrl + '/singin/match',
					data: {
						data: this.email,
						pwd: this.password
					},
					method: 'POST',
					success: (data) => {
						console.log(data);
						var status = data.data.status;
						if (status === 200) {
							// 登陆成功
							this.tips = 'none';
							var res = data.data.back;
							// 存储用户信息
							try {
								uni.setStorageSync('user', {
									'id': res.id,
									'name': res.name,
									'imgurl': res.imgurl,
									'token': res.token
								})
							} catch (e) {
								console.log('数据存储出错' + e);
							};
							uni.navigateTo({
								url: '/pages/index/index',
							});
						} else if (status === 400) {
							// 用户匹配失败
							this.tips = 'block';
							this.psw = '';
						} else if (status === 500) {
							console.log('ssss');
							// 服务器出错
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
	// 头部标签栏
	@import url('../../commons/css/mycss.scss');

	.top-bar {
		background: rgba(255, 255, 255, 0.96);
		border-bottom: 1px solid $uni-border-color;

		.top-bar-right {
			float: right;
			padding-top: 20rpx;
			padding-right: 60rpx;
		}
	}


	// 登录图标
	.logo {
		text-align: center;

		image {
			padding-top: 256rpx;
			width: 194rpx;
			height: 194rpx;
			margin: 0 auto;
		}
	}

	.main {
		padding: 54rpx $uni-spacing-row-lg 120rpx;
		// width: 100%;

		.title {
			font-size: 56rpx;
			font-weight: 500;
			color: $uni-text-color;
			line-height: 80rpx;
		}

		.slogn {
			font-size: 40rpx;
			line-height: 56rpx;
			color: $uni-text-color-grey;
		}

		.inputs {
			padding-top: 8rpx;

			input {
				padding-top: 40rpx;
				height: 88rpx;
				font-size: $uni-font-size-lg;
				font-weight: 500;
				color: $uni-text-color;
				line-height: 88rpx;
				border-bottom: 1px solid $uni-border-color;
			}
		}

		.tips {
			font-size: 20px;
			color: $uni-color-warning;
			line-height: 56rpx;
			float: left;
		}
	}

	.submit {
		text-align: center;
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255, 288, 49, 0.4);
		border-radius: 50rpx;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 96rpx;
	}

	.tips {
		display: block;
	}
</style>