<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<AccountListItem
				v-for="(value, key) in addedRestriction"
				:key="'ralp_' + key"
				:address="value"
				:value="getTranslation('restrictionAdded')"
			/>

			<AccountListItem
				v-for="(value, key) in removedRestriction"
				:key="'ralp_' + key"
				:address="value"
				:value="getTranslation('restrictionRemoved')"
			/>
		</b-list-group>
	</b-popover>
</template>

<script>
import GraphicComponent from './GraphicComponent.vue';
import AccountListItem from './AccountListItem.vue';

export default {
	extends: GraphicComponent,

	components: {
		AccountListItem
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
