<template>
	<view class="money-item">
		<!-- 左侧信息 -->
		<view class="money-item__left">
			<view class="money-item__title dashed line1">
				<template v-if="!$store.state.isHoliday">
					今天已赚
					<text class="money-item__num">{{ hasProfileData ? 9999.99 : 0 }}</text>
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
	<modal ref="modalChild">
		<view class="form">
			<view class="form-list">
				<text class="form-list__title">上下班时间</text>
				<view class="form-list__content">
					<view class="form-list__range light-shadow">{{ profileForm.workingTime }}</view>
					<text style="margin: 0 14rpx;">~</text>
					<view class="form-list__range light-shadow">{{ profileForm.closingTime }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">午休时间</text>
				<view class="form-list__content">
					<view class="form-list__range light-shadow">{{ profileForm.breakStart }}</view>
					<text style="margin: 0 14rpx;">~</text>
					<view class="form-list__range light-shadow">{{ profileForm.breakEnd }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">薪资类型</text>
				<view class="form-list__content">
					<view v-for="item in moneyTypeList" :class="{ 'active-btn': profileForm.moneyType === Number(item.id) }" class="form-list__group f-14 light-shadow">
						{{ item.title }}
					</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">一个月多少钱钱</text>
				<view class="form-list__content"><input class="form-list__input light-shadow" v-model="profileForm.money" maxlength="6" /></view>
			</view>
			<view class="form-list">
				<text class="form-list__title">月打工天数</text>
				<view class="form-list__content">
					<view class="form-list__input light-shadow">{{ profileForm.workDays }}</view>
				</view>
			</view>
			<view class="form-list">
				<text class="form-list__title">每月多少号发工资</text>
				<view class="form-list__content">
					<view class="form-list__input light-shadow">{{ profileForm.payoffTime }}</view>
				</view>
			</view>
		</view>
	</modal>
	<date-time-picker></date-time-picker>
</template>
<script>
export default {
	name: 'money-item'
};
</script>
<script setup>
import { computed, ref } from 'vue';
import { dateState } from '@/common/util.js';
import { useStore } from 'vuex';
const store = useStore();
// 是否填写信息
let hasProfileData = ref(false);
// 资料内容
const moneyProfile = ref({});
// 模态框
const modalChild = ref(null);
// 获取资料
function getProfile() {
	const profile = uni.getStorageSync('moneyProfile');
	if (profile) {
		moneyProfile.value = profile;
		hasProfileData.value = true;
	}
}

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

// 打开填写资料弹窗
function openModal() {
	modalChild.value.openModal();
}

const moneyTypeList = [{ id: 1, title: '月薪' }, { id: 2, title: '日薪' }, { id: 3, title: '时薪' }];
// 资料表单
const profileForm = ref({
	// 上班时间
	workingTime: '9:00',
	// 下班时间
	closingTime: '18:00',
	// 上班工时时间戳
	workTimestamp: '',
	// 午休开始时间
	breakStart: '12:00',
	// 午休结束时间
	breakEnd: '14:00',
	// 午休时间时间戳
	breakTimestamp: '',
	// 薪资类型 1月薪  2日薪  3时薪
	moneyType: 1,
	// 薪资
	money: '8000',
	// 月工时
	workDays: '22',
	// 发薪时间 不定时==>none 日结==>day 其余为数字
	payoffTime: '15'
});
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
