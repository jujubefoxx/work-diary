<template>
	<view class="lounge home-item">
		<view class="home-item__header"><h4 class="home-item__title">打工人休息室</h4></view>
		<view class="lounge-item">
			<view v-for="item in lougeList" @click="openLounge(item)" class="lounge-item__list">
				<view class="lounge-item__list-icon ali-font black-border light-shadow">{{ item.shortTitle }}</view>
				<view class="lounge-item__list-title f-14">{{ item.title }}</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'lounge'
};
</script>
<script setup>
import { computed, reactive, ref, watch } from 'vue';
import { dateState, getNowDate } from '@/common/util.js';
import { onShow } from '@dcloudio/uni-app';
let lougeList = reactive([
	{ title: '今天吃啥', shortTitle: '吃啥', path: 'pages/index/index', appid: 'wx18508a564e357535' },
	{ title: '广告招租', shortTitle: '广告' },
	{ title: '广告招租', shortTitle: '广告' },
	{ title: '广告招租', shortTitle: '广告' }
]);
onShow(() => {
	const { hour } = getNowDate();
	if (hour >= 23 || hour < 8) {
		lougeList[1] = { title: '扫雷', shortTitle: '扫雷', path: '/pages/game/minesweeper' };
	} else {
		lougeList[1] = { title: '广告招租', shortTitle: '广告' };
	}
});

function openLounge(item) {
	if (!item.path) return;
	if (item.appid) {
		uni.navigateToMiniProgram({
			appId: item.appid,
			path: item.path
		});
	} else {
		uni.navigateTo({
			url: item.path
		});
	}
}
</script>

<style lang="scss" scoped>
.lounge-item {
	display: flex;
	flex-wrap: wrap;
}
.lounge-item__list-icon {
	display: flex;
	width: 92rpx;
	height: 92rpx;
	border-radius: 50%;
	font-size: 44rpx;
	font-weight: 800;
	color: #2c2c2c;
	line-height: 52rpx;
	align-items: center;
	justify-content: center;
	text-align: center;
	overflow: hidden;
	margin-bottom: 14rpx;
}
.lounge-item__list {
	display: flex;
	flex-direction: column;
	justify-content: center;
	margin-top: 30rpx;
	width: calc(100% / 4);
	align-items: center;
}
</style>
