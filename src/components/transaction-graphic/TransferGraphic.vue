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
				:address="signer"
			/>
			<AccountIcon
				:x="objectPositionX"
				:y="objectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:address="recipient"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<MessageCircle
				v-if="hasMessage"
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:message="message"
			/>
			<MosaicsCircle
				v-if="hasMosaic"
				id="target"
				:x="getCircleIconPositionX(1)"
				:y="circleIconPositionY"
				:mosaics="mosaicList"
			/>
			<NativeMosaicCircle
				v-if="hasNativeMosaic"
				id="target"
				:x="getCircleIconPositionX(2)"
				:y="circleIconPositionY"
				:mosaics="[nativeMosaic]"
			/>
			<text :x="transactionTypeTextPositionX" :y="transactionTypeTextPositionY" text-anchor="middle" class="message">
				{{ transactionType }}
				<title>{{ transactionType }}</title>
			</text>
		</svg>
	</div>
</template>

<script>
import GraphicComponent from '../graphics/GraphicComponent.vue';
import AccountIcon from '../graphics/AccountIcon.vue';
import MessageCircle from '../graphics/MessageCircle.vue';
import MosaicsCircle from '../graphics/MosaicsCircle.vue';
import NativeMosaicCircle from '../graphics/NativeMosaicCircle.vue';
import Arrow from '../graphics/Arrow.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		MessageCircle,
		MosaicsCircle,
		NativeMosaicCircle,
		Arrow
	},

	props: {
		message: {
			type: Object,
			default: () => {}
		},
		signer: {
			type: String,
			required: true,
			default: ''
		},
		recipient: {
			type: String,
			required: true,
			default: ''
		},
		mosaics: {
			type: Array,
			default: () => []
		}
	},

	computed: {
		transactionType () {
			return this.getTransactionTypeCaption(16724); // Transfer
		},

		circleIconsToDisplay () {
			return [this.hasMessage, this.hasMosaic, this.hasNativeMosaic];
		},

		hasMessage () {
			return 'string' === typeof this.message.payload && 0 < this.message.payload.length;
		},

		hasNativeMosaic () {
			return 'undefined' !== typeof this.nativeMosaic;
		},

		hasMosaic () {
			return 0 < this.mosaicList.length;
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
