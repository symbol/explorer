<template>
    <b-dropdown 
        :variant="variant"
        :text="getLabel(value)"
    >
        <b-dropdown-item 
            v-for="(label, value) in options"
            class="ex-dropdown"
            :key="'dropdown ' + value"
            @click="onChange(value)"
        >
            {{label}}
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
export default {
    props: {
        options: {
            type: Object,
            default: () => ({})
        },

        value: {
            type: [String, Number],
            default: ''
        },

        changePageAction: {
            type: String
        },

        dark: {
            type: Boolean,
            default: false
        },

        border: {
            type: Boolean,
            default: true
        }
    },

    computed: {
        variant() {
            let variant = '';

            variant = 'outline-';

            if(this.dark === true)
                variant += 'light';
            else
                variant += 'info';

            if(this.border === false)
                variant += ' border-transparent' 

            return variant;
        }
    },

    methods: {
        onChange(e) {
            this.$emit('change', e);
            if(this.changePageAction)
                this.$store.dispatch(this.changePageAction, e);
        },

        getLabel(value) {
            if(this.options && this.options[value] !== void 0)
                return this.options[value];
            return value;
        }
    }
}
</script>