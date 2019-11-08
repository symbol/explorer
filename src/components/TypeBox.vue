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
  <div class="box-title">
    <div class="btn_grp inline-block flt-rt">
      <div class="select_type">
        <select @change="onChange($event)">
            <option
                v-for="(value, option) in typeMap"
                v-bind:key="option"
                :value="option"
            >
                {{value}}
            </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    typeMap: {
      required: true
    },

    resetPageAction: {
      type: String,
      required: true
    },

    changePageAction: {
      type: String,
      required: true
    }
  },

  mounted() {
    this.$store.dispatch(this.resetPageAction)
  },

  destroyed() {
    this.$store.dispatch(this.resetPageAction)
  },

  methods: {
    onChange(event) {
      this.$store.dispatch(this.changePageAction, event.target.value)
    }
  }
}
</script>
