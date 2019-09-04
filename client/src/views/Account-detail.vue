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
                <div class="btn_grp inline-block flt-rt">
                  <span>
                    {{acnt_adrs}}
                    <i id="adrscopy" class="ico-files-o act-copy" @click="copy_text">
                      <input type="hidden" :value="this.acnt_adrs" />
                    </i>
                  </span>
                </div>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Public key</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{account_info.publicKey}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Importance</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{account_info.importance}}</div>
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
                    <datatable
                      tableClass="blocktrxtbl"
                      :tableHead="this.balance.head"
                      :tableData="this.balance.data"
                    ></datatable>
                  </tab>
                  <tab title="Owned Mosaics">
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
                  </tab>
                  <tab title="Owned Namespaces">
                    <datatable
                      tableClass="blocktrxtbl"
                      :tableHead="this.ownedNamespaceList.head"
                      :tableData="this.ownedNamespaceList.data"
                    ></datatable>
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
                    <datatable
                      tableClass="blocktrxtbl"
                      :tableHead="this.account_trx.head"
                      :tableData="this.account_trx.data"
                    ></datatable>
                    <!-- <div class="table-responsive">
                      <div
                        id="sorting-table_wrapper"
                        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                      >
                        <table
                          id
                          class="table table-striped table-bordered"
                          cellspacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Amount</th>
                              <th>Fee</th>
                              <th>Sender</th>
                              <th>Recipient</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>-->
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
import router from '../router'
import { Tabs, Tab } from 'vue-slim-tabs'
import DataService from '../data-service'
import w1 from '@/components/inforow.vue'
import w2 from '@/components/Table-dynamic.vue'
import { MosaicHttp, AccountHttp, MosaicService, Address } from 'nem2-sdk';



      // mosaicService
      //   .mosaicsAmountViewFromAddress(address)
      //   .pipe(
      //     flatMap(x => x),
      //     map(mosaic => formatMosaics(mosaic, blockHeight)),
      //     toArray(),
      //   )
      //   .subscribe(
      //     (x) => {
      //       if (x.length !== 0) {
      //         resolve(sortMosaics(x));
      //       } else {
      //         resolve([]);
      //       }
      //     },
      //     err => reject(err),
      //   );

export default {
  name: 'block',
  components: {
    Tabs,
    Tab,
    inforow: w1,
    datatable: w2
  },
  data () {
    return {
      acnt_adrs: this.$route.params.acnt_adrs,
      account_info: {},
      account_trx: {
        head: ['#', 'Timestamp', 'Amount', 'Fee', 'Transaction Hash', 'Type'],
        data: []
      },
      ownedNamespaceList: {
        head: ['#', 'Namespace', 'Height'],
        data: []
      },
      balance: {
        head: ['MosaicID', 'Quantity'],
        data: []
      }
    }
  },
  created () {
    this.asyncData(),
    this.getAccountBalance()
  },
  watch: {
    $route: 'asyncData'
  },
  methods: {
    asyncData () {
      this.acnt_adrs = this.$route.params.acnt_adrs
      let self = this
      DataService.getAcntdetail(this.acnt_adrs).then(function (data) {
        self.account_info = data.accountInfo
        // self.account_trx = data.accountTransaction;
        data.accountTransaction.forEach((el, idx) => {
          var temp = []
          temp.push(idx + 1)
          temp.push(el.deadline)
          temp.push(0)
          temp.push(el.fee)
          temp.push(el.transactionHash)
          temp.push(el.transactionDetail.type)
          self.account_trx.data.push(temp)
        })
        data.ownedNamespaceList.forEach((el, idx) => {
          var temp = []
          temp.push(idx + 1)
          temp.push(el.namespaceName)
          temp.push(el.startHeight)
          self.ownedNamespaceList.data.push(temp)
        })
        data.accountInfo.mosaics.forEach((el, idx) => {
          var temp = []
          temp.push(el.id)
          temp.push(el.amount)
          self.balance.data.push(temp)
        })
      })
    },
    async getAccountBalance  () {
const mosaicService = new MosaicService(
        new AccountHttp('http://52.194.207.217:3000'),
        new MosaicHttp('http://52.194.207.217:3000'),
      );
      console.log(this.acnt_adrs)
      const a = await mosaicService.mosaicsAmountViewFromAddress(new Address(this.acnt_adrs)).toPromise()
      console.log(a);
    },
    copy_text: function (event) {}
  }
}
</script>
