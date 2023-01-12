<template>
	<view class="commemoration home-item">
		<view class="home-item__header">
			<h4 class="home-item__title">激动时刻</h4>
			<view class="home-item__btn light-shadow">自定</view>
		</view>
		<view class="commemoration-item">
			<view class="commemoration-list" :style="'background-image: url(' + imgUrl.moneyCat + ')'">
				<view class="commemoration-list__date">
					<text>15</text>
					<text class="f-12 f-w-400">天</text>
				</view>
				<view class="f-16">距离发工资还有</view>
				<view class="commemoration-list__remark">开开心心收米米</view>
			</view>
			<view class="commemoration-list" :style="'background-image: url(' + imgUrl.foodCat + ')'">
				<view class="commemoration-list__date">
					<text>今天</text>
					<text class="f-12 f-w-400"></text>
				</view>
				<view class="f-16">就是周末</view>
				<view class="commemoration-list__remark">开开心心收米米</view>
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
console.log(getRepeatDay([1], 3));
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
</script>

<style lang="scss" scoped>
.commemoration-item {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	margin-top: 8px;
}
.commemoration-list {
	width: 302rpx;
	height: 244rpx;
	border-radius: 12rpx;
	border: 4rpx solid #2c2c2c;
	background-size: 126rpx 148rpx;
	background-position: 100% 110%;
	background-repeat: no-repeat;
	padding: 14px 11px;
	color: #2c2c2c;
	line-height: 22px;
}
.commemoration-list__date {
	font-size: 30px;
	font-weight: bold;
	color: #000000;
}
.commemoration-list__remark {
	font-size: 12px;
	line-height: 17px;
}
// .commemoration-list__img {
// 	width: 126rpx;
// 	height: 74px;
// }
</style>
