<template>
	<view class="commemoration home-item">
		<view class="home-item__header">
			<h4 class="home-item__title">激动时刻</h4>
			<view class="home-item__btn light-shadow">自定</view>
		</view>
		<view class="commemoration-item">
			<!-- 发工资日，需和填写资料配合，不可修改 -->
			<view class="commemoration-list" v-if="payoffTime && payoffTime > 0" :style="'background-image: url(' + imgUrl.moneyCat + ')'">
				<view class="commemoration-list__date">
					<text>{{ isToday([payoffTime], 1) ? `${getRepeatDay([payoffTime], 1)}天` : getRepeatDay([payoffTime], 1) }}</text>
					<text v-if="!isToday([payoffTime], 1)" class="f-12 f-w-400">天</text>
				</view>
				<view class="f-16">{{ isToday([payoffTime], 1) ? '就是发工资日' : '离发工资日还有' }}</view>
				<view class="commemoration-list__remark">开开心心收米米</view>
			</view>
			<!-- 可自定的日期 -->
			<view v-for="(item, index) in commemorationList" class="commemoration-list" :style="'background-image: url(' + (item.alias ? imgUrl.foodCat : imgUrl.loveCat) + ')'">
				<view class="commemoration-list__date">
					<text>{{ isToday(item.date, item.type) ? '今天' : Math.abs(getRepeatDay(item.date, item.type)) }}</text>
					<text v-if="!isToday(item.date, item.type)" class="f-12 f-w-400">天</text>
				</view>
				<view v-if="getRepeatDay(item.date, item.type) >= 0" class="f-16">{{ isToday(item.date, item.type) ? `就是${item.title}` : `离${item.title}还有` }}</view>
				<view v-else class="f-16">{{ item.title }}已经过去了</view>
				<view class="commemoration-list__remark">{{ item.remark }}</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'commemoration'
};
</script>
<script setup>
import { computed, ref, watch, isRef } from 'vue';
import { dateState, getNowDate, getRepeatDay } from '@/common/util.js';
import { useStore } from 'vuex';
const store = useStore();
// 发工资时间
const payoffTime = computed(() => store.getters.payoffTime);
// 是否今天
function isToday(day, type) {
	return getRepeatDay(day, type) === 0;
}
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;

/**
 *  纪念日列表 数组对象
 *  alias 只有休息日有 不可删除只能修改
 *  date 日期数据
 *  type 计算类型：1 月重复 2 年重复 3 周重复 4 不重复
 */
let commemorationList = ref([{ alias: 'holiday', type: 3, date: [0, 5, 6], title: '休息日', remark: '谁请我吃肯德基' }]);
// 获取保存的数据
// if (uni.getStorageSync('commemoration')) {
// 	commemorationList.value = uni.getStorageSync('commemoration');
// } else {
// 	uni.setStorageSync('commemoration', commemorationList.value);
// }
// 如果是休息日 变更打工状态
function checkHoliday() {
	const holidayData = commemorationList.value.find(item => item.alias === 'holiday');
	if (isToday(holidayData.date, holidayData.type)) {
		// 变更状态
		store.commit('changeHoliday', true);
	} else {
		// 变更状态
		store.commit('changeHoliday', false);
	}
}
checkHoliday();
</script>

<style lang="scss" scoped>
.commemoration-item {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 16rpx;
}
.commemoration-list {
	width: 302rpx;
	height: 244rpx;
	border-radius: 12rpx;
	border: 4rpx solid #2c2c2c;
	background-size: 126rpx 148rpx;
	background-position: 100% 110%;
	background-repeat: no-repeat;
	padding: 28rpx 22rpx;
	color: #2c2c2c;
	line-height: 44rpx;
}
.commemoration-list__date {
	font-size: 60rpx;
	font-weight: bold;
	color: #000000;
	height: 70rpx;
	line-height: 70rpx;
}
.commemoration-list__remark {
	font-size: 24rpx;
	line-height: 34rpx;
}
// .commemoration-list__img {
// 	width: 126rpx;
// 	height: 148rpx;
// }
</style>
