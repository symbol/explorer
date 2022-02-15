<script>
import IconStatistics from '../../styles/img/statistics.png';
import IconMosaics from '../../styles/img/mosaic.png';
import IconHome from '../../styles/img/home.png';
import IconBlocks from '../../styles/img/block.png';
import IconTransactions from '../../styles/img/transaction.png';
import IconAccounts from '../../styles/img/account.png';
import IconNodes from '../../styles/img/nodes.png';
import IconNamespaces from '../../styles/img/namespace.png';

export default {
	data () {
		return {
			IconStatistics,
			IconMosaics,
			IconHome,
			IconBlocks,
			IconTransactions,
			IconAccounts,
			IconNodes,
			IconNamespaces
		};
	},

	methods: {
		getNameByKey (e) {
			return this.$store.getters['ui/getNameByKey'](e);
		},

		iconUrl (icon) {
			switch (icon) {
			case 'IconHome':
				return this.IconHome;
			case 'IconBlocks':
				return this.IconBlocks;
			case 'IconTransactions':
				return this.IconTransactions;
			case 'IconAccounts':
				return this.IconAccounts;
			case 'IconNodes':
				return this.IconNodes;
			case 'IconNamespaces':
				return this.IconNamespaces;
			case 'IconStatistics':
				return this.IconStatistics;
			case 'IconMosaics':
				return this.IconMosaics;
			default:
				return null;
			}
		}
	}
};
</script>
