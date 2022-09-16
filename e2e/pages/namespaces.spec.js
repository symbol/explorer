describe('Symbol Explorer Namespaces list page should', () => {
	beforeEach(() => {
		cy.visit('/namespaces');
	});

	it('load pages titles', () => {
		cy.contains('Namespaces');
	});

	it('render table header and table body', () => {
		cy.renderTable();
	});

	it('render 5 items in table header', () => {
		cy.renderHeaderItem(5);
	});

	it('render at least 1 row data in the table list', () => {
		cy.renderData();
	});

	it('redirect to account detail page given click on Owner Address', () => {
		cy.get('tbody tr .ownerAddress a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/account');
	});

	it('redirect to namespace detail page given click on Namespace ID', () => {
		cy.get('tbody tr .namespaceId a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/namespace');
	});

	it('redirect to namespace detail page given click on Name', () => {
		cy.get('tbody tr .namespaceName a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/namespace');
	});
});