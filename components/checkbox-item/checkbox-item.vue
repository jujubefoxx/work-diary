<template>
	<view class="mask" v-show="show" @click="close"></view>
	<view class="checkbox-item picker-template" :class="{ 'picker-template--show': show }">
		<view
			class="checkbox-item__list"
			v-for="(item, index) in columnList"
			:key="index"
			@click="handleCheck(item.id)"
			:class="{ 'checkbox-item__list--checked': checkedValue.includes(item.id) }"
		>
			{{ item.title }}
			<text v-if="checkedValue.includes(item.id)" class="check-icon iconfont icon-dui light-shadow"></text>
		</view>
		<confirm-button @handleConfirm="handleConfirm" @handleCancel="close"></confirm-button>
	</view>
</template>
<script setup lang="ts">
import { ref, toRefs, Ref } from 'vue';
interface Props {
	columnList?: any[];
}
const props = withDefaults(defineProps<Props>(), {
	columnList: []
});
const { columnList } = toRefs(props);
const emit = defineEmits(['confirm']);
// 展示开关
const show: Ref<boolean> = ref(false);
// 选择的值
const checkedValue: Ref<number[]> = ref([]);

function handleCheck(id: number): void {
	if (checkedValue.value.includes(id)) {
		checkedValue.value.splice(checkedValue.value.indexOf(id), 1);
	} else {
		checkedValue.value.push(id);
	}
}
function handleConfirm(): void {
	emit('confirm', checkedValue.value.sort());
}
// 打开
function open(value: number[]): void {
	if (value) {
		checkedValue.value = value;
	}
	show.value = true;
}
// 关闭
function close(): void {
	show.value = false;
}
defineExpose({ open, close });
</script>

<style lang="scss" scoped>
.checkbox-item {
}
.checkbox-item__list {
	position: relative;
	font-size: 28rpx;
	color: #2c2c2c;
	text-align: center;
	line-height: 96rpx;
	border-bottom: 2rpx solid #d5d5d5;
}
.checkbox-item__list--checked {
	background: rgba(186, 186, 186, 0.2);
}
</style>
