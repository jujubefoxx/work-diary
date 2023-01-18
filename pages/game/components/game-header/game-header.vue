<template>
	<view class="game-header">
		<text class="iconfont icon-saolei"></text>
		<image class="game-header__cat" :src="imgUrl.boomCat"></image>
	</view>
</template>
<script>
export default {
	name: 'game-header'
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
const rightSaying = ref('');
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
.game-header {
	position: relative;
	width: 100%;
	height: 258rpx;
}
.game-header__cat {
	position: absolute;
	left: 18rpx;
	bottom: 32rpx;
	width: 342rpx;
	height: 208rpx;
}
.icon-saolei {
	position: absolute;
	right: 80rpx;
	bottom: 84rpx;
	font-size: 140rpx;
}
</style>
