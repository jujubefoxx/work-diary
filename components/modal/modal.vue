<template>
	<uni-popup ref="popup" :mask-click="false" :animation="showAnimation">
		<view class="modal theme-bg">
			<view class="modal-title t-c" v-if="showTitle">{{ title }}</view>
			<view class="modal-content"><slot></slot></view>
			<view class="flex flex-x-center" v-if="showBtn">
				<confirm-button
					@handleCancel="closeModal"
					:cancelText="cancelText"
					:confirmText="confirmText"
					@handleConfirm="handleConfirm"
					:showCancel="showCancel"
					:showconfirm="showconfirm"
				></confirm-button>
			</view>
			<view v-else><confirm-button @handleCancel="closeModal" :cancelText="cancelText" :showconfirm="false"></confirm-button></view>
		</view>
	</uni-popup>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
const store = useStore(key);
const popup: Ref = ref(null);
// 事件导出
const emit = defineEmits<{
	(e: 'confirmModal'): void;
	(e: 'handleCancel'): void;
}>();
// Props类型
interface Props {
	showTitle?: boolean;
	showCancel?: boolean;
	title?: string;
	cancelText?: string;
	confirmText?: string;
	showconfirm?: boolean;
	showBtn?: boolean;
	showAnimation?: boolean;
}
withDefaults(defineProps<Props>(), {
	showTitle: true,
	title: '填写资料',
	showCancel: true,
	cancelText: '取消',
	confirmText: '确定',
	showconfirm: true,
	showBtn: true,
	showAnimation: true
});
// 开关状态
const show: Ref = ref(false);

function openModal() {
	store.commit('changeMeta', true);
	show.value = true;
	popup.value.open('center');
}
function closeModal() {
	store.commit('changeMeta', false);
	show.value = false;
	popup.value.close();
	emit('handleCancel');
}
function handleConfirm() {
	emit('confirmModal');
}
defineExpose({ show, openModal, closeModal });
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
