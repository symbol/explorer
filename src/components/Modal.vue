<template>
	<transition name="modal">
		<div class="modal-mask" @click="$emit('close')">
			<div class="modal-wrapper">
				<div class="modal-container" @click.stop>
					<div class="modal-title">
						{{translate(language, title)}} 
						<img :src="CloseIcon" class="close-icon" @click="$emit('close')"/>
					</div>
					<div class="modal-body-wrapper">
						<div class="modal-body-scrollable">
							<table class="modal-table">
								<tbody>
									<tr v-if="showPassed">
										<td class="table-header">
											{{translate(language, 'testPassed')}}
										</td>
										<td class="table-value">
											<BooleanField :value="passed" />
										</td>
									</tr>
									<tr 
										v-for="(item, key) in data"
										:key="'' + key + 'nm-mtb'"
									>
										<td class="table-header">{{translate(language, key)}}</td>
										<td class="table-value" :title="item">
											<BooleanField v-if="isBoolean(item, key)" :value="item" />
											<DateField v-else-if="isDate(item, key)" :value="item" :keyName="key" />
											<TextField v-else :value="item" />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
import translate from '../i18n';
import BooleanField from './table-components/Boolean.vue';
import DateField from './table-components/Date.vue';
import TextField from './table-components/Text.vue';
import CloseIcon from '../assets/close.png';

export default {
	name: "Modal",

	components: { BooleanField, DateField, TextField },

	props: {
		title: {
			type: String
		},
		data: {
			type: Object,
			required: true,
		},
		passed: {
			type: Boolean
		},
		language: {
			type: String,
		}
	},

	mounted() {
		console.log(this.data)
	},

	data() {
		return {
			translate,
			CloseIcon
		}
	},
	
	computed: {
		defaultTitle() {
			return;
		},

		tableHeader() {
			if(Array.isArray(this.data)) 
				return Object.keys(this.data[0]);
			else
				return ['parameter', 'value'];
		},

		showPassed() {
			return typeof this.passed === 'boolean';
		}
	},

	methods: {
		isBoolean(item, key) {
			return typeof item === 'boolean';
		},

		isDate(item, key) {
			return key.toUpperCase().includes('DATE');
		}
	}
};
</script>

<style lang="scss" scoped>
.modal-mask {
	position: absolute;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	transition: opacity 0.3s ease;
	backdrop-filter: blur(5px);
	border-radius: 6px;
	animation: fadein 0.2s;
}

.modal-wrapper {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.modal-container {
	display: flex;
	flex-direction: column;
	width: 80%;
	height: 80%;
	
	color: #44004e;
	background-color: #f3f4f8;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	border-radius: 6px;
}

.modal-title {
	padding: 11px 20px 9px;
	font-weight: 700;
	text-align: center;
	border-bottom: 1px solid #bbb;
	position: relative;
	width: 100%;
}

.close-icon {
	height: 32px;
	padding: 8px;
	position: absolute;
	right: 8px;
	top: 8px;
	cursor: pointer;
}

.close-icon:hover {
	opacity: 0.8;
}

.modal-body-wrapper {
	flex: 1;
	padding: 20px 0 20px 20px;
	height: 100%;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
}

.modal-body-scrollable {
	height: 100%;
	width: 100%;
	overflow-y: auto;
	overflow-x: hidden;
}

.modal-table {
	width: 100%;
	font-size: 12px;
	border-spacing: 10px;
	margin-right: 10px;
}

tr:hover {
	background: #fff5;
}

td {
	padding-right: 20px;
	padding-top: 5px;
	padding-bottom: 5px;
}

.table-header {
	font-weight: 700;
}

.table-value {
	word-break: break-all;
}

.modal-enter {
	opacity: 0;
}

.modal-leave-active {
	opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
	opacity: 0;
}

@keyframes fadein {
	from { opacity: 0; }
	to   { opacity: 1; }
}
</style>