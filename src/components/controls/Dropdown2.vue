<template>
    <b-dropdown :text="getLabel(value)">
        <b-dropdown-item 
            v-for="(label, value) in options"
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
        }
    },

    methods: {
        onChange(e) {
            console.log(e)
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

<style lang="scss" scoped>

</style>