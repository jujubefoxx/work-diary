<script>
import { getNowDate, getRepeatDay } from '@/common/util.js';
export default {
	globalData: {
		imgUrl: {
			moneyCat: 'https://s1.ax1x.com/2023/01/06/pSAX3b8.png',
			diaryCat: 'https://s1.ax1x.com/2023/01/05/pSAE5TA.png',
			foodCat: 'https://s1.ax1x.com/2023/01/06/pSAXlKP.png',
			noteCat: 'https://s1.ax1x.com/2023/01/18/pS3mPWq.png',
			loveCat: 'https://s1.ax1x.com/2023/01/06/pSAX1Df.png',
			boomCat: 'https://s1.ax1x.com/2023/01/16/pS1iia6.png',
			sbCat: 'https://s1.ax1x.com/2023/01/16/pS1Kqde.png'
		}
		//  V3模式，可以通过getApp({allowDefault: true}).globalData获取
	},
	onLaunch: function() {},
	onShow: function() {
		const { year, month, day } = getNowDate();
		const currentDayDate = {
			year,
			month,
			day,
			dateStr: `${year}-${month}-${day}`,
			weather: ''
		};

		// 如果是休息日 变更打工状态
		function checkHoliday() {
			const commemorationList = uni.getStorageSync('commemoration');
			if (commemorationList) {
				const holidayData = commemorationList.find(item => item.alias === 'holiday');
				return getRepeatDay(holidayData.date, holidayData.type) === 0;
			} else {
				return false;
			}
		}

		const storeData = uni.getStorageSync('currentDayDate');
		// 是否新的一天
		if (!storeData || (storeData && currentDayDate.dateStr !== storeData.dateStr)) {
			// 更新当天数据
			this.$store.commit('setCurrentDayDate', currentDayDate);
			// 更新休息状态
			this.$store.commit('changeHoliday', checkHoliday());
			// 更新打卡数据
			const dailyList = uni.getStorageSync('dailyList');
			if (dailyList) {
				const newDailyList = dailyList.map(item => ({ ...item, hasPunch: false }));
				this.$store.commit('setArrList', { data: newDailyList });
			}
			// 更新记事本数据
			const noteList = uni.getStorageSync('noteList');
			if (noteList) {
				noteList.forEach((item, index) => {
					if (item.isComplete) {
						this.$store.commit('setArrList', { arr: 'noteList', data: index, type: 'splice' });
					}
				});
			}
		}
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'static/css/theme.scss';
@import 'static/css/common.css';
@import 'static/css/iconfont.css';
@import 'static/css/public.scss';
</style>
