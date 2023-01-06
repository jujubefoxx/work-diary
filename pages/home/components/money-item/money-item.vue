<template>
	<view class="money-item">
		<view class="money-item__title dashed">
			<template v-if="!$store.state.isHoliday">
				今天已经赚了
				<text class="money-item__num">{{ hasProfileData ? 111 : 0 }}</text>
				元
			</template>
			<template v-else>
				今天休息哦~
			</template>
		</view>
		<view class="money-item__btn">
			<happy-button
				:active-id="activeId"
				:button-list="hasProfileData ? [buttonList.working, buttonList.resting] : [buttonList.noData]"
				@handleClick="handleClick"
			></happy-button>
		</view>
	</view>
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
</script>

<style lang="scss" scoped>
.money-item {
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
	margin-bottom: 4rpx;
}
.money-item__num {
	font-size: 72rpx;
	font-weight: bold;
	color: #bf503c;
	line-height: 84rpx;
}
</style>
