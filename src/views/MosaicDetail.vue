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
                    {{title}}
                </template>

                <template #body v-if="mosaicInfo">
                    <TableInfoView :data="mosaicInfo" />
                </template>

                <template #error>
                    Mosaic {{mosaicId}} does not exist
                </template>
            </Card>

            <!-- Metadata Entries -->
            <MetadataEntries class="card-f card-full-width" :data="metadataList" :loading="loading" />


        </div>
    </div>
</template>
<script>
import View from './View.vue'
import MetadataEntries from '../components/MetadataEntries'
import { mapGetters } from 'vuex'

export default {
  extends: View,

  components: { MetadataEntries },

  data() {
    return {
      title: 'Mosaic Detail',
    }
  },

  computed: {
    ...mapGetters({
      mosaicInfo: 'mosaic/getMosaicInfo',
      metadataList: 'mosaic/getMetadataList',
      loading: 'mosaic/mosaicInfoLoading',
      error: 'mosaic/mosaicInfoError'
    }),
    mosaicId() {
      return this.$route.params.mosaicId || 0
    }
  }
}
</script>
