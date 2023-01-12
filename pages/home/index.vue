<template>
	<view class="home" :id="$store.state.theme">
		<home-header></home-header>
		<notebook>
			<money-item></money-item>
			<date-item></date-item>
		</notebook>
	</view>
</template>

<script setup>
import HomeHeader from './components/home-header/home-header.vue';
import MoneyItem from './components/money-item/money-item.vue';
import DateItem from './components/date-item/date-item.vue';
</script>

<style lang="scss" scoped></style>
