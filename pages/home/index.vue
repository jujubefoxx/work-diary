<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="home" :id="$store.state.theme">
		<home-header></home-header>
		<notebook>
			<money-item></money-item>
			<date-item></date-item>
			<commemoration></commemoration>
			<daily-attendance></daily-attendance>
		</notebook>
	</view>
</template>

<script setup>
import HomeHeader from './components/home-header/home-header.vue';
import MoneyItem from './components/money-item/money-item.vue';
import DateItem from './components/date-item/date-item.vue';
import Commemoration from './components/commemoration/commemoration.vue';
import DailyAttendance from './components/daily-attendance/daily-attendance.vue';
</script>

<style lang="scss" scoped></style>
