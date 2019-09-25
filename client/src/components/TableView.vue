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
            clickableItems: [
                'account',
                'block'
            ],
            keyNames: {
                'datetime': 'Date',
                'address': 'Address',
                'account': 'Account',
                'block': 'Block',
                'mosaic': 'Mosaic',
                'namespace': 'Namespace',
                'transaction': 'Transaction',

                'accounts': 'Account',
                'blocks': 'Block',
                'mosaics': 'Mosaic',
                'namespaces': 'Namespace',
                'transactions': 'Transaction',
            },
            actionMiddleNames: {
                'account': 'Account',
                'block': 'Block',
                'mosaic': 'Mosaic',
                'namespace': 'Namespace',
                'transaction': 'Transaction',

                'accounts': 'Account',
                'blocks': 'Block',
                'mosaics': 'Mosaic',
                'namespaces': 'Namespace',
                'transactions': 'Transaction',
            }
        }
    },


    methods: {
        isItemClickable(itemKey) {
            return this.clickableItems.indexOf(itemKey) !== -1;
        },

        onItemClick(itemKey, item) {
            if(this.isItemClickable(itemKey))
            {
                let actionMiddleName = this.actionMiddleNames[itemKey];
    
                if(actionMiddleName != null)
                    this.$store.dispatch(`open${actionMiddleName}Page`, item);
            }
        },



        getKeyName(key){
            const name = this.keyNames[key];
            return name != null ? name : key;
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