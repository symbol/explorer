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
				:address="signer"
			/>
			<Arrow :x="arrowPositionX" :y="arrowPositionY" />
			<EditCircle
				:x="getCircleIconPositionX(0)"
				:y="circleIconPositionY"
				:data="data"
				:title="transactionType"
			/>
			<AccountCircle
				v-if="!!addressAdditions.length"
				:x="getCircleIconPositionX(1)"
				:y="circleIconPositionY"
				:accounts="addressAdditions"
			/>
			<AccountRemoveCircle
				v-if="!!addressDeletions.length"
				:x="getCircleIconPositionX(2)"
				:y="circleIconPositionY"
				:accounts="addressDeletions"
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
import AccountCircle from '../graphics/AccountCircle.vue';
import AccountRemoveCircle from '../graphics/AccountRemoveCircle.vue';
import EditCircle from '../graphics/EditCircle.vue';
import Arrow from '../graphics/Arrow.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountIcon,
		AccountCircle,
		AccountRemoveCircle,
		EditCircle,
		Arrow
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
		minRemovalDelta: {
			type: Number,
			required: true
		},
		minApprovalDelta: {
			type: Number,
			required: true
		},
		addressAdditionsCount: {
			type: Number
		},
		addressDeletionsCount: {
			type: Number
		},
		addressAdditions: {
			type: Array,
			default: () => []
		},
		addressDeletions: {
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
			return [true, !!this.addressAdditions.length, !!this.addressDeletions.length];
		},

		data () {
			return {
				minRemovalDelta: this.minRemovalDelta,
				minApprovalDelta: this.minApprovalDelta
			};
		}
	}
};
</script>
