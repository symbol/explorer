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
                <h1 class="inline-block">Nodes List</h1>
                <div class="btn_grp inline-block flt-rt">
                  <div class="select_type">
                    Search :
                    <input type="text" class="form-field" />
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
                      id="table-acnts"
                      class="table table-striped table-bordered"
                      cellspacing="0"
                      width="100%"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Server Name</th>
                          <th>Resolved IP</th>
                          <th>Version</th>
                          <th>Location</th>
                          <th>Internet Service Provider</th>
                          <th>Height</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>Unknown</td>
                          <td>52.194.207.217</td>
                          <td>-</td>
                          <td>Tokyo : Japan</td>
                          <td>Amazon.com, Inc.</td>
                          <td>19602</td>
                          <td>Online</td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>Unknown</td>
                          <td>52.194.207.217</td>
                          <td>-</td>
                          <td>Tokyo : Japan</td>
                          <td>Amazon.com, Inc.</td>
                          <td>19602</td>
                          <td>Online</td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>Unknown</td>
                          <td>52.194.207.217</td>
                          <td>-</td>
                          <td>Tokyo : Japan</td>
                          <td>Amazon.com, Inc.</td>
                          <td>19602</td>
                          <td>Online</td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>Unknown</td>
                          <td>52.194.207.217</td>
                          <td>-</td>
                          <td>Tokyo : Japan</td>
                          <td>Amazon.com, Inc.</td>
                          <td>19602</td>
                          <td>Online</td>
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
export default {
  name: "block",
  components: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>
