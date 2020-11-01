<template>
    <b-popover :target="target" placement="bottom" triggers="hover">
        <template v-slot:title>{{ title }}</template>
        <b-list-group>
            <b-list-group-item
                v-for="(namespace, index) in namespaces"
                :key="'nlp' + namespace.namespaceId + index"
                class="d-flex justify-content-between align-items-center namespace-list"
                :title="namespace.namespaceName"
            >
                <NamespaceIcon
                    :key="'namespace' + namespace.namespaceId + index"
                    hide-caption
                    :width="32"
                    :height="32"
                    :namespace="namespace"
                />
                {{ truncString(namespace.namespaceName, 8) }}
                <i />
            </b-list-group-item>
        </b-list-group>
    </b-popover>
</template>

<script>
import NamespaceIcon from '../graphics/NamespaceIcon.vue';
import GraphicComponent from './GraphicComponent.vue';

export default {
    components: {
        NamespaceIcon,
    },
    extends: GraphicComponent,

    props: {
        namespaces: {
            type: Array,
            default: () => [],
        },

        title: {
            type: String,
            default: 'Namespaces',
        },

        target: {
            type: String,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped>
.namespace-list {
    min-width: 250px;
}
</style>
