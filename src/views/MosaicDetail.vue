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
      <Card class="card-f card-full-width">
        <!-- Mosaic Detail -->
        <template v-slot:title>Mosaic Detail</template>

        <template v-slot:body v-if="mosaicInfo">
          <TableInfoView :data="mosaicInfo" />
        </template>
      </Card>
    </div>
  </div>
</template>
<script>
import TableInfoView from '@/components/tables/TableInfoView.vue'
import Card from '@/components/containers/Card.vue'
import View from './View.vue'
import { mapGetters } from 'vuex'

export default {
  extends: View,
  name: 'MosaicDetail',
  components: {
    Card,
    TableInfoView
  },
  created() {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      mosaicInfo: 'mosaic/getMosaicInfo'
    }),
    mosaicId() {
      return this.$route.params.mosaicId || 0
    }
  },
  methods: {},
  mounted() {
    this.$store.dispatch('mosaic/fetchMosaicInfo', this.mosaicId)
  }
}
</script>
<style lang="scss">

</style>
