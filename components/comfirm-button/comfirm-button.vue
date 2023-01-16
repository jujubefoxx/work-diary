<template>
	<view class="comfirm-button light-shadow">
		<view class="comfirm-button__list" :class="{ 'comfirm-button__list--border': showComfirm }" v-if="showCancel" @click="$emit('handleCancel')">{{ cancelText }}</view>
		<view class="comfirm-button__list active-btn" v-if="showComfirm" @click="$emit('handleComfirm')">确定</view>
	</view>
</template>
<script>
export default {
	name: 'happy-button'
};
</script>
<script setup>
import { computed, ref, toRefs } from 'vue';
import { dateState } from '@/common/util.js';

const props = defineProps({
	showCancel: {
		type: Boolean,
		default: () => true
	},
	cancelText: {
		type: String,
		default: () => '取消'
	},
	showComfirm: {
		type: Boolean,
		default: () => true
	}
});
const { buttonList, activeId } = toRefs(props);
</script>

<style lang="scss" scoped>
.comfirm-button {
	display: flex;
	justify-content: center;
	border-radius: 200rpx;
	border: 4rpx solid #2c2c2c;
	overflow: hidden;
	width: fit-content;
	margin: 44rpx auto;
}
.comfirm-button__list {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 228rpx;
	height: 88rpx;
	background: #f4f4f6;
	color: #535354;
}
.comfirm-button__list--border {
	border-right: 4rpx solid #2c2c2c;
}
</style>
