<template>
	<div>
		<span
			class="restrictionItem"
			v-if="hasRestrictionAccountAddressAdditions"
		>
			<b-badge variant="primary" pill>
				{{ additionsCount }} {{ getTranslation('added') }}
			</b-badge>
		</span>

		<span
			class="restrictionItem"
			v-if="hasRestrictionAccountAddressDeletions"
		>
			<b-badge variant="primary" pill>
				{{ deletionsCount }} {{ getTranslation('removed') }}
			</b-badge>
		</span>
	</div>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';

export default {
	extends: GraphicComponent,

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasRestrictionAccountAddressAdditions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionAddressAdditions'))
					return Array.isArray(item.restrictionAddressAdditions) && 0 < item.restrictionAddressAdditions.length;
			}

			return false;
		},

		hasRestrictionAccountAddressDeletions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionAddressDeletions'))
					return Array.isArray(item.restrictionAddressDeletions) && 0 < item.restrictionAddressDeletions.length;
			}

			return false;
		},

		additionsCount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionAddressAdditions'))
					return item.restrictionAddressAdditions.length;
			}

			return 0;
		},

		deletionsCount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionAddressDeletions'))
					return item.restrictionAddressDeletions.length;
			}

			return 0;
		}
	}

};
</script>

<style lang="scss" scoped>
.restrictionItem {
    display: flex;
    flex-wrap: wrap;
}
</style>
