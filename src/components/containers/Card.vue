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
    <div class="card">
        <div class="card-header">
            <slot name="header" />
            <slot name="title" />
            <slot name="control" />
        </div>

        <div v-if="loading" class="card-loading">
            <Loading />
        </div>

        <div v-if="error" class="card-error">
            <slot name="error" />
        </div>

        <div v-if="!error && !loading" class="card-body">
            <slot name="body" />
        </div>
    </div>
</template>

<script>
import Loading from '@/components/Loading.vue'

export default {
    components: {
        Loading
    },

    props: {
        loading: {
            type: Boolean,
            default: false
        },

        error: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.card {
    padding: 20px;
    box-shadow: 0 1px 15px 1px rgba(52, 40, 104, 0.18);
    background: #fff;
    border-radius: 4px;
    border: none;
    margin-bottom: 20px;
    transition: all 0.5s ease-in-out;
    position: relative;

    .card-loading {
        height: 187px;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 500;
        color: #393939;
    }

    .card-body {
        position: relative;
        display: block;
    }

    .card-error {
        font-size: 14px;
        color: #98a8b4;
        display: flex;
        justify-content: center;
    }
}
</style>
