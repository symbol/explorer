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
			<linearGradient id="key-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stop-color="#FF9999" />
				<stop offset="100%" stop-color="#FF9999" />
			</linearGradient>
		</defs>
		<foreignObject x="446" y="318" width="100" height="100">
			<RestrictionOperationListPopover :title="title" :target="this.id" :data="data" />
		</foreignObject>
		<circle
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="url(#key-circle-gradient)"
			cx="19.115"
			cy="19.094"
			r="17.26"
		/>
		<g>
			<path fill="#FFFFFF" d="M19.371,10.805c-4.755,0-8.612,3.855-8.612,8.612c0,4.757,3.857,8.612,8.612,8.612
			c4.757,0,8.612-3.855,8.612-8.612C27.982,14.66,24.127,10.805,19.371,10.805z M20.232,23.155c0,0.313-0.256,0.567-0.568,0.567
			h-0.586c-0.312,0-0.568-0.255-0.568-0.567v-0.586c0-0.312,0.256-0.568,0.568-0.568h0.586c0.312,0,0.568,0.256,0.568,0.568V23.155z
			M20.232,19.71c0,0.312-0.256,0.568-0.568,0.568h-0.586c-0.312,0-0.568-0.256-0.568-0.568v-4.031c0-0.313,0.256-0.567,0.568-0.567
			h0.586c0.312,0,0.568,0.255,0.568,0.567V19.71z"
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
import RestrictionOperationListPopover from './RestrictionOperationListPopover.vue';

export default {
	extends: GraphicComponent,

	components: {
		RestrictionOperationListPopover
	},

	props: {
		title: {
			type: String,
			default: 'Key'
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},

	data () {
		return {
			id: this.getId('restriction-circle')
		};
	}
};
</script>
