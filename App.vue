<script>
import { getNowDate } from '@/common/util.js';
export default {
	globalData: {
		imgUrl: {
			moneyCat: 'https://s1.ax1x.com/2023/01/06/pSAX3b8.png',
			diaryCat: 'https://s1.ax1x.com/2023/01/05/pSAE5TA.png',
			foodCat: 'https://s1.ax1x.com/2023/01/06/pSAXlKP.png',
			noteCat: 'https://s1.ax1x.com/2023/01/05/pSAEql8.png',
			loveCat: 'https://s1.ax1x.com/2023/01/06/pSAX1Df.png'
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
		const storeData = uni.getStorageSync('currentDayDate');
		// 是否新的一天
		if (!storeData || (storeData && currentDayDate.dateStr !== storeData.dateStr)) {
			this.$store.commit('setCurrentDayDate', currentDayDate);
			const dailyList = uni.getStorageSync('dailyList');
			if (dailyList) {
				const newDailyList = dailyList.map(item => ({ ...item, hasPunch: false }));
				this.$store.commit('setDailyList', newDailyList);
			}
		}

		uni.getStorageSync('dailyList');
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
