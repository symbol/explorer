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
  <div class="table-responsive">
    <div
      id="sorting-table_wrapper"
      class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
    >
      <table
        id="table-block-list"
        class="table table-striped table-bordered"
        cellspacing="0"
        width="100%"
      >
        <thead>
          <tr>
            <th>Block Height</th>
            <th>Age</th>
            <th>Transactions</th>
            <th>Fee</th>
            <th>Timestamp</th>
            <th>Harvester</th>
          </tr>
        </thead>
        <tbody>
          <BlockRow
            :item="item"
            v-for="item in blockList"
            v-bind:key="item.height"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import w1 from '@/components/BlockRow.vue'

export default {
  name: 'BlockTable',
  components: {
    BlockRow: w1
  },
  props: {
    blockList: {}
  }
}
</script>
