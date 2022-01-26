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
			<LockIcon
				:x="objectPositionX"
				:y="objectPositionY"
				:width="subjectWidth"
				:height="subjectHeight"
				:lockName="subTitle"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<MosaicsCircle
				id="target"
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:mosaics="mosaics"
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
import LockIcon from '../graphics/LockIcon.vue';
import MosaicsCircle from '../graphics/MosaicsCircle.vue';
import { TransactionType } from 'symbol-sdk';
import Arrow from '../graphics/Arrow.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		LockIcon,
		MosaicsCircle,
		Arrow
	},

	props: {
		type: {
			type: Number,
			default: TransactionType.HASH_LOCK
		},
		signer: {
			type: String,
			required: true,
			default: ''
		},
		duration: {
			type: Number
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
			return [true];
		},

		subTitle () {
			return `${this.duration} Blocks`;
		}
	}
};
</script>
