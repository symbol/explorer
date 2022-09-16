Cypress.Commands.add('renderTable', () => {
	cy.get('table')
		.should('be.visible');

	cy.get('thead')
		.should('be.visible');

	cy.get('tbody')
		.should('be.visible');
});

Cypress.Commands.add('renderHeaderItem', length => {
	cy.get('thead > tr > th')
		.should('have.length', length);
});

Cypress.Commands.add('renderData', () => {
	cy.get('tbody > tr')
		.then($data => {
			return $data.length;
		}).should('be.at.least',1);
});

Cypress.Commands.add('renderTableInCard', dataCy => {
	cy.get(`[data-cy="${dataCy}"] table`)
		.should('be.visible');

	cy.get(`[data-cy="${dataCy}"] tbody > tr`)
		.then($data => {
			return $data.length;
		}).should('be.at.least',1);
});

Cypress.Commands.add('renderHeaderInTable', (dataCy, items) => {
	cy.get(`[data-cy="${dataCy}"] thead > tr > th`).as('tableHeader');
	cy.get('@tableHeader').should('have.length', items.length);

	items.map(item => {
		cy.get('@tableHeader').should('contain', item);
	});
});

Cypress.Commands.add('renderFieldInTable', (dataCy, items) => {
	cy.get(`[data-cy="${dataCy}"] .table-titles`).as('infoField');
	cy.get('@infoField').should('have.length', items.length);

	items.map(item => {
		cy.get('@infoField').should('contain', item);
	});
});

