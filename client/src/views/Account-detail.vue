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
                    {{account_address}}
                    <button
                      type="button"
                      class="ico-files-o act-copy"
                      v-clipboard:copy="account_address"
                      v-clipboard:success="onCopy"
                      v-clipboard:error="onError"
                    ></button>
                  </span>
                </div>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!loading"></loader>
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
                      :tableHead="this.account_transaction.head"
                      :tableData="this.account_transaction.data"
                    ></datatable>
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
import router from "../router";
import { Tabs, Tab } from "vue-slim-tabs";
import DataService from "../data-service";
import w1 from "@/components/inforow.vue";
import w2 from "@/components/Table-dynamic.vue";
import { getAccountInfoByAddress } from "../infrastructure/getAccount";
import { getAccountTransactions } from "../infrastructure/getTransaction";
import { getNamespacesFromAccountByAddress } from "../infrastructure/getNamespace";

export default {
  name: "block",
  components: {
    Tabs,
    Tab,
    inforow: w1,
    datatable: w2
  },
  data() {
    return {
      account_address: this.$route.params.acnt_adrs,
      account_info: {},
      account_transaction: {
        head: ["#", "Deadline", "Fee", "Transaction Hash", "Type"],
        data: []
      },
      ownedNamespaceList: {
        head: [
          "#",
          "Namespace",
          "Type",
          "Status",
          "Start Height",
          "End Height"
        ],
        data: []
      },
      balance: {
        head: ["#", "MosaicID", "Quantity"],
        data: []
      },
      loading: 0
    };
  },
  mounted() {
    this.getAccountInfo();
    this.getOwnedNamespace();
  },
  methods: {
    onCopy(e) {
      alert("You just copied: " + e.text);
    },
    onError(e) {
      alert("Failed to copy address");
    },
    async getAccountInfo() {
      const accountInfo = await getAccountInfoByAddress(this.account_address);
      const accountTransaction = await getAccountTransactions(
        accountInfo.publicKey
      );

      this.account_info = accountInfo;

      accountInfo.mosaics.forEach((el, idx) => {
        var temp = [];
        let mosaicLink = `<a href="/#/mosaic/${el.hex}">${el.hex}</a>`;
        temp.push(idx + 1);
        temp.push(mosaicLink);
        temp.push(el.amount);
        this.balance.data.push(temp);
      });

      accountTransaction.forEach((el, idx) => {
        var temp = [];
        temp.push(idx + 1);
        temp.push(el.deadline);
        temp.push(el.fee);
        temp.push(el.transactionHash);
        temp.push(el.transactionDetail.type);
        this.account_transaction.data.push(temp);
      });

      this.loading = 1;
    },
    async getOwnedNamespace() {
      const ownedNamespaceList = await getNamespacesFromAccountByAddress(
        this.account_address
      );

      ownedNamespaceList.forEach((el, idx) => {
        var temp = [];
        let namespaceNameLink = `<a href="/#/namespace/${el.namespaceName}">${el.namespaceName}</a>`;
        temp.push(idx + 1);
        temp.push(namespaceNameLink);
        temp.push(el.type);
        temp.push(el.active);
        temp.push(el.startHeight);
        temp.push(el.endHeight);
        this.ownedNamespaceList.data.push(temp);
      });

      this.loading = 1;
    }
  }
};
</script>
