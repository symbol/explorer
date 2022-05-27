<template>
	<div class="address-field">
		<div class="address">
			<router-link :to="getItemHref(itemKey, value)">
				<Truncate>{{value}}</Truncate>
			</router-link>
		</div>

		<span>
			<CopyButton
				title="copy"
				:value="value"
				v-if="value"
				successMessage="addressHasBeenCopied" />
		</span>
	</div>
</template>
<script>
import CopyButton from '../../components/controls/CopyButton.vue';
import TableView from '@/components/tables/TableView.vue';

export default{
	name: 'AddressField',
	extends: TableView,
	components: {
		CopyButton
	},
	props: {
		itemKey: {
			type: String,
			required: true
		},
		value: {
			type: String,
			required: true
		},
	},
	methods: {
		getItemHref (itemKey, item) {
			return this.$store.getters['ui/getPageHref']({ pageName: itemKey, param: item });
		},
	}
}
</script>

<style lang="scss" scoped>
span {
    align-items: center;
    display: flex;
}

.address-field {
    width: 100%;
    display: flex;
    flex-direction: row;
}

.address {
    max-width: 340px;
    width: 90%;
}
</style>
