<template>
	<view class="happy-button black-shadow">
		<view class="happy-button__list" @click="$emit('handleClick', item.id)" :class="{ 'active-btn': activeId.includes(Number(item.id)) }" v-for="(item, index) in buttonList">
			{{ item.title }}
		</view>
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
	buttonList: {
		type: Array,
		default: () => [{ alias: '', title: '按钮名称', id: 0 }, { alias: '', title: '按钮名称', id: 1 }]
	},
	activeId: {
		type: Array,
		default: () => [0]
	},
	message: Number
});
const { buttonList, activeId } = toRefs(props);
</script>

<style lang="scss" scoped>
view {
	width: fit-content;
}
.happy-button {
	display: flex;
	border-radius: 4rpx;
	overflow: hidden;
}
.happy-button__list {
	padding: 0 16rpx;
	height: 50rpx;
	line-height: 50rpx;
	background: #f4f4f6;
	font-size: 24rpx;
	font-weight: 400;
	color: #535354;
}
</style>
