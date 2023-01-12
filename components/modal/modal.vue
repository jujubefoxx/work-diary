<template>
	<uni-popup ref="popup" :mask-click="false">
		<view class="modal theme-bg">
			<view class="modal-title t-c" v-if="showTitle">{{ title }}</view>
			<view class="modal-content"><slot></slot></view>
			<view class="flex flex-x-center" v-if="showBtn">
				<comfirm-button @handleCancel="closeModal" @handleComfirm="handleComfirm" :showCancel="showCancel" :showComfirm="showComfirm"></comfirm-button>
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
const emit = defineEmits(['comfirmModal']);
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
function closeModal() {
	popup.value.close();
}
function handleComfirm() {
	emit('comfirmModal');
}
defineExpose({ openModal, closeModal });
</script>

<style lang="scss" scoped>
.modal {
	position: relative;
	width: 686rpx;
	border-radius: 22rpx;
	border: 4rpx solid #000000;
	padding: 0 52rpx;
}
.modal-title {
	font-size: 36rpx;
	font-weight: 600;
	line-height: 50rpx;
	margin: 36rpx;
}
</style>
