<template>
	<view class="confirm-button light-shadow">
		<view class="confirm-button__list" :class="{ 'confirm-button__list--border': showconfirm }" v-if="showCancel" @click="$emit('handleCancel')">{{ cancelText }}</view>
		<view class="confirm-button__list active-btn" v-if="showconfirm" @click="$emit('handleConfirm')">{{ confirmText }}</view>
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
	confirmText: {
		type: String,
		default: () => '确定'
	},
	showconfirm: {
		type: Boolean,
		default: () => true
	}
});
const { buttonList, activeId } = toRefs(props);
</script>

<style lang="scss" scoped>
.confirm-button {
	display: flex;
	justify-content: center;
	border-radius: 200rpx;
	border: 4rpx solid #2c2c2c;
	overflow: hidden;
	width: fit-content;
	margin: 44rpx auto;
	font-size: 28rpx;
}
.confirm-button__list {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 228rpx;
	height: 88rpx;
	background: #f4f4f6;
	color: #535354;
}
.confirm-button__list--border {
	border-right: 4rpx solid #2c2c2c;
}
</style>
