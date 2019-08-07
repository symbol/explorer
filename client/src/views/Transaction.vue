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
                <h1 class="inline-block">Transactions</h1>
                <div class="btn_grp inline-block flt-rt">
                  <div class="select_type">
                    <select>
                      <option>Recent Transactions</option>
                      <option>Pending Transactions</option>
                      <option>Transfer Transactions</option>
                      <option>Multisig Transactions</option>
                      <option>Mosaic Transactions</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="box-con mt-0">
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
                          <th>Block Height</th>
                          <th>Txn Hash</th>
                          <th>Type</th>
                          <th>Sender</th>
                          <th>Recipient</th>
                          <th>Amount/Fee</th>
                          <th>Timestamp</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr @click="load_trx_info(ec7398741cfd6d3716e)">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="load_trx_info(ec7398741cfd6d3716e)">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="load_trx_info(ec7398741cfd6d3716e)">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="load_trx_info(ec7398741cfd6d3716e)">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr>
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                          <span>1</span>
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
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from '../router'
export default {
  methods: {
    load_trx_info: function (id) {
      //router.push({ path: `/transaction/${id}` })
    }
  }
}
</script>
