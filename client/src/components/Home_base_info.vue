<template>
  <div class="widget has-shadow">
    <div class="row">
      <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
              <span>Price</span>
              <p  v-if="marketinfo">{{marketinfo.price}}</p>
          </div>
      </div>
      <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
               <span>Market Cap</span>
              <p v-if="marketinfo">${{marketinfo.marketCap}}</p>
          </div>
      </div>
      <!-- <div class="col-md-2">
          <div class="hm_wdjt_itm_t1">
               <span>Average block time</span>
              <p>0 seconds</p>
          </div>
      </div> -->
      <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
               <span>Total Transactions</span>
              <p v-if="chaininfo" >{{chaininfo.totalTransactions}}</p>
          </div>
      </div>
      <div class="col-md-3">
          <div class="hm_wdjt_itm_t1">
               <span>Block Height</span>
              <p v-if="chaininfo" >{{chaininfo.totalBlocks}}</p>
          </div>
      </div>
      <!-- <div class="col-md-2">
          <div class="hm_wdjt_itm_t1">
               <span>Nodes Online</span>
              <p>400</p>
          </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
      marketinfo:{},
      chaininfo:{}
  }
  // ['ItemTitle','ItemData','itemThumb']
}
</script>
