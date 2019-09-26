<script>
export default {
    props: {
        view: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            componentType: 'list',
            clickableItems: [
                'account',
                'block'
            ],
            
        }
    },

    methods: {
        isItemClickable(itemKey) {
            return this.clickableItems.indexOf(itemKey) !== -1;
        },

        onItemClick(itemKey, item) {
            if(this.isItemClickable(itemKey))
                this.$store.dispatch(`ui/openPage`, { pageName: itemKey, param: item });
            
        },

        getKeyName(key){
            return this.$store.getters['ui/getNameByKey'](key)
        }
    }
}
</script>

<style lang="scss">

.table-item-clickable {
    color: #0997a3;
    font-weight: bold;
    cursor: pointer;
}

</style>