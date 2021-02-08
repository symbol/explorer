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
	<div class="programs-container">
		<div
			v-for="(item, index) in value"
			class="program"
			:key="'prog_s' + index"
			:title="translate('rewardProgram') + ': ' + item.name + '\n' + translate('lastTestPassed') + ': ' + item.passed"
		>
			{{item.name}}
			<Boolean :value="item.passed" class="boolean-icon" />
		</div>
	</div>
</template>

<script>
import Boolean from '@/components/fields/Boolean.vue';

export default {
	name: 'RewardPrograms',

	components: {
		Boolean
	},

	props: {
		value: {
			type: Array,
			required: true
		}
	},

	methods: {
		translate(value) {
			return this.$store.getters['ui/getNameByKey'](value);
		}
	}
};
</script>

<style lang="scss" scoped>
.programs-container {
    padding-right: 8px;

    .program {
        position: relative;
        word-break: normal;

        .boolean-icon {
            position: absolute;
            height: 8px;
            width: 8px;
        }
    }
}
</style>
