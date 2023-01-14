<template>
	<view class="mask" v-show="show" @click="close"></view>
	<view class="date-time-picker picker-template" :class="{ 'picker-template--show': show }">
		<picker-view class="picker-view" :immediate-change="true" :value="pickerValue" @change="bindChange" indicator-class="picker-indicator">
			<template v-if="mode === 'time'">
				<picker-view-column>
					<view class="picker-view__item" v-for="(item, index) in hours" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
				<picker-view-column>
					<view class="picker-view__item" v-for="(item, index) in minutes" :key="index">{{ item < 10 ? '0' + item : item }}</view>
				</picker-view-column>
			</template>
			<template v-else-if="mode === 'date'">
				<picker-view-column v-if="showYears">
					<view class="picker-view__item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
				</picker-view-column>
				<picker-view-column v-if="showMonths">
					<view class="picker-view__item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
				</picker-view-column>
				<picker-view-column v-if="showDays">
					<view class="picker-view__item" v-for="(item, index) in days" :key="index">{{ item }}日</view>
				</picker-view-column>
			</template>
			<template v-else>
				<picker-view-column v-for="(column, key) in columnList">
					<view class="picker-view__item" v-for="(item, index) in column" :key="index">{{ item }}</view>
				</picker-view-column>
			</template>
		</picker-view>
		<comfirm-button @handleComfirm="handleComfirm" @handleCancel="close"></comfirm-button>
	</view>
</template>
<script>
export default {
	name: 'date-time-picker'
};
</script>
<script setup>
import { ref, toRefs, nextTick } from 'vue';
const props = defineProps({
	// 模式:time 时间选择器 date日期选择器 other其它 根据columnList生成
	mode: {
		type: String,
		default: () => 'time'
	},
	// 显示年份
	showYears: {
		type: Boolean,
		default: () => true
	},
	// 显示月份
	showMonths: {
		type: Boolean,
		default: () => true
	},
	// 显示日期
	showDays: {
		type: Boolean,
		default: () => true
	},
	// 初始位置
	value: {
		type: Array,
		default: () => []
	},
	// 自定义选择器
	columnList: {
		type: Array,
		default: () => []
	}
});
const { mode, value, showYears, showMonths, showDays, columnList } = toRefs(props);
const emit = defineEmits(['comfirm']);
// 展示开关
let show = ref(false);

// 时间选择器
const hours = [];
const minutes = [];
for (let i = 0; i <= 23; i++) {
	hours.push(i);
}
for (let i = 0; i <= 59; i++) {
	minutes.push(i);
}

// 年月日选择器
const date = new Date();
const years = [];
const year = date.getFullYear();
const months = [];
const month = date.getMonth() + 1;
let days = [];
const day = date.getDate();
const allDay = [];
// 所有日期
for (let i = 1990; i <= 2030; i++) {
	years.push(i);
}
for (let i = 1; i <= 12; i++) {
	months.push(i);
}
for (let i = 1; i <= 31; i++) {
	days.push(i);
	allDay.push(i);
}

// 选择的值
let pickerValue = ref([]);
if (value.value.length > 0) {
	pickerValue.value = value.value;
} else if (mode.value === 'date') {
	// 不传value时默认当前年月日
	pickerValue.value = [year - 1990, month - 1, day - 1];
} else {
	// 默认值
	pickerValue.value = [0];
}

function bindChange(e) {
	const val = e.detail.value;
	if (mode.value === 'date' && showMonths.value && showDays.value) {
		if ([4, 6, 9, 11].includes(months[val[1]])) {
			// 设置大小月
			days = allDay.slice(0, 30);
		} else if (months[val[1]] == 2) {
			//设置二月
			// 闰年
			days = allDay.slice(0, 29);
			if (showYears.value) {
				const year = years[val[0]];
				if (!((year % 4 == 0 && !(year % 100 == 0)) || year % 400 == 0)) {
					// 平年
					days = allDay.slice(0, 28);
				}
			}
		} else {
			days = allDay;
		}
	}
	pickerValue.value = val;
}
function handleComfirm() {
	// 传值
	let data = [];
	// 列表
	let list = [];
	if (mode.value === 'date') {
		list = [showYears.value ? years : [], showMonths.value ? months : [], showDays.value ? days : []].filter(item => item.length > 0);
	} else if (mode.value === 'time') {
		list = [hours, minutes];
	} else {
		list = columnList.value;
	}
	pickerValue.value.forEach((item, index) => {
		if (list[index]) {
			data.push(list[index][pickerValue.value[index]]);
		}
	});

	emit('comfirm', data, pickerValue.value);
}
// 打开
function open(value) {
	console.log(value);
	show.value = true;
	if (value.length > 0) {
		pickerValue.value = value;
	}
}
// 关闭
function close() {
	show.value = false;
}
defineExpose({ open, close });
</script>

<style lang="scss" scoped>
.date-time-picker {
	// padding-left: 42rpx;
	padding-top: 42rpx;
	// padding-right: 42rpx;
}
</style>
