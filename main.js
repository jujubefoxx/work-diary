import App from './App'

import {
	createSSRApp
} from 'vue'
import store from './store'
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$store = store
	// app.config.globalProperties.$test2 = {
	// 	playing: false,
	// 	playTime: 0,
	// 	formatedPlayTime: '00:00:00'
	// }
	return {
		app
	}
}
