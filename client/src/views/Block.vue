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
import w1 from "@/components/Table-block.vue";
import DataService from "../data-service";
import io from "socket.io-client";
const socket = io.connect("http://localhost:3000", {
  path: "/ws"
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
    },
  },
  created: function() {},
  mounted: function() {
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
