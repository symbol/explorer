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

<script>
import TableListView from '@/components/tables/TableListView.vue'
import TableInfoView from '@/components/tables/TableInfoView.vue'
import DropDown from '@/components/controls/DropDown.vue'
import Pagination from '@/components/controls/Pagination.vue'
import Card from '@/components/containers/Card.vue'
import Modal from '@/components/containers/Modal.vue'

export default {
    components: {
        TableListView,
        TableInfoView,
        Card,
        DropDown,
        Pagination,
        Modal
    },

    mounted() {
        this.$store.dispatch('initialize', this.$route)
    }
}
</script>

<style lang="scss">
.page {
    .page-content-card-f {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }

    .card-f {
        margin: 10px;
    }

    .card-adaptive {
        flex: 1 1 auto;
        max-width: 100%;
    }

    .card-full-width {
        width: 100%;
    }

    .max-height-medium {
        max-height: 100px;
    }

    @media screen and (max-width: 40em) {
        .page-content-card-f {
            padding-left: 0;
            padding-right: 0;
        }

        .card-f {
            padding: 5px;
            padding-top: 10px;
            margin-left: 0;
            margin-right: 0;
            width: 100%;
        }
    }

    @media screen and (min-width: 80em) {
        .page-content-card-f {
            padding-left: 80px;
            padding-right: 80px;
        }

        .card-f {
            margin-right: 10px;
        }
    }
}
</style>
