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
				<stop offset="0%" stop-color="#B429FA" />
				<stop offset="100%" stop-color="#B429FA" />
			</linearGradient>
		</defs>
		<foreignObject x="446" y="318" width="100" height="100">
			<TablePopover :title="title" :target="this.id" :data="data" />
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
			<path fill="#FFFFFF" stroke="#FFFFFF" stroke-miterlimit="10" d="M20.62,18.72c1.72-0.52,3.04-1.79,3.29-3.29L20.62,18.72z
				M15.88,14.92c0-1.34,1.45-2.44,3.24-2.44c1.16,0,2.18,0.46,2.76,1.16l1.13-1.13c-0.05-0.06-0.11-0.12-0.16-0.17
				c-0.92-0.93-2.27-1.46-3.71-1.46c-2.68,0-4.84,1.82-4.84,4.05c0,1.56,1.09,2.94,2.69,3.6l1.25-1.25
				C16.88,16.99,15.88,16.04,15.88,14.92z M21.05,23.5h-1.03c-0.09,0-0.52,0.04-0.52-0.05v-3.61l-1,1v6.02c0,0.25,0.09,0.64,0.35,0.64
				h0.55c0.26,0,0.1-0.39,0.1-0.64v-1.13c0-0.1,0.44-0.23,0.53-0.23h1.14c0.26,0,0.33-0.15,0.33-0.41v-1.01
				C21.5,23.85,21.45,23.5,21.05,23.5z"
			/>
			<rect id="Cut" x="10.557" y="18.571" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -7.6666 19.9229)" fill="#FFFFFF" width="19.318" height="1.289"/>
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
			default: 'Key'
		},
		data: {
			type: Object,
			default: () => ({})
		}
	},

	data () {
		return {
			id: this.getId('key-circle')
		};
	}
};
</script>
