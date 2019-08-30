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
          <div class="widget has-shadow mt-4 m-0 z-1">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Namespace Detail</h1>
              </div>
              <div class="box-con mt-0">
                <div class="list_info_con">
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Namespace</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{namespace_id}}</div>
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
                      <div class="label">CreateTime</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2019-08-06 13:48:40</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">ExpiredTime</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2020-08-06 13:48:40</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">2271690</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="widget has-shadow">
            <div class="box">
                <div class="box-title">
                <h1 class="inline-block">Mosaics</h1>
              </div>
              <div class="table-responsive">
                <div
                  id="sorting-table_wrapper"
                  class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                >
                  <table
                    id="lst34"
                    class="table table-striped table-bordered"
                    cellspacing="0"
                    width="100%"
                  >
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Mosaic</th>
                        <th>InitialSupply</th>
                        <th>Divisibility</th>
                        <th>TimeStamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1</td>
                        <td>nemona:xemona</td>
                        <td>100,000</td>
                        <td>0</td>
                        <td>2019-08-06 15:57:28</td>
                      </tr>
                      <tr>
                        <td>2</td>
                        <td>nemona:nemona</td>
                        <td>1,000,000</td>
                        <td>0</td>
                        <td>2019-08-06 15:56:28</td>
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
      namespace_id: this.$route.params.namespace_id
    }
  },
  methods: {},
  mounted () {}
}
</script>
