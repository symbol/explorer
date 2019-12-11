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
            <!-- Namespace Detail -->
            <Card
                class="card-f card-full-width"
                :loading="loading"
                :error="error"
            >
                <template #title>
                    {{detailTitle}}
                </template>

                <template #body v-if="namespaceInfo">
                    <TableInfoView :data="namespaceInfo" />
                </template>

                <template #error>
                    Namespace {{namespaceId}} does not exist
                </template>
            </Card>

            <!-- Namespace Levels -->
            <Card
                class="card-f card-adaptive"
                :loading="loading"
            >
                <template #title>
                    {{levelTitle}}
                </template>

                <template #body>
                    <TableListView :data="namespaceLevels" />
                </template>
            </Card>

            <!-- Metadata Entries -->
            <MetadataEntries class="card-f card-full-width" :data="metadataList" :loading="loading" />

        </div>
    </div>
</template>
<script>
import View from './View.vue'
import { mapGetters } from 'vuex'
import MetadataEntries from '../components/MetadataEntries'


export default {
  extends: View,

  components: { MetadataEntries },

  data() {
    return {
      detailTitle: 'Namespace Detail',
      levelTitle: 'Namespace Level',
    }
  },

  computed: {
    ...mapGetters({
      namespaceInfo: 'namespace/getNamespaceInfo',
      namespaceLevels: 'namespace/getNamespaceLevels',
      metadataList: 'namespace/getMetadataList',
      loading: 'namespace/namespaceInfoLoading',
      error: 'namespace/namespaceInfoError'
    }),

    namespaceId() {
      return this.$route.params.namespaceId || 0
    }
  }
}
</script>
