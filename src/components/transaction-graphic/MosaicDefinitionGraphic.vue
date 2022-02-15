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
			<MosaicIcon
				:x="objectPositionX"
				:y="objectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:mosaic="mosaic"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<AddCircle
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:data="data"
				:title="transactionType"
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
import AddCircle from '../graphics/AddCircle.vue';
import MosaicIcon from '../graphics/MosaicIcon.vue';
import Arrow from '../graphics/Arrow.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		AddCircle,
		Arrow,
		MosaicIcon
	},

	props: {
		message: {
			type: String,
			default: ''
		},
		signer: {
			type: String,
			required: true,
			default: ''
		},
		mosaicId: {
			type: String,
			required: true
		},
		divisibility: {
			type: Number,
			required: true
		},
		duration: {
			type: Number,
			required: true
		},
		supplyMutable: {
			type: Boolean,
			required: true
		},
		transferable: {
			type: Boolean,
			required: true
		},
		restrictable: {
			type: Boolean,
			required: true
		},
		revokable: {
			type: Boolean,
			required: true
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
			return [true];
		},

		mosaic () {
			return { mosaicId: this.mosaicId };
		},

		data () {
			return {
				divisibility: this.divisibility,
				duration: this.duration,
				supplyMutable: this.supplyMutable,
				transferable: this.transferable,
				restrictable: this.restrictable,
				revokable: this.revokable
			};
		}
	}
};
</script>
