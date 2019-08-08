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
                <h1 class="inline-block">Mosaic Detail</h1>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">MosaicID</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{ns}}:{{msc}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Namespace</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{ns}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Creator</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">NAAXHJM65OKDFSYGW4XW4EKJXUIRTKEZZWRK45YF</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Create / Update Time</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2019-08-06 15:57:28</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Create / Update Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2271813</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Supply</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">100,000</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Divisibility</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">0</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">SupplyMutable</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">Yes</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Transferable</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">Yes</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Description</div>
                    </div>
                    <div class="col-md-10">
                      <div
                        class="value"
                      >oa:020cf6c3061842385ba9861192e7c48899c2e658eec55180b4edf67990af1d9a</div>
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
                  <tab title="Mosaic Transfer">
                    <div class="table-responsive">
                      <div
                        id="sorting-table_wrapper"
                        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                      >
                        <table
                          id
                          class="table table-striped table-bordered"
                          cellspacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Sender</th>
                              <th>Recipient</th>
                              <th>Quantity</th>
                              <th>TimeStamp</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>NCL3LNFH7IZTAE3JOK5TEWPLF6DOF3YIDWTJUOAY</td>
                              <td>NCL3LNFH7IZTAE3JOK5TEWPLF6DOF3YIDWTJUOAY</td>
                              <td>1.085357</td>
                              <td>2019-08-03 20:52:49</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </tab>
                  <tab title="Rich List">
                      <div class="table-responsive">
                      <div
                        id="sorting-table_wrapper"
                        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                      >
                        <table
                          id
                          class="table table-striped table-bordered"
                          cellspacing="0"
                          width="100%"
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>Address</th>
                              <th>Quantity</th>
                             
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>1</td>
                              <td>NCL3LNFH7IZTAE3JOK5TEWPLF6DOF3YIDWTJUOAY</td>
                              <td>9,000,000,000.000000</td>                       
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
      ns: this.$route.params.ns,
      msc: this.$route.params.m
    };
  },
  methods: {},
  mounted() {}
};
</script>
