<template>
    <div class="page">
        <div class="page-content-card-f">
            <template v-for="(item, index) in schema">
                <Card
                    v-if="isItemShown(item)"
                    class="card-f"
                    :class="{'card-full-width': item.fullWidth, 'card-adaptive': !item.fullWidth}"
                    :loading="getter(item.loading)"
                    :error="getter(item.error)"
                    :key="item.title + index"
                >
                    <template #title>
                        {{getNameByKey(item.title)}}
                    </template>

                    <template #control>
                        <template v-for="(headerItem, headerIndex) in item.header">
                            <DropDown
                                v-if="headerItem.type === 'filter'"
                                :value="getter(headerItem.filterValue)"
                                :options="getter(headerItem.filterOptions)"
                                @change="getter(headerItem.filterChange)"
                                :key="item.title + index + 'h' + headerIndex"
                            />
                            <Pagination
                                v-else-if="headerItem.type === 'Pagination'"
                                v-bind="headerItem"
                                :key="item.title + index + 'h' + headerIndex"
                            />
                        </template>
                    </template>

                    <template #body v-if="item.body">
                        <component 
                            :is="item.body" 
                            :data="getter(item.data)" 
                            :pagination="item.pagination" 
                            :pageSize="item.pageSize"
                        />
                    </template>

                    <template #error v-if="item.error">
                        {{item.errorMessage}}
                        <br>
                        {{prop}}
                    </template>
                </Card>
            </template>
            
        </div>
    </div>
</template>

<script>
import View from './View.vue'
import MetadataEntries from '../components/MetadataEntries'
import { mapGetters } from 'vuex'

export default {
    extends: View,
    components: { MetadataEntries },
    props: {
        schema: {
            type: Array,
            required: true,
            default: () => ([])
        }
    },

    computed: {
        prop() {
            for(let key in this.$route.params)
                return this.$route.params[key];
        }
    },

    methods: {
        getter(e) {
            if(typeof e === 'string')
                return this.$store.getters[e];
        },

        isItemShown(item) {
            return !item.hideEmptyData || this.getter(item.data)?.length > 0;
        },

        getNameByKey(e) {
            return this.$store.getters['ui/getNameByKey'](e)
        }
    }

};
</script>

<style lang="scss" scoped></style>
