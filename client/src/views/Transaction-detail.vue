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
                <h1 class="inline-block">Block</h1>
                <span class="info_append">#{{trx_id}}</span>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{trx_id}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Timestamp</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2019-08-06 17:23:26</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Difficulty</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">135.20%</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Fees</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">0.4</div>
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
                </div>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
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
                    <tr>
                      <td>2</td>
                      <td>2019-08-06 17:22:17</td>
                      <td>0.05</td>
                      <td>0.05</td>
                      <td>NCKZD7JGDLNDIVVPH6U2PG2QKD3PX3FX4CPZMF2A</td>
                      <td>NALEA4T4SW7UP3EDYPPOVR7O2MBTIARMJ2IMB7PV</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>2019-08-06 17:22:17</td>
                      <td>0.05</td>
                      <td>0.05</td>
                      <td>NCKZD7JGDLNDIVVPH6U2PG2QKD3PX3FX4CPZMF2A</td>
                      <td>NALEA4T4SW7UP3EDYPPOVR7O2MBTIARMJ2IMB7PV</td>
                    </tr>
                    <tr>
                      <td>4</td>
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
import router from '../router'
export default {
  name: 'block',
  components: {},
  created () {},
  data () {
    return {
      trx_id: this.$route.params.trx_id
    }
  },
  methods: {},
  mounted () {}
}
</script>
