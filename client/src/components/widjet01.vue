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
  <div class="info-col">
    <div class="info-ico">
      <i v-bind:class=itemThumb></i>
    </div>
    <div class="info-desc">
      <h3>{{ItemTitle}}</h3>
      <p>{{ItemData}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    ItemTitle: {
      type: String,
      required: true,
      default: ''
    },
    ItemData: { },
    itemThumb: { type: String }
  }
  // ['ItemTitle','ItemData','itemThumb']
}
</script>
