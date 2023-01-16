import App from './App'

import {
	createSSRApp
} from 'vue'
import store from './store'
// #ifdef MP
// if (uni.getSystemInfoSync().platform !== "devtools") {
// 	console.log = () => {}
// }
// #endif
export function createApp() {
	const app = createSSRApp(App)
	app.use(store)
	app.config.globalProperties.$store = store
	return {
		app
	}
}
