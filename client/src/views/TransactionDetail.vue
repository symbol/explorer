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
                <h1 class="inline-block">Transaction Info - {{transactionInfo.transaction.transactionBody.type}}</h1>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!loading"></loader>
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Transaction Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.transaction.transactionHash}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/block/' + transactionInfo.transaction.blockHeight"
                        >{{transactionInfo.transaction.blockHeight}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.transaction.fee}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Sender</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/account/' + transactionInfo.transaction.signer"
                        >{{transactionInfo.transaction.signer}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Signature</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.transaction.signature}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.timestamp}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Status</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.status}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Confirmation</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{transactionInfo.confirm}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if='transactionInfo.transaction.transactionBody.type === "AggregateBonded"' class="widget has-shadow">
              <div class="box">
                <div class="tabs-con">
                  <tabs>
                    <tab title="Transactions">
                      <DataTable
                        :tableHead="this.innerTransactions.head"
                        :tableData="this.innerTransactions.data"
                      ></DataTable>
                    </tab>
                    <tab title="Cosignatures">
                      <DataTable
                        :tableHead="this.cosignatures.head"
                        :tableData="this.cosignatures.data"
                      ></DataTable>
                    </tab>
                  </tabs>
                </div>
              </div>
            </div>

            <InfoRow v-else
              infoTitle="Transaction Details"
              :rows="this.transactionInfo.transaction.transactionBody"
              :loading="this.loading"
            ></InfoRow>

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
import w2 from '@/components/TableDynamic.vue'
import { Tabs, Tab } from 'vue-slim-tabs'
import DataService from '../data-service'
import sdkTransaction from '../infrastructure/getTransaction'
export default {
  name: 'block',
  components: {
    Tabs,
    Tab,
    InfoRow: w1,
    DataTable: w2,
  },
  created() {},
  data() {
    return {
      transactionHash: this.$route.params.transactionHash,
      transactionInfo: {},
      loading: 0,
      innerTransactions: {
        head: [
          '#',
          'Transaction ID',
          'Type',
          'Message',
          'Mosaics',
          'Sender',
          'Recipient',
        ],
        data: [],
      },
      cosignatures: {
        head: ['#', 'signature', 'signer'],
        data: [],
      },
    }
  },
  mounted() {
    this.getTransactionByHash()
  },
  methods: {
    async getTransactionByHash() {
      const transactionDetail = await sdkTransaction.getTransactionInfoByHash(
        this.transactionHash
      )
      this.transactionInfo = transactionDetail

      if (transactionDetail.transaction.transactionBody.type === "AggregateBonded") {
        transactionDetail.transaction.transactionBody.innerTransactions.forEach((el, idx) => {

          let temp = []
          let singerLink = `<a href="/#/account/${el.signer}">${el.signer}</a>`
          let recipientLink = `<a href="/#/account/${el.transactionBody.recipient}">${el.transactionBody.recipient}</a>`
          let displayMosaics = ``

          el.transactionBody.mosaics.map(mosaic => {
            displayMosaics = displayMosaics + `<span><a href="/#/mosaic/${mosaic.id}">${mosaic.id}</a> : ${mosaic.amount}</span>`
          })

          temp.push(idx + 1)
          temp.push(el.transactionId)
          temp.push(el.transactionBody.type)
          temp.push(el.transactionBody.message)
          temp.push(displayMosaics)
          temp.push(singerLink)
          temp.push(recipientLink)
          this.innerTransactions.data.push(temp)
        })

        transactionDetail.transaction.transactionBody.cosignatures.forEach((el, idx) => {

          let temp = []
          let singerLink = `<a href="/#/account/${el.signer}">${el.signer}</a>`
          temp.push(idx + 1)
          temp.push(el.signature)
          temp.push(singerLink)
          this.cosignatures.data.push(temp)
        })
      }

      this.loading = 1
    },
  },
}
</script>
