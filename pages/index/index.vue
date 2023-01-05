<template>
	<view class="home" :id="$store.state.theme">
		<view class="text-area">
			<text class="title">{{ title }}</text>
		</view>
	</view>
</template>

<script setup>
import { getCurrentInstance } from 'vue';
const title = '1';
</script>

<style></style>
