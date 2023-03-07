<template>
	<view class="date-item">
		<!-- 左侧信息 -->
		<view class="date-item__left">
			<navigator url="/pages/note/index" class="note-btn light-shadow flex flex-y-center flex-x-center">
				<view class="note-btn__icon"><text class="iconfont icon-notebook"></text></view>
				打工人记事本
			</navigator>
		</view>
		<view class="date-item__right">
			<view class="date-item__date flex flex-x-center dashed">
				<text>{{ year }}年{{ month }}月{{ day }}日</text>
				<text v-show="weather" class="date-item__weather">{{ weather }}</text>
			</view>
			<happy-button :button-list="[{ title: weather ? '修改天气' : '新增天气', id: 0 }]" @handleClick="handleClick"></happy-button>
		</view>
	</view>
	<date-time-picker ref="picker" mode="other" :columnList="columnList" @confirm="pickerconfirm"></date-time-picker>
</template>
<script setup lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue';
import { useStore } from 'vuex';
import { key } from '@/store';
const store = useStore(key);
const picker: Ref<any> = ref(null);
const { year, month, day } = store.state.currentDayDate;
const weather: ComputedRef<string> = computed(() => store.state.currentDayDate.weather);
const columnList = [['出太阳', '大阴天', '下雨啦', '刮大风', '下雪咯', '不知道']];
// 点击选择天气
function handleClick() {
	picker.value.open();
}
function pickerconfirm(data: any) {
	const obj = store.state.currentDayDate;
	obj.weather = data[0];
	store.commit('setCurrentDayDate', obj);
	picker.value.close();
}
</script>

<style lang="scss" scoped>
.date-item {
	display: flex;
	justify-content: space-between;
	margin-top: 20rpx;
	margin-bottom: 40rpx;
}
.date-item__left {
	padding-top: 20rpx;
}
.date-item__right {
	flex-direction: column;
	display: flex;
	align-items: flex-end;
}
.date-item__date {
	width: 344rpx;
	height: 64rpx;
	border-radius: 4rpx;
	font-size: 30rpx;
	font-weight: 600;
	color: #ffffff;
	line-height: 64rpx;
	margin-bottom: 2rpx;
}
.date-item__weather {
	margin-left: 8rpx;
}
.happy-button {
	margin-right: 4rpx;
	margin-top: 4rpx;
}
.dashed::after {
	bottom: -4rpx;
}

.note-btn {
	width: 308rpx;
	height: 100rpx;
	background: #ffffff;
	border-radius: 24rpx;
	border: 4rpx solid #2c2c2c;
	font-size: 28rpx;
	font-weight: 600;
	color: #2c2c2c;
	line-height: 100rpx;

	.iconfont {
		position: relative;
		font-weight: 400;
		font-size: 52rpx;
		margin-right: 16rpx;
	}
}
.note-btn__icon {
	position: relative;
	&::before {
		position: absolute;
		content: '';
		width: 50rpx;
		height: 50rpx;
		top: 20rpx;
		left: -20rpx;
		border-radius: 50%;
	}
}
</style>
