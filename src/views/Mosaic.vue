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
    <top-header />
    <page-menu />
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Mosaic List</h1>
                <div class="btn_grp inline-block flt-rt"></div>
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
                          <th>Mosaic ID</th>
                          <th>Creator</th>
                          <th>Supply</th>
                          <th>Divisibility</th>
                           <th>Create Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr @click="loadMosaicInfo('nemona','xemona')">
                          <td>1</td>
                          <td>nemona:xemona</td>
                          <td>NAAXHJM65OKDFSYGW4XW4EKJXUIRTKEZZWRK45YF</td>
                          <td>100,000</td>
                          <td>0</td>
                          <td>2019-08-06 15:57:28</td>
                        </tr>
                        <tr @click="loadMosaicInfo('nemona','xemona')">
                          <td>2</td>
                          <td>nemona:nemona</td>
                          <td>NAAXHJM65OKDFSYGW4XW4EKJXUIRTKEZZWRK45YF</td>
                          <td>1,000,000</td>
                          <td>0</td>
                          <td>2019-08-06 15:57:28</td>
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
    <page-footer />
  </div>
</template>
<script>
import router from '../router'

export default {
  methods: {
    loadMosaicInfo(namespaceId, mosaicId) {
      router.push({ path: `/mosaic/${namespaceId}/${mosaicId}` })
    }
  }
}
</script>
