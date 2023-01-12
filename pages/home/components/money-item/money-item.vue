<template>
	<view class="money-item">
		<!-- 左侧信息 -->
		<view class="money-item__left">
			<view class="money-item__title dashed line1">
				<template v-if="!$store.state.isHoliday">
					今天已赚
					<text class="money-item__num">{{ hasProfileData ? computedMoney : 0 }}</text>
					元
				</template>
				<template v-else>
					今天休息哦~
				</template>
			</view>
			<view class="money-item__btn"></view>
			<!-- 右侧按钮 -->
			<happy-button
				:active-id="activeId"
				:button-list="hasProfileData ? [buttonList.working, buttonList.resting] : [buttonList.noData]"
				@handleClick="handleClick"
			></happy-button>
		</view>
		<view class="money-item__right">
			<view class="money-item__right-list radius50 light-shadow" @click="openModal"><text class="iconfont icon-edit"></text></view>
			<view class="money-item__right-list radius50 light-shadow"><text class="iconfont icon-night"></text></view>
		</view>
	</view>
	<!-- 填写资料表格 -->
	<modal ref="modalChild" @comfirmModal="comfirmModal">
		<view class="form">
			<view class="form-list">
				<text class="form-list__title">上下班时间</text>
				<view class="form-list__content">
					<view class="form-list__range light-shadow" @click="openPicker('workingTime')">{{ filterTime(profileForm.workingTime) }}</view>
					<text style="margin: 0 14rpx;">~</text>
					<view class="form-list__range light-shadow" @click="openPicker('closingTime')">{{ filterTime(profileForm.closingTime) }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">午休时间</text>
				<view class="form-list__content">
					<view class="form-list__range light-shadow" @click="openPicker('breakStart')">{{ filterTime(profileForm.breakStart) }}</view>
					<text style="margin: 0 14rpx;">~</text>
					<view class="form-list__range light-shadow" @click="openPicker('breakEnd')">{{ filterTime(profileForm.breakEnd) }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">薪资类型</text>
				<view class="form-list__content">
					<view
						v-for="item in moneyTypeList"
						@click="handleChoose(item.id)"
						:class="{ 'active-btn': profileForm.moneyType === item.id }"
						class="form-list__group f-14 light-shadow"
					>
						{{ item.title }}
					</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">{{ activeType.string }}多少钱钱</text>
				<view class="form-list__content"><input type="digit" class="form-list__input light-shadow" v-model="profileForm.money" :maxlength="activeType.maxLength" /></view>
			</view>
			<view class="form-list" v-if="profileForm.moneyType === 1">
				<text class="form-list__title">月打工天数</text>
				<view class="form-list__content">
					<view class="form-list__input light-shadow" @click="openPicker('workDays', 'other')">{{ profileForm.workDays }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">每月多少号发工资</text>
				<view class="form-list__content">
					<view class="form-list__input light-shadow" @click="openPicker('payoffTime', 'other')">{{ profileForm.payoffTime }}</view>
				</view>
			</view>
		</view>
		<view class="modal-tips">
			<h4>{{ modalTips.title }}</h4>
			<p><text v-for="item in modalTips.content" v-html="item"></text></p>
		</view>
	</modal>
	<date-time-picker ref="picker" :mode="pickerMode" :columnList="columnList" @comfirm="pickerComfirm"></date-time-picker>
</template>
<script>
export default {
	name: 'money-item'
};
</script>
<script setup>
import { computed, ref, watch, isRef } from 'vue';
import { dateState, getNowDate } from '@/common/util.js';
import { useStore } from 'vuex';
const store = useStore();
// 是否填写信息
let hasProfileData = ref(false);
// 资料内容
const moneyProfile = ref({});
// 模态框
const modalChild = ref(null);
// 选择器
const picker = ref(null);
// 今日工作时长/秒
let realWorkTimes = 0;
// 定时器
let timer = null;
// 今日已赚
let computedMoney = ref(0);
// 获取资料
function getProfile() {
	const profile = uni.getStorageSync('profile');
	if (profile) {
		moneyProfile.value = profile;
		hasProfileData.value = true;
		timer = setInterval(() => {
			const date = new Date();
			// 当前时间
			const now = [date.getHours(), date.getMinutes(), date.getSeconds()];
			const { workingTime, closingTime } = moneyProfile.value;
			// 开始工作时长/秒
			const realWorkingTime = compareTime(workingTime, now, 's');
			// 开始工作
			const workingStart = realWorkingTime >= 0;
			// 结束工作
			const workingEnd = compareTime(closingTime, now) >= 0;
			// 上班中
			if (workingStart) {
				computedMoney.value = (secordMoney.value * realWorkingTime).toFixed(2);
			}
			// 下班了
			if (workingEnd) {
				clearInterval(timer);
			}
			console.log('定时器运作中');
		}, 1000);
	}
}
// 秒薪
const secordMoney = computed(() => {
	const type = Number(moneyProfile.value.moneyType);
	// 上班工时/分
	const workMinute = moneyProfile.value.workMinutes - moneyProfile.value.breakMinutes;
	// 日薪
	let dayMoney = type === 2 ? moneyProfile.value.money : 0;
	if (type === 1) {
		dayMoney = moneyProfile.value.money / moneyProfile.value.workDays;
	}
	// 时薪
	let hourMoney = type === 3 ? moneyProfile.value.money : dayMoney / (workMinute / 60);
	// 秒薪
	return hourMoney / 60 / 60;
});

getProfile();
// 按钮
const buttonList = {
	noData: {
		id: 0,
		title: '请填写资料'
	},
	working: {
		id: 1,
		title: '今天在打工'
	},
	resting: {
		id: 2,
		title: '今天没打工'
	}
};

// 黄色按钮的Id
let activeId = ref([0, 1]);

// 点击按钮事件
function handleClick(value) {
	const id = Number(value);
	if (id !== 0) {
		if (activeId.value.includes(id)) return;
		activeId.value = [0, id];
		// 变更状态
		store.commit('changeHoliday');
	} else {
		openModal();
	}
}

const modalTips = { title: '秒薪计算方法', content: ['1.秒薪=时薪/60/60', '2.时薪=日薪/日工作时长<br>', '3.日薪=月薪/月工作日'] };
const moneyTypeList = [
	{ id: 1, title: '月薪', string: '一个月', default: '8000', maxLength: 6 },
	{ id: 2, title: '日薪', string: '一天', default: '200', maxLength: 4 },
	{ id: 3, title: '时薪', string: '一小时', default: '30', maxLength: 3 }
];
// 资料表单
const profileForm = ref({
	// 上班时间
	workingTime: [9, 0],
	// 下班时间
	closingTime: [18, 0],
	// 上班工时（分）
	workMinutes: compareTime([9, 0], [18, 0]),
	// 午休开始时间
	breakStart: [12, 0],
	// 午休结束时间
	breakEnd: [14, 0],
	// 午休时间（分）
	breakMinutes: compareTime([12, 0], [14, 0]),
	// 薪资类型 1月薪  2日薪  3时薪
	moneyType: 1,
	// 薪资
	money: '8000',
	// 月工时
	workDays: 22,
	// 发薪时间
	payoffTime: 15
});

// 打开填写资料弹窗
function openModal() {
	if (hasProfileData.value) {
		moneyTypeList.find(item => item.id === moneyProfile.value.moneyType).default = moneyProfile.value.money;
		profileForm.value = moneyProfile.value;
	}
	modalChild.value.openModal();
}
// 关闭填写资料弹窗
function closeModal() {
	modalChild.value.closeModal();
}
// 转换时间数组格式
function filterTime(array) {
	const [hour, time] = array;
	return `${hour < 10 ? '0' + hour : hour}:${time < 10 ? '0' + time : time}`;
}
// 当前薪资类型
const activeType = computed(() => {
	const obj = moneyTypeList.find(item => item.id === profileForm.value.moneyType);
	profileForm.value.money = obj.default;
	return obj;
});
// 当前使用选择器的表单
let activeName = '';
// 选择器值
let pickerValue = ref([]);
// 选择器模式
let pickerMode = ref('');
// 自定义选择列表
let columnList = ref([]);
// 打开时间选择器
function openPicker(name, mode = 'time') {
	activeName = name;
	pickerValue = profileForm.value[name];
	pickerMode.value = mode;

	if (mode === 'other' && name === 'workDays') {
		columnList.value = [[]];
		for (let i = 1; i <= 31; i++) {
			columnList.value[0].push(i);
		}
		pickerValue = [profileForm.value[name] - 1];
	} else if (mode === 'other' && name === 'payoffTime') {
		columnList.value = [['不定时', '日结']];
		for (let i = 1; i <= 28; i++) {
			columnList.value[0].push(i);
		}
		columnList.value[0].push('每月最后一天');
		let index = 15;
		const value = profileForm.value[name];
		if (isNaN(value)) {
			if (value === '不定时') {
				index = 0;
			} else if (value === '日结') {
				index = 1;
			} else {
				index = 99;
			}
		} else {
			index = Number(value + 1);
		}
		pickerValue = [index];
	}

	picker.value.open(pickerValue);
}

// 计算时间差
function compareTime(st, et, mode = 'm') {
	// 开始时间 st 结束时间 et
	let s = st[0] * 60 + Number(st[1]);
	let e = et[0] * 60 + Number(et[1]);

	// 秒
	if (mode === 's') {
		// 开始时间 st 结束时间 et
		if (!st[2]) {
			st[2] = 0;
		}
		if (!et[2]) {
			st[2] = 0;
		}
		s = st[0] * 60 * 60 + st[1] * 60 + Number(st[2]);
		e = et[0] * 60 * 60 + et[1] * 60 + Number(et[2]);
	} else {
	}

	return e - s;
}
// 确认选择
function pickerComfirm(data, index) {
	// 时间范围判断
	const rangeTime = ['closingTime', 'workingTime', 'breakStart', 'breakEnd'];
	if (rangeTime.includes(activeName)) {
		// 开始时间
		let startTime = [];
		// 结束时间
		let endTime = [];
		// 分组
		const startArr = ['workingTime', 'breakStart'];
		const endArr = ['closingTime', 'breakEnd'];
		// 下标组
		const startIndex = startArr.indexOf(activeName);
		const endIndex = endArr.indexOf(activeName);
		if (startIndex !== -1) {
			// 开始时间
			startTime = data;
			// 结束时间
			endTime = profileForm.value[endArr[startIndex]];
		} else {
			// 开始时间
			startTime = profileForm.value[startArr[endIndex]];
			// 结束时间
			endTime = data;
		}
		const realMinutes = compareTime(startTime, endTime);
		// 时间范围判断
		if (realMinutes <= 0) {
			uni.showToast({
				title: ['closingTime', 'workingTime'].includes(activeName) ? '上班时间必须早于下班时间哦，目前还不支持夜班模式~' : '结束时间必须早于开始时间哦',
				icon: 'none'
			});
			return;
		}
		profileForm.value[activeName] = data;
	} else {
		profileForm.value[activeName] = data[0];
	}
	picker.value.close();
}
// 选择薪资类型
function handleChoose(id) {
	profileForm.value.moneyType = id;
}
// 提交表单
function comfirmModal() {
	const { workingTime, breakStart, breakMinutes, workMinutes, closingTime, breakEnd } = profileForm.value;
	// 异常处理
	if (compareTime(workingTime, breakStart) <= 0) {
		uni.showToast({
			title: '你咋先午休再上班？',
			icon: 'none'
		});
		return;
	}
	if (compareTime(breakEnd, closingTime) <= 0) {
		uni.showToast({
			title: '你咋下班了还没午休结束？',
			icon: 'none'
		});
		return;
	}
	// 午休时长大于工作时长
	if (breakMinutes >= workMinutes) {
		uni.showToast({
			title: '你不会上班的时候一直在午休吧',
			icon: 'none'
		});
		return;
	}
	// 保存资料信息
	uni.setStorageSync('profile', profileForm.value);
	getProfile();
	closeModal();
}
</script>

<style lang="scss" scoped>
.money-item {
	display: flex;
	justify-content: space-between;
}
.money-item__title {
	display: flex;
	align-items: flex-end;
	position: relative;
	width: fit-content;
	height: 84rpx;
	font-size: 32rpx;
	font-weight: 500;
	color: #2c2c2c;
	line-height: 44rpx;
	max-width: 460rpx;
	padding-bottom: 4rpx;
}
.money-item__num {
	font-size: 72rpx;
	font-weight: bold;
	color: #bf503c;
	line-height: 84rpx;
	margin: 0 4rpx;
}
.money-item__right {
	display: flex;
	align-items: center;

	.iconfont {
		font-size: 36rpx;
	}
}
.money-item__right-list {
	box-sizing: content-box;
	width: 78rpx;
	height: 78rpx;
	text-align: center;
	line-height: 78rpx;
	background: #ffffff;
	border: 4rpx solid #2c2c2c;
	margin-left: 26rpx;
}
</style>
