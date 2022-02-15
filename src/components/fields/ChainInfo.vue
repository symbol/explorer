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
		class="chain-info-container"
		:title="title"
	>
		<div v-if="value && value.chainHeight" class="chain-height">
			<div class="icon icon-height">
				<span class="mdi mdi-clock-outline"/>
			</div>
			{{value.chainHeight}}
		</div>
		<div v-if="value && value.chainHeight" class="finalized-height">
			<div class="icon">
				<img
					class="icon-finalized"
					:src="LockIcon"
				/>
			</div>
			{{value.finalizationHeight}}
		</div>
	</div>
</template>

<script>
import LockIcon from '../../styles/img/lock.png';

export default {
	name: 'ChainInfo',

	props: {
		value: {
			type: Object,
			required: true
		}
	},

	data () {
		return {
			LockIcon
		};
	},

	computed: {
		title () {
			return this.translate('chainHeight') +
			': ' + this.value.chainHeight +
			'\n' + this.translate('finalizedHeight') +
			': ' + this.value.finalizationHeight +
			'\n' + this.translate('lastStatusCheck') +
			': ' + new Date(this.value.lastStatusCheck);
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
.chain-info-container {
    word-break: keep-all;
    content: ' ';
}

.chain-height {
    display: flex;
}

.finalized-height {
    font-size: 90%;
    opacity: 0.7;
    display: flex;
    width: 100%;
}

.icon {
    margin-right: 5px;

    .icon-finalized {
        margin-left: 1.5px;
        height: 12px;
        margin-bottom: 2px;
        filter: var(--icon-invert);
    }

    .icon-height {
        margin-left: -5px;
    }
}
</style>
