describe('NEM 2 Explorer Menu Route', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('click on home tab', () => {
        cy.contains('XEM Price')
        cy.contains('Base Info')
        cy.contains('Recent Transactions')
        cy.contains('Recent Blocks')
    })

    it('click on blocks tab', () => {
        cy.get('.ex-menu').contains('Blocks').click()
        cy.url().should('contain', '/blocks')

    })

    it('click on transactions tab', () => {
        cy.get('.ex-menu').contains('Transactions').click()
        cy.url().should('contain', '/transactions')
    })

    it('click on account tab', () => {
        cy.get('.ex-menu').contains('Accounts').click()
        cy.url().should('contain', '/accounts')
    })

    it('loaded namespace tab', () => {
        cy.get('.ex-menu').contains('Namespaces').click()
        cy.url().should('contain', '/namespaces')
    })

    it('click on mosaic tab', () => {
        cy.get('.ex-menu').contains('Mosaics').click()
        cy.url().should('contain', '/mosaics')
    })

    it('click on nodes tab', () => {
        cy.get('.ex-menu').contains('Nodes').click()
        cy.url().should('contain', '/nodes')
    })
})
