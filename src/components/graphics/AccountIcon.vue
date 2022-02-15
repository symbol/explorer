<template>
	<svg
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		:x="_x"
		:y="_y"
		:width="_width"
		:height="_height"
		:viewBox="viewBox"
		xml:space="preserve"
		class="account"
		@click="onAccountClick(address)"
	>
		<title> {{ title }} </title>
		<rect
			x="25.266"
			y="107.646"
			fill-rule="evenodd"
			clip-rule="evenodd"
			fill="none"
			width="207.333"
			height="23.667"
		/>
		<text
			v-if="!hideCaption"
			x="130"
			y="122.8457"
			class="account-text"
			text-anchor="middle"
		>{{ truncatedAddress }}</text>

		<svg
			x="96px"
			y="30px"
		>
			<path d="M2.5 32C2.5 15.4315 15.9315 2 32.5 2V2C49.0685 2 62.5 15.4315 62.5 32V32C62.5 48.5685 49.0685 62 32.5 62V62C15.9315 62 2.5 48.5685 2.5 32V32Z"
				:fill="iconColor"
			/>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M27.6558 24.1875C27.6558 21.5124 29.8244 19.3438 32.4995 19.3438C35.1746 19.3438 37.3433 21.5124 37.3433 24.1875C37.3433 26.8626 35.1746 29.0312 32.4995 29.0312C29.8244 29.0312 27.6558 26.8626 27.6558 24.1875ZM32.4995 16.5312C28.2711 16.5312 24.8433 19.9591 24.8433 24.1875C24.8433 28.4159 28.2711 31.8437 32.4995 31.8437C36.7279 31.8437 40.1558 28.4159 40.1558 24.1875C40.1558 19.9591 36.7279 16.5312 32.4995 16.5312ZM22.9683 42.9375C22.9683 40.2624 25.1369 38.0938 27.812 38.0938H37.187C39.8621 38.0938 42.0308 40.2624 42.0308 42.9375C42.0308 43.8867 41.2612 44.6562 40.312 44.6562H24.687C23.7378 44.6562 22.9683 43.8867 22.9683 42.9375ZM27.812 35.2812C23.5836 35.2812 20.1558 38.7091 20.1558 42.9375C20.1558 45.44 22.1845 47.4687 24.687 47.4687H40.312C42.8146 47.4687 44.8433 45.44 44.8433 42.9375C44.8433 38.7091 41.4154 35.2812 37.187 35.2812H27.812Z"
				fill="black"
			/>
			<path
				d="M32.5 60.125C16.967 60.125 4.375 47.533 4.375 32H0.625C0.625 49.6041 14.8959 63.875 32.5 63.875V60.125ZM60.625 32C60.625 47.533 48.033 60.125 32.5 60.125V63.875C50.1041 63.875 64.375 49.6041 64.375 32H60.625ZM32.5 3.875C48.033 3.875 60.625 16.467 60.625 32H64.375C64.375 14.3959 50.1041 0.125 32.5 0.125V3.875ZM32.5 0.125C14.8959 0.125 0.625 14.3959 0.625 32H4.375C4.375 16.467 16.967 3.875 32.5 3.875V0.125Z"
				:fill="iconColor"
			/>
		</svg>
	</svg>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	props: {
		width: {
			type: Number,
			default: 261.333
		},

		height: {
			type: Number,
			default: 131.313
		},

		address: {
			type: String,
			required: true
		},

		hideCaption: {
			type: Boolean,
			default: false
		}
	},

	data () {
		return {
			id: this.getId('account-icon')
		};
	},

	computed: {
		title () {
			return this.getTranslation('address') + ': ' + this.address;
		},

		iconColor () {
			return this.getIconColor(this.address);
		},

		truncatedAddress () {
			return this.truncString(this.address);
		},

		viewBox () {
			return this.hideCaption
				? '95 30 70 65'
				: '0 0 261.333 131.313';
		}
	}
};
</script>

<style lang="scss" scoped>
.account {
    cursor: pointer;
}

.account-text {
    font-size: 18px;
    font-weight: bold;
    fill: var(--clickable-text);
}
</style>
