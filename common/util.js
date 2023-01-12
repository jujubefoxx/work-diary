const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
// 判断当前早中晚
function dateState() {
	let date = new Date();
	if (date.getHours() >= 6 && date.getHours() < 12) {
		return 'morning'
	} else if (date.getHours() >= 12 && date.getHours() < 18) {
		return 'afternoon'
	} else {
		return 'evening'
	}
}
// 获取当前时间对象
const getNowDate = () => {
	var date = new Date();
	var sign2 = ":";
	var year = date.getFullYear() // 年
	var month = date.getMonth() + 1; // 月
	var day = date.getDate(); // 日
	var hour = date.getHours(); // 时
	var minutes = date.getMinutes(); // 分
	var seconds = date.getSeconds() //秒
	var week = weekArr[date.getDay()];
	// // 给一位数的数据前面加 “0”
	// if (month >= 1 && month <= 9) {
	//   monthStr = "0" + month;
	// }
	// if (day >= 0 && day <= 9) {
	//   dayStr = "0" + day;
	// }
	// if (hour >= 0 && hour <= 9) {
	//   hourStr = "0" + hour;
	// }
	// if (minutes >= 0 && minutes <= 9) {
	//   minutesStr = "0" + minutes;
	// }
	// if (seconds >= 0 && seconds <= 9) {
	//   secondsStr = "0" + seconds;
	// }
	return {
		year,
		month,
		day,
		hour,
		minutes,
		seconds,
		week
	}
}
// 时间戳格式化
function formatTime(time) {
	if (typeof time !== 'number' || time < 0) {
		return time
	}

	var hour = parseInt(time / 3600)
	time = time % 3600
	var minute = parseInt(time / 60)
	time = time % 60
	var second = time

	return ([hour, minute, second]).map(function(n) {
		n = n.toString()
		return n[1] ? n : '0' + n
	}).join(':')
}
// 地区格式化
function formatLocation(longitude, latitude) {
	if (typeof longitude === 'string' && typeof latitude === 'string') {
		longitude = parseFloat(longitude)
		latitude = parseFloat(latitude)
	}

	longitude = longitude.toFixed(2)
	latitude = latitude.toFixed(2)

	return {
		longitude: longitude.toString().split('.'),
		latitude: latitude.toString().split('.')
	}
}
var dateUtils = {
	UNITS: {
		'年': 31557600000,
		'月': 2629800000,
		'天': 86400000,
		'小时': 3600000,
		'分钟': 60000,
		'秒': 1000
	},
	humanize: function(milliseconds) {
		var humanize = '';
		for (var key in this.UNITS) {
			if (milliseconds >= this.UNITS[key]) {
				humanize = Math.floor(milliseconds / this.UNITS[key]) + key + '前';
				break;
			}
		}
		return humanize || '刚刚';
	},
	format: function(dateStr) {
		var date = this.parse(dateStr)
		var diff = Date.now() - date.getTime();
		if (diff < this.UNITS['天']) {
			return this.humanize(diff);
		}
		var _format = function(number) {
			return (number < 10 ? ('0' + number) : number);
		};
		return date.getFullYear() + '/' + _format(date.getMonth() + 1) + '/' + _format(date.getDate()) + '-' +
			_format(date.getHours()) + ':' + _format(date.getMinutes());
	},
	parse: function(str) { //将"yyyy-mm-dd HH:MM:ss"格式的字符串，转化为一个Date对象
		var a = str.split(/[^0-9]/);
		return new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]);
	}
};
/**
 * 计算距离该日期的天数
 *  date  该日期 [day]  [month,day] [weekArr] [year,month,day]
 *  type 计算类型：1 重复月 2 重复年 3 重复周 4 不重复
 *  如果日期相同 返回0
 */
function getRepeatDay(date, type = 1) {
	const {
		year,
		month,
		day,
		week
	} = getNowDate();
	let nowDate = year + '-' + month + '-' + day
	let newDate = ''
	let isFuture = false;

	// 计算相差的天
	function compareDay(nowDay, newDay, future) {
		if (future) {
			return newDay - nowDay
		} else {
			// 传入为某个日期，格式转换
			newDate = year + '-' + (month + 1) + '-' + newDay
			return getDaysBetween(nowDate, newDate)
		}
	}
	// 每月的该日重复
	if (type === 1) {
		isFuture = day < date[0];
		// 如果为当天 返回0
		if (day === date[0]) {
			return 0
		} else {
			return compareDay(day, date[0], isFuture)
		}
	}
	// 每年的该月该日重复
	if (type === 2) {
		const sameMonth = month === date[0];
		const sameDay = day === date[1];
		isFuture = (month < date[0]) || (sameMonth && day < date[1]);
		// 如果为当天 返回0
		if (sameMonth && sameDay) {
			return 0
		} else if (sameMonth) {
			// 同月 计算日
			return compareDay(day, date[1], isFuture)
		} else {
			// 不同月不同日
			newDate = (isFuture ? year : year + 1) + '-' + date[0] + '-' + date[1]
			return getDaysBetween(nowDate, newDate)
		}
	}
	// 每周几重复
	if (type === 3) {
		// date格式为星期数组 [0,1,2,3,4,5,6]
		const nowWeek = new Day().getDay();
		if (date.includes(nowWeek)) {
			return 0
		}

	}
	// // 年重复的计算
	// if (type === 2) {
	// 	const sameYear = year === date[0];
	// 	const sameMonth = month === date[1];
	// 	const sameDay = day === date[2];
	// 	isFuture = year < date[0] ||
	// 		(sameYear && month < date[1]) ||
	// 		(sameYear && sameMonth && day < date[2]);
	// 	// 如果为当天 返回0
	// 	if (sameYear && sameMonth && sameDay) {
	// 		return 0
	// 	} else if (sameYear && sameMonth) {
	// 		// 同年月 计算日
	// 		return compareDay(day, date[2], isFuture)
	// 	} else if (sameYear) {
	// 		// 每年的该月该日
	// 		nowDate = year + '-' + month + '-' + day
	// 		newDate = (isFuture ? year : year + 1) + '-' + date[1] + '-' + date[0]
	// 		return getDaysBetween(nowDate, newDate)
	// 	}
}
/**
 * 计算两个日期之间的天数
 *  date1  开始日期 yyyy-MM-dd
 *  date2  结束日期 yyyy-MM-dd
 *  如果日期相同 返回一天 开始日期大于结束日期，返回0
 */
function getDaysBetween(date1, date2) {
	var startDate = Date.parse(date1);
	var endDate = Date.parse(date2);
	if (startDate > endDate) {
		return 0;
	}
	if (startDate == endDate) {
		return 1;
	}
	var days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
	return days;
}

export {
	dateState,
	formatTime,
	formatLocation,
	dateUtils,
	getNowDate,
	getDaysBetween,
	getRepeatDay
}
