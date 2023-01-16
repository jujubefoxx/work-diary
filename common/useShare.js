//useShare.js  
import {
	onShareAppMessage,
	onShareTimeline
} from '@dcloudio/uni-app'

const {
	imgUrl
} = getApp({
	allowDefault: true
}).globalData;
export const useShare = (params = {}) => {
	let defaultOptions = {
		title: '你想像我一样获得让打工变得快乐的力量吗？',
		path: '/pages/home/index',
	}
	const shareApp = (options = {}) => {
		onShareAppMessage(() => {
			return {
				imageUrl: imgUrl.sbCat,
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
	return {
		onShareAppMessage: shareApp,
		onShareTimeline: shareTime,
	}
}
