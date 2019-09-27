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
                <h1 class="inline-block">Account Detail</h1>
                <div class="btn_grp inline-block flt-rt address_info">
                  <span>{{address}}</span>
                  <button
                    type="button"
                    class="ico-files-o act-copy"
                    v-clipboard:copy="address"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError"
                  ></button>
                </div>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!accountInfo"></loader>
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Public key</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{accountInfo.publicKey}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Importance</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{accountInfo.importance}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Account Type</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{accountInfo.accountType}}</div>
                    </div>
                  </div>
                  <div v-if="!accountInfo.accountType==='Unlinked'" class="row list_item">
                    <div class="col-md-2">
                      <div class="label">linked Account Key</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{accountInfo.linkedAccountKey}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
            <div class="box">
              <div class="tabs-con">
                <tabs>
                  <tab title="Balance">
                    <DataTable
                      tableClass="account_balance"
                      :tableHead="this.balance.head"
                      :tableData="accountBalance"
                    ></DataTable>
                  </tab>
                  <!-- <tab title="Owned Mosaics">
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
                              <th>#</th>
                              <th>Mosaic</th>
                              <th>Start Height</th>
                              <th>End Height</th>
                            </tr>
                          </thead>
                          <tbody></tbody>
                        </table>
                      </div>
                    </div>
                  </tab>-->
                  <tab title="Owned Namespaces">
                    <DataTable
                      tableClass="blocktrxtbl"
                      :tableHead="this.ownedNamespaceList.head"
                      :tableData="accountOwnNamespaces"
                    ></DataTable>
                  </tab>

                  <!-- <tab title="Harvest Info">
                    <div class="list_info_con p-0">
                      <div class="row list_item">
                        <div class="col-md-4">
                          <div class="label">Harvest status</div>
                        </div>
                        <div class="col-md-8">
                          <div class="value">enable</div>
                        </div>
                      </div>
                    </div>
                  </tab>-->
                </tabs>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
            <div class="box">
              <div class="tabs-con">
                <tabs>
                  <tab title="Transactions">
                    <DataTable
                      tableClass
                      :tableHead="this.accountTransaction.head"
                      :tableData="accountTransactions"
                    ></DataTable>
                  </tab>
                </tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import { Tabs, Tab } from 'vue-slim-tabs'
import w1 from '@/components/InfoRow.vue'
import w2 from '@/components/TableDynamic.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'block',
  components: {
    Tabs,
    Tab,
    InfoRow: w1,
    DataTable: w2,
  },
  data() {
    return {
      address: this.$route.params.address,
      accountTransaction: {
        head: ['#', 'Deadline', 'Fee', 'Transaction Hash', 'Type'],
      },
      ownedNamespaceList: {
        head: [
          '#',
          'Namespace',
          'Type',
          'Status',
          'Start Height',
          'End Height',
        ],
      },
      balance: {
        head: ['#', 'MosaicID', 'Quantity'],
      },
    }
  },
  computed: {
    ...mapGetters({
      accountInfo: 'account/getAccountInfo',
      accountBalance: 'account/getAccountBalance',
      accountOwnNamespaces: 'account/getAccountOwnNamespaces',
      accountTransactions: 'account/getAccountTransactions',
    }),
  },
  mounted() {
    this.$store.dispatch('account/fetchAccountDataByAddress', this.address)
  },
  methods: {
    onCopy(e) {
      alert('You just copied: ' + e.text)
    },
    onError(e) {
      alert('Failed to copy address')
    },
  },
}
</script>
