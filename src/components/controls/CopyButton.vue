<template>
	<img :src="IconCopy" class="icon-copy noselect" @click="onCopyClick" />
</template>
<script>
import helper from '../../helper';
import IconCopy from '../../styles/img/copy.png';
import TableView from '../../components/tables/TableView.vue';

export default{
	name: 'CopyButton',
	extends: TableView,
	data () {
		return {
			IconCopy
		};
	},
	props: {
		value: {
			type: String,
			required: true
		},
		successMessage: {
			type: String,
			default: 'value'
		}
	},
	methods: {
		onCopyClick () {
			return helper.copyTextToClipboard(this.value)
				.then(() => this.successMsg())
				.catch(() => this.errorMsg());
		},
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},
		successMsg () {
			this.$bvToast.toast(this.getNameByKey(this.successMessage), {
				variant: 'success',
				solid: true,
				'noCloseButton': true
			});
		},
		errorMsg () {
			this.$bvToast.toast(this.getNameByKey('failedToCopy'), {
				variant: 'danger',
				solid: true,
				'noCloseButton': true
			});
		}
	}
}
</script>
<style lang="scss" scoped>
.icon-copy {
    margin-top: -2px;
    margin-left: 5px;
    opacity: 0.5;
    cursor: pointer;
    padding: 0 2px;
}
</style>
