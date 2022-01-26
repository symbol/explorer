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
	<div class="restriction-tag-container">
		<span
			v-for="(item, index) in value"
			class="restriction"
			:key="'restriction_key_' + index"
			:title="getTranslation('restrictionType') + ': ' + getTranslation(item.restrictionType) + ' | ' + getTranslation('restrictionValue') + ': ' + item.restrictionValue"
		>

			<span class="restriction-content">
				{{getTranslation('restrictionKey')}} {{ item.restrictionKey }} {{ getTranslation(item.restrictionType) || ':' }} {{ item.restrictionValue }}
			</span>
		</span>
	</div>
</template>

<script>
export default {
	name: 'RestrictionField',

	props: {
		value: {
			type: Array,
			required: true
		}
	},

	methods: {
		getTranslation (key) {
			return this.$store.getters['ui/getNameByKey'](key);
		}
	}
};
</script>

<style lang="scss" scoped>
.restriction-tag-container {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .restriction {
        display: inline-block;
        background: $violet-color;
        color: #fff;
        border-radius: 5px;
        border-width: 1px;
        border-style: solid;
        border-color: $violet-color;
        padding: 5px 10px;
        margin-right: 10px;
        white-space: nowrap;
    }
}
</style>
