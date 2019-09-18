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
                <h1 class="inline-block">Block</h1>
                <span class="info_append">{{'# '+this.$route.params.blockid}}</span>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!loading"></loader>
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.height}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.date}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Difficulty</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.difficulty}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.totalFee}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Total Transactions</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.numTransactions}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Harvester</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/account/' + this.block_Info.signer.address.address"
                        >{{this.block_Info.signer.address.address}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_Info.hash}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            class="widget has-shadow"
            v-if="this.table_data.data.length || this.block_Info.length"
          >
            <loader v-if="!this.loading"></loader>
            <div class="box">
              <div class="table-responsive">
                <div
                  id="sorting-table_wrapper"
                  class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                >
                  <datatable
                    tableClass="blocktrxtbl"
                    :tableHead="this.table_data.head"
                    :tableData="this.table_data.data"
                    v-if="this.table_data.data.length"
                  ></datatable>
                  <div v-else>
                    <p class="lblwarn">Block {{this.$route.params.blockid}} has no transactions</p>
                  </div>
                </div>
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
import w1 from "@/components/Table-dynamic.vue";

import DataService from "../data-service";
var s = "";
export default {
  name: "block",
  components: {
    datatable: w1
  },
  data() {
    return {
      block_id: this.$route.params.blockid,
      block_Info: {},
      table_data: {
        head: [
          "#",
          "Timestamp",
          "Transaction Type",
          "Fees",
          "Signer",
          "Transaction Hash"
        ],
        data: []
      },
      loading: true
    };
  },
  mounted() {
    this.asyncData();
  },
  methods: {
    asyncData() {
      let self = this;
      this.block_id = this.$route.params.blockid;
      this.loading = 0;
      DataService.getBlockinfo(this.block_id).then(function(data) {
        self.block_Info = data.blockInfo;
        if (data.blockTransactionList.length) {
          self.table_data.data = [];
          let i = 0;
          data.blockTransactionList.forEach((el, idx) => {
            let temp = [];
            let singerLink = `<a href="/#/account/${el.signer}">${el.signer}</a>`;
            let transactionHashLink = `<a href="/#/transaction/${el.transactionHash}">${el.transactionHash}</a>`;
            temp.push(idx + 1);
            temp.push(el.deadline);
            temp.push(el.transactionBody.type);
            temp.push(el.fee);
            temp.push(singerLink);
            temp.push(transactionHashLink);
            self.table_data.data.push(temp);
          });
        } else {
          self.table_data.data = [];
        }
        self.loading = 1;
      });
    }
  }
};
</script>
