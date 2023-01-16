<template>
	<view class="daily-attendance home-item">
		<view class="home-item__header">
			<h4 class="home-item__title">今日打卡</h4>
			<view class="home-item__btn light-shadow" v-if="dailyList.length < 8" @click="openModal()">新增</view>
		</view>
		<view class="daily-item">
			<view
				class="daily-list"
				:class="{ 'animated flip': item.hasPunch }"
				@touchstart="touchS(index, $event)"
				@touchmove="touchM(index, $event)"
				@touchend="touchE(index, $event)"
				@click="punchCard(index)"
				v-for="(item, index) in dailyList"
			>
				<view class="daily-list__mask" v-show="item.hasPunch || deleteIndex === index"></view>
				<text class="check-icon iconfont icon-dui light-shadow" :style="item.hasPunch && deleteIndex !== index ? 'display:flex' : 'display:none'"></text>
				<view class="delete-item" @click="handleDelete(index)" :style="`transform:translateX(${Number(deleteIndex) === index ? 56 - touchWidth * 2 : 56}rpx)`">
					<text class="iconfont icon-shanchu"></text>
				</view>
				<view class="daily-list__icon iconfont" :class="`icon-${item.icon || 'daka'}`"></view>
				<view class="daily-list__content">
					<view class="daily-list__title">
						{{ item.title }}
						<text class="iconfont icon-card"></text>
					</view>
					<view class="daily-list__remark">{{ item.remark }}</view>
				</view>
			</view>
		</view>
		<modal ref="modalChild" :showAnimation="false" @comfirmModal="comfirmModal" title="新增打卡">
			<view class="form">
				<view class="form-list">
					<text class="form-list__title">给打卡起个名吧</text>
					<view class="form-list__content"><input class="form-list__input light-shadow" v-model="formData.title" maxlength="4" placeholder="不超过四个字" /></view>
				</view>
				<view class="form-list">
					<text class="form-list__title">备注</text>
					<view class="form-list__content"><input class="form-list__input light-shadow" v-model="formData.remark" maxlength="7" placeholder="不超过七个字" /></view>
				</view>
			</view>
			<view class="modal-tips">
				<h4>{{ modalTips.title }}</h4>
				<p>
					<view v-for="(item, index) in modalTips.content">
						<text>{{ index + 1 }}.</text>
						{{ item }}
					</view>
				</p>
			</view>
		</modal>
	</view>
	<modal ref="attention" title="注意" @comfirmModal="attentionComfirm"><p class="t-c" v-html="modalContent"></p></modal>
</template>
<script>
export default {
	name: 'daily-attendance'
};
</script>
<script setup>
import { computed, ref, watch } from 'vue';
import { dateState, getNowDate, getRepeatDay } from '@/common/util.js';
import { useStore } from 'vuex';
const store = useStore();
const modalChild = ref(null);
const attention = ref(null);
const checkbox = ref(null);
const deleteIndex = ref(-1);
const modalContent = ref('');

const dailyList = computed(() => store.state.dailyList);
const defaultDailyList = [
	{ title: '我摸鱼了', remark: '摸鱼咋还扎手', hasPunch: false, icon: 'fish' },
	{ title: '我发呆了', remark: '地球是我的了', hasPunch: false, icon: 'emm' },
	{ title: '我拉屎了', remark: '拉屎还通畅吗', hasPunch: false, icon: 'shit' },
	{ title: '我学习了', remark: '畅游知识海洋', hasPunch: false, icon: 'pen' }
];
// 获取保存的数据
if (!dailyList.value || dailyList.value.length < 4) {
	store.commit('setArrList', { data: defaultDailyList, type: '' });
}
const modalTips = {
	title: '温馨提示',
	content: ['新增的打卡只能右滑删除，不能修改', '每日已打卡的数据会在次日0点重置未未打卡', '最多添加4个自定义的打卡', '默认的四个打卡无法删除或修改哦']
};

// 资料信息
const formData = ref({});

// 打开填写资料弹窗
function openModal(isEditValue = false, index) {
	formData.value = {
		// 名称
		title: '',
		// 备注
		remark: ''
	};
	modalChild.value.openModal();
}
// 关闭填写资料弹窗
function closeModal() {
	modalChild.value.closeModal();
}

// 提交表单
function comfirmModal() {
	// 名称未填
	if (!formData.value.title) {
		uni.showToast({
			title: '不能没有名字！',
			icon: 'none'
		});
		return;
	}
	// 新建
	store.commit('setArrList', { data: { ...formData.value, hasPunch: false }, type: 'push' });
	uni.showToast({
		title: '成功新增了一个打卡耶，加油加油！',
		icon: 'none'
	});
	closeModal();
}
// 滑动距离
const touchWidth = ref(0);

// 防抖
let touchStart = { height: 0, width: 0 };
let touchHeight = 0;
// 临时
let temWidth = 0;
let hasMove = false;
let attentionType = '';
let attentionIndex = -1;

// 打卡
function punchCard(index) {
	if (deleteIndex.value === index) return;
	if (dailyList.value[index].hasPunch) {
		modalContent.value = '确定反悔今天的打卡吗<br />当日打卡数据会在次日重置';
		attentionType = 'cancel';
		attentionIndex = index;
		attention.value.openModal();
	} else {
		const newData = { ...dailyList.value[index], hasPunch: true };
		store.commit('setArrList', { data: newData, index, type: 'edit' });
		uni.showToast({
			title: '哦耶！' + dailyList.value[index].title + '！',
			icon: 'none'
		});
	}
	// 复位
	deleteIndex.value = -1;
	hasMove = false;
}

// 删除确认
function handleDelete(index) {
	modalContent.value = '确定把' + dailyList.value[index].title + '丢进垃圾桶吗';
	attentionType = 'delete';
	attentionIndex = index;
	attention.value.openModal();
}
// 注意确认
function attentionComfirm() {
	const { title } = dailyList.value[attentionIndex];
	if (attentionType === 'cancel') {
		const newData = { ...dailyList.value[attentionIndex], hasPunch: false };
		store.commit('setArrList', { data: newData, index: attentionIndex, type: 'edit' });
	} else if (attentionType === 'delete') {
		store.commit('setArrList', { data: attentionIndex, type: 'splice' });
	}
	uni.showToast({
		title: attentionType === 'cancel' ? '原来没完成T^T' : '再见！' + title,
		icon: 'none'
	});
	// 复位
	deleteIndex.value = -1;
	attention.value.closeModal();
}

/**
 * 触摸开始
 */
function touchS(index, e) {
	touchStart.width = e.touches[0].clientX;
	touchStart.height = e.touches[0].clientY;
}
/**
 * 触摸移动
 */
function touchM(index, e) {
	// 无法删除前四个
	if (index < 4) return;
	if (e.touches[0].clientX) hasMove = true;
	if (deleteIndex.value !== index) {
		touchWidth.value = 0;
		temWidth = 0;
		touchHeight = 0;
	}
	temWidth = touchStart.width - e.touches[0].clientX;
	touchHeight = touchStart.height - e.touches[0].clientY;
	if (temWidth >= 15 && touchHeight < 2) {
		deleteIndex.value = index;
		touchWidth.value = temWidth > 28 ? 28 : temWidth;
	}
}
/**
 * 触摸结束
 */
function touchE(index, e) {
	if (!hasMove) return;
	// 复位
	// 避免上下滑动导致滑动
	if (temWidth < 24 || Math.abs(touchHeight) > 10) {
		deleteIndex.value = -1;
	} else {
		deleteIndex.value = index;
		touchWidth.value = 28;
	}
	hasMove = false;
}
</script>

<style lang="scss" scoped>
.daily-item {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
}
.daily-list {
	display: flex;
	position: relative;
	align-items: center;
	margin-top: 16rpx;
	font-size: 28rpx;
	color: #2c2c2c;
	line-height: 40rpx;
	width: 302rpx;
	height: 114rpx;
	background: #f6f1dc;
	border-radius: 12rpx;
	border: 4rpx solid #2c2c2c;
	padding: 20rpx;
	overflow: hidden;
}
.daily-list__mask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #000000;
	opacity: 0.4;
	transition: all 0.3s;
}
.check-icon {
	right: 14rpx;
	top: auto;
	bottom: 12rpx;
	transform: translateY(0);
}

.daily-list__title {
	font-weight: 600;
	.iconfont {
		font-weight: 400;
	}
}
.daily-list__remark {
	font-size: 24rpx;
	font-weight: 400;
	color: #a5a296;
	line-height: 34rpx;
}
.daily-list__icon {
	width: 56rpx;
	font-size: 56rpx;
	margin-right: 14rpx;
}
.delete-item {
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	right: 0;
	top: 0;
	width: 56rpx;
	background: #ffce30;
	border-left: 4rpx solid #2c2c2c;
	transition: all 0.3s;
}
</style>
