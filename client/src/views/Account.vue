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
                <h1 class="inline-block">Rich List</h1>
                <div class="btn_grp inline-block flt-rt">
                  <div class="select_type">
                    <select>
                      <option>Rich List</option>
                      <option>Harvester List</option>
                      <option>Harvesting Calculator</option>
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
                      id="table-acnts"
                      class="table table-striped table-bordered"
                      cellspacing="0"
                      width="100%"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Address</th>
                          <th>Balance</th>
                          <th>Importance</th>
                          <th>Last Timestamp</th>
                          <th>Info</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr @click="loadAccountInfo('NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q')">
                          <td>1</td>
                          <td>NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q</td>
                          <td>900,000,216</td>
                          <td>8.84909%</td>
                          <td>2019-07-05 15:44:30</td>
                          <td>Post-V1 Fund - 400 - Fund stakes</td>
                        </tr>
                        <tr @click="loadAccountInfo('NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q')">
                          <td>2</td>
                          <td>NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q</td>
                          <td>900,000,216</td>
                          <td>8.84909%</td>
                          <td>2019-07-05 15:44:30</td>
                          <td>Post-V1 Fund - 400 - Fund stakes</td>
                        </tr>
                        <tr @click="loadAccountInfo('NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q')">
                          <td>3</td>
                          <td>NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q</td>
                          <td>900,000,216</td>
                          <td>8.84909%</td>
                          <td>2019-07-05 15:44:30</td>
                          <td>Post-V1 Fund - 400 - Fund stakes</td>
                        </tr>
                        <tr @click="loadAccountInfo('NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q')">
                          <td>4</td>
                          <td>NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q</td>
                          <td>900,000,216</td>
                          <td>8.84909%</td>
                          <td>2019-07-05 15:44:30</td>
                          <td>Post-V1 Fund - 400 - Fund stakes</td>
                        </tr>
                        <tr @click="loadAccountInfo('NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q')">
                          <td>5</td>
                          <td>NDEVPOSK4OMR4PRTLYFHX4W5QTOND7TZDT2DTU4Q</td>
                          <td>900,000,216</td>
                          <td>8.84909%</td>
                          <td>2019-07-05 15:44:30</td>
                          <td>Post-V1 Fund - 400 - Fund stakes</td>
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
    loadAccountInfo(id) {
      console.log(id)
      router.push({ path: `/account/${id}` })
    }
  }
}
</script>
