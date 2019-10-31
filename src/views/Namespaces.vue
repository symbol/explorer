/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

<template>
    <div class="page">
        <div class="page-content-card-f">
            <Card
                class="card-f card-full-width"
                :loading="loading"
            >
                <template #title>
                    Namespaces
                </template>
                <template #control>
                    <Pagination
                        v-if="canFetchPrevious"
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
                        :nextPageAction="nextPageAction"
                        :previousPageAction="previousPageAction"
                    />
                </template>

                <template #body>
                    <TableListView
                        :data="namespaceList"
                    />
                    <Pagination
                        style="margin-top: 20px;"
                        :canFetchPrevious="canFetchPrevious"
                        :canFetchNext="canFetchNext"
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
    this.$store.dispatch('namespace/initialize')
  },

  data() {
    return {
      nextPageAction: 'namespace/fetchNextPage',
      previousPageAction: 'namespace/fetchPreviousPage'
    }
  },

  computed: {
    ...mapGetters({
      namespaceList: 'namespace/getTimelineFormatted',
      canFetchPrevious: 'mosaic/getCanFetchPrevious',
      canFetchNext: 'mosaic/getCanFetchNext',
      loading: 'namespace/getLoading'
    })

  },

  destroyed() {
    this.$store.dispatch('namespace/resetPage')
  }
}
</script>
