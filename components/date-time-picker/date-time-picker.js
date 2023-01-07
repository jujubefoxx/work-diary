import {
	ref
} from 'vue'
// 选择器
// 按照惯例，组合式函数名以“use”开头
export function useDateTimePicker(name) {
	const dateTimePicker = ref(null);
	// 打开时间选择器
	function openTimePicker() {
		console.log(dateTimePicker)
		dateTimePicker.value.open();
	}
	return {
		openTimePicker
	}
}
