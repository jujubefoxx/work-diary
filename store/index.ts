// store.ts
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';

// 为 store state 声明类型
export interface State {
	theme: string;
	themeList: Theme[];
	isHoliday: boolean;
	loading: boolean;
	metaShow: boolean;
	currentDayDate: Current;
	profile: Profile;
	dailyList: [];
	noteList: Note;
}
/**
 * 钱的类型
 */
export type Money = string | number;
/**
 *  笔记
 *  color 主题色
 *  name 名称
 *  font 字体大小
 */
export interface Theme {
	color: string;
	name: string;
	font?: string;
}
/**
 *  笔记
 *  content 内容
 *  date 创建/修改日期
 *  isComplete 是否完成
 *  index 下标
 */
export interface Note {
	content: string;
	date: string;
	isComplete: boolean;
	index?: string | number;
}
/**
 *  资料
 *  workingTime 上班时间
 *  closingTime 下班时间
 *  workMinutes 上班工时
 *  breakStart 午休开始时间
 *  breakEnd 午休结束时间
 *  breakMinutes 午休时间
 *  moneyType 薪资类型 1月薪  2日薪  3时薪
 *  money 薪资
 *  workDays 月工时
 *  payoffTime 发薪时间
 */
export interface Profile {
	// 上班时间
	workingTime: number[];
	// 下班时间
	closingTime: number[];
	// 上班工时（分）
	workMinutes: number;
	// 午休开始时间
	breakStart: number[];
	// 午休结束时间
	breakEnd: number[];
	// 午休时间（分）
	breakMinutes: number;
	// 薪资类型 1月薪  2日薪  3时薪
	moneyType: number;
	// 薪资
	money: string | number;
	// 月工时
	workDays: number;
	// 发薪时间
	payoffTime: number | string;
}
export interface Current {
	day: number;
	month: number;
	year: number;
}
// 定义 injection key
export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
	state: {
		// 皮肤
		theme: uni.getStorageSync('theme') || 'default-skin',
		themeList: [
			{
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
		noteList: uni.getStorageSync('noteList') || []
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
				state.isHoliday = data;
			} else {
				state.isHoliday = !state.isHoliday;
			}
			uni.setStorageSync('isHoliday', state.isHoliday);
		},
		setCurrentDayDate(state, data) {
			// 更新当天的信息
			uni.setStorageSync('currentDayDate', data);
			state.currentDayDate = data;
		},
		setArrList(state, { arr = 'dailyList', type = '', data, index }) {
			if (type === 'push') {
				state[arr].push(data);
			} else if (type === 'splice') {
				state[arr].splice(data, 1);
			} else if (type === 'edit') {
				state[arr][index] = data;
			} else {
				state[arr] = data;
			}
			// 更新当天的信息
			uni.setStorageSync(arr, state[arr]);
		},
		setProfile(state, data) {
			// 保存资料信息
			uni.setStorageSync('profile', data);
			state.profile = data;
		}
	},
	getters: {
		// 发工资时间
		payoffTime(state) {
			if (isNaN(state.profile.payoffTime as number)) {
				if (state.profile.payoffTime && (state.profile.payoffTime as string).indexOf('最后一天') !== -1) {
					return 99;
				}
				return 0;
			}
			return state.profile.payoffTime;
		}
	}
});
