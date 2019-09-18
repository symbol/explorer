/*
 *
 * Copyright (c) 2019-present for NEM
 *
 * Licensed under the Apache License, Version 2.0 (the "License ");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

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
                        <tr @click="loadTransactionInfo('ec7398741cfd6d3716e')">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="loadTransactionInfo('ec7398741cfd6d3716e')">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="loadTransactionInfo('ec7398741cfd6d3716e')">
                          <td>2271554</td>
                          <td>ec7398741cfd6d3716e...</td>
                          <td>transfer | mosaic</td>
                          <td>NDQVYTCPX6WE53...</td>
                          <td>NBT3ASCTQJ4M2Q...</td>
                          <td>404 / 0.15</td>
                          <td>2019-08-06 21:20:17</td>
                        </tr>
                        <tr @click="loadTransactionInfo('ec7398741cfd6d3716e')">
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
    loadTransactionInfo(id) {
      console.log(id)
      router.push({ path: `/transaction/${id}` })
    }
  }
}
</script>
