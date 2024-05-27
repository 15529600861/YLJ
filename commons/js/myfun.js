// 消息时间
export default {
	// 转换时间
	dateTime(e) {
		var old = new Date(e);
		var now = new Date();
		// 获取old具体时间 消息发送时间
		var d = old.getTime();
		var h = old.getHours(); // 时
		var m = old.getMinutes(); // 分
		var Y = old.getFullYear(); // 年
		var M = old.getMonth() + 1; // 月
		var D = old.getDate(); // 日
		// 获取now具体时间 现在时间
		var nd = now.getTime();
		var nh = now.getHours();
		var nm = now.getMinutes();
		var nY = now.getFullYear();
		var nM = now.getMonth() + 1;
		var nD = now.getDate();
		// 当天时间
		if (Y === nY && M === nM && D === nD) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m
		};
		// 昨天时间
		if (Y === nY && M === nM && D + 1 === nD) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天' + h + ':' + m
		} else {
			// 大于两天
			return Y + '/' + M + '/' + D;
		};
	},



	// 具体详细时间
	detialTime(e) {
		var old = new Date(e);
		// 获取old具体时间 消息发送时间
		var d = old.getTime();
		var h = old.getHours(); // 时
		var m = old.getMinutes(); // 分
		var Y = old.getFullYear(); // 年
		var M = old.getMonth() + 1; // 月
		var D = old.getDate(); // 日

		// 处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		if (h < 10) {
			h = '0' + h;
		}
		if (m < 10) {
			m = '0' + m;
		}
		return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
	},

	// 生日时间
	detialTime1(e) {
		var old = new Date(e);
		// 获取old具体时间 消息发送时间
		var Y = old.getFullYear(); // 年
		var M = old.getMonth() + 1; // 月
		var D = old.getDate(); // 日

		// 处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		return Y + '-' + M + '-' + D;
	},

	// 文件夹使用时间（创建）
	fileName(e) {
		var old = new Date(e);
		// 获取old具体时间 消息发送时间
		var Y = old.getFullYear(); // 年
		var M = old.getMonth() + 1; // 月
		var D = old.getDate(); // 日

		// 处理时间
		if (M < 10) {
			M = '0' + M;
		}
		if (D < 10) {
			D = '0' + D;
		}
		return Y + M + D;
	},

	// 聊天页面时间
	dateTime1(e) {
		var old = new Date(e);
		var now = new Date();
		// 获取old具体时间 消息发送时间
		var d = old.getTime();
		var h = old.getHours(); // 时
		var m = old.getMinutes(); // 分
		var Y = old.getFullYear(); // 年
		var M = old.getMonth() + 1; // 月
		var D = old.getDate(); // 日
		// 获取now具体时间 现在时间
		var nd = now.getTime();
		var nh = now.getHours();
		var nm = now.getMinutes();
		var nY = now.getFullYear();
		var nM = now.getMonth() + 1;
		var nD = now.getDate();
		// 当天时间
		if (Y === nY && M === nM && D === nD) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return h + ':' + m
		};
		// 昨天时间
		if (Y === nY && M === nM && D + 1 === nD) {
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			}
			return '昨天' + h + ':' + m
		} else if (Y === nY) {
			// 今年
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			} // 小时/分钟
			return M + '月' + D + '日' + h + ':' + m;
		} else {
			// 过去的年份（非今年）
			if (h < 10) {
				h = '0' + h;
			}
			if (m < 10) {
				m = '0' + m;
			} // 小时/分钟
			return Y + '年' + M + '月' + D + '日' + h + ':' + m;
		}
	},
	// 聊天页面同一个时间段间隔的时间差
	spaceTime(old, now) {
		old = new Date(old);
		now = new Date(now);
		var told = old.getTime();
		var tnow = now.getTime();
		if (tnow > (told + 1000 * 60 * 5)) {
			return now;
		} else {
			return '';
		}
	},
	// 排序
	paixu: function(arr, tip) {
		function mySort(a, b) {
			// // 降序排序
			return new Date(b.lastTime) - new Date(a.lastTime);
		};

		function mySort1(a, b) {
			// 升序排序
			return new Date(a.lastTime) - new Date(b.lastTime);
		};
		if (tip == 0) {
			// 降序排序（5，4，3，2，1）
			arr.sort(mySort);
			return arr;
		} else if (tip == 1) {
			// 升序排序 （1，2，3，4，5）
			arr.sort(mySort1);
			return arr;
		}
	},
}