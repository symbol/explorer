<template>
	<div>
		<span
			class="restrictionItem"
			v-if="hasRestrictionOperationAdditions"
		>
			<span
				v-for="(restriction, index) in operationAdditions"
				:key="'restriction_' + index"
				:title="getTranslation('restrictionAdded') + ': ' + getTranslation('transactionDescriptor_' + restriction)"
			>
				<TransactionType hideCaption size="small" :value="restriction" />
			</span>

		</span>

		<span
			class="restrictionItem"
			v-if="hasRestrictionOperationDeletions"
		>
			<span
				v-for="(restriction, index) in operationDeletions"
				:key="'restriction_' + index"
				:title="getTranslation('restrictionRemoved') + ': ' + getTranslation('transactionDescriptor_' + restriction)"
			>
				<TransactionType hideCaption size="small" :value="restriction" />
			</span>
		</span>
	</div>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';
import TransactionType from '@/components/fields/TransactionType.vue';

export default {
	extends: GraphicComponent,

	components: {
		TransactionType
	},

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasRestrictionOperationAdditions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionOperationAdditions'))
					return Array.isArray(item.restrictionOperationAdditions) && 0 < item.restrictionOperationAdditions.length;
			}

			return false;
		},

		hasRestrictionOperationDeletions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionOperationDeletions'))
					return Array.isArray(item.restrictionOperationDeletions) && 0 < item.restrictionOperationDeletions.length;
			}

			return false;
		},

		operationAdditions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionOperationAdditions'))
					return [...new Set(item.restrictionOperationAdditions)];
			}

			return [];
		},

		operationDeletions () {
			for (const item of this.value) {
				if (Object.keys(item).includes('restrictionOperationDeletions'))
					return [...new Set(item.restrictionOperationDeletions)];
			}

			return [];
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
