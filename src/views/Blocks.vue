<template>
    <div class="page">
        <div class="page-content-card-f">
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    Blocks
                </template>
                <template #control>
                    <h5 v-if="pageIndex === 0"> Chain height: {{chainHeight}} </h5>
                    <Pagination
                        v-else
                        :pageIndex="pageIndex"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>
                <template #body>
                    <TableListView
                        :data="blockList"
                    />
                    <Pagination
                        style="margin-top: 20px;"
                        :pageIndex="pageIndex"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>
            </Card>
        </div>
    </div>
</template>

<script>
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  mounted() {
    this.$store.dispatch('block/initialize')
  },

  data() {
    return {
      nextPageAction: 'block/fetchNextPage',
      previousPageAction: 'block/fetchPreviousPage'
    }
  },

  computed: {
    ...mapGetters({
      chainHeight: 'chain/getBlockHeight',
      blockList: 'block/getPageListFormatted',
      loading: 'block/getLoading',
      pageIndex: 'block/getPageIndex'
    })

  },

  destroyed() {
    this.$store.dispatch('block/resetPage')
  }
}
</script>

<style lang="scss" scoped>

</style>
