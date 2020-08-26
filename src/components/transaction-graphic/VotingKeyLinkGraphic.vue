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
				:address="linkedAccountAddress"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<KeyLinkCircle
				v-if="isLinkAction"
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				title="Voting Key Link"
				:data="keyLinkInfo"
			/>
			<KeyUnlinkCircle
				v-else
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				title="Voting Key Link"
				:data="keyLinkInfo"
			/>
			<text :x="transactionTypeTextPositionX" :y="transactionTypeTextPositionY" text-anchor="middle" class="message">
				{{ transactionType + subTitle }}
				<title>{{ transactionType }}</title>
			</text>
		</svg>
	</div>
</template>

<script>
import GraphicComponent from '../graphics/GraphicComponent.vue';
import AccountIcon from '../graphics/AccountIcon.vue';
import KeyLinkCircle from '../graphics/KeyLinkCircle.vue';
import KeyUnlinkCircle from '../graphics/KeyUnlinkCircle.vue';
import Arrow from '../graphics/Arrow.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		Arrow,
		KeyLinkCircle,
		KeyUnlinkCircle
	},

	props: {
		type: {
			type: Number,
			default: TransactionType.VOTING_KEY_LINK
		},
		message: {
			type: String,
			default: ''
		},
		signer: {
			type: String,
			required: true,
			default: ''
		},
		linkedAccountAddress: {
			type: String,
			required: true,
			default: ''
		},
		linkAction: {
			type: String,
			required: true,
			default: ''
		},
		linkedPublicKey: {
			type: String,
			required: true,
			default: ''
		},
		startPoint: {
			type: Number
		},
		endPoint: {
			type: Number
		}
	},

	data() {
		return {
			width: this.transactionGraphicWidth,
			heigth: this.transactionGraphicHeight
		};
	},

	computed: {
		transactionType() {
			return this.getTransactionTypeCaption(this.type);
		},

		circleIconsToDisplay() {
			return [true];
		},

		isLinkAction() {
			return this.linkAction === 'Link';
		},

		subTitle() {
			return `. ${this.linkAction} account`;
		},

		keyLinkInfo() {
			return {
				publicKey: this.linkedPublicKey,
				startPoint: this.startPoint,
				endPoint: this.endPoint
			};
		}
	}
};
</script>
