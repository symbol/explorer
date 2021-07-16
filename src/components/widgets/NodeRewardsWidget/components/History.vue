<template>
	<div class="history">
		<div class="history-steps-wrapper">
			<div
				v-for="(test, index) in data"
				:key="'' + index + 'nm-hist'"
				class="history-step"
			>
				<div class="history-icon-wrapper">
					<img class="history-icon" :src="getIconSrc(test.passed)" />
				</div>
				<div class="history-circle hoverable" @click="onItemClick(test)"></div>
				<div class="history-title">#{{test.round}}</div>
				<div class="history-date" :title="test.date">{{formatDate(test.date)}}</div>
				<div class="history-line history-line-left"></div>
				<div class="history-line history-line-right"></div>
			</div>
		</div>
		<Modal
			v-if="isModalShown"
			:passed="selectedItemData.passed"
			:title="translate(language, 'roundNumber', {number: selectedItemData.round})"
			:data="selectedItemData.details"
			@close="closeModal"
		/>
	</div>
</template>

<script>
import * as utils from '../utils';
import translate from '../i18n';
import Modal from './Modal.vue';
import TrueIcon from '../assets/true.png';
import FalseIcon from '../assets/false.png';

export default {
	name: 'History',

	components: { Modal },

	props: {
		data: {
			type: Array,
			required: true
		},
		language: {
			type: String
		}
	},

	mounted() {
		this.selectedItemData = {};
		this.isModalShown = false;
	},

	data() {
		return {
			utils,
			translate,
			isModalShown: false,
			selectedItemData: {}
		};
	},

	methods: {
		formatDate(date) {
			return utils.formatDate(date, this.language);
		},

		getIconSrc(value) {
			if (value === true)
				return TrueIcon;

			if (value === false)
				return FalseIcon;
		},

		onItemClick(item) {
			this.selectedItemData = item;
			this.isModalShown = true;
		},

		closeModal() {
			this.isModalShown = false;
		}
	}
};
</script>

<style lang="scss" scoped>
.history {
    width: 100%;
}

.history-steps-wrapper {
    max-width: 500px;
    display: table;
    width: 100%;
    margin: 0 auto;
}

.history-step {
    display: table-cell;
    position: relative;
    padding: 24px 6px 0;
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
    background-color: #fff;
    border-radius: 50%;
    color: #fff;
}

.history-step:last-child .history-circle {
    width: 12px;
    height: 12px;
    margin-top: -1px;
}

// text
.history-title {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
}

.history-step:last-child .history-title {
    font-weight: bold;
}

.history-date {
    font-size: 10px;
    text-align: center;
}

.history-step:last-child .history-date {
    font-weight: bold;
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

.history-step:first-child .history-line-left, .history-step:last-child .history-line-right {
    display: none;
}
</style>
