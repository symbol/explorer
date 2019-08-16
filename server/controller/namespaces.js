const { NamespaceHttp, Address, NamespaceId } = require('nem2-sdk');
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
	const namespaceIds = [];
	const namespace = new NamespaceId(name);
	const namespaceInfo = await namespaceHttp.getNamespace(namespace).toPromise();

	namespaceIds.push(namespaceInfo.id);
	// console.log(namespaceInfo);

	const namespaceNames = await namespaceHttp
		.getNamespacesName(namespaceIds)
		.toPromise();

	namespaceNames.map(x => {
		namespaceInfo.namespaceName = x;
	});

	console.log(namespaceInfo);

	// let namespaceName = namespaceNames;

	const namespacesInfo = [{ namespaceInfo }];
	return utils.formatNamespaces(namespacesInfo);
}

async function getLinkedMosaicIdByNamespaceId() {
	// Todo: namespaceHttp.getLinkedMosaicId(defaultNamespaceId)
}

async function getLinkedAddressByNamespaceId() {
	// Todo: namespaceHttp.getLinkedAddress(namespaceId)
}

module.exports = {
	getNamespacesFromAccountByAddress,
	getNamespaceInfoByName,
};
