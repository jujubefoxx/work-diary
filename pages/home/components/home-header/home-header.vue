<template>
	<view class="home-header">
		<text class="iconfont icon-hudong"></text>
		<text class="iconfont icon-banzhuan"></text>
		<image class="home-header__cat" :src="imgUrl.diaryCat"></image>
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
<script>
export default {
	name: 'home-header'
};
</script>
<script setup>
import { computed, ref } from 'vue';
import { dateState } from '@/common/util.js';
import { useStore } from 'vuex';
// import { mapState } from 'vuex'
const store = useStore();
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
// 是否假期
const isHoliday = computed(() => store.state.isHoliday);
// 打招呼内容
const helloWord = {
	morning: '又是元气满满的一天！',
	afternoon: '下班后好好吃一顿吧！',
	evening: '辛苦了一天早点休息吧！'
};
const dateWord = {
	morning: '上午好呀打工人，',
	afternoon: '下午好呀打工人，',
	evening: '晚上好呀打工人，'
};
// 猫咪说的话
const leftSaying = computed(() => {
	if (isHoliday.value) {
		return dateWord[dateState()] + '今天猫猫也休息哦';
	}
	return dateWord[dateState()] + helloWord[dateState()];
});
// 自己说的话
let rightSaying = ref('');
// 获取输入内容
function onKeyInput(e) {
	rightSaying.value = e.detail.value;
}
// input输入框宽度自适应
const inputWid = computed(() => {
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
	left: 34rpx;
}
.icon-hudong {
	position: absolute;
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
