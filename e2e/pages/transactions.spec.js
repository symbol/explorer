describe('Symbol Explorer Transactions list page should', () => {
    it('load pages titles', () => {
        cy.visit('/transactions')
        cy.contains('Transactions')
    })

    it('render table header and table body', () => {
        cy.visit('/transactions')

        cy.get('table')
        .should('be.visible')

        cy.get('thead')
        .should('be.visible')

        cy.get('tbody')
        .should('be.visible')
    })

    it('render 7 items in table header', () => {
        cy.visit('/transactions')

        cy.get('thead > tr > th')
        .should('have.length', 7)
    })

    it('render at least 1 row data in the table list', () => {
        cy.visit('/transactions')

        cy.get('tbody > tr')
        .then($data => {
            return $data.length
        }).should('be.at.least',1)
    })

    it('redirect to transaction detail page given click on transaction hash', () => {
        cy.visit('/transactions')

        cy.get('tbody tr .transactionHash')
        .then($data => {
            return $data[0]
        }).click()

        cy.url().should('contain', '/transaction')
    })

    it('redirect to account detail page given click on signer address', () => {
        cy.visit('/transactions')

        cy.get('tbody tr .signer')
        .then($data => {
            return $data[0]
        }).click()

        cy.url().should('contain', '/account')
    })
  })