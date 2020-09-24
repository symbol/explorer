<template>
	<b-popover :target="target" placement="bottom" triggers="hover">
		<template v-slot:title>{{ title }}</template>
		<b-list-group>
			<b-list-group-item
				v-for="(value, key) in addedRestriction"
				class="d-flex justify-content-between align-items-center table-list"
				:key="'rlp_added_' + value + key"
				:title="getTranslation('Added') + ': ' + value"
			>
				<span class="key">
					+
				</span>
				<span class="value">
					{{getTranslation(value)}}
				</span>
			</b-list-group-item>

			<b-list-group-item
				v-for="(value, key) in removedRestriction"
				class="d-flex justify-content-between align-items-center table-list"
				:key="'rlp_removed_' + value + key"
				:title=" getTranslation('Removed') + ': ' + value"
			>
				<span class="key">
					-
				</span>
				<span class="value">
					{{getTranslation(value)}}
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
			default: 'Table'
		},

		target: {
			type: String,
			required: true
		}
	},
	computed: {
		addedRestriction() {
			return this.data.added;
		},
		removedRestriction() {
			return this.data.removed;
		}
	},
	methods: {
		getTranslation(key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>

<style lang="scss" scoped>
.test {
    border: none;
}

.table-list {
    min-width: 250px;

    .key {
        color: $table-title-text-color;
        font-weight: bolder;
        font-size: 12px;
        letter-spacing: 1px;
    }

    .value {
        display:flex;
        font-size: 12px;
        color: $table-text-color;
    }
}
</style>
