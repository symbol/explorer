<template>
	<span
		v-if="hasNamespace"
		:title="getTranslation('namespaceName')"
		style="display: flex"
	>

		<NamespaceIcon
			hideCaption
			:width="16"
			:height="16"
			:namespace="namespace"
		/>
		{{ truncString(namespace.namespaceName, 8) }}
	</span>
</template>

<script>
import GraphicComponent from '@/components/graphics/GraphicComponent.vue';
import NamespaceIcon from '@/components/graphics/NamespaceIcon.vue';

export default {
	extends: GraphicComponent,

	components: {
		NamespaceIcon
	},

	props: {
		value: {
			type: Array,
			required: true,
			default: () => []
		}
	},

	computed: {
		hasNamespace() {
			for (const item of this.value) {
				if (Object.keys(item).includes('namespace'))
					return typeof item.namespace === 'object';
			}
			return false;
		},

		namespace() {
			for (const item of this.value) {
				if (Object.keys(item).includes('namespace'))
					return item.namespace;
			}

			return {};
		}
	}
};
</script>
