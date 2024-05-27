// 临时消息预览（好友头像、好友名称、时间、消息）
export default {
	frineds: function() {
		var friendarr = [{
				id: 1,
				imgurl: '04.jpg',
				tip: 902,
				name: '老大',
				email: 'shucan@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
			{
				id: 2,
				imgurl: '01.jpg',
				tip: 0,
				name: '老二',
				email: 'xixhui@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
			{
				id: 3,
				imgurl: '02.jpg',
				tip: 2,
				name: '老三',
				email: 'heliu@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
			{
				id: 4,
				imgurl: '03.jpg',
				tip: 92,
				name: '老四',
				email: 'heliu2@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
			{
				id: 5,
				imgurl: '06.jpg',
				tip: 12,
				name: '老五',
				email: 'heliu3@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
			{
				id: 6,
				imgurl: '05.jpg',
				tip: 2,
				name: '老六',
				email: 'heliu4@163.com',
				time: new Date(),
				news: 'PuffTalk: “Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。',
			},
		];
		return friendarr;
	},
	// 好友关系(userid表示是否为好友(1代表是好友；0代表不是好友);friend表示用户的id)
	isFriend: function() {
		var isfriend = [{
				userid: 1,
				friend: 2,
			},
			{
				userid: 1,
				friend: 5,
			},
			{
				userid: 1,
				friend: 6,
			},
			{
				userid: 1,
				friend: 3,
			},
		];
		return isfriend;
	},
	// 聊天消息
	message: function() {
		var msgs = [{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: {
					voice: 'b',
					time: 60,
				},
				types: 2, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000, //发送时间
				tip: 0,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: {
					voice: 'a',
					time: 2,
				},
				types: 2, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000, //发送时间
				tip: 1,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: '“Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。1',
				types: 0, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000, //发送时间
				tip: 2,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: '“Puff”可以指轻飘飘的云雾，给人一种轻松的聊天氛围。2',
				types: 0, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 16 * 60, //发送时间
				tip: 3,
			},
			{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: '112093nsdkho190nxcn9o1',
				types: 0, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60, //发送时间
				tip: 4,
			},
			{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: '112093nsdkho190nxcn9o1',
				types: 0, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60 * 36, //发送时间
				tip: 5,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: '02.jpg',
				types: 1, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60 * 36 * 40, //发送时间
				tip: 6,
			},
			{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: '03.jpg',
				types: 1, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60 * 36 * 41, //发送时间
				tip: 7,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: '02.jpg',
				types: 1, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60 * 36 * 40, //发送时间
				tip: 8,
			},
			{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: '03.jpg',
				types: 1, // 内容类型(0为文字，1为图片链接，2为音频链接)
				time: new Date() - 1000 * 60 * 36 * 41, //发送时间
				tip: 9,
			},
			{
				id: 'b', // 用户ID
				imgurl: '02.jpg',
				message: {
					name: '粟禾韩国料理(高新学院店)',
					address: '陕西省西安市长安区Y364下北良村208号',
					latitude: 34.104262,
					longitude: 108.890166
				},
				types: 3, // 内容类型(0为文字，1为图片链接，2为音频链接，3为定位信息)
				time: new Date() - 1000 * 60 * 36 * 42, //发送时间
				tip: 10,
			},
			{
				id: 'a', // 用户ID
				imgurl: '01.jpg',
				message: {
					name: '黄良街道盛源宾馆(下北良店)西安科技大学高新学院',
					address: '陕西省西安市长安区黄良街道盛源宾馆(下北良店)西安科技大学高新学院',
					latitude: 34.104387,
					longitude: 108.888937
				},
				types: 3, // 内容类型(0为文字，1为图片链接，2为音频链接，3为定位信息)
				time: new Date() - 1000 * 60 * 36 * 43, //发送时间
				tip: 11,
			},
		];
		return msgs;
	},
}