describe('Symbol Explorer Transaction detail page for Transfer Transaction', () => {
    beforeEach(() => {
        cy.visit('/transaction/B6AF0363AEE2BC714C8D1E4311607FEEAE64A1CE39C484010A0DD71D8BCC5061')
    })

    describe('Transaction info card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Transaction Info"]').should('contain', 'Transaction Info')
        })

        it('render data info in table', ()=> {
            cy.get('[data-cy="Transaction Info"] table')
            .should('be.visible')

            cy.get('[data-cy="Transaction Info"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })

        it('render correct transaction info titles', ()=> {
            cy.get('[data-cy="Transaction Info"] .table-titles').as('infoTitle')

            cy.get('@infoTitle').should('have.length', 10)
            cy.get('@infoTitle').should('contain', 'Block Height')
            cy.get('@infoTitle').should('contain', 'Transaction Hash')
            cy.get('@infoTitle').should('contain', 'Transaction ID')
            cy.get('@infoTitle').should('contain', 'Date')
            cy.get('@infoTitle').should('contain', 'Deadline')
            cy.get('@infoTitle').should('contain', 'Fee')
            cy.get('@infoTitle').should('contain', 'Signature')
            cy.get('@infoTitle').should('contain', 'Signer')
            cy.get('@infoTitle').should('contain', 'Status')
            cy.get('@infoTitle').should('contain', 'Confirmation')
        })
    })

    describe('Transaction Detail card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Transaction Detail"]').should('contain', 'Transaction Detail')
        })

        it('render data info in table', ()=> {
            cy.get('[data-cy="Transaction Detail"] table')
            .should('be.visible')

            cy.get('[data-cy="Transaction Detail"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })

        it('render correct transaction detail titles', () => {
            cy.get('[data-cy="Transaction Detail"] .table-titles').as('infoTitle')

            cy.get('@infoTitle').should('have.length', 3)
            cy.get('@infoTitle').should('contain', 'Type')
            cy.get('@infoTitle').should('contain', 'Recipient')
            cy.get('@infoTitle').should('contain', 'Message')
        })

    })

    describe('Mosaics card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Mosaics"]').should('contain', 'Mosaics')
        })

        it('render data list in table', () => {
            cy.get('[data-cy="Mosaics"] table')
            .should('be.visible')

            cy.get('[data-cy="Mosaics"] thead > tr > th')
            .should('have.length', 3)

            cy.get('[data-cy="Mosaics"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })

        it('render correct table header.', () => {
            cy.get('[data-cy="Mosaics"] thead > tr > th').as('tableHeader')

            cy.get('@tableHeader').should('contain', 'Mosaic ID')
            cy.get('@tableHeader').should('contain', 'Amount')
            cy.get('@tableHeader').should('contain', 'Alias Namespace')
        })
    })

})