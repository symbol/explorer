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
  <div class="box">
    <div class="box-title">
      <h1 class="inline-block">{{infoTitle}}</h1>
      <span class="info_append">{{infoDescription}}</span>
    </div>
    <div class="box-con mt-0">
       <loader v-if="!loading"></loader>
      <div class="list_info_con" >
        <div
          class="row list_item"
          v-for="(item,index) in rows"
          v-bind:key="index"
        >
          <div class="col-md-2">
            <div class="label">{{index}}</div>
          </div>
          <div class="col-md-10">

            <div v-if="index =='mosaics'">
              <div v-for="(mosaic,index) in item" v-bind:key="index">
                <div class="label">ID: {{mosaic.id}} : {{mosaic.amount}}</div>
              </div>
            </div>
            <div v-else class="label">{{item}}</div>
          </div>
        </div>
      </div>
      <!-- <div class="list_info_con">
        <div class="row">
           <div class="label">Block data not found</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: {
    loading: {
      type: Number,
      default: 0
    },
    infoTitle: String,
    infoDescription: String,
    rows: {}
  },
  methods: {}
}
</script>
