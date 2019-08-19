const {
	NamespaceHttp,
	Address,
	NamespaceId,
	NamespaceService,
} = require('nem2-sdk');
const utils = require('../utils');
const { mergeMap, map } = require('rxjs/operators');
const endpoint = utils.getNodeEndPoint();

const namespaceHttp = new NamespaceHttp(endpoint);

async function getNamespacesFromAccountByAddress(address) {
	const addressObj = new Address(address);
	const namespacesIds = [];
	const namespaceList = await namespaceHttp
		.getNamespacesFromAccount(addressObj)
		.pipe(
			mergeMap(namespacesInfo => {
				const namespaceIds = namespacesInfo.map(x => {
					namespacesIds[x.id.toHex().toUpperCase()] = { namespaceInfo: x };
					return x.id;
				});
				return namespaceHttp.getNamespacesName(namespaceIds);
			}),
			map(namespacesNames =>
				namespacesNames.map(namespaceName => {
					const namespace =
						namespacesIds[namespaceName.namespaceId.toHex().toUpperCase()];
					namespace.namespaceName = namespaceName;
					return namespace;
				})
			)
		)
		.toPromise();

	return utils.formatNamespaces(namespaceList);
}

async function getNamespaceInfoByName(name) {
	const namespace = new NamespaceId(name);

	const namespaceService = new NamespaceService(namespaceHttp);
	const namespaceInfo = await namespaceService.namespace(namespace).toPromise();

	return utils.formatNamespace(namespaceInfo);
}

module.exports = {
	getNamespacesFromAccountByAddress,
	getNamespaceInfoByName,
};
