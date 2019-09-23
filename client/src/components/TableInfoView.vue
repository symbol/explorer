<template>
    <div 
        class="table-list"
    >
        <table class="table">
            
            <tbody>
                <tr
                    v-for="(item, itemKey) in data"
                    :key="view+'r'+itemKey"
                >
                    <td
                        class="table-left-header"
                    >
                        {{getKeyName(itemKey)}}
                    </td>
                    <td
                        :class="{'table-item-clickable': isItemClickable(itemKey)}"
                        @click="onItemClick(itemKey, item)"
                    >
                        {{item}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import TableView from './TableView.vue'
export default {
    extends: TableView,

    props: {
        // data: {
        //     type: Object,
        //     required: true
        // }

        infoId: {
            type: String,
            required: true
        }
    },

    mounted() {
        this.$store.dispatch(this.view + "/fetchInfo", this.infoId);
    },

    computed: {
        data() {
            let data = this.$store.getters[this.view + "/getPageInfo"];
            if(typeof data === 'object')
                return data;
            else
                return null;
        },

        header() {
            let header = ["", ""];
            return header;
        }
    }
}
</script>

<style lang="scss" scoped>

.table-pagination {
    float: right;
}

.table-left-header {
    font-weight: bold;
}

</style>