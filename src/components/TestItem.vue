<template>
		<tr class="test-item" valign="top">
			<td class="name-td" valign="top">
				{{ translate(language, name) }}
			</td>

			<td class="value-td">
				<div class="value">
					<div class="progress-outer">
						<div class="progress-value" :style="progressValue"/>
						<div class="value-text">{{ value }}</div>
					</div>
					<div class="expected-value-text">{{ _expectedValue }}</div>
				</div>
			</td>
		</tr>
</template>

<script>
import translate from '../i18n';

export default {
	name: 'TestItem',

	props: {
		name: {
			type: String,
			required: true
		},
		value: {
			type: [String, Number],
			required: true
		},
		expectedValue: {
			type: [String, Number],
			required: true
		},
		passed: {
			type: Boolean,
			required: true
		},
		language: {
			type: String,
		},
	},

	mounted() {
		setTimeout(() => {
			if(this.passed)
				this.progressValue = { width: '100%', backgroundColor: '#33dd50' };
			else
				this.progressValue = { width: '25%' };
		}, 1000)
		
	},
	data() {
		return {
			translate,
			progressValue: { width: '0%' },
		}
	},

	computed: {
		_expectedValue() {
			if(this.passed)
				return ' ';
			else
				return this.expectedValue;
		}
	},

}
</script>

<style lang="scss" scoped>
td {
	padding: 5px 0;
}

.name-td {
	vertical-align: top;
	//font-size: 12px;
}

.value-td {
	display: flex;
	justify-content: flex-end;
}

.value {
	display: flex;
	flex-direction: column;
	align-items: center;
	flex-shrink: 0;
	width: 100px;
}

.progress-outer {
	display: flex;
	width: 100%;
	flex-grow: 1;
	flex-direction: row;
	position: relative;
	height: 1rem;
    overflow: hidden;
    font-size: 0.75rem;
    background: linear-gradient(120deg, #ffffff 0%, #f3f4f8 100%);
    border-radius: 0.25rem;
}

.progress-value {
	content: '';
	background: $orange-color;
	height: 100%;
	width: 0%;
	transition: 1s all 0s;
  	-webkit-transition: width 1s; 
}

.value-text {
	position: absolute;
	height: 100%;
	left: 5px;
	line-height: 17px;
	font-size: 10px;
	color: $secondary-color;
	font-weight: bold;
}

.expected-value-text {
	font-size: 10px;
	width: 45px;
	margin-top: 2px;
	text-align: center;
	align-self: flex-end;
	opacity: 0.5;
}

</style>