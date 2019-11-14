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
    <div class="pagination-wrapper">
        <DisabledPaginationArrows
            v-if="!canFetchPrevious && !canFetchNext"
        />

        <ButtonMore
            v-else-if="!canFetchPrevious"
            @click="nextPage"
        >
            More
        </ButtonMore>

        <ButtonLess
            v-else-if="!canFetchNext"
            @click="previousPage"
        >
            Less
        </ButtonLess>

        <PaginationArrows
            v-else
            :nextPageAction="nextPageAction"
            :previousPageAction="previousPageAction"
        />
    </div>
</template>

<script>
import ButtonLess from './ButtonLess.vue'
import ButtonMore from './ButtonMore.vue'
import DisabledPaginationArrows from './DisabledPaginationArrows.vue'
import PaginationArrows from './PaginationArrows.vue'

export default {
    components: {
        ButtonLess,
        ButtonMore,
        DisabledPaginationArrows,
        PaginationArrows
    },

    props: {
        canFetchPrevious: {
            type: Boolean,
            required: true
        },

        canFetchNext: {
            type: Boolean,
            required: true
        },

        nextPageAction: {
            type: String,
            required: true
        },

        previousPageAction: {
            type: String,
            required: true
        }
    },

    methods: {
        nextPage() {
            this.$store.dispatch(this.nextPageAction)
        },

        previousPage() {
            this.$store.dispatch(this.previousPageAction)
        }
    }
}
</script>

<style lang="scss" scoped>
.pagination-wrapper {
    float: right;
}
</style>
