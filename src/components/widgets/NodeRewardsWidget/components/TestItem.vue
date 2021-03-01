<template>
	<tr class="test-item" valign="top" @click="$emit('click', name)">
		<td class="name-td" valign="top">
			{{ translate(language, name) }}
		</td>

		<td class="value-td">
			<div class="value">
				<div class="vert-line" />
				<div class="progress-outer">
					<div class="progress-value" :style="progressValue"/>
					<Decimal
						v-if="isBalance(value, name)"
						class="value-text"
						:value="value"
					/>
					<div v-else class="value-text">{{ getValue(value) }}</div>
				</div>
				<div class="expected-value-text">{{ _expectedValue }}</div>
			</div>
		</td>
	</tr>
</template>

<script>
import translate from '../i18n';
import Decimal from '../../../fields/Decimal.vue';

export default {
	name: 'TestItem',

	components: { Decimal },

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
			required: false
		},
		passed: {
			type: Boolean,
			required: true
		},
		language: {
			type: String
		}
	},

	mounted() {
		setTimeout(() => {
			if (this.passed)
				this.progressValue = { width: '100%', backgroundColor: '#33dd50' };
			else
				this.progressValue = { width: '25%' };
		}, 100);
	},
	data() {
		return {
			translate,
			progressValue: { width: '0%' }
		};
	},

	computed: {
		_expectedValue() {
			if (this.passed)
				return ' ';
			else
				return this.expectedValue === null ? ' ' : this.expectedValue;
		}
	},

	methods: {
		getValue(value) {
			if (value === -1)
				return this.translate(this.language, 'na');

			return value === ''
				? this.getPassedDescription(this.passed)
				: value;
		},

		getPassedDescription(passed) {
			const descriptor = passed === true
				? 'value_passed'
				: 'value_failed';

			return this.translate(this.language, descriptor);
		},

		isBalance(item, key) {
			return key?.toUpperCase().includes('BALANCE') === true;
		}
	}
};
</script>

<style lang="scss" scoped>
tr:hover {
    background: #fff1;
    cursor: pointer;
}

td {
    padding: 5px 0;
}

.name-td {
    vertical-align: top;
    font-size: 12px;
}

.value-td {
    display: flex;
    justify-content: flex-end;
}

.value {
    position: relative;
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
    background: linear-gradient(120deg, #fff 0%, #f3f4f8 100%);
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
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 60%;
}

.expected-value-text {
    font-size: 10px;
    width: 45px;
    margin-top: 2px;
    text-align: center;
    align-self: flex-end;
    opacity: 0.5;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.vert-line {
    z-index: 0;
    top: -95%;
    right: 50%;
    position: absolute;
    width: 1px;
    height: 250%;
    background-image: linear-gradient(to bottom, rgba(255, 0, 255, 0), $pink-color, rgba(0, 0, 0, 0));
}
</style>
