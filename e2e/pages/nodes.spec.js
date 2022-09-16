describe('Symbol Explorer Nodes list page should', () => {
	beforeEach(() => {
		cy.visit('/nodes');
	});

	it('load pages titles', () => {
		cy.contains('Nodes');
	});

	it('render table header and table body', () => {
		cy.renderTable();
	});

	it('render 8 items in table header', () => {
		cy.renderHeaderItem(8);
	});

	it('render at least 1 row data in the table list', () => {
		cy.renderData();
	});

	it('redirect to account detail page given click on Address', () => {
		cy.get('tbody tr .address a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/account');
	});
});