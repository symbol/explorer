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
			<linearGradient id="edit-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#FF9999" />
				<stop offset="100%" stop-color="#FF9999" />
			</linearGradient>
		</defs>
		<foreignObject x="446" y="318" width="100" height="100">
			<TablePopover
				:title="title"
				:target="this.id"
				:data="data"
			/>
		</foreignObject>
		<circle
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="url(#edit-circle-gradient)"
			cx="19.115"
			cy="19.094"
			r="17.26"
		/>
		<g>
			<path fill="#FFFFFF" d="M27.152,14.584c0.354-0.354,0.354-0.943,0-1.279l-2.124-2.124c-0.336-0.354-0.926-0.354-1.279,0
				l-1.669,1.661l3.402,3.403 M11.082,23.849v3.403h3.403l10.036-10.045l-3.403-3.403L11.082,23.849z"
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
			default: 'Edit'
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},

	data () {
		return {
			id: this.getId('edit-circle')
		};
	}
};
</script>
