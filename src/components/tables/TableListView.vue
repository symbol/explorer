<template>
	<div v-if="data" class="table-view">
		<div v-if="dataIsNotEmpty" class="table-wrapper">
			<table class="table ex-table-striped">
				<thead>
					<tr>
						<th
							v-for="(columnName, index) in header"
							class="table-head-cell table-title-item"
							:key="'tlv_h'+index"
						>
							<span>{{getKeyName(columnName)}}</span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr
						v-for="(row, rowIndex) in preparedData"
						class="t-row"
						:class="{'pointer': isRowPointerShown}"
						:key="'tlv_r'+rowIndex"
						@click.stop="onRowClick(row)"
					>
						<td
							v-for="(item, itemKey) in row"
							class="table-cell"
							:key="'tlv_r'+rowIndex+'i'+itemKey"
							:class="{[itemKey]: true}"
							:title="getKeyName(itemKey) + (typeof item !== 'string' ? '' : ': ' +  item)"
						>
							<ArrayField v-if="isArrayField(itemKey)" :itemKey="itemKey" :value="item" />
							<Age v-else-if="isAge(itemKey)" :date="item" />
							<Decimal v-else-if="isDecimal(itemKey)" :value="item" />
							<MosaicsField v-else-if="isMosaics(itemKey)" :value="item" />
							<TransactionType v-else-if="isTransactionType(itemKey)" :value="item" />
							<BlockHeightWithFinalizedStatusField v-else-if="isBlockHeightWithFinalizedStatus(itemKey)" :value="item" />
							<RestrictionField v-else-if="itemKey === 'restrictions'" :value="item" />
							<ChainInfo v-else-if="itemKey === 'chainInfo'" :value="item" />
							<ExtendGraphicValueField v-else-if="itemKey === 'extendGraphicValue'" :value="item" :transactionType="row['transactionType']"/>
							<DateField v-else-if="itemKey === 'timestamp'" :timestamp="item" />
							<SoftwareVersion v-else-if="itemKey === 'softwareVersion'" :value="item" />
							<Harvester v-else-if="itemKey === 'harvester'" :value="item" />
							<EpochInfoField v-else-if="itemKey === 'epochInfo'" :value="item" />
							<MosaicFlagsField v-else-if="itemKey === 'mosaicFlags'" :value="item" />

							<div v-else-if="isAggregateInnerTransaction(itemKey)">
								<b-link v-b-modal="'tlv_r'+rowIndex">Show Detail</b-link>
								<Modal :id="'tlv_r'+rowIndex" :title="item.type">
									<div slot="body">
										<AggregateTransaction slot="body" :transactionBody="item" />
									</div>
								</Modal>
							</div>

							<div v-else class="max-item-width">
								<div
									v-if="isKeyClickable(itemKey) && getItemHref(itemKey, item)"
									@click.stop
									@click.prevent
								>
									<router-link
										:to="getItemHref(itemKey, item)"
										@click.stop
									>
										<Truncate v-if="isTruncate(itemKey)">{{item}}</Truncate>
										<div v-else>{{ translateValue(itemKey, item) }}</div>
									</router-link>
								</div>
								<div v-else>
									<Truncate v-if="isTruncate(itemKey)">{{item}}</Truncate>
									<div v-else>{{ translateValue(itemKey, item) }}</div>
								</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div v-if="pagination || timelinePagination" class="bottom">
				<div class="pagination-wrapper">
					<Pagination
						:canFetchPrevious="prevPageExist"
						:canFetchNext="nextPageExist"
						:goUp="false"
						:currentPageNumber="pageNumber"
						:lastPageNumber="lastPage"
						class="pagination"
						@next="nextPage"
						@previous="prevPage"
						@firstPage="goFirstPage"
						@lastPage="goLastPage"
						@fetchPage="fetchPage($event)"
					/>
					<Loading small v-if="paginationLoading" />
				</div>
			</div>
		</div>
		<div v-else class="empty-data">{{emptyDataMessageFormatted}}</div>
	</div>
</template>

<script>
import TableView from './TableView.vue';
import Modal from '@/components/containers/Modal.vue';
import AggregateTransaction from '@/components/AggregateTransaction.vue';
import Pagination from '@/components/controls/Pagination.vue';
import MosaicsField from '@/components/fields/MosaicsField.vue';
import TransactionType from '@/components/fields/TransactionType.vue';
import ArrayField from '@/components/fields/ArrayField.vue';
import RestrictionField from '@/components/fields/RestrictionField.vue';
import Loading from '@/components/Loading.vue';
import BlockHeightWithFinalizedStatusField from '@/components/fields/BlockHeightWithFinalizedStatusField.vue';
import ExtendGraphicValueField from '@/components/fields/ExtendGraphicValueField.vue';
import ChainInfo from '@/components/fields/ChainInfo.vue';
import DateField from '@/components/fields/DateField.vue';
import SoftwareVersion from '@/components/fields/SoftwareVersion.vue';
import Harvester from '@/components/fields/Harvester.vue';
import EpochInfoField from '@/components/fields/EpochInfoField.vue';
import MosaicFlagsField from '@/components/fields/MosaicFlagsField.vue';

export default {
	extends: TableView,

	components: {
		Modal,
		AggregateTransaction,
		Pagination,
		MosaicsField,
		TransactionType,
		ArrayField,
		BlockHeightWithFinalizedStatusField,
		RestrictionField,
		ExtendGraphicValueField,
		ChainInfo,
		Loading,
		DateField,
		SoftwareVersion,
		Harvester,
		EpochInfoField,
		MosaicFlagsField
	},

	props: {
		data: {
			type: Array,
			required: true
		},

		pagination: {
			type: Boolean,
			default: false
		},

		timelinePagination: {
			type: Boolean,
			default: false
		},

		timeline: {
			type: Object
		},

		pageSize: {
			type: Number,
			default: 10
		},

		onRowClickKey: {
			type: String
		}
	},

	created () {
		this.componentType = 'list';
	},

	data () {
		return {
			pageIndex: 0,
			openedModal: null
		};
	},

	computed: {
		preparedData () {
			if (
				Array.isArray(this.data) &&
                true === this.pagination &&
                !this.timelinePagination
			) {
				return this.data.slice(
					this.pageIndex * this.pageSize,
					this.pageIndex * this.pageSize + this.pageSize
				);
			} else { return this.data; }
		},

		nextPageExist () {
			if (this.timelinePagination && this.timeline instanceof Object)
				return this.timeline.canFetchNext;
			else
				return this.pageSize * (this.pageIndex + 1) < this.data.length;
		},

		prevPageExist () {
			if (this.timelinePagination && this.timeline instanceof Object)
				return this.timeline.canFetchPrevious;
			else
				return 0 < this.pageIndex;
		},

		pageNumber () {
			if (this.timelinePagination)
				return this.timeline.pageNumber;

			return this.pageIndex + 1;
		},

		lastPage () {
			if (this.timelinePagination) {
				if (!this.timeline?.totalRecords)
					return undefined;

				return Math.ceil(this.timeline.totalRecords / this.timeline.pageSize);
			}

			return Math.ceil(this.data.length / this.pageSize);
		},

		header () {
			let header = [];

			if (this.data) {
				for (let key in this.data[0])
					header.push(key);
			}
			return header;
		},

		dataIsNotEmpty () {
			return this.data.length;
		},

		paginationLoading () {
			return true === this.timeline?.isLoading;
		},

		isRowPointerShown () {
			return !!this.onRowClickKey;
		}
	},

	methods: {
		onMoreClick () {
			this.$store.dispatch(this.nextPageAction);
		},

		fetchPage (number) {
			const pageNumber = parseInt(number) || 1;

			// handle input number over range
			if (this.lastPage !== undefined) {
				if (pageNumber > this.lastPage || 0 >= pageNumber) {
					console.error('number out of range');
					return;
				}
			}

			if (this.timelinePagination)
				return this.timeline.fetchPage({ pageNumber });

			else
				this.pageIndex = pageNumber;
		},

		nextPage () {
			if (this.nextPageExist) {
				if (this.timelinePagination)
					this.timeline.fetchNext();

				else
					this.pageIndex++;
			}
		},

		prevPage () {
			if (this.prevPageExist) {
				if (this.timelinePagination)
					this.timeline.fetchPrevious();

				else
					this.pageIndex--;
			}
		},

		goFirstPage () {
			if (this.timelinePagination)
				this.fetchPage(1);

			else
				this.pageIndex = 0;
		},

		goLastPage () {
			if (this.timelinePagination)
				this.fetchPage(this.lastPage);

			else
				this.pageIndex = this.lastPage;
		},

		onRowClick (row) {
			if (this.onRowClickKey)
				this.onItemClick(this.onRowClickKey, row[this.onRowClickKey]);
		}
	},

	watch: {
		preparedData () {
			if (this.pageIndex >= this.lastPage)
				this.pageIndex = this.lastPage - 1;
		}
	}
};
</script>

<style lang="scss" scoped>
.table-view {
    overflow: auto;

    .pointer {
        cursor: pointer;
    }

    .bottom {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        color: var(--text-color);

        .pagination-wrapper {
            position: relative;
            display: flex;

            .pagination {
                margin: 0;
                margin-left: 10px;
            }
        }
    }
}
</style>
