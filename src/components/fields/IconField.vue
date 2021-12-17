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
	<div class="icon-container">
		<span class="icon" v-for="(value, key) in displayIcons" :key="'icon_' + key">
			<img
				v-if="value"
				:title="translate(key)"
				:src="iconUrl(key)"
				width="20px"
				height="20px"
				alt="icon"
			/>
		</span>
	</div>
</template>

<script>
import IconPeerNode from '../../styles/img/peer-node.png';
import IconApiNode from '../../styles/img/api-node.png';
import IconVotingNode from '../../styles/img/voting-node.png';

export default {
	name: 'IconField',

	props: {
		value: {
			type: Object,
			required: true
		}
	},

	data() {
		return {
			IconPeerNode,
			IconApiNode,
			IconVotingNode
		};
	},

	computed: {
		displayIcons() {
			const filtered = Object.entries(this.value).filter(([key, value]) => value);

			return Object.fromEntries(filtered);
		}
	},

	methods: {
		translate(value) {
			return this.$store.getters['ui/getNameByKey'](value);
		},

		iconUrl(icon) {
			switch (icon) {
			case 'peer':
				return this.IconPeerNode;
			case 'api':
				return this.IconApiNode;
			case 'voting':
				return this.IconVotingNode;
			default:
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.icon {
    padding: 0 5px;
}
</style>
