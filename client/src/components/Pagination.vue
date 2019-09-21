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
    <div class="pagination-container">
      <ul class="pagination">
        <li class="page-item" @click="previousPage()">
          <a href="#">
            <i class="ico-angle-left"></i>
          </a>
        </li>
        <li class="page-item">
          <a href="#" @click="nextPage()">
            <i class="ico-angle-right"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Pagination',
  props: {
    nextPageAction: String,
    previousPageAction: String
  },
  methods: {
    nextPage() {
      this.$store.dispatch(this.nextPageAction)
        .catch(error => console.log(error))
    },
    previousPage() {
      this.$store.dispatch(this.previousPageAction)
        .catch(error => console.log(error))
    }
  }
}
</script>
