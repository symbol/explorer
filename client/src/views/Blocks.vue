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
                <h1 class="inline-block">Blocks</h1>
                <div class="btn_grp inline-block flt-rt">
                  <span>Current Block Height: {{blockHeight}}</span>
                </div>
              </div>
              <div class="box-con mt-0">
                <!-- <loader v-if="!this.loading"></loader>
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
                          <th>Age</th>
                          <th>Transactions</th>
                          <th>Fee</th>
                          <th>Timestamp</th>
                          <th>Harvester</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in getLatestBlockList" v-bind:key="item.height">
                          <td>
                            <router-link :to="'/block/' + item.height">{{item.height}}</router-link>
                          </td>
                          <td>
                            <time-since :date="item.date">
                              <template slot-scope="interval">
                                {{timeSince(interval)}}
                              </template>
                            </time-since>
                          </td>
                          <td>{{item.numTransactions}}</td>
                          <td>{{item.totalFee}}</td>
                          <td>{{item.date}}</td>
                          <td>
                            <router-link
                              :to="'/account/' + item.signer.address.address"
                            >{{item.signer.address.address}}</router-link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="table-footer">
                  <div class="pagination-container">
                    <ul class="pagination">
                      <li class="page-item" @click="previousPage()">
                        <a href="#">
                          <i class="ico-angle-left"></i>
                        </a>
                      </li>
                      <li class="page-item">
                        <a href="#" @click="nextPage()">
                          MORE
                        </a>
                      </li>
                    </ul>
                  </div>
                </div> -->
                <loader v-if="loading"></loader>
                <BlockTable :blockList="blockList"></BlockTable>
                <Pagination class="table-footer"
                  :nextPageAction="'block/fetchNextPage'"
                  :previousPageAction="'block/fetchPreviousPage'"
                ></Pagination>
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
import w1 from '@/components/BlockTable.vue'
import w2 from '@/components/Pagination.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Blocks',
  components: {
    BlockTable: w1,
    Pagination: w2
  },
  computed: {
    ...mapGetters({
      blockHeight: 'chain/getBlockHeight',
      blockList: 'block/getPageList',
      loading: 'block/getLoading'
    })
  },
  destroyed() {
    this.$store.dispatch('block/resetPage')
  }
}
</script>
