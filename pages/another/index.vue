<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="another" :id="$store.state.theme">
		<notebook>
			<view class="another-item">
				<button class="another-btn black-border light-shadow">作者的信</button>
				<button class="another-btn black-border light-shadow">开发日志</button>
				<button class="another-btn black-border light-shadow" open-type="contact">意见建议</button>
			</view>
		</notebook>
		<modal ref="modalChild" :title="modalTitle" @comfirmModal="modalComfirm" :showAnimation="isCheck" :showBtn="!isCheck">
			<textarea :disabled="isCheck" class="modal-content black-border light-shadow" placeholder="请输入内容" v-model="formData.content" maxlength="70"></textarea>
			<view class="modal-tips">
				<h4>{{ modalTips.title }}</h4>
				<p><view v-for="item in modalTips.content" v-html="item"></view></p>
			</view>
		</modal>
	</view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { dateState, getNowDate } from '@/common/util.js';
import { useStore } from 'vuex';
const store = useStore();
const modalChild = ref(null);
const attention = ref(null);
const checkbox = ref(null);
const deleteIndex = ref(-1);
const modalContent = ref('');
const modalTips = {
	title: '温馨提示',
	content: ['1.已完成的事情会在次日零点自动删除，也可自行手动删除<br>', '2.最多添加10件事情，事情堆的太多是不好的习惯哦']
};
const letter = `
    <p>感谢点开！因为一时心血来潮想用Vue3写个小程序，就抓着UI两个人一起搞了个以日记/手账为主题的可可爱的小程序，快乐打工日记就这么诞生啦~
    <br>当然这里也要感谢灵感来源：摸鱼侠，还有我们都非常喜欢的Bearis表情包，打工猫猫就是从这个风格里诞生出来的
	<br>其中涉及到的算法都是作者用js自己想出来和纯手敲的，如果有需要提供算法的话可以联系作者，因为没有看过其他相关类型应用的代码（百度的不算)，所以可能并不是最好的写法，有需要改进的地方都可以点击下方意见建议提供哦
	<br>因为目前还在初步开发阶段，暂时还没有开放源码的打算，等完善后就会把源码地址整理好放出来啦，后续会根据用户量接入云开发，把小程序做的更好，希望大家多多支持！</p>
	<p>
	<h4>以下是计划开发的内容（画饼阶段）</h4>
	<ul>
	<li>换肤：可以更换主题色（开发中）</li>
	<li>打工人休息室：提供一些娱乐活动（开发中）</li>
	<li>扫雷小游戏：就是扫雷（开发中）</li>
	<li>驱赶烦恼小游戏：点击驱赶烦恼小猫咪，可以把烦恼小猫替换成自己讨厌的东西狂扁一顿（解压用）</li>
	<li>打卡统计：统计打卡次数</li>
	<li>日历系统：可以点击日期查看以往的打卡/记事本已完成记录，需要接入云开发</li>
	<li>微信登陆：将个人数据绑定到微信号上，删除小程序/更换手机数据不再丢失啦，需要接入云开发</li>
	</ul>
	</p>`;
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
</style>
