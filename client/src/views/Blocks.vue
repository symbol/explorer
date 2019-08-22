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
                <table-blocks :blockslist="this.blockdata"></table-blocks>
                <div class="table-footer">
                  <div class="pagination-container">
                    <ul class="pagination">
                      <li class="page-item">
                        <a href="#">
                          <i class="ico-angle-double-left"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <a href="#">
                          <i class="ico-angle-left"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <input type="number" value="1" min='1'>
                      </li>
                      <li class="page-item">
                        <a href="#">
                          <i class="ico-angle-right"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <a href="#">
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
import w1 from "@/components/Table-block-list.vue";
import DataService from "../data-service";
import moment from "moment-timezone";

import io from "socket.io-client";

const socket = io.connect(window.conf.ws, {
  path: window.conf.ws_path
});
export default {
  name: "block",
  components: {
    "table-blocks": w1
  },
  data() {
    return {
      blockdata: {},
      blockhight: ""
    };
  },
  methods: {
    load_block_list: function(id) {
      router.push({ path: `/block?` });
    }
  },
  created: function() {},
  mounted() {
    let self = this;
    DataService.getBlocks().then(function(data) {
      self.blockdata = data.blockList;
      self.blockhight = data.hight;
      console.log(data);
    });
    DataService.syncWs("blocks").then(data => {
      socket.on("update", function(data) {
        // self.blockdata = data.data.blockList;
        //self.blockhight =  data.data.hight;
        // console.log(data);
      });
    });
  },
  destroyed: function() {
    socket.disconnect();
  }
};
</script>
