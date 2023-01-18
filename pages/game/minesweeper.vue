<template>
	<page-meta :page-style="'overflow:' + ($store.state.metaShow ? 'hidden' : 'visible')"></page-meta>
	<view class="minesweeper" :id="$store.state.theme">
		<game-header></game-header>
		<view class="minesweeper-item">
			<view class="minesweeper-rules"><text class="active-btn black-border light-shadow" @click="openRule">游戏规则</text></view>
			<view class="minesweeper-game t-c">
				<view class="minesweeper-top">
					<view v-if="hasChoseLevel" class="minesweeper-info">
						<view class="minesweeper-info__list">
							<view>难度:{{ gameInfo.level }}</view>
							<view>时间:{{ gameInfo.time }}s</view>
						</view>
						<view class="minesweeper-info__list">
							<view>剩余:{{ remain }}</view>
							<view>最高纪录:{{ gameInfo.record ? `${gameInfo.record}s` : '无' }}</view>
						</view>
					</view>
					<view v-else>请选择难度</view>
				</view>
				<view v-if="!hasChoseLevel">
					<view class="minesweeper-level">
						<view class="minesweeper-level__list black-border" v-for="(item, index) in config" :key="index" @click="choseLevel(item)">
							{{ `${item.level} （${item.xNum}×${item.yNum}）` }}
						</view>
					</view>
				</view>

				<view v-else class="minesweeper-content">
					<view class="board">
						<view v-for="(row, index) in board" class="board-row" :key="index">
							<view
								v-for="(column, key) in row"
								:key="key"
								:class="['board-column', gameInfo.yNum <= 9 ? 'board-column--small' : gameInfo.yNum < 30 ? 'board-column--middle' : 'board-column--large']"
								@click="isSetFlag ? setFlag([index, key], column) : isInit ? updateBoard([index, key], column.data) : setBoom([index, key])"
							>
								<view :class="['board-column__list', column.isShow ? 'board-column__list--show' : 'board-column__list--unknown']">
									<text v-if="column.data === 'X'" class="board-column__img iconfont icon-boom"></text>
									<text v-else-if="column.data === 'F'" class="board-column__img iconfont icon-flag"></text>
									<text
										v-else-if="parseInt(column.data) > 0"
										class="board-column__img board-column__img--number"
										:class="`iconfont icon-shuzi${column.data}`"
									></text>
								</view>
							</view>
						</view>
					</view>
					<view class="minesweeper-bottom">
						<view class="minesweeper-button">
							<view
								v-if="!isOver"
								class="minesweeper-button__list flag-btn black-border light-shadow"
								:class="{ 'flag-btn--active': isSetFlag }"
								@click="isSetFlag = !isSetFlag"
							>
								插旗
							</view>
							<view class="minesweeper-button__list minesweeper-button__list--restart black-border light-shadow" @click="handleRestart">重新开始</view>
							<view class="minesweeper-button__list minesweeper-button__list--choose black-border light-shadow" @click="handleRestart(false)">重新选择难度</view>
						</view>
						<view v-if="isOver" class="minesweeper-bottom__tips">踩到地雷，游戏结束</view>
					</view>
				</view>
			</view>
		</view>
		<modal ref="modalChild" title="游戏规则" :showBtn="false" cancelText="我知道了">
			<scroll-view class="scroll-view" scroll-y>
				<view>
					确定大小的矩形雷区中随机布置一定数量的地雷(初级为9*9个方块10个雷，中级为16*16个方块40个雷，高级为16*30个方块99个雷，其中第一个翻开的格子必不为雷，请放心翻开)，玩家需要尽快找出雷区中的所有不是地雷的方块，而不许踩到地雷。
				</view>
				<view class="m-top10">
					<h4>扫雷的操作：</h4>
					<br />
					1、点击下方的插旗按钮可以打开或关闭插旗标记状态。
					<br />
					2、 非插旗状态下单击格子
					<text class="f-w">（扫雷状态）：</text>
					在判断出不是雷的方块上点击，可以打开该方块。如果方块上出现数字，则该数字表示其周围3×3区域中的地雷数，如果方块上为空（相当于0），则可以递归地打开与空相邻的方块；如果不幸触雷，则游戏结束。
					<br />
					3、 开启插旗按钮后点击格子
					<text class="f-w">（插旗状态）：</text>
					在判断为地雷的方块上按下点击，可以标记地雷（显示为小红旗），已插旗的格子在扫雷状态下不可点击，在插旗状态下点击可取消标记。
					<br />
				</view>
			</scroll-view>
		</modal>
		<modal ref="attention" title="注意" @handleCancel="closeModal" :cancelText="modalInfo.cancelText" :confirmText="modalInfo.confirmText" @confirmModal="attentionConfirm">
			<p class="t-c" v-html="modalInfo.content"></p>
		</modal>
	</view>
</template>

<script setup>
import { computed, ref, watch, reactive, onBeforeUnmount, onUnmounted } from 'vue';
import GameHeader from './components/game-header/game-header.vue';
import { useStore } from 'vuex';
import { usePage } from '@/common/usePage.js';
const { onShareAppMessage, onShareTimeline, onReady } = usePage();
onShareAppMessage({
	title: '要来一场紧张又刺激的扫雷吗？',
	path: '/pages/game/minesweeper'
});
onShareTimeline({
	title: '要来一场紧张又刺激的扫雷吗？',
	path: '/pages/game/minesweeper'
});
onReady();
// 图片地址
const { imgUrl } = getApp({ allowDefault: true }).globalData;
const modalChild = ref(null);
const attention = ref(null);
const modalInfo = reactive({ content: '', cancelText: '', confirmText: '' });
function openRule() {
	modalChild.value.openModal();
}

// 选择难度 START
//难度配置
const config = [
	{
		alias: 'easy',
		level: '青铜',
		xNum: 9, // 列数
		yNum: 9, // 行数
		boomNum: 10 // 炸弹数
	},
	{
		alias: 'middle',
		level: '白银',
		xNum: 16,
		yNum: 16,
		boomNum: 40
	},
	{
		alias: 'hard',
		level: '黄金',
		xNum: 16,
		yNum: 30,
		boomNum: 99
	}
];

// 是否选择了难度
let hasChoseLevel = ref(false);
// 当前游戏信息
let gameInfo = ref({
	alias: 'easy',
	level: '青铜', // 难度等级
	time: 0, // 时间
	record: undefined, // 最高纪录
	xNum: 9, // 列数
	yNum: 9, // 行数
	boomNum: 10 // 炸弹数
});
// 旗帜数
let flagNum = ref(0);
// 当前难度的非雷格子数
let saveNum = 0;
//剩余炸弹数量
const remain = computed(() => {
	return gameInfo.value.boomNum - flagNum.value < 0 ? 0 : gameInfo.value.boomNum - flagNum.value;
});

/**
 * 选择难度
 *
 * @param   {Object} item 选择的难度数据
 */
function choseLevel(item) {
	const { alias } = item;

	gameInfo.value = {
		...gameInfo.value,
		...item,
		record: uni.getStorageSync(`${alias}_record`)
	};
	const { xNum, yNum, boomNum } = gameInfo.value;
	saveNum = yNum * xNum - boomNum;
	hasChoseLevel.value = true;
	restart();
}

// 选择难度 END

// 开始游戏 START
// 棋盘
let board = ref([]);
//保证第一个点击的格子不是雷
let isInit = ref(false);
// 游戏是否结束
let isOver = ref(false);
// 是否处于插旗模式
let isSetFlag = ref(false);
// 计时器
let timer = null;
// 开始计时
function setTimer() {
	timer = setInterval(() => {
		const num = parseFloat(gameInfo.value.time) + 0.01;
		gameInfo.value.time = num.toFixed(2);
	}, 10);
}
onBeforeUnmount(() => {
	clearInterval(timer);
});
// 开始/重新开始
function restart() {
	const { yNum, xNum } = gameInfo.value;

	board.value = new Array(yNum).fill(
		new Array(xNum).fill({
			data: '-1',
			isShow: false,
			isBoom: false
		})
	);
	[isInit.value, isOver.value, isSetFlag.value, gameInfo.value.time, flagNum.value] = [false, false, false, 0, 0];
	setTimer();
}

// 开始游戏 END

// 游戏过程 START

/**
 * 插旗
 *
 * @param   {Array} click 点击的坐标
 * @param   {Object} column 点击坐标数据
 */
function setFlag(click, column) {
	const [cY, cX] = click;
	const { data, isBoom, isShow } = column;
	if (isShow) return; // 如果这个格子已经翻开 直接返回
	const obj = {
		data: 'F', // F旗帜
		isShow: false, // 未翻开
		isBoom: isBoom // 炸弹
	};
	if (data === 'F') {
		obj.data = '-1'; // 未翻开的空格子
		flagNum.value -= 1;
	} else {
		flagNum.value += 1;
	}
	editBoard(cX, cY, obj);
}

/**
 * 修改坐标数据
 *
 * @param   {String|Number} x   需要修改的x坐标
 * @param   {String|Number} y   需要修改的y坐标
 * @param   {Object} data   改变后的数据
 */
function editBoard(x, y, data) {
	const row = [...board.value[y]]; // 获取那一行的数据
	row.splice(x, 1, data); // 修改
	board.value[y] = row;
}

/**
 * 初始化棋盘
 * @return  {Promise}   Promise
 * @param   {Array} click 点击的坐标
 *
 **/
function setBoom(click) {
	const { xNum, yNum, boomNum } = gameInfo.value;
	const [cY, cX] = click;
	const dx = [],
		dy = [];
	//生成炸弹
	while (dx.length < boomNum) {
		const randomX = Math.round(Math.random() * (xNum - 1)); //获取一个范围内的随机数
		const randomY = Math.round(Math.random() * (yNum - 1)); //获取一个范围内的随机数
		const isClick = randomX === parseInt(cX) && randomY === parseInt(cY); // 是否点击的坐标
		if (!isClick && (dx.indexOf(randomX) === -1 || dx.indexOf(randomX) !== dy.indexOf(randomY))) {
			// 如果没有重复且不是点击的坐标则推入
			dx.push(randomX);
			dy.push(randomY);
		}
	}
	// 修改炸弹数据
	for (let i = 0; i < dx.length; i++) {
		// console.log(JSON.stringify([dx[i]][dy[i]]))
		const obj = {
			data: '-1',
			isShow: false,
			isBoom: true //是炸弹
		};
		editBoard(dx[i], dy[i], obj);
	}
	isInit.value = true;
	updateBoard(click);
}

/**
 * 更新格子状态
 *
 * @param   {Array} click 点击的坐标
 * @param   {Object} data 点击坐标数据值
 */
function updateBoard(click, data = undefined) {
	const { xNum, yNum } = gameInfo.value;
	if (isOver.value || data === 'F') return; // 如果游戏已经结束或为旗帜 直接返回
	const dx = [1, -1, 0, 0, -1, 1, -1, 1]; // 横坐标
	const dy = [0, 0, 1, -1, 1, -1, -1, 1]; // 纵坐标
	const inBound = (x, y) => x >= 0 && x < xNum && y >= 0 && y < yNum; // 辅助函数

	const update = (x, y) => {
		if (!inBound(x, y) || board.value[y][x].isShow || board.value[y][x].data === 'F') return; // 不在界内或已插旗或已翻开，直接返回
		let count = 0;
		for (let i = 0; i < 8; i++) {
			// 统计周围雷的个数
			const nX = x + dx[i];
			const nY = y + dy[i];
			if (inBound(nX, nY) && board.value[nY][nX].isBoom) {
				count++;
			}
		}

		if (count === 0) {
			// 如果周围没有雷，翻开且标记0，递归
			const obj = {
				data: '0', // 0翻开的空格子
				isShow: true, // 已翻开
				isBoom: false // 不是炸弹
			};
			editBoard(x, y, obj);
			for (let i = 0; i < 8; i++) {
				update(x + dx[i], y + dy[i]);
			}
		} else {
			const obj = {
				data: count + '', // 数字1-9附近有炸弹
				isShow: true, // 已翻开
				isBoom: false // 不是炸弹
			};
			editBoard(x, y, obj);
		}
	};

	const [cY, cX] = click;
	if (board.value[cY][cX].isBoom) {
		// 第一下就踩雷了
		const obj = {
			data: 'X', // X炸弹
			isShow: true, // 已翻开
			isBoom: true // 是炸弹
		};
		editBoard(cX, cY, obj);
		isOver.value = true;
		clearInterval(timer);
	} else {
		update(cX, cY); // 开启dfs
	}
}

// 注意的类型
let attentionType = '';
// 重新开始确认
function handleRestart(isRestart = true) {
	// 停止计时
	clearInterval(timer);
	if (isOver.value) {
		if (isRestart) {
			// 重新开始
			restart();
		} else {
			// 返回主页
			setLevelPage();
		}
	} else {
		attentionType = isRestart ? 'restart' : 'level';
		modalInfo.content = `确认要重新${isRestart ? '开始' : '选择难度'}吗?`;
		modalInfo.confirmText = '确定';
		modalInfo.cancelText = '取消';
		attention.value.openModal();
	}
}
//
function closeModal() {
	if (attentionType === 'over') {
		// 返回主页
		setLevelPage();
	}
	if (attentionType === 'restart' || attentionType === 'level') {
		setTimer();
	}
	attentionType = '';
}
function attentionConfirm() {
	if (attentionType === 'restart' || attentionType === 'over') {
		// 重新开始
		restart();
	}
	if (attentionType === 'level') {
		// 返回主页
		setLevelPage();
	}
	attentionType = '';
	attention.value.closeModal();
}
// 打开难度选择页面
function setLevelPage() {
	clearInterval(timer); // 清除定时器
	hasChoseLevel.value = false;
}

// 游戏过程 END

// 游戏结束 START
// 计算已翻开的格子数 当翻开的格子数=安全的格子数时游戏胜利
const showCount = computed(() => {
	const arr = board.value.flat();
	let num = 0;
	arr.forEach(item => {
		if (item.isShow) {
			num++;
		}
	});
	return num;
});

// 难度评级配置
const scoreLevel = {
	easy: {
		0.49: '100',
		40: '99',
		70: '88',
		90: '80',
		110: '77',
		180: '66',
		240: '55',
		500: '35',
		800: '15',
		1000: '10',
		1300: '1'
	},
	// 452 293
	middle: {
		7.03: '100',
		250: '99',
		500: '88',
		800: '77',
		1000: '66',
		1200: '55',
		1500: '35',
		2000: '15',
		2500: '10'
	},
	hard: {
		31.13: '100',
		500: '99',
		800: '88',
		1200: '77',
		1800: '66',
		2300: '55',
		3000: '35',
		5000: '15',
		8000: '10'
	}
};

// 监听翻开的格子数，判断游戏是否结束
watch(showCount, () => {
	const { time, alias, record } = gameInfo.value;
	if (isOver.value) return; // 处理最后一个点击到炸弹的异常情况
	if (showCount.value === saveNum) {
		// 停止计时
		clearInterval(timer);

		// 击败玩家百分比
		let percent = '1';

		for (const key in scoreLevel[alias]) {
			if (parseFloat(time) < key) {
				percent = scoreLevel[alias][key];
				break;
			}
		}

		// 判断是否为最高纪录
		if (!record || parseFloat(time) < parseFloat(record)) {
			uni.setStorageSync(`${alias}_record`, time);
			gameInfo.value.record = time;
		}
		modalInfo.content = `恭喜用时${time}秒挑战成功！\n击败了${percent}%的玩家！\n您的最高纪录：${gameInfo.value.record}秒`;
		attentionType = 'over';
		modalInfo.confirmText = '重新开始';
		modalInfo.cancelText = '返回主页';
		attention.value.openModal();
	}
});
// 游戏结束 END
</script>

<style lang="scss" scoped>
.minesweeper-item {
	width: 100%;
	position: relative;
	background: #fafbf9;
	border-radius: 48rpx 48rpx 0rpx 0rpx;
	border: 4rpx solid #2c2c2c;
	border-bottom: none;
	padding: 74rpx 32rpx 20rpx;
	padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
	margin-top: -52rpx;
	min-height: calc(100vh - 206rpx);
}
.minesweeper-rules {
	font-size: 24rpx;
	font-weight: 600;
	text-align: right;
	.active-btn {
		padding: 4rpx;
		border-radius: 8rpx;
	}
}
.minesweeper-top {
	font-size: 32rpx;
	font-weight: 600;
	color: #2c2c2c;
	line-height: 44rpx;
	padding-top: 20rpx;
}
.minesweeper-info {
	display: flex;
	flex-direction: column;
	font-size: 28rpx;
	line-height: 40rpx;
}
.minesweeper-info__list {
	display: flex;
	justify-content: space-between;
	flex: 1;
}
.minesweeper-game {
	margin-top: 20rpx;
}
//等级
.minesweeper-level {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
	width: 494rpx;
	height: 358rpx;
	margin: 20rpx auto;
	padding: 52rpx;
	border: 4rpx dashed #2c2c2c;
}

.minesweeper-level__list {
	width: 386rpx;
	height: 60rpx;
	border-radius: 30rpx;
	font-size: 28rpx;
	line-height: 56rpx;
}
//棋盘
.board {
	max-width: 686rpx;
	padding: 6rpx;
	margin: 20rpx auto;
	border: 4rpx solid #2c2c2c;
	&-row {
		display: flex;
		overflow: hidden;
		justify-content: center;
	}

	&-column {
		display: flex;
		justify-content: center;
		align-items: center;
		//flex: 1;
		margin: 2rpx;
		background: #dcdcdc;
		overflow: hidden;
		.icon-flag {
			color: #6d2c2d;
		}
		.board-column__img--number {
			color: #555555;
		}
		&--small {
			width: 70rpx;
			height: 70rpx;
			.iconfont {
				font-size: 40rpx;
			}
		}

		&--middle {
			width: 40rpx;
			height: 40rpx;
			font-size: 24rpx;
		}

		&--large {
			width: 40rpx;
			height: 40rpx;
			font-size: 24rpx;
		}

		&__list {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 100%;
			overflow: hidden;

			&--unknown {
				cursor: pointer;
			}

			&--show {
				box-sizing: border-box;
				background: #fff;
				padding: 4rpx 0 0 4rpx;
			}
		}

		&__img {
			width: 85%;
		}
	}
}
.minesweeper-bottom {
	text-align: center;
	margin-top: 100rpx;
}
.minesweeper-button {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}
.minesweeper-button__list {
	width: 250rpx;
	line-height: 86rpx;
	border-radius: 4rpx;
	margin-bottom: 36rpx;
	font-size: 28rpx;
	&--restart {
		background: #dcdcdc;
	}
	&--choose {
		background: #f4f4f6;
		color: #606060;
	}
}
.icon-boom {
	color: #414141;
}
</style>
