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
	<modal ref="modalChild"></modal>
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
let hasProfileData = ref(true);
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
	}
}
// 打开填写资料弹窗
function openModal() {
	modalChild.value.openModal();
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
	max-width: 450rpx;
	padding-bottom: 4rpx;
}
.money-item__num {
	font-size: 72rpx;
	font-weight: bold;
	color: #bf503c;
	line-height: 84rpx;
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
