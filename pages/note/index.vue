<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="note" :id="$store.state.theme">
		<notebook>
			<image v-if="noteList <= 0" class="note-nodata" :src="imgUrl.noteCat"></image>
			<view v-else class="note-content" :class="{ 'note-content--nopd': noteList.length < 10 }">
				<view class="note-content__column" v-for="(column, index) in renderList.columnList">
					<view class="note-list" @click="openModal(false, true, item.index)" v-for="(item, key) in column" :class="{ 'note-list--complete': item.isComplete }">
						<view class="note-list__text">{{ item.content }}</view>
						<view class="note-list__date">{{ item.date }}</view>
						<view class="note-list__btn">
							<view class="note-list__btn-list light-shadow" @click.stop="handleDelete(item.index)"><text class=" iconfont icon-shanchu"></text></view>
							<view class="note-list__btn-list light-shadow" v-if="!item.isComplete" @click.stop="openModal(true, false, item.index)">
								<text class=" iconfont icon-xiugai"></text>
							</view>
							<view class="note-list__btn-list light-shadow" :class="{ 'active-btn check-icon--animate': item.isComplete }" @click.stop="handleComplete(item.index)">
								<text class=" iconfont icon-dui"></text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="note-bottom"><button class="bottom-btn light-shadow black-border" v-if="noteList.length < 10" @click="openModal(false, false)">新建</button></view>
		</notebook>
		<modal ref="modalChild" :title="modalTitle" @comfirmModal="modalComfirm" :showAnimation="isCheck" :showBtn="!isCheck">
			<textarea :disabled="isCheck" class="modal-content black-border light-shadow" placeholder="请输入内容" v-model="formData.content" maxlength="70"></textarea>
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
		<modal ref="attention" title="注意" @comfirmModal="attentionComfirm"><p class="t-c" v-html="modalContent"></p></modal>
	</view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { dateState, getNowDate } from '@/common/util.js';
import { useStore } from 'vuex';
import { useShare } from '@/common/useShare.js';
const { onShareAppMessage, onShareTimeline } = useShare();
onShareAppMessage();
onShareTimeline();
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
const store = useStore();
const modalChild = ref(null);
const attention = ref(null);
const checkbox = ref(null);
const deleteIndex = ref(-1);
const modalContent = ref('');
const modalTips = {
	title: '温馨提示',
	content: ['已完成的事情会在次日零点自动删除，也可自行手动删除', '最多添加10件事情，事情堆的太多是不好的习惯哦']
};
/**
 *  笔记列表 数组对象
 *  content 内容
 *  date 创建/修改日期
 *  isComplete 是否完成
 *  index 下标
 */
const noteList = computed(() => store.state.noteList.map((i, index) => ({ ...i, index })));
// 渲染排序
const renderList = computed(() => {
	const arr = noteList.value;
	// 按时间排序 降序
	arr.sort((a, b) => b.date.localeCompare(a.date));
	const leftList = [],
		rightList = [];

	// 根据行数渲染瀑布流
	let leftColumn = 0;
	let rightColumn = 0;
	function getColumn(item) {
		const str = item.content;
		let len = 0;
		// 正则表达式，判断是否为汉字
		const re = /[\u4e00-\u9fa5]/;
		for (let i = 0; i < str.length; i++) {
			if (re.test(str.charAt(i))) {
				len++;
			}
		}
		return Math.ceil((len + str.length) / 16) + 3;
	}
	// 分割成左右两侧的数据
	arr.forEach((item, index) => {
		if (leftColumn <= rightColumn) {
			leftList.push(item);
			leftColumn = leftColumn + getColumn(item);
		} else {
			rightList.push(item);
			rightColumn = rightColumn + getColumn(item);
		}
	});
	return { columnList: [[...leftList], [...rightList]] };
});

// 是否编辑
let isEdit = ref(false);
// 是否查看
let isCheck = ref(false);
// 是否编辑
let modalTitle = ref('');
// 表单数据
let formData = ref({});
function openModal(edit = false, check = false, index) {
	isEdit.value = edit;
	isCheck.value = check;
	if (check) {
		modalTitle.value = '查看内容';
		formData.value = { ...noteList.value[index] };
	} else if (edit) {
		modalTitle.value = '编辑';
		activeIndex = index;
		formData.value = { ...noteList.value[index] };
	} else {
		modalTitle.value = '新建';
		formData.value = { content: '', date: '', isComplete: false, index: undefined };
	}
	modalChild.value.openModal();
}
// 提交表单
function modalComfirm() {
	// 名称未填
	if (!formData.value.content) {
		uni.showToast({
			title: '内容不能为空哇！',
			icon: 'none'
		});
		return;
	}
	const { length } = noteList.value;
	const { year, month, day } = getNowDate();
	formData.value.date = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
	if (isEdit.value) {
		store.commit('setArrList', { arr: 'noteList', data: formData.value, index: formData.value.index, type: 'edit' });

		uni.showToast({
			title: '成功修改了这件事情，加油完成哦~',
			icon: 'none'
		});
	} else {
		// 新建
		store.commit('setArrList', { arr: 'noteList', data: formData.value, type: 'push' });

		uni.showToast({
			title: '成功新增了一件事情，加油完成哦~',
			icon: 'none'
		});
	}
	modalChild.value.closeModal();
}

// 目标Index
let activeIndex = -1;
// 注意类型
let attentionType = '';
// 完成/取消完成
function handleComplete(index) {
	const { isComplete } = noteList.value[index];
	activeIndex = index;
	attentionType = 'complete';
	if (isComplete) {
		// 取消完成
		modalContent.value = '确定取消完成这件事的完成状态吗';
	} else {
		// 完成
		modalContent.value = '这件事已经完成了吗<br>已完成的事情会在次日自动清除哦~';
	}
	attention.value.openModal();
}
function handleDelete(index) {
	const { isComplete } = noteList.value[index];
	activeIndex = index;
	attentionType = 'delete';
	modalContent.value = '确定删除完成这件事吗<br>已完成的事情会在次日自动清除哦~';
	attention.value.openModal();
}
// 注意确认
function attentionComfirm() {
	const { isComplete } = noteList.value[activeIndex];

	if (attentionType === 'delete') {
		store.commit('setArrList', { arr: 'noteList', data: activeIndex, type: 'splice' });
		uni.showToast({
			title: '成功的把一件事丢进垃圾桶啦~',
			icon: 'none'
		});
	} else {
		const newObj = { ...noteList.value[activeIndex], isComplete: !isComplete };
		store.commit('setArrList', { arr: 'noteList', data: newObj, index: activeIndex, type: 'edit' });

		if (isComplete) {
			uni.showToast({
				title: '原来没完成TUT',
				icon: 'none'
			});
		} else {
			uni.showToast({
				title: '完成这件事啦，恭喜恭喜！',
				icon: 'none'
			});
		}
	}
	attention.value.closeModal();
}
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
.note-content {
	display: flex;
	justify-content: space-between;
	&--nopd {
		padding-bottom: 180rpx;
	}
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
	margin-bottom: 20rpx;
}
.note-list--complete {
	position: relative;
	// overflow: hidden;

	&::before {
		position: absolute;
		left: 0;
		top: 0;
		content: '';
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0.4;
	}
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
.modal-content {
	box-sizing: border-box;
	width: 100%;
	border-radius: 12rpx;
	background: #f4f4f6;
	height: 364rpx;
	padding: 28rpx;
	margin-bottom: 40rpx;
	font-size: 28rpx;
}
</style>
