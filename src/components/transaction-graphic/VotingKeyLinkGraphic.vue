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
			<KeyCircle
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
import KeyCircle from '../graphics/KeyCircle.vue';
import KeyUnlinkCircle from '../graphics/KeyUnlinkCircle.vue';
import Arrow from '../graphics/Arrow.vue';
import { TransactionType } from 'symbol-sdk';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		Arrow,
		KeyCircle,
		KeyUnlinkCircle
	},

	props: {
		type: {
			type: Number,
			default: TransactionType.VOTING_KEY_LINK
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
		startEpoch: {
			type: Number
		},
		endEpoch: {
			type: Number
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

		isLinkAction () {
			return 'Link' === this.linkAction;
		},

		subTitle () {
			return `. ${this.linkAction} account`;
		},

		keyLinkInfo () {
			return {
				publicKey: this.linkedPublicKey,
				startEpoch: this.startEpoch,
				endEpoch: this.endEpoch
			};
		}
	}
};
</script>
