<template>
	<view class="home" :id="$store.state.theme">
		<HomeHeader></HomeHeader>
	</view>
</template>

<script setup>
import HomeHeader from './components/HomeHeader/index.vue';
</script>

<style lang="scss" scoped></style>
