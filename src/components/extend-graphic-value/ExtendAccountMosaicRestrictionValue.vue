<template>
	<div>
		<span
			class="restrictionItem"
			v-if="hasRestrictionAccountMosaicAdditions"
		>
			<b-badge variant="primary" pill>
				{{ additionsCount }} {{ getTranslation('added') }}
			</b-badge>
		</span>

		<span
			class="restrictionItem"
			v-if="hasRestrictionAccountMosaicDeletions"
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
		hasRestrictionAccountMosaicAdditions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionMosaicAdditions'))
					return Array.isArray(item.restrictionMosaicAdditions) && 0 < item.restrictionMosaicAdditions.length;
			}

			return false;
		},

		hasRestrictionAccountMosaicDeletions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionMosaicDeletions'))
					return Array.isArray(item.restrictionMosaicDeletions) && 0 < item.restrictionMosaicDeletions.length;
			}

			return false;
		},

		additionsCount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionMosaicAdditions'))
					return item.restrictionMosaicAdditions.length;
			}

			return 0;
		},

		deletionsCount () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionMosaicDeletions'))
					return item.restrictionMosaicDeletions.length;
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
