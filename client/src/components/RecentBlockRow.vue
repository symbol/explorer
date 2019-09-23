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
  <div class="col-md-3">
    <div class="rn_blk_con">
      <BlockHeightLink :height="item.height" tag="div" class="blkht"></BlockHeightLink>
      <BlockInfo :item="item"/>
    </div>
  </div>
</template>
<script>
import w1 from '@/components/BlockHeightLink.vue'
import w2 from '@/components/BlockInfo.vue'

export default {
  name: 'RecentBlockRow',
  components: {
    BlockHeightLink: w1,
    BlockInfo: w2
  },
  props: {
    item: {}
  }
}
</script>
