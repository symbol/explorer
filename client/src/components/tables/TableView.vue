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

.table-titles {
    background-color: rgba(52, 40, 104, .05);
    //border-radius: 4px;
}

.table-title-item {
    vertical-align: middle;
    border: 0 none;
    padding: 12px 6px 12px 6px;
    color: #0997a3;
    font-weight: 500;
    outline: none;
    font-size: 12px;
    letter-spacing: 1px;
}

.table-titles-ver {
    width: 30%;
    max-width: 200px;
}

</style>