import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		theme: 'default-skin',
		isHoliday: false,
		currentDayDate: uni.getStorageSync('currentDayDate'),
		profile: uni.getStorageSync('profile'),
		loginProvider: "",
		openid: null,
		testvuex: false,
		colorIndex: 0,
		colorList: ['#FF0000', '#00FF00', '#0000FF'],
		noMatchLeftWindow: true,
		active: 'componentPage',
		leftWinActive: '/pages/component/view/view',
		activeOpen: '',
		menu: [],
		univerifyErrorMsg: ''
	},
	mutations: {
		changeTheme(state, themeName) {
			state.theme = themeName;
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
		setProfile(state, data) {
			// 保存资料信息
			uni.setStorageSync('profile', data);
			state.profile = data
		},
		setTestFalse(state) {
			state.testvuex = false
		},
		setColorIndex(state, index) {
			state.colorIndex = index
		},
		setMatchLeftWindow(state, matchLeftWindow) {
			state.noMatchLeftWindow = !matchLeftWindow
		},
		setActive(state, tabPage) {
			state.active = tabPage
		},
		setLeftWinActive(state, leftWinActive) {
			state.leftWinActive = leftWinActive
		},
		setActiveOpen(state, activeOpen) {
			state.activeOpen = activeOpen
		},
		setMenu(state, menu) {
			state.menu = menu
		},
		setUniverifyLogin(state, payload) {
			typeof payload !== 'boolean' ? payload = !!payload : '';
			state.isUniverifyLogin = payload;
		},
		setUniverifyErrorMsg(state, payload = '') {
			state.univerifyErrorMsg = payload
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
	actions: {
		// lazy loading openid
		getUserOpenId: async function({
			commit,
			state
		}) {
			return await new Promise((resolve, reject) => {
				if (state.openid) {
					resolve(state.openid)
				} else {
					uni.login({
						success: (data) => {
							commit('login')
							setTimeout(function() { //模拟异步请求服务器获取 openid
								const openid = '123456789'
								console.log('uni.request mock openid[' +
									openid + ']');
								commit('setOpenid', openid)
								resolve(openid)
							}, 1000)
						},
						fail: (err) => {
							console.log('uni.login 接口调用失败，将无法正常使用开放接口等服务', err)
							reject(err)
						}
					})
				}
			})
		},
		getPhoneNumber: function({
			commit
		}, univerifyInfo) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: 'https://97fca9f2-41f6-449f-a35e-3f135d4c3875.bspapp.com/http/univerify-login',
					method: 'POST',
					data: univerifyInfo,
					success: (res) => {
						const data = res.data
						if (data.success) {
							resolve(data.phoneNumber)
						} else {
							reject(res)
						}

					},
					fail: (err) => {
						reject(res)
					}
				})
			})
		}
	}
})

export default store
