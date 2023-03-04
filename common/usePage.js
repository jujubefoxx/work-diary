//usePage.js  
import {
	onShareAppMessage,
	onShareTimeline,
	onReady
} from '@dcloudio/uni-app'
import {
	useStore
} from 'vuex';
import {
	key
} from '@/store';
import img from "@/static/images/sbCat.jpg";
export const usePage = (params = {}) => {
	const store = useStore(key);
	let defaultOptions = {
		title: '你想像我一样获得让打工变得快乐的力量吗？',
		path: '/pages/home/index',
	}
	const shareApp = (options = {}) => {
		onShareAppMessage(() => {
			return {
				imageUrl: img,
				...defaultOptions,
				...options
			}
		})
	}
	const shareTime = (options = {}) => {
		onShareTimeline(() => {
			return {
				...defaultOptions,
				...options
			}
		})
	}
	const setTheme = () => {
		onReady(() => {
			const item = store.state.themeList.find(i => i.name === store.state.theme);
			uni.setNavigationBarColor({
				frontColor: item.font || '#000000',
				backgroundColor: item.color
			});
		});
	}
	return {
		onShareAppMessage: shareApp,
		onShareTimeline: shareTime,
		onReady: setTheme
	}
}
