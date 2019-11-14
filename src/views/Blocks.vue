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
