<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="another" :id="$store.state.theme">
		<notebook>
			<view class="another-item">
				<button class="another-btn black-border light-shadow" v-for="(item, index) in btnList" @click="openModal(item)">{{ item.title }}</button>
				<button class="another-btn black-border light-shadow" open-type="contact">意见建议</button>
			</view>
		</notebook>
		<modal ref="modalChild" :title="modalInfo.title" :showBtn="false" cancelText="关闭">
			<scroll-view class="scroll-view" scroll-y>
				<template v-if="modalInfo.alias === 'letter'">
					<rich-text v-html="modalInfo.content"></rich-text>
				</template>
				<template v-if="modalInfo.alias === 'log'">
					<h4>当前版本：v{{ version }}</h4>
					<view class="version-info" v-for="(item, index) in modalInfo.content">
						<view class="version-info__num">
							<text>v{{ item.version }}</text>
							<text>{{ item.date }}</text>
						</view>
						<view>{{ item.des }}</view>
					</view>
				</template>
			</scroll-view>
		</modal>
	</view>
</template>

<script setup>
import { computed, ref, watch, reactive } from 'vue';
import { version } from '@/package.json';
import { usePage } from '@/common/usePage.js';
const { onShareAppMessage, onShareTimeline, onReady } = usePage();
onShareAppMessage();
onShareTimeline();
onReady();
const modalChild = ref(null);
const modalInfo = reactive({
	title: '',
	content: '',
	alias: ''
});
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
const letter = `
    <p style="text-align:center"><img style="width:145Px" src="${imgUrl.sbCat}"></img></p>
    <p>感谢你能够看到这里！因为一时心血来潮想用Vue3写个小程序，就抓着UI两个人一起搞了个以日记/手账为风格主题的可可爱爱的小程序，快乐打工日记就这么诞生啦~
    <br>当然这里也要感谢灵感来源：摸鱼侠，还有我们都非常喜欢的Bearis表情包，打工猫猫就是从这个风格里诞生出来的~</p>
	<p style="margin-top:20Px">其中涉及到的算法都是作者用js自己想出来和纯手敲的，如果有需要提供算法的话可以联系作者，因为没有看过其他相关类型应用的代码（百度的不算)，所以可能并不是最好的写法，有需要改进的地方都可以点击下方意见建议提供哦
	<br>因为目前还在初步开发阶段，暂时还没有开放源码的打算，等完善后就会把源码地址整理好放出来啦，后续会根据用户量接入云开发，把小程序做的更好，希望大家多多支持！</p>
	<p style="margin-top:20Px">
	<h4>以下是计划开发的内容（画饼阶段）</h4>
	<ul>
	<li>驱赶烦恼小游戏：点击驱赶烦恼小猫咪，可以把烦恼小猫替换成自己讨厌的东西狂扁一顿（解压用）</li>
	<li>天气查询：根据用户所在位置自动获取今天的天气</li>
	<li>日历系统：可以点击日期查看以往的打卡/记事本已完成记录，需要接入云开发</li>
	<li>微信登陆：将个人数据绑定到微信号上，删除小程序/更换手机数据不再丢失啦，需要接入云开发</li>
	<li>扫雷游戏：可以和好友互相PK发起挑战</li>
	</ul>
	</p>`;

const logList = [
	{
		version: '1.0.0',
		date: '2023-1-16',
		des: '上线今天已赚、每日打卡、倒数日、记事本功能，已知部分安卓手机的图标大小会有偏移，后续进行优化。'
	},
	{
		version: '1.1.0',
		date: '2023-1-18',
		des:
			'上线换肤，打工人休息室：今天吃啥功能，新增当天是否在打工选项的记录，如果当天选择了休息，会在次日根据是否休息日重置打工状态，如果修改了休息日的时间也会根据休息日的状态进行调整；修复打卡记录次日不重置的问题。'
	},
	{
		version: '1.1.1',
		date: '2023-1-19',
		des: '新增一项打工人休息室，优化秒薪计算的算法，修复换肤弹窗标题显示错误的问题，提前祝大家新春快乐。'
	},
	{
		version: '1.1.2',
		date: '2023-1-30',
		des: '新年好，优化了换肤主题色的表现。'
	},
	{
		version: '1.1.3',
		date: '2023-2-23',
		des: '新增默认四项打卡的次数的统计，自更新日开始计算。'
	},
	{
		version: '1.1.4',
		date: '2023-3-1',
		des: '修复薪资计算的问题。'
	}
];
const btnList = [{ alias: 'letter', title: '作者的信', content: letter }, { alias: 'log', title: '开发日志', content: logList }];

function openModal(item) {
	modalInfo.title = item.title;
	modalInfo.alias = item.alias;
	modalInfo.content = item.content;
	modalChild.value.openModal();
}
</script>

<style lang="scss" scoped>
.modal-img {
	display: flex;
	justify-content: center;
	margin-bottom: 20rpx;
	image {
		width: 290rpx;
		height: 262rpx;
	}
}
.another {
	padding-top: 112rpx;
}
.another-btn {
	height: 134rpx;
	line-height: 134rpx;
	background: #ffffff;
	font-size: 32rpx;
	border-radius: 24rpx;
	font-weight: 600;
	margin-top: 24rpx;
}
.version-info {
	margin-top: 20rpx;
}
.version-info__num {
	text {
		margin-right: 20rpx;
	}
}
</style>
