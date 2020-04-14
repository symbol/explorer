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
    <div class="page">
        <div class="page-content-card-f">
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{getNameByKey(title)}}
                </template>
                <template #control>
                    <div class="ex-infotext" v-if="hasInfoText"> {{infoText}} </div>
                    <TypeBox
                        v-if="hasFilter"
                        :options="filterOptions"
                        :value="filterValue"
                        right
                        @change="changeFilterValue"
                        @reset="resetFilter"
                    />
                </template>
                <template #body>
                    <TableListView
                        :data="data"
                        :timeline="timeline"
                        :timelinePagination="true"
                    />
                </template>

                <template #error>
                    {{getNameByKey('Unable to fetch data')}}
                </template>
            </Card>
        </div>
    </div>
</template>
<script>
import TypeBox from '@/components/controls/Dropdown.vue'
import View from './View.vue'

export default {
  extends: View,

  components: {
    TypeBox
  },

  props: {
    title: {
      type: String,
      required: true
    },

    hasFilter: {
      type: Boolean,
      default: false
    },

    hasInfoText: {
      type: Boolean,
      default: false
    },

    storeNamespaces: {
      type: Array
    },

    managerGetter: {
      type: String
    },

    dataGetter: {
      type: String
    },

    infoTextGetter: {
      type: String
    },

    Fields: {
      type: [Array, undefined],
      default: void 0
    },

    mobileFields: {
      type: [Array, undefined],
      default: void 0
    }
  },

  computed: {
    timeline() {
      return this.getter(this.managerGetter) || {}
    },

    data() {
      const timeline = this.getter(this.dataGetter) || this.timeline.data
      if (typeof timeline === 'undefined')
        throw Error('ListPage error. Timeline or Data getter is not provided')

      if (this.$store.getters['ui/isMobile'] && Array.isArray(this.mobileFields)) {
        return timeline.map(row => {
          let mobileRow = {}

          for (let item of this.mobileFields) {
            if (Object.keys(row).includes(item))
              mobileRow[item] = row[item]
          }

          return mobileRow
        })
      } else
      if (Array.isArray(this.Fields)) {
        return timeline.map(row => {
          let columnRow = {}

          for (let item of this.Fields) {
            if (Object.keys(row).includes(item))
              columnRow[item] = row[item]
          }

          return columnRow
        })
      } else
        return timeline
    },

    loading() {
      if (typeof this.loadingGetter === 'string')
        return this.getter(this.loadingGetter)
      else
        return this.timeline.loading
    },

    error() {
      if (typeof this.errorGetter === 'string')
        return this.getter(this.errorGetter)
      else
        return this.timeline.error
    },

    infoText() {
      if (typeof this.infoTextGetter === 'string')
        return this.getter(this.infoTextGetter)
      else
        return void 0
    },

    filterValue() {
      if (typeof this.filterValueGetter === 'string')
        return this.getter(this.filterValueGetter)
      else
        return this.timeline.filterValue
    },

    filterOptions() {
      if (typeof this.filterOptionsGetter === 'string')
        return this.getter(this.filterOptionsGetter)
      else
        return this.timeline.filterOptions
    }
  },

  methods: {
    getNameByKey(e) {
      return this.$store.getters['ui/getNameByKey'](e)
    },

    changeFilterValue(e) {
      this.timeline.changeFilterValue(e)
    },

    resetFilter(e) {
      // this.timeline.reset(e)
    },

    getter(name) {
      return this.$store.getters[name]
    }
  }
}
</script>
