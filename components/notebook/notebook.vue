<template>
	<view class="notebook">
		<!-- 顶部环扣 -->
		<view class="notebook-buckle">
			<view class="notebook-buckle__list" v-for="index in 7">
				<view class="notebook-buckle__top"></view>
				<view class="notebook-buckle__bottom"></view>
			</view>
		</view>
		<!-- 插槽 -->
		<slot></slot>
	</view>
</template>
<script>
export default {
	name: 'notebook'
};
</script>

<style lang="scss" scoped>
.notebook {
	padding: 74rpx 32rpx 20rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
	position: relative;
	background-color: #fff;
	width: 100%;
	border-radius: 48rpx 48rpx 0rpx 0rpx;
	margin-top: -52rpx;
	// 格子背景
	background-image: linear-gradient(90deg, rgba(60, 10, 30, 0.04) 3%, transparent 0), linear-gradient(1turn, rgba(60, 10, 30, 0.04) 3%, transparent 0);
	background-size: 40rpx 40rpx;
	background-repeat: repeat;
	min-height: calc(100vh - 112rpx);
}

.notebook-buckle {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	top: -28rpx;
	left: 0;
}
.notebook-buckle__list {
	display: flex;
	width: fit-content;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	margin: 0 24rpx;
}
.notebook-buckle__top {
	width: 20rpx;
	height: 64rpx;
	border-radius: 10rpx;
	z-index: 2;
}
.notebook-buckle__bottom {
	width: 36rpx;
	height: 36rpx;
	border-radius: 50%;
	margin-top: -22rpx;
}
</style>
