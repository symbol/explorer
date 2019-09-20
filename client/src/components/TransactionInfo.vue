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
<div class="trx-info">
  <div class="inrw">
    <span>Block Height {{ item.blockHeight }}</span>
    <span>{{item.transactionDetail.type}}</span>
  </div>
  <div class="inrw flex">
    <span>Sender</span>
    <AddressLink :address="item.signer.address.address" class="acnt"/>
  </div>
</div>
</template>
<script>
import w1 from '@/components/AddressLink.vue'

export default {
  name: 'TransactionInfo',
  components: {
    AddressLink: w1
  },
  props: {
    item: {}
  }
}
</script>
