<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="note" :id="$store.state.theme">
		<notebook>
			<!-- <image class="note-nodata" :src="imgUrl.noteCat"></image> -->
			<view class="note-content">
				<view class="note-list">
					<view class="note-list__text">明天要去工地指着包工头的头说啥</view>
					<view class="note-list__date">2023-1-5</view>
					<view class="note-list__btn">
						<view class="note-list__btn-list light-shadow"><text class=" iconfont icon-shanchu"></text></view>
						<view class="note-list__btn-list light-shadow"><text class=" iconfont icon-xiugai"></text></view>
						<view class="note-list__btn-list light-shadow " :class="{ 'active-btn': true }"><text class=" iconfont icon-dui"></text></view>
					</view>
				</view>
			</view>
			<view class="note-bottom"><button class="note-btn light-shadow black-border">新建</button></view>
		</notebook>
	</view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { dateState, getNowDate } from '@/common/util.js';
import { useStore } from 'vuex';
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
const store = useStore();
const modalChild = ref(null);
const attention = ref(null);
const checkbox = ref(null);
const deleteIndex = ref(-1);

const noteList = computed(() => store.state.noteList);
function handleCreate() {}
</script>

<style lang="scss" scoped>
.note {
	padding-top: 112rpx;
}
.note-nodata {
	display: flex;
	width: 566rpx;
	height: 524rpx;
	justify-content: center;
	align-items: center;
	margin: 190rpx auto;
}
.note-bottom {
	position: fixed;
	text-align: center;
	width: 100%;
	padding: 0 32rpx;
	left: 0;
	bottom: 116rpx;
}
.note-btn {
	font-size: 28rpx;
	border-radius: 44rpx;
}
.note-list {
	position: relative;
	width: 330rpx;
	background: #ffffff;
	border-radius: 12rpx;
	padding: 28rpx 36rpx 86rpx;
	border: 4rpx solid #2c2c2c;
	font-size: 28rpx;
	color: #2c2c2c;
	line-height: 40rpx;
}
.note-list__date {
	font-size: 24rpx;
	color: #808080;
	line-height: 34rpx;
}
.note-list__btn {
	position: absolute;
	display: flex;
	right: 22rpx;
	bottom: 22rpx;
}
.note-list__btn-list {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 48rpx;
	height: 48rpx;
	border-radius: 50%;
	background: #ffffff;
	border: 4rpx solid #2c2c2c;
	margin-left: 26rpx;
	.iconfont {
		font-size: 24rpx;
		// transform: scale(0.9);
	}
	.icon-dui {
		transform: scale(0.8);
		transform-origin: 4rpx 30rpx;
	}
}
</style>
