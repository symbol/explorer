<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<b-list-group-item
				v-if="isGlobalRestriction"
				class="d-flex justify-content-center align-items-center item"
				:title="titleGlobalRestriction"
			>
				<span class="key">
					{{ truncString(data.restrictionKey, 7) }}
				</span>
				<span class="type">
					{{ restrictionTypeText }}
				</span>
				<span class="value">
					{{ truncString(data.newRestrictionValue, 5) }}
				</span>
			</b-list-group-item>
			<b-list-group-item
				v-if="isAddressRestriction"
				class="d-flex justify-content-center align-items-center item"
				:title="data.restrictionKey + '=' + data.newRestrictionValue"
			>
				<span class="key">
					{{ truncString(data.restrictionKey, 7) }}
				</span>
				<span class="type">
					=
				</span>
				<span class="value">
					{{ truncString(data.newRestrictionValue, 5) }}
				</span>
			</b-list-group-item>
		</b-list-group>
	</b-popover>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	props: {
		data: {
			type: Object,
			default: () => ({})
		},

		title: {
			type: String,
			default: 'Restriction'
		},

		target: {
			type: String,
			required: true
		}
	},

	computed: {
		titleGlobalRestriction() {
			return `${this.getTranslation('restrictionKey')}: ${this.data.restrictionKey}` +
				`${this.getTranslation('newRestrictionType')}: ${this.getTranslation(this.data.newRestrictionType)}` +
				`${this.getTranslation('newRestrictionValue')}: ${this.data.newRestrictionValue}`;
		},

		isGlobalRestriction() {
			return this.data.type === 'mosaic.global';
		},

		isAddressRestriction() {
			return this.data.type === 'mosaic.address';
		},

		restrictionTypeText() {
			const restrictionType = this.data.newRestrictionType;

			switch (restrictionType) {
			case 'MosaicRestrictionType.EQ': return '=';
  				case 'MosaicRestrictionType.GE': return '≥';
  				case 'MosaicRestrictionType.GT': return '>';
  				case 'MosaicRestrictionType.LE': return '≤';
  				case 'MosaicRestrictionType.LT': return '<';
  				case 'MosaicRestrictionType.NE': return '≠';
  				case 'MosaicRestrictionType.NONE': return 'none';
			}
			return '-';
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
    min-width: 250px;
    background: linear-gradient(120deg, var(--primary) 0%, var(--secondary) 100%);

    .key {
        color: #fff;
        font-weight: 700;
        font-size: 12px;
    }

    .type {
        color: #f0f;
        font-weight: 700;
        font-size: 18px;
        line-height: 12px;
        margin: 0 10px;
	}

    .value {
        font-size: 12px;
        color: #fff;
        font-weight: 400;
    }
}
</style>
