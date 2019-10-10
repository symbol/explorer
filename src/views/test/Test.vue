<template>
    <div>
        {{mosaics}}
        <button @click="getMosaics"> Get mosaic </button>
    </div>
</template>

<script>
export default {
    computed: {
        mosaics() {
            console.log(this.$store.getters['mosaic/getMosaicInfo'])
            return this.$store.getters['mosaic/getMosaicInfo'];
        }
    },
    methods: {
        getMosaics() {
            this.$store.dispatch('mosaic/fetchMosaicInfo', 'D525AD41D95FCF29')
        }
    }
}
</script>
