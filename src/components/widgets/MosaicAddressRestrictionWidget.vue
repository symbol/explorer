<template>
	<Card :loading="loading">
		<template #title>
			{{getNameByKey('checkMosaicAddressRestrictionStatus')}}
		</template>

		<template #body>
			<b-container fluid>
				<b-row>
					<b-col auto>
						<b-input
							v-model="address"
							:placeholder="getNameByKey('address')"
							size="sm"
							@focus="clear"
							@change="getMosaicAddressRestrictionStatus"
						/>
					</b-col>
					<b-col style="flex-grow: 0">
						<b-button @click="getMosaicAddressRestrictionStatus" variant="primary" size="sm">
							{{getNameByKey('check')}}
						</b-button>
					</b-col>
				</b-row>

				<b-row>
					<div v-if="error" class="btn-sm m-1 status errorMessage">
						{{getNameByKey('mosaicRestrictionError')}}
					</div>

					<div v-if="!error" class="detail-table">
						<TableInfoView v-if="restrictionInfo" :data="restrictionInfo" />
						<TableListView v-if="Array.isArray(restrictionList)" :data="restrictionList" />
					</div>
				</b-row>

			</b-container>
		</template>
	</Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import TableInfoView from '@/components/tables/TableInfoView.vue';
import TableListView from '@/components/tables/TableListView.vue';
import { mapGetters } from 'vuex';

export default {
	components: {
		Card,
		TableInfoView,
		TableListView
	},

	mounted() {
		this.clear();
	},

	data() {
		return {
			address: ''
		};
	},

	computed: {
		...mapGetters({
			mosaicInfo: 'mosaic/info',
			mosaicAddressRestriction: 'mosaic/mosaicAddressRestriction'
		}),

		loading() {
			return this.mosaicInfo.loading;
		},

		restrictionInfo() {
			const { restrictions, ...rest } = this.mosaicAddressRestriction.data;

			return rest;
		},

		restrictionList() {
			const { restrictions } = this.mosaicAddressRestriction.data;

			return restrictions;
		},

		error() {
			return this.mosaicAddressRestriction.error;
		}
	},

	methods: {
		clear() {
			this.address = '';
		},

		getNameByKey(e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		getMosaicAddressRestrictionStatus() {
			const payload = {
				mosaicId: this.mosaicInfo.data.mosaicId,
				address: this.address
			};

			this.$store.dispatch('mosaic/fetchMosaicAddressRestriction', payload);
		}
	},
};
</script>

<style lang="scss" scoped>
.errorMessage {
    color: red;
}

.status {
    font-size: 12px;
    padding-left: 15px;
    margin-left: 0;
    width: 100%;
}

.detail-table {
    padding-top: 10px;
    width: 100%;
}
</style>
