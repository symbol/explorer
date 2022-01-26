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
	<div
		class="software-info-container"
		:title="title"
	>
		<div v-if="value && value.version" class="item-container">
			<div class="icon">
				<span class="mdi mdi-server"/>
			</div>
			{{value.version}}
		</div>
		<div v-if="value && value.restVersion" class="item-container">
			<div class="icon">
				<span class="mdi mdi-api"/>
			</div>
			{{value.restVersion}} {{value.isHttpsEnabled ? '(https)' : ''}}
		</div>
	</div>
</template>

<script>
export default {
	name: 'SoftwareVersion',

	props: {
		value: {
			type: Object,
			required: true
		}
	},

	data () {
		return {};
	},

	computed: {
		title () {
			return this.translate('version') +
			': ' + this.value.version +
			'\n' + this.translate('restVersion') +
			': ' + this.value.restVersion;
		}
	},

	methods: {
		translate (value) {
			return this.$store.getters['ui/getNameByKey'](value);
		}
	}
};
</script>

<style lang="scss" scoped>
.software-info-container {
    word-break: keep-all;
    content: ' ';
}

.item-container {
    display: flex;
}

.icon {
    margin: 0 5px 0 -5px;
}
</style>
