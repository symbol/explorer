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
    <top-header />
    <page-menu />
    <div class="page-content-card-f">
      <Card class="card-f card-full-width"> <!-- Mosaic Detail -->
                <template v-slot:title>
                    Mosaic Detail
                </template>

                <template v-slot:body>
                    <TableInfoView
                        :data="mosaicInfo"
                    />
                </template>
            </Card>

    </div>
    <page-footer />
  </div>
</template>
<script>
import View from './test/View';
import TableInfoView from '@/components/tables/TableInfoView.vue'
import Card from '@/components/containers/Card.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'MosaicDetail',
  extends: View,
  components: {
    Card,
    TableInfoView,
  },
  created() {},
  data() {
    return {
      mosaicId: this.$route.params.mosaicId,
    }
  },
  computed: {
    ...mapGetters({
      mosaicInfo: 'mosaic/getMosaicInfo',
    }),
  },
  methods: {},
  mounted() {
    this.$store.dispatch('mosaic/fetchMosaicInfo', this.mosaicId)
  },
}
</script>
