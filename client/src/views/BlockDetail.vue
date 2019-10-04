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
    <top-header />
    <page-menu />
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4 m-0 z-1">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Block</h1>
                <span class="info_append">{{'# '+this.$route.params.blockId}}</span>
                <div class="btn_grp inline-block flt-rt">
                  <ul class="pagination">
                    <li class="page-item">
                      <a @click="previousBlock()" title="Previous Block">
                        <i class="ico-angle-left"></i>
                      </a>
                    </li>
                    <li class="page-item">
                      <a @click="nextBlock()"  title="Next Block">
                        <i class="ico-angle-right"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!loading"></loader>
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.height}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.date}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Difficulty</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.difficulty}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.totalFee}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Total Transactions</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.numTransactions}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Harvester</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/account/' + this.blockInfo.signer.address.address"
                        >{{this.blockInfo.signer.address.address}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.blockInfo.hash}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="widget has-shadow" v-if="this.tableData.data.length || this.blockInfo.length">
            <loader v-if="!loading"></loader>
            <div class="box">
              <div class="table-responsive">
                <div
                  id="sorting-table_wrapper"
                  class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                >
                  <DataTable
                    tableClass="blocktrxtbl"
                    :tableHead="this.tableData.head"
                    :tableData="this.tableData.data"
                    v-if="this.tableData.data.length"
                  ></DataTable>
                  <div v-else>
                    <p class="lblwarn">Block {{this.$route.params.blockId}} has no transactions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer />
  </div>
</template>
<script>
import w1 from "@/components/TableDynamic.vue";
import DataService from "../data-service";

export default {
  name: "block",
  components: {
    DataTable: w1
  },
  data() {
    return {
      blockId: this.$route.params.blockId,
      blockInfo: {},
      tableData: {
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
  watch: {
    $route: "asyncData"
  },
  mounted() {
    this.asyncData();
  },
  methods: {
    previousBlock() {
      var previousBlock = Number(this.blockId) - 1;
      this.$router.push({
        path: "/block/" + previousBlock
      });
    },
    nextBlock() {
      var nextBlock = Number(this.blockId) + 1;
      this.$router.push({
        path: "/block/" + nextBlock
      });
    },
    asyncData() {
      let self = this;
      this.blockId = this.$route.params.blockId;
      this.loading = 0;
      DataService.getBlockInfo(this.blockId).then(function(data) {
        self.blockInfo = data.blockInfo;
        if (data.blockTransactionList.length) {
          self.tableData.data = [];
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
            self.tableData.data.push(temp);
          });
        } else {
          self.tableData.data = [];
        }
        self.loading = 1;
      });
    }
  }
};
</script>
