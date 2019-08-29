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
          <nempricegraph></nempricegraph>
          <Homebaseinfo :marketinfo="home_data.marketData" :chaininfo="home_data.chainInfo"></Homebaseinfo>
        </div>
        <div class="container p-0 mt-1">
          <recent-blocks :blocklist="home_data.recentBlocks"></recent-blocks>
        </div>
        <div class="container p-0 mt-1">
          <recent-trxs></recent-trxs>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import tileWidjet from "@/components/widjet01.vue";
import w1 from "@/components/Home_base_info.vue";
import w2 from "@/components/nempricegraph.vue";
import w3 from "@/components/recent_blocks.vue";
import w4 from "@/components/recent_trxs.vue";
import DataService from "../data-service";
import io from "socket.io-client";
const socket = io.connect(window.conf.ws, {
  path: window.conf.ws_path
});
export default {
  name: "home",
  components: {
    Homebaseinfo: w1,
    nempricegraph: w2,
    "recent-blocks": w3,
    "recent-trxs": w4
  },
  data() {
    return {
      home_data: {}
    };
  },
  async beforeCreate() {
    try {
      this.home_data = await DataService.getHomeData();
    } catch (err) {}
  },
  methods: {},
  mounted() {},
  created: function() {
    let self = this;
    DataService.syncWs("home").then(data => {
      socket.on("update", function(data) {
       // self.home_data.chaininfo = data.data.chaininfo;
        //self.home_data.recentBlocks = data.data.recentBlocks;
      });
    });
  },
  destroyed:function(){
     socket.disconnect()
  }
};
</script>
