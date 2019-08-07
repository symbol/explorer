<template>
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4 m-0 z-1">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Account Detail</h1>
                <div class="btn_grp inline-block flt-rt">
                  <span>
                    {{acnt_adrs}}
                    <i class="ico-files-o act-copy"></i>
                  </span>
                </div>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Public key</div>
                    </div>
                    <div class="col-md-10">
                      <div
                        class="value"
                      >728c90f73c7317f79de49e48ff48db574836e862d6af0ae4a8dd021936960c30</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Balance</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">67.65</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Vested balance</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">31.698017</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Importance</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">0.00000%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
            <div class="box">
              <div class="tabs-con">
                <tabs>
                  <tab title="Owned Mosaics">
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
                              <th>Mosaic</th>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>xarleecm:token</td>
                              <td>100</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>xarleecm:token</td>
                              <td>100</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>xarleecm:token</td>
                              <td>100</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>xarleecm:token</td>
                              <td>100</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </tab>
                  <tab title="Owned Namespaces">
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
                              <th>Namespace</th>
                              <th>Height</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>hybseglobal</td>
                              <td>2266068</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>ibinglobal</td>
                              <td>2266068</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </tab>
                  <tab title="Harvest Info">
                    <div class="list_info_con p-0">
                      <div class="row list_item">
                        <div class="col-md-4">
                          <div class="label">Harvest status</div>
                        </div>
                        <div class="col-md-8">
                          <div class="value">enable</div>
                        </div>
                      </div>
                      <div class="row list_item">
                        <div class="col-md-4">
                          <div class="label">Harvested blocks (all)</div>
                        </div>
                        <div class="col-md-8">
                          <div
                            class="value"
                          >total blocks: 30352, total fee: 188081 xem, avg per block 6.20 xem (0.397 usd) (0.00003408 btc)</div>
                        </div>
                      </div>
                      <div class="row list_item">
                        <div class="col-md-4">
                          <div class="label">Harvested blocks (1 day)</div>
                        </div>
                        <div class="col-md-8">
                          <div
                            class="value"
                          >total blocks: 26, total fee: 21 xem, avg per block 0.81 xem (0.052 usd) (0.00000444 btc)</div>
                        </div>
                      </div>
                      <div class="row list_item">
                        <div class="col-md-4">
                          <div class="label">Harvested blocks (1 month)</div>
                        </div>
                        <div class="col-md-8">
                          <div
                            class="value"
                          >total blocks: 527, total fee: 276 xem, avg per block 0.52 xem (0.034 usd) (0.00000288 btc)</div>
                        </div>
                      </div>
                    </div>
                  </tab>
                </tabs>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
            <div class="box">
              <div class="tabs-con">
                <tabs>
                  <tab title="Transactions">
                    <div class="table-responsive">
                      <div
                        id="sorting-table_wrapper"
                        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                      >
                        <table
                          id=""
                          class="table table-striped table-bordered"
                          cellspacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Amount</th>
                              <th>Fee</th>
                              <th>Sender</th>
                              <th>Recipient</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </tab>
                  <tab title="Mosaic Transactions">
                    <div class="table-responsive">
                      <div
                        id="sorting-table_wrapper"
                        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                      >
                        <table
                          id=""
                          class="table table-striped table-bordered"
                          cellspacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Timestamp</th>
                              <th>Mosaic</th>
                              <th>Quantity</th>
                              <th>Sender</th>
                              <th>Recipient</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>usd:usd</td>
                              <td>13.00</td>
                              <td>	NBHL7HJKCANUSR7TTBYZI5YAAUBSJ2ZAOW34NVEX</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>peerfin:pfn</td>
                              <td>5,000.000000</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>peerfin:pfn</td>
                              <td>5,000.000000</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>2019-08-06 04:34:37</td>
                              <td>392</td>
                              <td>0.15</td>
                              <td>NCPAYOUTH2BGEGT3Q7K75PV27QKMVNN2IZRVZWMD</td>
                              <td>NAJAGRSQQP75VJJDU7CDSHMASMM33A2R2W6DUHH7</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </tab>
                </tabs>
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
import router from "../router";
import { Tabs, Tab } from "vue-slim-tabs";
export default {
  name: "block",
  components: {
    Tabs,
    Tab
  },
  created() {},
  data() {
    return {
      acnt_adrs: this.$route.params.acnt_adrs
    };
  },
  methods: {},
  mounted() {}
};
</script>
