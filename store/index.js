import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		// 皮肤
		theme: uni.getStorageSync('theme') || 'default-skin',
		themeList: [{
				color: '#ffce30',
				name: 'default-skin'
			},
			{
				color: '#F36AA5',
				font: '#ffffff',
				name: 'pink-skin'
			},
			{
				color: '#1A69B2',
				font: '#ffffff',
				name: 'blue-skin'
			},
			{
				color: '#8181B7',
				font: '#ffffff',
				name: 'purple-skin'
			},
			{
				color: '#F77821',
				font: '#ffffff',
				name: 'orange-skin'
			}
		],
		// 是否休息日
		isHoliday: uni.getStorageSync('isHoliday') || false,
		// 是否加载中
		loading: true,
		// 滚动穿透
		metaShow: false,
		// 今日数据
		currentDayDate: uni.getStorageSync('currentDayDate') || {},
		// 个人资料
		profile: uni.getStorageSync('profile') || {},
		// 打卡列表
		dailyList: uni.getStorageSync('dailyList') || [],
		// 记事本列表
		noteList: uni.getStorageSync('noteList') || [],
	},
	mutations: {
		changeTheme(state, themeName) {
			state.theme = themeName;
			uni.setStorageSync('theme', themeName);
		},
		changeLoading(state, data) {
			state.loading = data;
		},
		changeMeta(state, data) {
			state.metaShow = data;
		},
		changeHoliday(state, data) {
			if (data !== undefined) {
				state.isHoliday = data
			} else {
				state.isHoliday = !state.isHoliday
			}
			uni.setStorageSync('isHoliday', state.isHoliday)
		},
		setCurrentDayDate(state, data) {
			// 更新当天的信息
			uni.setStorageSync('currentDayDate', data);
			state.currentDayDate = data
		},
		setArrList(state, {
			arr = 'dailyList',
			type = '',
			data,
			index
		}) {
			if (type === 'push') {
				state[arr].push(data)
			} else if (type === 'splice') {
				state[arr].splice(data, 1);
			} else if (type === 'edit') {
				state[arr][index] = data;
			} else {
				state[arr] = data
			}
			// 更新当天的信息
			uni.setStorageSync(arr, state[arr]);
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
