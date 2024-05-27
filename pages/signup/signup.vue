<template>
	<view class="content">
		<!-- 头部 -->
		<view class="top-bar">
			<view class="top-bar-right">
				<view class="search">
					<view class="text" @tap="toSignin">登录</view>
				</view>
			</view>
		</view>
		<!-- 图标LOGO -->
		<view class="logo">
			<image src="../../static/images/index/Logo.png" alt="" />
		</view>
		<!-- 内容 -->
		<view class="main">
			<view class="title">注册</view>
			<view class="inputs">
				<view class="inputs-div">
					<input type="text" placeholder="设置昵称" placeholder-style="color:#bbb; font-weight:200;"
						@blur="matchUser" class="user" />
					<text class="employ" v-if="emuser">用户昵称已占用</text>
					<image src="../../static/images/sign/tick.png" class="ok" v-if="isuser"></image>
				</view>

				<view class="inputs-div">
					<input type="text" placeholder="请输入邮箱" placeholder-style="color:#bbb; font-weight:200;"
						class="email" @blur="email">
					<view class="employ" v-if="ememil">此邮箱已被绑定</view>
					<view class="invalid" v-if="invalid">邮箱无效</view>
					<image src="../../static/images/sign/tick.png" class="ok" v-if="isemail"></image>
				</view>

				<view class="inputs-div">
					<input :type="type" placeholder="设置密码" placeholder-style="color:#bbb; font-weight:200;"
						@input="passwords" class="psw">
					<image :src="lookurl" class="look" @tap="looks"></image>
					<!-- <image src="../../static/images/sign/hide.png" class="look" v-if="!look" @tap="looks"></image> -->
					<!-- <image src="../../static/images/sign/tick.png" class="ok"></image> -->
				</view>

			</view>
			<!-- <view class="tips">
				用户名或者密码错误！！！
			</view> -->
		</view>
		<view :class="[{submit:isok},{submit1:!isok}]" @tap="signUp">
			注册
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				isuser: false, // 用户名是否有效可用	 
				isemail: false, // 邮箱是否有效可用
				look: false, // 是否显示密码
				invalid: false, // 邮箱是否符合条件
				emuser: false, // 是否占用--用户名
				ememil: false, // 是否占用--邮箱
				lookurl: '../../static/images/sign/hide.png', // 显示隐藏密码的logo图片路径
				emails: '', // 邮箱
				user: '', // 用户昵称
				password: '', // 用户帐号密码
				isok: false, // 注册按钮样式 (是否可以注册)
			}
		},
		methods: {
			// 密码显示隐藏
			looks: function() {
				if (this.look) {
					this.type = 'password';
					this.look = !this.look;
					// console.log(this.look);
					this.lookurl = '../../static/images/sign/hide.png';
				} else {
					this.type = 'text';
					this.look = !this.look;
					this.lookurl = '../../static/images/sign/show.png'
				}
			},
			// 判断邮箱格式是否正确
			email: function(e) {
				console.log(e);
				console.log(e.detail.value);
				this.emails = e.detail.value;
				// 正则表达式邮箱验证
				var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
				if (this.emails.length > 0) {
					if (reg.test(this.emails)) {
						console.log('邮箱正确');
						this.invalid = false;
						// 验证邮箱是否被占用
						this.matchMail();
					} else {
						console.log('邮箱错误');
						this.invalid = true;
						this.ememil = false;
						this.isemail = false;
					}
				} else {
					this.invalid = false;
					this.ememil = false;
					this.isemail = false;
					this.isOk();
				}
				this.isOk();
			},
			// 匹配邮箱
			matchMail: function() {
				uni.request({
					url: this.serverUrl + '/singup/judge',
					data: {
						data: this.emails,
						type: 'email',
					},
					method: 'POST',
					success: (data) => {
						console.log(data);
						var status = data.data.status;
						if (status === 200) {
							// 访问后端成功
							var res = data.data.result;
							if (res > 0) {
								// 邮箱已存在
								this.ememil = true;
								this.isemail = false;
							} else {
								// 邮箱不存在
								this.ememil = false;
								this.isemail = true;
							};
						} else if (status === 500) {
							uni.showToast({
								title: '网络状态不好，请稍等！！！',
								duration: 1500, //提示显示的时间 ms
							});
						};
					}
				})
			},
			// 跳转到登陆页
			toSignin: function() {
				uni.navigateTo({
					url: '/pages/signin/signin',
				})
			},
			// 获取用户信息(邮箱上面进行判断的时候已经获取)
			// 用户昵称匹配
			matchUser: function(e) {
				// console.log(e);
				this.user = e.detail.value;
				if (this.user.length > 0) {
					uni.request({
						url: this.serverUrl + '/singup/judge',
						data: {
							data: this.user,
							type: 'name',
						},
						method: 'POST',
						success: (data) => {
							console.log(data);
							var status = data.data.status;
							if (status === 200) {
								// 访问后端成功
								var res = data.data.result;
								if (res > 0) {
									// 用户名已存在
									this.emuser = true;
									this.isuser = false;
								} else {
									// 用户名不存在
									this.emuser = false;
									this.isuser = true;
								};
								this.isOk();
							} else if (status === 500) {
								uni.showToast({
									title: '网络状态不好，请稍等！！！',
									duration: 1500, //提示显示的时间 ms
								});
							};
						},
					})
				} else {
					this.emuser = false;
					this.isuser = false;
					this.isOk();
				}
			},
			// 用户密码
			passwords: function(e) {
				this.password = e.detail.value;
				this.isOk();
			},
			// 判断是否可以注册
			isOk: function() {
				var that = this;
				if (that.isuser && that.isemail && that.password.length >= 8) {
					that.isok = true;
				} else {
					that.isok = false
				}
				return that.isok;
			},
			signUp: function() {
				console.log(this.isok);
				if (this.isok) {
					uni.request({
						url: this.serverUrl + '/singup/add',
						data: {
							name: this.user,
							mail: this.emails,
							pwd: this.password,
						},
						method: 'POST',
						success: (data) => {
							console.log(data);
							var status = data.data.status;
							if (status === 200) {
								// 注册成功跳转到登录页面
								uni.navigateTo({
									url: '/pages/signin/signin?name=' + this.user,
								});
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
		}
	}
</script>

<style lang="scss">
	// 头部标签栏
	@import url("../../commons/css/mycss.scss");

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

		.inputs-div {
			// display: flex;
			// flex-direction: row;
			// flex-wrap: nowrap;
			// justify-content: flex-start;
			// align-items: center;
			position: relative;

			// input[type="password"]::-ms-reveal {
			// 	display: none;
			// }
		}

		.employ,
		.invalid {
			position: absolute;
			right: 0;
			top: 40rpx;
			float: right;
			font-size: 16px;
			font-weight: 500;
			line-height: 88rpx;
			color: $uni-color-warning;
		}

		.ok,
		.look {
			position: absolute;
			right: 0;
			top: 70rpx;
			float: right;
			width: 42rpx;
			height: 42rpx;
		}
	}

	.submit1 {
		text-align: center;
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: #bbb;
		box-shadow: 0px 50rpx 32rpx -36rpx #bbb;
		border-radius: 50rpx;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 96rpx;
	}

	.submit {
		text-align: center;
		margin: 0 auto;
		width: 520rpx;
		height: 96rpx;
		background: $uni-color-primary;
		box-shadow: 0px 50rpx 32rpx -36rpx rgba(255, 228, 49, 0.4);
		border-radius: 50rpx;
		font-size: $uni-font-size-lg;
		color: $uni-text-color;
		line-height: 96rpx;
	}
</style>