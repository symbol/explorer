<template>
    <div class="col-md-3 network_switch">
        <div class="lang-swtch dropdown">
            <a class="dropdown-toggle">
                Node : {{activeNode}}
            </a>
            <div class="dropdown-menu dropdown-menu-right">
                <a
                    class="dropdown-item"
                    href="#"
                    v-for="(item, index) in options"
                    :key="'dd'+item.value + index"
                    @click="onChange(item)"
                >
                {{item.label}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '../Pagination.vue';

export default {
    props: {
        value: {
            required: true
        }
    },
    
    components: {
        Pagination
    },

    props: {
        options: {
            type: Array,
            required: true
        }
    },

    methods: {
        onChange(value) {
            this.$emit('change', value)
        }
    }
}
</script>