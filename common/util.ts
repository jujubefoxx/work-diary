const weekArr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
// 判断当前早中晚
function dateState(): string {
	let date: Date = new Date();
	if (date.getHours() >= 6 && date.getHours() < 12) {
		return 'morning';
	} else if (date.getHours() >= 12 && date.getHours() < 18) {
		return 'afternoon';
	} else {
		return 'evening';
	}
}
// 获取当前时间对象
const getNowDate = (): { year: number; month: number; day: number; hour: number; minutes: number; seconds: number; week: string } => {
	const date: Date = new Date();
	const year: number = date.getFullYear(); // 年
	const month: number = date.getMonth() + 1; // 月
	const day: number = date.getDate(); // 日
	const hour: number = date.getHours(); // 时
	const minutes: number = date.getMinutes(); // 分
	const seconds: number = date.getSeconds(); //秒
	const week: string = weekArr[date.getDay()];
	return {
		year,
		month,
		day,
		hour,
		minutes,
		seconds,
		week
	};
};

/**
 *  计算距离该日期的天数
 *  date 格式月重复[day] 年重复[month,day] 周重复[weekArr] 不重复[year,month,day]
 *  type 计算类型：1 月重复 2 年重复 3 周重复 4 不重复
 *  如果为当天 返回0
 */
function getRepeatDay(date: number[], type: number = 1): number {
	const { year, month, day } = getNowDate();
	let nowDate: string = getDateString(year, month, day);
	let newDate: string = '';
	let isFuture: boolean = false; // 是否未来的日期
	// 当月的最后一天
	const lastDay: number = new Date(year, month, 0).getDate();
	// 获取年月日字符串
	function getDateString(yearNum: number, monthNum: number, dayNum: number): string {
		return `${yearNum}-${monthNum < 10 ? `0${monthNum}` : monthNum}-${dayNum < 10 ? `0${dayNum}` : dayNum}`;
	}
	// 计算相差的天
	function compareDay(nowDay: number, newDay: number, future: boolean): number {
		if (future) {
			// 异常判断（当月没有该日期）
			if (newDay > lastDay) {
				newDate = getDateString(year, month + 1, date[0]);
				return getDaysBetween(nowDate, newDate);
			} else {
				return newDay - nowDay;
			}
		} else {
			// 异常判断（下月没有该日期）
			const nextLastDay: number = new Date(year, month + 1, 0).getDate();
			// 传入为某个日期，格式转换
			newDate = getDateString(year, month + 1, newDay);

			if (newDay > nextLastDay) {
				newDate = getDateString(year, month + 2, newDay);
			}
			return getDaysBetween(nowDate, newDate);
		}
	}

	// 每月的该日重复
	// date格式为[day] 如[1]代表每月1日进行提醒 其中99代表每个月的最后一天
	if (type === 1) {
		let newDay: number = date[0] === 99 ? lastDay : date[0];
		isFuture = day < newDay;
		// 如果为当天 返回0
		if (day === newDay) {
			return 0;
		} else {
			return compareDay(day, newDay, isFuture);
		}
	}

	// 每年的该月该日重复
	// date格式为[month,day] 如[11,1]代表每年11月1日进行提醒
	if (type === 2) {
		const sameMonth: boolean = month === date[0];
		const sameDay: boolean = day === date[1];
		isFuture = month < date[0] || (sameMonth && day < date[1]);
		// 如果为当天 返回0
		if (sameMonth && sameDay) {
			return 0;
		} else if (sameMonth) {
			// 同月 计算日
			return compareDay(day, date[1], isFuture);
		} else {
			// 不同月不同日
			newDate = getDateString(isFuture ? year : year + 1, date[0], date[1]);
			return getDaysBetween(nowDate, newDate);
		}
	}

	// 每周几重复
	// date格式为星期数组 [0,1,2,3,4,5,6] 如[1,4]代表每周一和每周四进行提醒
	if (type === 3) {
		const nowWeek: number = new Date().getDay();
		if (date.includes(nowWeek)) {
			return 0;
		} else {
			let arr = []; // 距离值
			date.forEach(i => {
				if (i > nowWeek) {
					arr.push(i - nowWeek);
				} else {
					arr.push(weekArr.length - nowWeek + i);
				}
			});
			// 取最小值
			return Math.min(...arr);
		}
	}
	// 不重复
	// date格式为[year,month,day] 如[2022,1,4]代表今天距离该天的日期
	if (type === 4) {
		newDate = getDateString(date[0], date[1], date[2]);
		return getDaysBetween(nowDate, newDate);
	}
}
/**
 * 计算两个日期之间的天数
 *  date1  开始日期 yyyy-MM-dd
 *  date2  结束日期 yyyy-MM-dd
 *  开始日期大于结束日期，返回负数
 */
function getDaysBetween(date1: string, date2: string): number {
	const startDate: Date = Date.parse(date1);
	const endDate: Date = Date.parse(date2);
	const days: number = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000);
	return days;
}

export { weekArr, dateState, getNowDate, getDaysBetween, getRepeatDay };
