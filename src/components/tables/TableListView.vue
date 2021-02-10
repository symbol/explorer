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
							<RewardPrograms v-else-if="itemKey === 'rewardPrograms'" :value="item" />
							<ChainInfo v-else-if="itemKey === 'chainInfo'" :value="item" />
							<ExtendGraphicValueField v-else-if="itemKey === 'extendGraphicValue'" :value="item" :transactionType="row['transactionType']"/>

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
				<div v-if="pagination">{{ pageIndex + 1 }}/{{ getPageNumber(lastPage) }}</div>
				<div v-else>{{ getPageNumber(timeline.index, timeline.pageNumber) }}/ {{ getPageNumber() }}</div>
				<div class="pagination-wrapper">
					<Pagination
						:canFetchPrevious="prevPageExist"
						:canFetchNext="nextPageExist"
						:goUp="false"
						class="pagination"
						@next="nextPage"
						@previous="prevPage"
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
import RewardPrograms from '@/components/fields/RewardPrograms';
import ChainInfo from '@/components/fields/ChainInfo';

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
		RewardPrograms,
		ChainInfo,
		Loading
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

	created() {
		this.componentType = 'list';
	},

	data() {
		return {
			pageIndex: 0,
			openedModal: null
		};
	},

	computed: {
		preparedData() {
			if (
				Array.isArray(this.data) &&
                this.pagination === true &&
                !this.timelinePagination
			) {
				return this.data.slice(
					this.pageIndex * this.pageSize,
					this.pageIndex * this.pageSize + this.pageSize
				);
			}
			else return this.data;
		},

		nextPageExist() {
			if (this.timelinePagination && this.timeline instanceof Object)
				return this.timeline.canFetchNext;
			else return this.pageSize * (this.pageIndex + 1) < this.data.length;
		},

		prevPageExist() {
			if (this.timelinePagination && this.timeline instanceof Object)
				return this.timeline.canFetchPrevious;
			else return this.pageIndex > 0;
		},

		lastPage() {
			return Math.ceil(this.data.length / this.pageSize);
		},

		header() {
			let header = [];

			if (this.data) for (let key in this.data[0]) header.push(key);
			return header;
		},

		dataIsNotEmpty() {
			return this.data.length;
		},

		paginationLoading() {
			return this.timeline?.isLoading === true;
		},

		isRowPointerShown() {
			return !!this.onRowClickKey;
		}
	},

	methods: {
		onMoreClick() {
			this.$store.dispatch(this.nextPageAction);
		},

		nextPage() {
			if (this.nextPageExist) {
				if (this.timelinePagination)
				// this.$store.dispatch(this.timelineNextAction)
					this.timeline.fetchNext();
				else this.pageIndex++;
			}
		},

		prevPage() {
			if (this.prevPageExist) {
				if (this.timelinePagination)
				// this.$store.dispatch(this.timelinePreviousAction)
					this.timeline.fetchPrevious();
				else this.pageIndex--;
			}
		},

		getPageNumber() {
			const args = [...arguments];
			const number = args.find(arg => typeof arg === 'number');

			return typeof number === 'number'
				? number
				: '..';
		},

		onRowClick(row) {
			if (this.onRowClickKey)
				this.onItemClick(this.onRowClickKey, row[this.onRowClickKey]);
		}
	},

	watch: {
		preparedData() {
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
        color: #393939;

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
