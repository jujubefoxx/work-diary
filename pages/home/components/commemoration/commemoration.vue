<template>
	<view class="commemoration home-item">
		<view class="home-item__header">
			<h4 class="home-item__title">激动时刻</h4>
			<view class="home-item__btn light-shadow" v-if="commemorationList.length < 5" @click="openModal()">新增</view>
		</view>
		<view class="commemoration-item">
			<!-- 发工资日，需和填写资料配合，不可修改 -->
			<view class="commemoration-list" v-if="payoffTime && payoffTime > 0" :style="'background-image: url(' + imgUrl.moneyCat + ')'">
				<view class="commemoration-list__date">
					<text>{{ isToday([payoffTime], 1) ? `${getRepeatDay([payoffTime], 1)}天` : getRepeatDay([payoffTime], 1) }}</text>
					<text v-if="!isToday([payoffTime], 1)" class="f-12 f-w-400">天</text>
				</view>
				<view class="f-16">{{ isToday([payoffTime], 1) ? '就是发工资日' : '离发工资日还有' }}</view>
				<view class="commemoration-list__remark">开开心心收米米</view>
			</view>
			<!-- 可自定的日期 -->
			<view
				v-for="(item, index) in commemorationList"
				@click="openModal(true, index)"
				class="commemoration-list"
				:style="'background-image: url(' + (item.alias ? imgUrl.foodCat : imgUrl.loveCat) + ')'"
			>
				<view class="commemoration-list__date">
					<text>{{ isToday(item.date, item.type) ? '今天' : Math.abs(getRepeatDay(item.date, item.type)) }}</text>
					<text v-if="!isToday(item.date, item.type)" class="f-12 f-w-400">天</text>
				</view>
				<view v-if="getRepeatDay(item.date, item.type) >= 0" class="f-16">{{ isToday(item.date, item.type) ? `就是${item.title}` : `离${item.title}还有` }}</view>
				<view v-else class="f-16">{{ item.title }}已经过去了</view>
				<view class="commemoration-list__remark">{{ item.remark }}</view>
			</view>
		</view>
		<modal ref="modalChild" @comfirmModal="comfirmModal" :title="isEdit ? '修改激动时刻' : '新增激动时刻'">
			<text class="modal-delete black-border light-shadow" v-if="!formData.alias && isEdit" @click="handleDelete"><text class="iconfont icon-shanchu"></text></text>
			<view class="form">
				<view class="form-list">
					<text class="form-list__title">给日子起个名吧</text>
					<view class="form-list__content"><input class="form-list__input light-shadow" v-model="formData.title" maxlength="4" placeholder="不超过四个字" /></view>
				</view>
				<view class="form-list">
					<text class="form-list__title">重复类型</text>
					<view class="form-list__content" :class="{ 'form-list__content--disable': formData.alias }">
						<input class="form-list__input light-shadow" disabled v-model="activeType.title" placeholder="请选择重复类型" @click="openPicker('type')" />
						<!-- <view class="form-list__input light-shadow">{{ formData.type ? activeType.title : '请选择重复类型' }}</view> -->
					</view>
				</view>
				<view class="form-list" v-if="activeType.title">
					<text class="form-list__title">{{ activeType.title }}</text>
					<view class="form-list__content">
						<input class="form-list__input light-shadow" disabled v-model="filterDateText" placeholder="请选择时间" @click="openPicker('date')" />
					</view>
				</view>
				<view class="form-list">
					<text class="form-list__title">备注</text>
					<view class="form-list__content"><input class="form-list__input light-shadow" v-model="formData.remark" maxlength="7" placeholder="不超过七个字" /></view>
				</view>
			</view>
			<view class="modal-tips">
				<h4>{{ modalTips.title }}</h4>
				<p><view v-for="item in modalTips.content" v-html="item"></view></p>
			</view>
		</modal>
	</view>
	<checkbox-item ref="checkbox" :columnList="weekArr" @comfirm="checkboxComfirm"></checkbox-item>
	<date-time-picker ref="picker" :showYears="showYears" :showMonths="showMonths" :mode="pickerMode" :columnList="columnList" @comfirm="pickerComfirm"></date-time-picker>
	<modal ref="attention" title="注意" @comfirmModal="deleteComfirm">
		<p class="t-c">
			要删除该激动时刻吗
			<br />
			删了就不能恢复了哦
		</p>
	</modal>
</template>
<script>
export default {
	name: 'commemoration'
};
</script>
<script setup>
import { computed, ref, watch } from 'vue';
import { dateState, getNowDate, getRepeatDay } from '@/common/util.js';
import { useStore } from 'vuex';
const weekArr = [
	{ title: '周一', id: 1 },
	{ title: '周二', id: 2 },
	{ title: '周三', id: 3 },
	{ title: '周四', id: 4 },
	{ title: '周五', id: 5 },
	{ title: '周六', id: 6 },
	{ title: '周日', id: 0 }
];
const store = useStore();
const modalChild = ref(null);
const picker = ref(null);
const checkbox = ref(null);
const attention = ref(null);
// 发工资时间
const payoffTime = computed(() => store.getters.payoffTime);
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;

// 判断是否今天
function isToday(day, type) {
	return getRepeatDay(day, type) === 0;
}

/**
 *  纪念日列表 数组对象
 *  alias 只有休息日有 不可删除只能修改
 *  date 日期数据
 *  type 重复类型：1 月重复 2 年重复 3 周重复 4 不重复
 */
let commemorationList = ref([{ alias: 'holiday', type: 3, date: [0, 6], title: '休息日', remark: '谁请我吃肯德基' }]);
// 获取保存的数据
if (uni.getStorageSync('commemoration')) {
	commemorationList.value = uni.getStorageSync('commemoration');
} else {
	uni.setStorageSync('commemoration', commemorationList.value);
}
// 如果是休息日 变更打工状态
function checkHoliday() {
	const holidayData = commemorationList.value.find(item => item.alias === 'holiday');
	if (isToday(holidayData.date, holidayData.type)) {
		// 变更状态
		store.commit('changeHoliday', true);
	} else {
		// 变更状态
		store.commit('changeHoliday', false);
	}
}

checkHoliday();
const modalTips = {
	title: '温馨提示',
	content: ['1.发工资日只能在填写/修改薪资资料中新增或修改<br>', '2.休息日目前限制为只能每周重复且不能删除，但可以改成你喜欢的名字哦<br>', '3.最多添加4个自定义的激动时刻']
};

// type 重复类型：1 月重复 2 年重复 3 周重复 4 不重复
const typeList = [
	{
		id: 1,
		title: '每月'
	},
	{
		id: 2,
		title: '每年'
	},
	{
		id: 3,
		title: '每周'
	},
	{
		id: 4,
		title: '不重复'
	}
];
// 资料信息
const formData = ref({});

// 是否编辑状态
let isEdit = ref(false);
// 编辑状态的表单下标
let activeIndex = 0;
// 打开填写资料弹窗
function openModal(isEditValue = false, index) {
	isEdit.value = isEditValue;
	if (isEdit.value) {
		activeIndex = index;
		formData.value = commemorationList.value[index];
	} else {
		formData.value = {
			// 日期名称
			title: '',
			// 重复类型
			type: '',
			// 日期
			date: [],
			// 备注
			remark: ''
		};
	}
	modalChild.value.openModal();
}
// 关闭填写资料弹窗
function closeModal() {
	modalChild.value.closeModal();
}
// 当前日期
const activeType = computed(() => {
	return typeList.find(item => item.id === formData.value.type) || { title: '', id: 1 };
});

// 当前使用选择器的表单
let activeName = '';
// 选择器值
let pickerValue = ref([]);
// 选择器模式
let pickerMode = ref('');
// 选择器开关
let showYears = ref(true);
let showMonths = ref(true);
// 重复类型选择列表
const columnList = [typeList.map(i => i.title)];
// 打开重复类型选择器
function openPicker(string) {
	activeName = string;
	if (string === 'type') {
		// 休息日不允许修改类型
		if (formData.value.alias) return;
		pickerValue.value = [activeType.value.id - 1];
		pickerMode.value = 'other';
	} else if (string === 'date') {
		// 周重复
		if (activeType.value.id === 3) {
			checkbox.value.open(formData.value.date);
			return;
		} else {
			pickerMode.value = 'date';
			const { year, month, day } = getNowDate();
			const { date } = formData.value;
			// 月重复
			if (activeType.value.id === 1) {
				const [index1] = date.length === 0 ? [day] : date;
				pickerValue.value = [index1 - 1];
				showMonths.value = false;
				showYears.value = false;
			}
			// 年重复
			if (activeType.value.id === 2) {
				const [index1, index2] = date.length === 0 ? [month, day] : date;
				pickerValue.value = [index1 - 1, index2 - 1];
				showMonths.value = true;
				showYears.value = false;
			}
			// 不重复
			if (activeType.value.id === 4) {
				const [index1, index2, index3] = date.length === 0 ? [year, month, day] : date;
				pickerValue.value = [index1 - 1990, index2 - 1, index3 - 1];
				showMonths.value = true;
				showYears.value = true;
			}
		}
	}
	picker.value.open(pickerValue.value);
}

// 选择器确认
function pickerComfirm(data) {
	if (activeName === 'type') {
		formData.value.type = typeList.find(item => item.title === data[0]).id;
		formData.value.date = [];
	} else if (activeName === 'date') {
		formData.value.date = data;
	}

	picker.value.close();
}

function checkboxComfirm(data) {
	formData.value.date = data;
	checkbox.value.close();
}

// 文字转换
const filterDateText = computed(() => {
	const { date } = formData.value;
	if (activeType.value.id === 1) {
		return date.length > 0 ? `${date[0]}日` : '';
	}
	if (activeType.value.id === 2) {
		return date.length > 0 ? `${date[0]}月${date[1]}日` : '';
	}
	if (activeType.value.id === 3) {
		let arr = [];
		date.forEach(i => {
			arr.push(weekArr.find(item => item.id === i).title);
		});
		// 把星期日排到最后
		if (date.includes(0)) {
			// 删除第一个元素
			arr.shift();
			arr.push(weekArr.find(item => item.id === 0).title);
		}
		return arr.join(',');
	}
	if (activeType.value.id === 4) {
		return date.length > 0 ? `${date[0]}年${date[1]}月${date[2]}日` : '';
	}
	return '';
});

// 提交表单
function comfirmModal() {
	const { title } = formData.value;
	// 名称未填
	if (!title) {
		uni.showToast({
			title: '不能没有名字！',
			icon: 'none'
		});
		return;
	}
	if (isEdit.value) {
		// 编辑
		commemorationList.value[activeIndex] = formData.value;
	} else {
		// 新建
		commemorationList.value.push(formData.value);
	}
	uni.showToast({
		title: isEdit.value ? '修改这个激动时刻成功啦~' : '新增了一个激动时刻！',
		icon: 'none'
	});
	uni.setStorageSync('commemoration', commemorationList.value);
	closeModal();
}
// 删除确认
function handleDelete() {
	attention.value.openModal();
}
// 删除
function deleteComfirm() {
	const { title } = commemorationList.value[activeIndex];
	commemorationList.value.splice(activeIndex, 1);
	uni.setStorageSync('commemoration', commemorationList.value);

	uni.showToast({
		title: '再见！' + title,
		icon: 'none'
	});
	attention.value.closeModal();
	closeModal();
}
</script>

<style lang="scss" scoped>
.commemoration-item {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
}
.commemoration-list {
	width: 302rpx;
	height: 244rpx;
	border-radius: 12rpx;
	border: 4rpx solid #2c2c2c;
	background-size: 126rpx 148rpx;
	background-position: 100% 110%;
	background-repeat: no-repeat;
	padding: 28rpx 22rpx;
	color: #2c2c2c;
	line-height: 44rpx;
	margin-top: 16rpx;
}
.commemoration-list__date {
	font-size: 60rpx;
	font-weight: bold;
	color: #000000;
	height: 70rpx;
	line-height: 70rpx;
}
.commemoration-list__remark {
	font-size: 24rpx;
	line-height: 34rpx;
}
</style>
