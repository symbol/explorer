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
  <div class="row">
    <div class="col-md-12">
      <div class="ftr_btm">
        <span>© NEM.io Foundation 2019</span>
        <span>|</span>
        <span> All Rights Reserved</span>
        <span>|</span>
        <ul class="ftr_btm-menu">
          <li>
            <router-link v-bind:to="'terms'">Terms</router-link>
            &
            <router-link v-bind:to="'privacy'">Privacy</router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
