<template>
    <div class="col-md-3 network_switch">
        <div class="lang-swtch dropdown">
            <a class="dropdown-toggle">
                Node : {{currentNode}}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a
                    class="dropdown-item"
                    href="#"
                    v-for="(node, index) in nodeList"
                    :key="'dd'+node.value + index"
                    @click="setNode(node.value)"
                >
                {{node.name}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    computed: {
        nodelist() {
            return this.$store.getters['api/nodeList'];
        },

        currentNode() {
            return this.$store.getters['api/currentNode'];
        },
    },

    methods: {
        setNode(value) {
            this.$store.dispatch('api/nodeChange', value);
        }
    }
}
</script>