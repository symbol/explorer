/*
 *
 * (C) Symbol Contributors 2021
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
	<div class="flag-container">
		<span class="flag" v-for="(value, key) in displayFlag" :key="'mosaic_flag_' + key">
			<img
				v-if="value"
				:title="translate(key)"
				:src="iconUrl(key)"
				width="20px"
				height="20px"
				alt="flag"
			/>
		</span>
	</div>
</template>

<script>
import IconRestrictable from '../../styles/img/restrictable.png';
import IconMutable from '../../styles/img/supply-mutable.png';
import IconTransfer from '../../styles/img/transfer.png';
import IconRevoke from '../../styles/img/revoke.png';

export default {
	name: 'MosaicFlags',

	props: {
		value: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			IconRestrictable,
			IconMutable,
			IconTransfer,
			IconRevoke
		};
	},

	computed: {
		displayFlag () {
			const filtered = Object.entries(this.value).filter(([key, value]) => value);

			return Object.fromEntries(filtered);
		}
	},

	methods: {
		translate (value) {
			return this.$store.getters['ui/getNameByKey'](value);
		},

		iconUrl (icon) {
			switch (icon) {
			case 'restrictable':
				return this.IconRestrictable;
			case 'supplyMutable':
				return this.IconMutable;
			case 'transferable':
				return this.IconTransfer;
			case 'revokable':
				return this.IconRevoke;
			default:
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.flag {
    padding: 0 5px;
}
</style>
