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
			<EditCircle
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
import EditCircle from '../graphics/EditCircle.vue';
import MosaicIcon from '../graphics/MosaicIcon.vue';
import Arrow from '../graphics/Arrow.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		EditCircle,
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
		delta: {
			type: Number,
			required: true
		},
		action: {
			type: String,
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
			return this.getTransactionTypeCaption(this.type); // Mosaic alias
		},

		circleIconsToDisplay () {
			return [true];
		},

		mosaic () {
			return { mosaicId: this.mosaicId };
		},

		data () {
			return {
				mosaicId: this.mosaicId,
				delta: this.delta,
				action: this.action
			};
		}
	}
};
</script>
