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
<script>
export default {
	name: 'modal'
};
</script>
<script setup>
import { ref, toRefs, nextTick } from 'vue';
import { useStore } from 'vuex';
const store = useStore();
const popup = ref(null);
const emit = defineEmits(['confirmModal', 'handleCancel']);
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
	},
	showBtn: {
		type: Boolean,
		default: () => true
	},
	showAnimation: {
		type: Boolean,
		default: () => true
	}
});
const show = ref(false);
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
