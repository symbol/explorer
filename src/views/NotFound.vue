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
        <div class="page_con">
            <div class="container">
                <div class="content">
                    <h1>404</h1>
                    <blockquote>That's a Four-Oh-Four.</blockquote>
                    <router-link v-bind:to="'/'">Take me home.</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content {
    max-width: 740px;
    margin: 0 auto;
    padding: 2rem 2.5rem;
}

.content h1 {
    padding-top: 4.6rem;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-size: 40px;
}

blockquote {
    font-size: 1.2rem;
    color: #999;
    border-left: 0.25rem solid #dfe2e5;
    margin-left: 0;
    padding-left: 1rem;
}

a {
    color: #84accb;
    font-weight: bold;
    letter-spacing: 1px;
    text-decoration: none;
}
</style>
