import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		// 皮肤
		theme: 'default-skin',
		// 是否休息日
		isHoliday: false,
		// 滚动穿透
		metaShow: false,
		// 今日数据
		currentDayDate: uni.getStorageSync('currentDayDate'),
		// 个人资料
		profile: uni.getStorageSync('profile'),
		// 打卡列表
		dailyList: uni.getStorageSync('dailyList'),
	},
	mutations: {
		changeTheme(state, themeName) {
			state.theme = themeName;
		},
		changeMeta(state, data) {
			state.metaShow = data;
		},
		changeHoliday(state, data) {
			if (data) {
				state.isHoliday = data
			} else {
				state.isHoliday = !state.isHoliday
			}
		},
		setCurrentDayDate(state, data) {
			// 更新当天的信息
			uni.setStorageSync('currentDayDate', data);
			state.currentDayDate = data
		},
		setDailyList(state, {
			data,
			type = ''
		}) {
			if (type === 'push') {
				state.dailyList.push(data)
			} else if (type === 'splice') {
				state.dailyList.splice(data, 1);
			} else if (type === 'punch') {
				state.dailyList[data].hasPunch = true;
			} else if (type === 'cencel') {
				state.dailyList[data].hasPunch = false;
			} else {
				state.dailyList = data
			}
			// 更新当天的信息
			uni.setStorageSync('dailyList', state.dailyList);
			console.log(uni.getStorageSync('dailyList'))
		},
		setProfile(state, data) {
			// 保存资料信息
			uni.setStorageSync('profile', data);
			state.profile = data
		}
	},
	getters: {
		// 发工资时间
		payoffTime(state) {
			console.log(state.profile.payoffTime)
			if (isNaN(state.profile.payoffTime)) {
				if (state.profile.payoffTime && state.profile.payoffTime.indexOf('最后一天') !== -1) {
					return 99;
				}
				return 0
			}
			return state.profile.payoffTime
		}
	},
	actions: {}
})

export default store
