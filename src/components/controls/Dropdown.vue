<template>
    <b-dropdown
        :variant="variant"
        :text="getLabel(value)"
        :size="_size"
        :right="right"
    >
        <b-dropdown-item
            v-for="(label, label_value) in options"
            :key="'dropdown ' + label_value"
            class="ex-dropdown"
            @click="onChange(label_value)"
        >
            {{ label }}
        </b-dropdown-item>
    </b-dropdown>
</template>

<script>
export default {
    props: {
        options: {
            type: Object,
            default: () => ({}),
        },

        value: {
            type: [String, Number],
            default: '',
        },

        changePageAction: {
            type: String,
        },

        dark: {
            type: Boolean,
            default: false,
        },

        right: {
            type: Boolean,
            default: false,
        },

        border: {
            type: Boolean,
            default: true,
        },

        size: {
            type: String,
            default: 'small',
        },
    },

    computed: {
        variant() {
            let variant = '';

            variant = 'outline-';

            if (this.dark === true) variant += 'light';
            else variant += 'info';

            if (this.border === false) variant += ' border-transparent';

            return variant;
        },

        _size() {
            switch (this.size) {
                case 'small':
                    return 'sm';
                case 'medium':
                    return '';
                case 'large':
                    return 'lg';
            }
            return '';
        },
    },

    methods: {
        onChange(e) {
            this.$emit('change', e);
            if (this.changePageAction)
                this.$store.dispatch(this.changePageAction, e);
        },

        getLabel(value) {
            if (this.options && this.options[value] !== void 0)
                return this.options[value];
            return value;
        },
    },
};
</script>
