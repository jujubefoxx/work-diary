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
	var weekArr = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'];
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

export {
	dateState,
	formatTime,
	formatLocation,
	dateUtils,
	getNowDate
}
