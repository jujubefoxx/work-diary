//usePage.ts
import { onShareAppMessage, onShareTimeline, onReady } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { key } from '@/store';
import img from '@/static/images/sbCat.jpg';
export const usePage = () => {
	interface Page {
		imageUrl?: any;
		title: String;
		path: string;
	}
	const store = useStore(key);
	const defaultOptions: Page = {
		title: '你想像我一样获得让打工变得快乐的力量吗？',
		path: '/pages/home/index'
	};
	const shareApp = (options = {}): void => {
		onShareAppMessage(
			(): Page => {
				return {
					imageUrl: img,
					...defaultOptions,
					...options
				};
			}
		);
	};
	const shareTime = (options = {}): void => {
		onShareTimeline(
			(): Page => {
				return {
					...defaultOptions,
					...options
				};
			}
		);
	};
	const setTheme = (): void => {
		onReady(() => {
			const item = store.state.themeList.find(i => i.name === store.state.theme);
			uni.setNavigationBarColor({
				frontColor: item.font || '#000000',
				backgroundColor: item.color
			});
		});
	};
	return {
		onShareAppMessage: shareApp,
		onShareTimeline: shareTime,
		onReady: setTheme
	};
};
