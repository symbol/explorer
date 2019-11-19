<template>
    <div class="page">
        <div class="page-content-card-f">
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{title}}
                </template>
                <template #control>
                    <h5 v-if="!canFetchPrevious"> Chain height: {{chainHeight}} </h5>
                    <Pagination
                        v-else
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
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
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>

                <template #error>
                    Unable to fetch blocks data.
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

  data() {
    return {
      title: 'Blocks',
      nextPageAction: 'block/fetchNextPage',
      previousPageAction: 'block/fetchPreviousPage'
    }
  },

  computed: {
    ...mapGetters({
      chainHeight: 'chain/getBlockHeight',
      timeline: 'block/getTimeline',
      blockList: 'block/getTimelineFormatted',
      canFetchPrevious: 'block/getCanFetchPrevious',
      canFetchNext: 'block/getCanFetchNext',
      loading: 'block/getLoading',
      error: 'block/getError'
    })
  },

  destroyed() {
    this.$store.dispatch('block/resetPage')
  }
}
</script>
