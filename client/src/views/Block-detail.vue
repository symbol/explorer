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
            <inforow
              info_title="Block"
              :inforows="this.blockdetails"
              :info_title2="'# '+this.$route.params.blockid"
            ></inforow>
          </div>
          <div
            class="widget has-shadow"
            v-if="this.table_data.data.length || this.blockdetails.length"
          >
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
import w1 from "@/components/inforow.vue";
import w2 from "@/components/Table-dynamic.vue";

import DataService from "../data-service";
var s = "";
export default {
  name: "block",
  components: {
    inforow: w1,
    datatable: w2
  },
  data() {
    return {
      block_id: this.$route.params.blockid,
      blockdetails: {
        Height: "",
        Timestamp: "",
        Difficulty: "",
        Fees: "",
        "Total Transactions": "",
        Harvester: "",
        "Block Hash": ""
      },
      table_data: {
        head: [
          "#",
          "Timestamp",
          "Transaction Type",
          "Fees",
          "Signer",
          "Tx Hash"
        ],
        data: []
      },
      loading: true,
    };
  },
  created() {
    this.asyncData();
  },
  watch: {
    $route: "asyncData"
  },
  methods: {
    asyncData() {
      let self = this;
      this.block_id = this.$route.params.blockid;
      DataService.getBlockinfo(this.block_id).then(function(data) {
        self.blockdetails["Height"] = data.blockdata.height;
        self.blockdetails["Timestamp"] = data.blockdata.date;
        self.blockdetails["Difficulty"] = data.blockdata.difficulty;
        self.blockdetails["Fees"] = data.blockdata.totalFee;
        self.blockdetails["Total Transactions"] =data.blockdata.numTransactions;
        self.blockdetails["Harvester"] = data.blockdata.signer.address.address;
        self.blockdetails["Block Hash"] = data.blockdata.blockTransactionsHash;
        if (data.blocktrx.length) {
          self.table_data.data = [];
          var i = 0;
          data.blocktrx.forEach((el, idx) => {
            var temp = [];
            temp.push(idx + 1);
            temp.push(el.deadline);
            temp.push(el.transactionDetail.type);
            temp.push(el.fee);
            temp.push(el.signer.address.address);
            temp.push(el.transactionHash);
            self.table_data.data.push(temp);
          });
        } else {
          self.table_data.data = [];
        }
      });
    }
  }
};
</script>
