import App from './App'
import { store, key } from './store'
import {
	createSSRApp
} from 'vue'
// #ifdef MP
// if (uni.getSystemInfoSync().platform !== "devtools") {
// 	console.log = () => {}
// }
// #endif
export function createApp() {
	const app = createSSRApp(App)
	app.use(store, key)
	app.config.globalProperties.$store = store
	return {
		app
	}
}
