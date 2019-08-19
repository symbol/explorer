<template>
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4 m-0 z-1" >
            <div class="box">
               <div class="box-title">
                <h1 class="inline-block">Block</h1>
                <span class="info_append">#{{this.block_detail.blockdata.height}}</span>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.height}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.date}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Difficulty</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.difficulty}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.totalFee}}</div>
                    </div>
                  </div>
                  
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Total Transactions</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.numTransactions}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Harvester</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.block_detail.blockdata.signer.address.address}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Block Hash</div>
                    </div>
                    <div class="col-md-10">
                      <div
                        class="value"
                      >{{this.block_detail.blockdata.hash}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget has-shadow" v-if="this.block_detail.blockdata.numTransactions !=0">
            <div class="box">
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
                        <th>#</th>
                        <th>Timestamp</th>
                        <th>Amount</th>
                        <th>Fees</th>
                        <th>Sender</th>
                        <th>Recipient</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>2019-08-06 17:22:17</td>
                        <td>0.05</td>
                        <td>0.05</td>
                        <td>NCKZD7JGDLNDIVVPH6U2PG2QKD3PX3FX4CPZMF2A</td>
                        <td>NALEA4T4SW7UP3EDYPPOVR7O2MBTIARMJ2IMB7PV</td>
                      </tr>
                    </tbody>
                  </table>
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

export default {
  name: "block",
  components: {},
  data() {
    return {
      block_id: this.$route.params.blockid,
      block_detail: {}
    };
  },
  created: async function() {
    try {
      this.block_detail = await DataService.getBlockinfo(this.block_id);
      console.log(this.block_detail);
    } catch (err) {}
  },
  methods: {},
  mounted() {}
};
</script>
