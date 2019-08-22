<template>
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4 m-0 z-1">
            <inforow info_title="Transaction Details" :inforows="this.trx_detail"></inforow>
            <!-- <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Transaction Details</h1>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Transaction Hash:</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{trx_id}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2270701</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">38 secs ago (Aug-07-2019 04:23:19 AM +UTC)</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Type</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">Transfer</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Harvester</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">NAUARAIWN6WX4I2MDTT2VPB4W5MQDXYBL4XL3GGY</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div
                        class="value"
                      >9a6915a2fda4623ce8e67da0bd4c87e99a7ad9814e33d2e63bf1855407a88ba2</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Sender</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">NAEQYBEMWAYS52GGV4XWIQ62RALKP6ZE5ATE3EWN</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Recipient</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">NC64UFOWRO6AVMWFV2BFX2NT6W2GURK2EOX6FFMZ</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Amount</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">100,000</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fee</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">0.55</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Message</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">107797548</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from "../router";
import w1 from "@/components/inforow.vue";
import DataService from "../data-service";
export default {
  name: "block",
  components: {
    inforow: w1
  },
  created() {},
  data() {
    return {
      trx_id: this.$route.params.trx_id,
      trx_detail: {
        "Transaction Hash": "",
        Block: "",
       // Timestamp: "",
        Type: "",
        Harvester: "",
        "Block Hash": "",
        Sender: "",
        Recipient: "",
        Amount: "",
        Fee: "",
        Message: "",
        Status: "",
        confirmation: ""
      }
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
      this.trx_id = this.$route.params.trx_id;
      let self = this;
      DataService.getTrxdetail(this.trx_id).then(function(data) {
        self.trx_detail["Transaction Hash"] = self.trx_id;
        self.trx_detail["Block"] = data.transactionInfo.transaction.blocHeight;
        self.trx_detail["Type"] = data.transactionInfo.transaction.transactionDetail.type;
        self.trx_detail["Harvester"] = data.transactionInfo.transaction.signer;
        self.trx_detail["Harvester"] = 
        self.trx_detail["Status"] = data.transactionInfo.status;
        self.trx_detail["confirmation"] = data.transactionInfo.confirm;
        console.log(self.trx_detail);
      });
    }
  }
};
</script>
