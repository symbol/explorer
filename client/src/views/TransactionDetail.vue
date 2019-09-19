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
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4 m-0 z-1">
            <InfoRow infoTitle="Transaction Details" :rows="this.transactionDetail" :loading="this.loading"></InfoRow>
          </div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import w1 from '@/components/InfoRow.vue'
import DataService from '../data-service'

export default {
  name: 'block',
  components: {
    InfoRow: w1
  },
  data() {
    return {
      transactionHash: this.$route.params.transactionHash,
      transactionDetail: {
        'Transaction Hash': '',
        Block: '',
        // Timestamp: "",
        Type: '',
        Harvester: '',
        'Block Hash': '',
        Sender: '',
        Recipient: '',
        Amount: '',
        Fee: '',
        Message: '',
        Status: '',
        confirmation: ''
      },
      loading: 0
    }
  },
  created() {
    this.asyncData()
  },
  watch: {
    $route: 'asyncData'
  },
  methods: {
    asyncData() {
      this.transactionHash = this.$route.params.transactionHash
      let self = this
      DataService.getTransactionDetail(this.transactionHash).then(function (data) {
        self.transactionDetail['Transaction Hash'] = self.transactionHash
        self.transactionDetail['Block'] = data.transactionInfo.transaction.blockHeight
        self.transactionDetail['Type'] = data.transactionInfo.transaction.transactionDetail.type
        self.transactionDetail['Harvester'] = data.transactionInfo.transaction.signer
        self.transactionDetail['Recipient'] = data.transactionInfo.transaction.transactionDetail.recipient
        // self.transactionDetail['Amount'] = data.transactionInfo.transaction.transactionDetail.mosaics[0].amount
        self.transactionDetail['Fee'] = data.transactionInfo.transaction.fee
        self.transactionDetail['Status'] = data.transactionInfo.status
        self.transactionDetail['confirmation'] = data.transactionInfo.confirm
        self.loading = 1
      })
    }
  }
}
</script>
