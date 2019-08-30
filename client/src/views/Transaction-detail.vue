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
            <inforow info_title="Transaction Details" :inforows="this.trx_detail" :loading="this.loading"></inforow>
          </div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from '../router'
import w1 from '@/components/inforow.vue'
import DataService from '../data-service'
export default {
  name: 'block',
  components: {
    inforow: w1
  },
  created () {},
  data () {
    return {
      trx_hash: this.$route.params.trx_hash,
      trx_detail: {
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
      loading:0
    }
  },
  created () {
    this.asyncData()
  },
  watch: {
    $route: 'asyncData'
  },
  methods: {
    asyncData () {
      this.trx_hash = this.$route.params.trx_hash
      let self = this
      DataService.getTrxdetail(this.trx_hash).then(function (data) {
        self.trx_detail['Transaction Hash'] = self.trx_hash
        self.trx_detail['Block'] = data.transactionInfo.transaction.blocHeight
        self.trx_detail['Type'] = data.transactionInfo.transaction.transactionDetail.type
        self.trx_detail['Harvester'] = data.transactionInfo.transaction.signer
        self.trx_detail['Recipient'] = data.transactionInfo.transaction.transactionDetail.recipient
       // self.trx_detail['Amount'] = data.transactionInfo.transaction.transactionDetail.mosaics[0].amount
        self.trx_detail['Fee'] = data.transactionInfo.transaction.fee
        self.trx_detail['Status'] = data.transactionInfo.status
        self.trx_detail['confirmation'] = data.transactionInfo.confirm
        self.loading=1;
      })
    }
  }
}
</script>
