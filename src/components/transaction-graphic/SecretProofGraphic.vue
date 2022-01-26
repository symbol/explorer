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
			<LockCircle
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				title="Secret Proof"
				:data="secretProofInfo"
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
import LockCircle from '../graphics/LockCircle.vue';
import Arrow from '../graphics/Arrow.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		LockCircle,
		Arrow
	},

	props: {
		type: {
			type: Number,
			required: true,
			default: TransactionType.SECRET_PROOF
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
		secret: {
			type: String,
			required: true,
			default: ''
		},
		hashAlgorithm: {
			type: String,
			required: true,
			default: ''
		},
		proof: {
			type: String,
			required: true,
			default: ''
		}
	},

	computed: {
		transactionType () {
			return this.getTransactionTypeCaption(this.type);
		},

		circleIconsToDisplay () {
			return [true];
		},

		secretProofInfo () {
			return {
				secret: this.secret,
				hashAlgorithm: this.hashAlgorithm,
				proof: this.proof
			};
		}
	}
};
</script>
