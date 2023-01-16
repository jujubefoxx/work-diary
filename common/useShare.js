//useShare.js  
import {
	onShareAppMessage,
	onShareTimeline
} from '@dcloudio/uni-app'

import img from "@/static/images/sbCat.jpg";
export const useShare = (params = {}) => {
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
	return {
		onShareAppMessage: shareApp,
		onShareTimeline: shareTime,
	}
}
