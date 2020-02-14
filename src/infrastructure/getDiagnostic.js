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

import http from './http'
import axios from 'axios'
import dto from './dto'

class sdkDiagnostic {
    static getChainInfo = async () => {
      const chainInfo = await http.diagnostic.getDiagnosticStorage().toPromise()
      return chainInfo
    }

    static getDiagnosticBlocksFromHeightWithLimit = async (limit, fromBlockHeight) => {
      // Make request.
      const path = `/diagnostic/blocks/${fromBlockHeight}/limit/${limit}`
      const response = await axios.get(http.nodeUrl + path)
      const blocks = response.data.map(info => dto.createBlockInfoFromDTO(info, http.networkType))

      return blocks
    }
}

export default sdkDiagnostic
