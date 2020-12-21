<template>
    <div class="history-root">
		<div class="history">
			<div 
				v-for="(test, index) in tmp"
				:key="'' + index + 'nm-hist'"
				class="history-step"
			>
				<div class="history-icon-wrapper">
					<img class="history-icon" :src="getIconSrc(test.passed)" />
				</div>
				<div class="history-circle hoverable"></div>
				<div class="history-title">#{{test.round}}</div>
				<div class="history-date" :title="test.date">{{formatDate(test.date)}}</div>
				<div class="history-line history-line-left"></div>
				<div class="history-line history-line-right"></div>
			</div>
		</div>
    </div>
</template>

<script>
import * as utils from '../unils';
import TrueIcon from '../assets/true.png';
import FalseIcon from '../assets/false.png';

export default {
    name: "History",

    props: {
        data: {
            type: Object,
            required: true,
        },
        language: {
            type: String,
        },
	},
	data() {
		return {
			tmp: [
				{
					round: 12,
					passed: true,
					date: '2020-09-02 14:46:08',
				},
				{
					round: 13,
					passed: true,
					date: '2020-10-05 14:46:08',
				},
				{
					round: 14,
					passed: false,
					date: '2020-11-21 14:46:08',
				},
				{
					round: 15,
					passed: true,
					date: '2020-12-17 14:46:08',
				}
			]
		}
	},

	methods: {
		formatDate(date) {
			return utils.formatDate(date, this.language)
		},

		getIconSrc(value) {
			return value === true
				? TrueIcon
				: FalseIcon;
		}
	}
};
</script>

<style lang="scss" scoped>
.history-root {

}

.history {
    display: table;
    width: 100%;
    margin: 0 auto;
}

.history-step {
	width: 25%;
    display: table-cell;
    position: relative;
    padding: 24px;
}

.hoverable:hover {
    opacity: 0.8;
	cursor: pointer;
}


//icon
.history-icon-wrapper {
	width: 100%;
	margin-bottom: 10px;
	display: flex;
	justify-content: center;
}

.history-icon {
	height: 16px;
	align-self: center;
}


// circle
.history-circle {
    width: 10px;
    height: 10px;
    margin: 7px auto 0;
    background-color: #ffffff;
    border-radius: 50%;
    color: #ffffff;
}

.history-step:last-child .history-circle {
    // background-color: #f0f;
}


// text
.history-title {
	text-align: center;
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
}

.history-date {
    font-size: 10px;
	text-align: center;
	//color: #999;
}


// line
.history-line {
    position: absolute;
    top: 54px;
    border-top: 2px solid #fff;
}

.history-line-right {
    right: 0;
    left: 50%;
    margin-left: 10px;
}

.history-line-left {
    left: 0;
    right: 50%;
    margin-right: 10px;
}

.history-step:first-child .history-line-left,
.history-step:last-child .history-line-right {
    display: none;
}
</style>