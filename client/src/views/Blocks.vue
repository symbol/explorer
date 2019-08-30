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
          <div class="widget has-shadow mt-4">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Blocks</h1>
                <div class="btn_grp inline-block flt-rt">
                  <span>Last Block : {{this.blockhight}}</span>
                </div>
              </div>
              <div class="box-con mt-0">
                <loader v-if="!this.loading"></loader>
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
                          <th>Block Height</th>
                          <th>Age</th>
                          <th>Transactions</th>
                          <th>Fee</th>
                          <th>Timestamp</th>
                          <th>Harvester</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(item,index) in blockdata"
                          v-bind:key="item.height"
                          @click="load_block_info(item.height)"
                        >
                          <td>{{item.height}}</td>
                          <td>{{timefix(item.date)}}</td>
                          <td>{{item.numTransactions}}</td>
                          <td>{{item.totalFee}}</td>
                          <td>{{item.date}}</td>
                          <td>{{item.signer.address.address}}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="table-footer">
                  <div class="pagination-container">
                    <ul class="pagination">
                      <li class="page-item">
                        <a href="#" @click.prevent="load_block_list('prev2')">
                          <i class="ico-angle-double-left"></i>
                        </a>
                      </li>
                      <li class="page-item" @click.prevent="load_block_list('prev')">
                        <a href="#">
                          <i class="ico-angle-left"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <input
                          type="number"
                          v-model="curnt_page"
                          min="1"
                          v-on:keyup.enter="load_block_list('fromtxtfld')"
                        />
                      </li>
                      <li class="page-item">
                        <a href="#" @click.prevent="load_block_list('next')">
                          <i class="ico-angle-right"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <a href="#" @click.prevent="load_block_list('next2')">
                          <i class="ico-angle-double-right"></i>
                        </a>
                      </li>
                    </ul>
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
import DataService from "../data-service";
import router from "../router";
import helper from "../helper";
import io from "socket.io-client";

const socket = io.connect(window.conf.ws, {
  path: window.conf.ws_path
});
export default {
  name: "block",
  components: {},
  data() {
    return {
      blockdata: {},
      blockhight: "",
      curnt_page: 1,
      loading: 0
    };
  },
  methods: {
    load_block_list: function(act) {
      // router.push({ path: `/block?` });
      var computed_page = "";
      if (act == "next") {
        computed_page = this.curnt_page + 1;
      } else if (act == "next2") {
        computed_page = this.curnt_page + 2;
      } else if (act == "prev") {
        computed_page = this.curnt_page - 1;
      } else if (act == "prev2") {
        this.curnt_page - 2;
      } else if (act == "fromtxtfld") {
        computed_page = this.curnt_page;
      }
      if (computed_page > 1) {
        this.$router.push({ path: "/blocks?page=" + computed_page });
      } else this.$router.push({ path: "/blocks?page=" + 1 });
    },
    load_block_info: function(id) {
      router.push({ path: `/block/${id}` });
    },
    timefix: function(time) {
      var time_fx = new Date(time);
      var offset = new Date().getTimezoneOffset();
      return helper.timeSince(time_fx);
    },
    load_data: function(page = 1) {
      let self = this;
      console.log(page);
      self.loading=0;
      DataService.getBlocks(page).then(function(data) {
        self.curnt_page = parseInt(page);
        self.blockdata = data.blockList;
        self.blockhight = data.hight;
         self.loading=1;
      });
    },
    pageUrlsync: function() {
      this.load_data(this.$route.query.page);
    }
  },
  created: function() {},
  watch: {
    $route: "pageUrlsync"
  },
  mounted() {
    this.curnt_page = this.$route.query.page;
    this.load_data(this.curnt_page);
    DataService.syncWs("blocks").then(data => {
      socket.on("update", function(data) {
        // self.blockdata = data.data.blockList;
        // self.blockhight =  data.data.hight;
        // console.log(data);
      });
    });
  },
  destroyed: function() {
    socket.disconnect();
  }
};
</script>
