
describe('Symbol Explorer Menu Route should', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('redirect to home given click on home tab', () => {
        cy.contains('XEM Price')
        cy.contains('Base Info')
        cy.contains('Recent Transactions')
        cy.contains('Recent Blocks')
    })

    it('redirect to blocks listing given click on blocks tab', () => {
        cy.get('.ex-menu').contains('Blocks').click()
        cy.url().should('contain', '/blocks')

    })

    it('redirect to transactions listing given click on transactions tab', () => {
        cy.get('.ex-menu').contains('Transactions').click()
        cy.url().should('contain', '/transactions')
    })

    it('redirect to accounts listing click on account tab', () => {
        cy.get('.ex-menu').contains('Accounts').click()
        cy.url().should('contain', '/accounts')
    })

    it('redirect to namespaces listing given click on namespace tab', () => {
        cy.get('.ex-menu').contains('Namespaces').click()
        cy.url().should('contain', '/namespaces')
    })

    it('redirect to mosaics listing given click on mosaic tab', () => {
        cy.get('.ex-menu').contains('Mosaics').click()
        cy.url().should('contain', '/mosaics')
    })

    it('redirect to nodes listing given click on nodes tab', () => {
        cy.get('.ex-menu').contains('Nodes').click()
        cy.url().should('contain', '/nodes')
    })

    it('redirect to statistics page given click on statistics tab', () => {
        cy.get('.ex-menu').contains('Statistics').click()
        cy.url().should('contain', '/statistics')
    })
})
