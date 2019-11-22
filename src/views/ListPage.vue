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
                :error="error"
            >
                <template #title>
                    {{title}}
                </template>
                <template #control>
                    <div class="ex-infotext" v-if="hasInfoText"> {{infoText}} </div>
                    <TypeBox
                        v-if="hasFilter"
                        :typeMap="filterOptions"
                        :resetPageAction="resetPageAction"
                        :changePageAction="changePageAction"
                    />
                </template>
                <template #body>
                    <TableListView
                        :data="timeline"
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
                    Unable to fetch accounts data.
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import TypeBox from '@/components/TypeBox.vue'
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  components: {
    TypeBox
  },

  props: {
      namespace: {
          type: String,
          required: true
      },

      title: {
          type: String,
          required: true
      },

      hasFilter: {
          type: Boolean,
          default: false
      },

      hasInfoText: {
          type: Boolean,
          default: false
      },
  },

  mounted() {
    this.$store.dispatch(this.resetPageAction)
  },

  computed: {
    timeline() { return this.$store.getters[this.namespace + '/getTimelineFormatted'] },
    canFetchPrevious() { return this.$store.getters[this.namespace + '/getCanFetchPrevious'] },
    canFetchNext() { return this.$store.getters[this.namespace + '/getCanFetchNext'] },
    loading() { return this.$store.getters[this.namespace + '/getLoading'] },
    error() { return this.$store.getters[this.namespace + '/getError'] },

    infoText() { return this.$store.getters[this.namespace + '/infoText'] },

    filterValue() { return this.$store.getters[this.namespace + '/filterValue'] },
    filterOptions() { return this.$store.getters[this.namespace + '/filterOptions'] },

    nextPageAction() { return this.namespace + '/fetchNextPage' },
    previousPageAction() { return this.namespace + '/fetchPreviousPage' },
    resetPageAction() { return this.namespace + '/resetPage' },
    changePageAction() { return this.namespace + '/changePage' }
  },

  destroyed() {
    this.$store.dispatch(this.resetPageAction)
  }
}
</script>
