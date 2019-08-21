<template>
  <div class="widget has-shadow">
    <div class="box">
      <div class="box-title">
        <h1 class="inline-block">Recent Blocks</h1>
        <div class="btn_grp inline-block flt-rt">
          <router-link to="/blocks" exact active-class="active" class="btn btn-green">
            <span>View all blocks</span>
            <i class="ico-ios-arrow-thin-right"></i>
          </router-link>
        </div>
      </div>
      <div class="box-con">
        <div class="row">
          <div
            class="col-md-3"
            v-for="(item, index) in blocklist"
            v-bind:key="item.height"
            v-if="index < 4"
          >
            <div class="rn_blk_con">
              <div class="blkht">
                <span>{{ item.height }}</span>
              </div>
              <div class="blk-info">
                <div class="inrw">
                  <span>{{ item.numTransactions }} Transactions</span>
                  <span >{{timefix(item.date)}}</span>
                </div>
                <div class="inrw flex">
                  <span>Harvester</span>
                  <a href class="acnt">{{item.signer.address.address}}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import helper from "../helper";


export default {
  props: {
    blocklist: {}
  },
  methods: {
    timefix: function(time) {
      return helper.timeSince(new Date(time)) + " ago";
    }
  }
};
</script>
