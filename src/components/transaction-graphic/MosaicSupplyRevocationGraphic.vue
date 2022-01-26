<template>
	<div>
		<svg
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			xmlns:xlink="http://www.w3.org/1999/xlink"
			x="0px"
			y="0px"
			:width="getPixels(transactionGraphicWidth)"
			:height="getPixels(transactionGraphicHeight)"
			:viewBox="transactionGraphicViewbox"
			xml:space="preserve"
		>
			<AccountIcon
				:x="subjectPositionX"
				:y="subjectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:address="address"
			/>
			<AccountIcon
				:x="objectPositionX"
				:y="objectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:address="signer"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<MosaicsCircle
				v-if="hasMosaic"
				id="target"
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:mosaics="mosaicList"
			/>
			<NativeMosaicCircle
				v-if="hasNativeMosaic"
				id="target"
				:x="getCircleIconPositionX(1)"
				:y="circleIconPositionY"
				:mosaics="[nativeMosaic]"
			/>
			<text :x="transactionTypeTextPositionX" :y="transactionTypeTextPositionY" text-anchor="middle" class="message">
				{{ getTranslation(transactionType) }}
			</text>
		</svg>
	</div>
</template>

<script>
import GraphicComponent from '../graphics/GraphicComponent.vue';
import AccountIcon from '../graphics/AccountIcon.vue';
import Arrow from '../graphics/Arrow.vue';
import MosaicsCircle from '../graphics/MosaicsCircle.vue';
import NativeMosaicCircle from '../graphics/NativeMosaicCircle.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		Arrow,
		MosaicsCircle,
		NativeMosaicCircle
	},

	props: {
		signer: {
			type: String,
			required: true,
			default: ''
		},
		address: {
			type: String,
			required: true,
			default: ''
		},
		mosaics: {
			type: Array,
			default: () => []
		}
	},

	data () {
		return {
			width: this.transactionGraphicWidth,
			heigth: this.transactionGraphicHeight
		};
	},

	computed: {
		transactionType () {
			return this.getTransactionTypeCaption(this.type);
		},

		circleIconsToDisplay () {
			return [this.hasMosaic, this.hasNativeMosaic];
		},

		hasNativeMosaic () {
			return 'undefined' !== typeof this.nativeMosaic;
		},

		hasMosaic () {
			return 0 < this.mosaicList.length;
		},

		mosaic () {
			return { mosaicId: this.mosaicId };
		},

		nativeMosaic () {
			return this.mosaics.find(mosaic => mosaic.mosaicId === this.nativeMosaicId);
		},

		mosaicList () {
			return this.mosaics.filter(mosaic => mosaic.mosaicId !== this.nativeMosaicId);
		}
	}
};
</script>
