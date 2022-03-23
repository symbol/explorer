<template>
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		:x="_x"
		:y="_y"
		width="38.5px"
		height="38.167px"
		viewBox="0 0 38.5 38.167"
		xml:space="preserve"
		class="circle-icon"
	>
		<defs>
			<linearGradient id="account-remove-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#287326" />
				<stop offset="100%" stop-color="#287326" />
			</linearGradient>
		</defs>
		<foreignObject x="446" y="318" width="100" height="100">
			<AccountListPopover
				:target="id"
				title="Remove accounts"
				:accounts="accounts"
			/>
		</foreignObject>
		<circle
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="url(#account-remove-circle-gradient)"
			cx="19.115"
			cy="19.094"
			r="17.26"
		/>
		<g>
			<path fill="#FFFFFF" d="M27.36,25.503c-0.25-0.58-0.63-1.05-1.12-1.45c-0.851-0.7-1.83-1.149-2.87-1.47
				c-1.29-0.41-1.29-0.41-0.7-1.62l1.11-2.41c0-0.01,0-0.01,0-0.01c0.27-0.57,0.34-1.15,0-1.72c-0.04-0.11-0.13-0.23-0.11-0.32
				c0.23-0.89,0.2-1.76-0.05-2.53l-1.57,1.56c0.22,0.09,0.34,0.3,0.45,0.57c0.16,0.34-0.08,0.73,0.16,1.06
				c0.04,0.05,0.09,0.07,0.149,0.06c0.181,0.41,0.181,0.84,0.011,1.26c0,0.01-0.011,0.01-0.011,0.02c-0.1,0.26-0.13,0.55-0.38,0.74
				c-0.529,0.359-0.41,1.03-0.71,1.5c-1.75,1.99-3.7,1.92-4.86-0.061l-0.76,0.761c0.27,0.51,0.24,0.85-0.45,1.01
				c-0.26,0.06-0.53,0.13-0.78,0.22l-3.96,3.94c0,0.51,0.32,0.64,1.13,0.649h14.19C27.52,27.263,27.87,26.734,27.36,25.503z
				M21.29,23.793c-0.58,0.49-1.26,0.771-2.02,0.73c-0.76,0.029-1.42-0.221-1.97-0.7c-0.18-0.16-0.64-0.28-0.31-0.71
				c0.22-0.29,0.42-0.41,0.84-0.221c0.96,0.46,1.979,0.48,2.939-0.029c0.45-0.24,0.62,0.029,0.811,0.29
				C21.85,23.513,21.46,23.643,21.29,23.793z M20.13,11.063c-1.65-0.49-3.48,0.23-4.75,1.87c-0.26,0.32-0.51,0.66-0.54,1.1
				c-0.22,0.29-0.22,0.62-0.18,0.95c-0.3,0.73,0.16,1.45-0.01,2.2c-0.18,0.74,0.01,1.47,0.35,2.15c0.16,0.31,0.31,0.63,0.48,0.94
				l0.79-0.791c-0.09-0.14-0.18-0.26-0.24-0.41c-0.28-0.67-0.75-1.31-0.03-2.09c0.43-0.46,0.15-1.33,0.71-1.83
				c0.86-0.63,1.73-0.36,2.6-0.03c0.34,0.14,0.68,0.26,1.03,0.32l2.68-2.66C22.37,11.883,21.36,11.233,20.13,11.063z"/>
			<rect x="18.577" y="9.542" transform="matrix(0.7067 0.7075 -0.7075 0.7067 19.2152 -7.9528)" fill="#FFFFFF" width="1.245" height="19.317"/>
		</g>
		<circle
			:id="id"
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="transparent"
			cx="19.115"
			cy="19.094"
			r="17.26"
		/>
	</svg>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';
import AccountListPopover from './AccountListPopover.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountListPopover
	},

	props: {
		accounts: {
			type: Array,
			required: true
		}
	},

	data () {
		return {
			id: this.getId('account-remove-circle')
		};
	}
};
</script>
