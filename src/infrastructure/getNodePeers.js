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

import axios from 'axios'
import http from './http'
import dto from './dto'
import format from '../format'

class sdkNode {
    static getNodePeers = async () => {
      const path = `/node/peers`
      const response = await axios.get(http.nodeUrl + path)

      const nodes = response.data.map(node => dto.createNodeInfoFromDTO(node, http.networkType))

      return format.formatNodesInfo(nodes)
    }
}

export default sdkNode
