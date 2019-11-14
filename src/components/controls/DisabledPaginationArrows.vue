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
    <div>
        <div class="pagination-container">
            <ul class="pagination">
                <li class="page-item">
                    <a class="disabled">
                        <i class="ico-angle-left pagination-arrow" />
                    </a>
                </li>
                <li class="page-item">
                    <a class="disabled">
                        <i class="ico-angle-right pagination-arrow" />
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.disabled {
    cursor: not-allowed;
    color: gray;
}

.pagination-arrow {
    justify-content: center;
    flex-direction: column;
    display: flex;
}
</style>
