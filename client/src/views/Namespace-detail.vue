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
                      <div class="value">
                        <router-link
                          :to="'/account/' + this.namespaceInfo.owner.address.plain()"
                        >{{this.namespaceInfo.owner.address.plain()}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Creator PublicKey</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.namespaceInfo.owner.publicKey}}</div>
                    </div>
                  </div>
                  <!-- <div class="row list_item">
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
                  </div>-->
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Start Height</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">
                        <router-link
                          :to="'/block/' + this.namespaceInfo.startHeight"
                        >{{this.namespaceInfo.startHeight}}</router-link>
                      </div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">End Height</div>
                    </div>
                    <div class="col-md-10">
                      <div v-if="typeof this.namespaceInfo.endHeight == 'number'" class="value">
                        <router-link
                          :to="'/block/' + this.namespaceInfo.endHeight"
                        >{{this.namespaceInfo.endHeight}}</router-link>
                      </div>

                      <div v-else class="value">{{this.namespaceInfo.endHeight}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Namespace ID</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.namespaceInfo.hexId}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Namespace Type</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.namespaceInfo.type}} Namespace</div>
                    </div>
                  </div>
                  <div v-if="namespaceInfo.parentName" class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Parent ID</div>
                    </div>
                    <div class="col-md-10">
                      <div
                        class="value"
                      >{{this.namespaceInfo.parentHexId}} | {{this.namespaceInfo.parentName}}</div>
                    </div>
                  </div>
                  <div class="row list_item">
                    <div class="col-md-2">
                      <div class="label">Status</div>
                    </div>
                    <div class="col-md-10">
                      <div class="value">{{this.namespaceInfo.active}}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="this.namespaceInfo.alias" class="widget has-shadow">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Alias</h1>
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
                        <th>Alias ID</th>
                        <th>TYPE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-if="this.namespaceInfo.aliastype === 'Mosaic'">
                        <td>
                          <router-link
                            :to="'/mosaic/' + this.namespaceInfo.alias"
                          >{{this.namespaceInfo.alias}}</router-link>
                        </td>
                        <td>{{this.namespaceInfo.aliastype}}</td>
                      </tr>
                      <tr v-if="this.namespaceInfo.aliastype === 'Address'">
                        <td>
                          <router-link
                            :to="'/account/' + this.namespaceInfo.alias"
                          >{{this.namespaceInfo.alias}}</router-link>
                        </td>
                        <td>{{this.namespaceInfo.aliastype}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div v-if="this.levels.length > 0" class="widget has-shadow">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Level</h1>
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
                        <th>Name</th>
                        <th>Namespace ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr></tr>
                      <tr v-for="(item) in levels" v-bind:key="item.namespaceId">
                        <td>
                          <router-link :to="'/namespace/' + item.name">{{item.name}}</router-link>
                        </td>
                        <td>
                          <router-link :to="'/namespace/' + item.name">{{item.namespaceId}}</router-link>
                        </td>
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
import sdkNamespace from '../infrastructure/getNamespace'

export default {
  name: 'block',
  components: {},
  created() {},
  data() {
    return {
      namespace_id: this.$route.params.namespace_id,
      loading: 0,
      namespaceInfo: {},
      alias: {},
      levels: Array
    }
  },
  mounted() {
    this.getNamespaceInfo()
  },
  methods: {
    async getNamespaceInfo() {
      const namespaceInfo = await sdkNamespace.getNamespaceInfoByName(
        this.namespace_id.toString().toLowerCase()
      )

      this.namespaceInfo = namespaceInfo
      this.levels = namespaceInfo.levels
      this.loading = 1
    }
  }
}
</script>
