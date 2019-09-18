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
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Transaction Info</h1>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!loading"></loader>
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Transaction Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.transaction_Info.transaction.transactionHash}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/block/' + this.transaction_Info.transaction.blockHeight"
                        >{{this.transaction_Info.transaction.blockHeight}}</router-link></div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transaction_Info.transaction.fee}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Sender</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/account/' + this.transaction_Info.transaction.signer"
                        >{{this.transaction_Info.transaction.signer}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Signature</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transaction_Info.transaction.signature}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transaction_Info.timestamp}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Status</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transaction_Info.status}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Confirmation</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transaction_Info.confirm}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <inforow
              info_title="Transaction Details"
              :inforows="this.transaction_body"
              :loading="this.loading"
            ></inforow>
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
import sdkTransaction from '../infrastructure/getTransaction'
export default {
  name: 'block',
  components: {
    inforow: w1,
  },
  created() {},
  data() {
    return {
      transaction_hash: this.$route.params.trx_hash,
      transaction_Info: {},
      transaction_body: {},
      loading: 0,
    }
  },
  created() {
    // this.asyncData()
  },
  mounted() {
    this.getTransactionByHash()
  },
  methods: {
    async getTransactionByHash() {
      const transactionInfo = await sdkTransaction.getTransactionInfoByHash(
        this.transaction_hash
      )
      this.transaction_Info = transactionInfo
      this.transaction_body = transactionInfo.transaction.transactionBody

      this.loading = 1
    },
  },
}
</script>
