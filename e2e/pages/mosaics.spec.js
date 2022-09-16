describe('Symbol Explorer Mosaics list page should', () => {
	beforeEach(() => {
		cy.visit('/mosaics');
	});

	it('load pages titles', () => {
		cy.contains('Mosaics');
	});

	it('render table header and table body', () => {
		cy.renderTable();
	});

	it('render 7 items in table header', () => {
		cy.renderHeaderItem(7);
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

	it('redirect to mosaic detail page given click on Mosaic ID', () => {
		cy.get('tbody tr .mosaicId a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/mosaic');
	});

	it('redirect to block detail page given click on Registered at Height ', () => {
		cy.get('tbody tr .startHeight a')
			.then($data => {
				return $data[0];
			}).click({ force:true });

		cy.url().should('contain', '/block');
	});
});