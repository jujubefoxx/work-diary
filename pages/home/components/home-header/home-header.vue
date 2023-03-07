<template>
	<view class="home-header">
		<text class="iconfont icon-hudong"></text>
		<image class="home-header__cat" src="https://s1.ax1x.com/2023/01/05/pSAE5TA.png"></image>
		<view class="flex flex-dir-column f-14">
			<view class="home-header__left">
				<text>{{ leftSaying }}</text>
			</view>
			<view class="flex flex-x-end">
				<input class="home-header__right f-13" @input="onKeyInput" :style="{ width: inputWid }" maxlength="12" placeholder="请输入文字和猫猫交流吧～" />
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue';
import { dateState } from '@/common/util';
import { useStore } from 'vuex';
import { key } from '@/store';
const store = useStore(key);
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
console.log(imgUrl.diaryCat);
// 是否假期
const isHoliday: ComputedRef = computed(() => store.state.isHoliday);
interface TimeWord {
	morning: string;
	afternoon: string;
	evening: string;
}
// 打招呼内容
const helloWord: TimeWord = {
	morning: '又是元气满满的一天！',
	afternoon: '下班后好好吃一顿吧！',
	evening: '辛苦了一天早点休息吧！'
};
const dateWord: TimeWord = {
	morning: '上午好呀打工人，',
	afternoon: '下午好呀打工人，',
	evening: '晚上好呀打工人，'
};
// 猫咪说的话
const leftSaying: ComputedRef = computed(() => {
	if (isHoliday.value) {
		return dateWord[dateState()] + '今天猫猫也休息哦';
	}
	return dateWord[dateState()] + helloWord[dateState()];
});
// 自己说的话
const rightSaying: Ref = ref('');
// 获取输入内容
function onKeyInput(e: any) {
	rightSaying.value = e.detail.value;
}
// input输入框宽度自适应
const inputWid: ComputedRef = computed(() => {
	if (rightSaying.value == '' || rightSaying.value == 0) {
		return '314rpx';
	} else {
		const str = String(rightSaying.value);
		let len = 0;
		// 正则表达式，判断是否为汉字
		const re = /[\u4e00-\u9fa5]/;
		for (let i = 0; i < str.length; i++) {
			if (re.test(str.charAt(i))) {
				len++;
			}
		}
		return (len + str.length) * 14 + 'rpx';
	}
});
</script>

<style lang="scss" scoped>
.home-header {
	position: relative;
	width: 100%;
	height: 392rpx;
}
.home-header__cat {
	position: absolute;
	left: 18rpx;
	bottom: 32rpx;
	width: 342rpx;
	height: 208rpx;
}
.icon-banzhuan {
	position: absolute;
	bottom: 154rpx;
	font-size: 100rpx;
	left: 34rpx;
}
.icon-hudong {
	position: absolute;
	font-size: 72rpx;
	right: 46rpx;
	top: 84rpx;
}
.home-header__right,
.home-header__left {
	position: relative;
	width: fit-content;
	line-height: 40rpx;
	background: #ffffff;
	border: 4rpx solid #2c2c2c;
	border-radius: 24rpx;
	z-index: 2;
}
.home-header__left {
	padding: 24rpx 20rpx;
	margin-top: 12rpx;
	margin-left: 32rpx;
	&::before {
		position: absolute;
		bottom: -40rpx;
		content: '';
		width: 20rpx;
		height: 20rpx;
		background: #ffffff;
		border-radius: 50%;
		border: 4rpx solid #2c2c2c;
	}
}
.home-header__right {
	padding: 20rpx;
	max-width: 394rpx;
	margin-top: 38rpx;
	margin-right: 30rpx;
}
</style>
