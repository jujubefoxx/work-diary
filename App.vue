<script>
export default {
	globalData: {
		imgUrl: {
			moneyCat: 'https://s1.ax1x.com/2023/01/05/pSAEbSf.png',
			diaryCat: 'https://s1.ax1x.com/2023/01/05/pSAE5TA.png',
			foodCat: 'https://s1.ax1x.com/2023/01/05/pSAEL6S.png',
			noteCat: 'https://s1.ax1x.com/2023/01/05/pSAEql8.png'
		}
		//  V3模式，可以通过getApp({allowDefault: true}).globalData获取
	},
	onLaunch: function() {
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/*每个页面公共css */
@import 'static/css/theme.scss';
@import 'static/css/common.css';
@import 'static/css/iconfont.css';
/* CDN 服务仅供平台体验和调试使用，平台不承诺服务的稳定性，企业客户需下载字体包自行发布使用并做好备份。 */
// @font-face {
// 	font-family: '钉钉进步体';
// 	font-weight: 400;
// 	src: url('//at.alicdn.com/wf/webfont/Wy6xSOAemQSP/K-IVELB1b_eGWex96QVQC.woff2') format('woff2'),
// 		url('//at.alicdn.com/wf/webfont/Wy6xSOAemQSP/K0DF5NvY1cEir_GYyN7fv.woff') format('woff');
// 	font-display: swap;
// }
</style>
