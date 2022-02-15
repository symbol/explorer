<template>
	<b-list-group-item
		class="d-flex justify-content-between align-items-center list-item"
		:title="title"
	>
		<MosaicIcon
			v-if="!isNativeMosaic(mosaic.mosaicId)"
			hideCaption
			:width="32"
			:height="32"
			:mosaicId="mosaic.mosaicId"
		/>
		<NativeMosaicIcon
			v-else
			:width="32"
			:height="32"
			:mosaicId="mosaic.mosaicId"
		/>
		{{ text }}
		<b-badge v-if="isValueExist" variant="primary" pill>{{ _value }}</b-badge>
		<div v-else> &nbsp; </div>
	</b-list-group-item>
</template>

<script>
import MosaicIcon from '../graphics/MosaicIcon.vue';
import NativeMosaicIcon from '../graphics/NativeMosaicIcon.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	components: {
		MosaicIcon,
		NativeMosaicIcon
	},

	props: {
		mosaic: {
			type: Object,
			default: () => ({})
		},

		value: {
			type: [Number, String]
		}
	},

	computed: {
		text () {
			return this.truncString(this.getMosaicName(this.mosaic), 5);
		},

		title () {
			return this.getMosaicName(this.mosaic);
		},

		isValueExist () {
			return 'number' === typeof this._value || 'string' === typeof this._value;
		},

		_value () {
			return this.value || this.mosaic.amount;
		}
	},

	methods: {
		isNativeMosaic (mosaicId) {
			return mosaicId === this.nativeMosaicId;
		}
	}
};
</script>

<style lang="scss" scoped>
.list-item {
    min-width: 250px;
    background-color: var(--sub-card-bg);
    border: 1px solid var(--sub-card-border);
    color: var(--text-color);
}
</style>
