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
			<linearGradient id="lock-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#FF9999" />
				<stop offset="100%" stop-color="#FF9999" />
			</linearGradient>
		</defs>
		<foreignObject x="446" y="318" width="100" height="100">
			<TablePopover :title="title" :target="this.id" :data="data" />
		</foreignObject>
		<circle
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="url(#lock-circle-gradient)"
			cx="19.115"
			cy="19.094"
			r="17.26"
		/>
		<g>
			<path fill="#FFFFFF" stroke="#FFFFFF" stroke-miterlimit="10"
				d="M 22 17h-7a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V18a1 1 0 0 0-1-1zm-7-1 a2 2 0 0 0-2 2
                v5 a2 2 0 0 0 2 2 h7 a2 2 0 0 0 2-2 V18 a2 2 0 0 0-2-2 h-2 zm 0 -3 a 3.5 1.5 0 1 1 7-1 v3 h-1 V14 a2.5 2.5 0 0 0-5 0 v1 h-1 V15z"
			/>
		</g>
		<circle
			:id="this.id"
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
import TablePopover from './TablePopover.vue';

export default {
	extends: GraphicComponent,

	components: {
		TablePopover
	},

	props: {
		title: {
			type: String,
			default: 'Lock'
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},

	data () {
		return {
			id: this.getId('lock-circle')
		};
	}
};
</script>
