<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<TransactionTypeListItem
				v-for="(value, key) in addedRestriction"
				:key="'rolp_' + key"
				:transactionType="value"
				:value="getTranslation('restrictionAdded')"
			/>

			<TransactionTypeListItem
				v-for="(value, key) in removedRestriction"
				:key="'rolp_' + key"
				:transactionType="value"
				:value="getTranslation('restrictionRemoved')"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';
import TransactionTypeListItem from './TransactionTypeListItem.vue';

export default {
	extends: GraphicComponent,

	components: {
		TransactionTypeListItem
	},

	props: {
		data: {
			type: Object,
			default: () => ({})
		},

		title: {
			type: String,
			default: 'Table'
		},

		target: {
			type: String,
			required: true
		}
	},
	computed: {
		addedRestriction () {
			return this.data.added;
		},
		removedRestriction () {
			return this.data.removed;
		}
	},
	methods: {
		getTranslation (key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>
