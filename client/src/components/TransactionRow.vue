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
  <tr>
    <td><BlockHeightLink :height="item.blockHeight"/></td>
    <td><TransactionHashLink :hash="item.transactionHash"/></td>
    <td>{{item.transactionBody.type}}</td>
    <td><AddressLink :address="item.signer" :count="20"/></td>
    <td>
      <AddressLink
        v-if="item.transactionBody.recipient"
        :address="item.transactionBody.recipient.address"
        :count="20"
      />
    </td>
    <td>{{item.fee}}</td>
    <td>{{item.deadline}}</td>
  </tr>
</template>
<script>
import w1 from '@/components/BlockHeightLink.vue'
import w2 from '@/components/TransactionHashLink.vue'
import w3 from '@/components/AddressLink.vue'

export default {
  name: 'TransactionRow',
  components: {
    BlockHeightLink: w1,
    TransactionHashLink: w2,
    AddressLink: w3
  },
  props: {
    item: {}
  }
}
</script>
