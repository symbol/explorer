<template>
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <nempricegraph></nempricegraph>
          <Homebaseinfo  :marketinfo="home_data.marketData" :chaininfo="home_data.chainInfo"></Homebaseinfo>
        </div>
        <div class="container p-0 mt-1">
          <recent-blocks :blocklist="home_data.recentBlocks"></recent-blocks>
        </div>
        <div class="container p-0 mt-1">
          <recent-trxs ></recent-trxs>
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
  methods: {
    get_home_data() {}
  },
  mounted() {
    this.last_block_time = 1;
  }
};
</script>
