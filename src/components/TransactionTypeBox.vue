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
  <div class="box-title">
    <h1 class="inline-block">Transactions</h1>
    <div class="btn_grp inline-block flt-rt">
      <div class="select_type">
        <select @change="onChange($event)">
            <option
                v-for="option in Object.keys(transactionTypeMap)"
                :value="option"
            >
                {{transactionTypeMap[option]}}
            </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            transactionTypeMap: {
                'recent': 'Recent Transactions',
                'pending': 'Pending Transactions',
                'transfer': 'Transfer Transactions',
                'multisig': 'Multisig Transactions',
                'mosaic': 'Mosaic Transactions'
            }
        }
    },

    mounted() {
        this.$store.dispatch('transaction/resetPage')
    },

    destroyed() {
        this.$store.dispatch('transaction/resetPage')
    },

    methods: {
        onChange(event) {
            this.$store.dispatch('transaction/changePage', event.target.value)
        }
    }
}
</script>
