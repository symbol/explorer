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
  <div class="page-con">
    <div class="full-con mob_con">
      <div class="container p-0">
      <Card class="">
        <!-- Namespace Detail -->
        <template v-slot:title><h1 class="inline-block">Namespace Detail</h1></template>

        <template v-slot:body v-if="namespaceInfo">
          <TableInfoView :data="namespaceInfo" />
        </template>
      </Card>

      <!-- Namespace Level -->
      <Card class="card-adaptive">
        <template v-slot:title>Namespaces Level</template>

        <template v-slot:body>
          <TableListView :data="namespaceLevels" />
        </template>
      </Card>
    </div>
  </div>
  </div>
</template>
<script>
import TableInfoView from '@/components/tables/TableInfoView.vue'
import TableListView from '@/components/tables/TableListView.vue'
import Card from '@/components/containers/Card.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'NamespaceDetail',
  components: {
    Card,
    TableInfoView,
    TableListView,
  },
  created() {},
  data() {
    return {}
  },
  computed: {
    ...mapGetters({
      namespaceInfo: 'namespace/getNamespaceInfo',
      namespaceLevels: 'namespace/getNamespaceLevels',
    }),
    namespaceId() {
      return this.$route.params.namespaceId || 0
    },
  },
  mounted() {
    this.$store.dispatch('namespace/fetchNamespaceInfo', this.namespaceId)
  },
  methods: {},
}
</script>
<style lang="scss">
.page {
  .page-content-card-f {
    padding-top: 20px;
    padding-left: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .card-f {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  .card-adaptive {
    flex: 1 1 auto;
    max-width: 100%;
  }

  .card-full-width {
    width: 100%;
  }

  .max-height-medium {
    max-height: 100px;
  }
}
</style>
