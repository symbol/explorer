<template>
	<span
		:title="getNameByKey('exportCSV')"
		class="mdi mdi-file-export-outline export-csv"
		@click="exportCSVFile"
	/>
</template>

<script>
import { NodeService } from '../../infrastructure';

export default {
	props: {
		filterOptions: {
			type: Object,
			default: () => {}
		}
	},

	methods: {
		async exportCSVFile () {
			const option = this.filterOptions;

			let csv = '';

			let link = document.createElement('a');

			switch (option.exportCSV.name) {
			case 'nodeListCSV':
				csv = await NodeService.getNodeListCSV(option.value);
			}

			link.setAttribute('href', encodeURI('data:text/csv;charset=utf-8,' + csv));
			link.setAttribute('download', option.label);
			link.click();
		},

		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		}
	}
};
</script>

<style lang="scss" scoped>
.export-csv {
    padding: 5px;
    right: 0;
    position: absolute;
    cursor: pointer;
}
</style>
