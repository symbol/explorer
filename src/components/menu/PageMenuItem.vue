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
  <li @click="onItemClick">
    <router-link :to="to" exact active-class="active">
      <i v-bind:class="classname"></i>
      <span>{{text}}</span>
    </router-link>
  </li>
</template>
<script>
export default {
  name: 'PageMenuItem',
  props: {
    to: String,
    text: String,
    classname: String
  },
  methods: {
    onItemClick(e) {
      this.$store.dispatch('ui/openPage', { pageName: this.to.slice(1) })
      this.$emit('click', e)
    }
  }
}
</script>
