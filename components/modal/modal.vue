<template>
	<uni-popup ref="popup">
		<view class="modal theme-bg">
			<view class="modal-title t-c" v-if="showTitle">{{ title }}</view>
			<view class="modal-content"><slot></slot></view>
			<view class="flex flex-x-center" v-if="showBtn">
				<view class="modal-btn light-shadow">
					<view class="modal-btn__list" :class="{ 'modal-btn__list--border': showComfirm }" v-if="showCancel" @click="$emit('handleCancel')">取消</view>
					<view class="modal-btn__list active-btn" v-if="showComfirm" @click="$emit('handleComfirm')">确定</view>
				</view>
			</view>
		</view>
	</uni-popup>
</template>
<script>
export default {
	name: 'modal'
};
</script>
<script setup>
import { ref, toRefs, nextTick } from 'vue';
const popup = ref(null);
const props = defineProps({
	showTitle: {
		type: Boolean,
		default: () => true
	},
	title: {
		type: String,
		default: () => '填写资料'
	},
	showCancel: {
		type: Boolean,
		default: () => true
	},
	showComfirm: {
		type: Boolean,
		default: () => true
	},
	showBtn: {
		type: Boolean,
		default: () => true
	}
});
function openModal() {
	popup.value.open('center');
}
defineExpose({ openModal });
</script>

<style lang="scss" scoped>
.modal {
	position: relative;
	width: 686rpx;
	border-radius: 22rpx;
	border: 4rpx solid #000000;
	padding: 0 52rpx 52rpx;
}
.modal-title {
	font-size: 36rpx;
	font-weight: 600;
	line-height: 50rpx;
	margin: 36rpx;
}
.modal-btn {
	display: flex;
	justify-content: center;
	border-radius: 200rpx;
	border: 4rpx solid #2c2c2c;
	overflow: hidden;
}
.modal-btn__list {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 228rpx;
	height: 88rpx;
	background: #f4f4f6;
	color: #535354;
}
.modal-btn__list--border {
	border-right: 4rpx solid #2c2c2c;
}
</style>
