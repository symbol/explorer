describe('NEM 2 Explorer Menu Route', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('click on home tab', () => {
        cy.contains('Nem blockchain explorer')
    })

    it('click on blocks tab', () => {
        cy.get('.ex-menu').contains('Blocks').click()
        cy.get('.ex-card-header').should('be.visible')
        cy.get('.table').should('be.visible')
    })

    it('click on transactions tab', () => {
        cy.get('.ex-menu').contains('Transactions').click()
        cy.get('.ex-card-header').should('be.visible')
    })

    it('click on account tab', () => {
        cy.get('.ex-menu').contains('Accounts').click()
        cy.get('.ex-card-header').should('be.visible')
    })

    it('loaded namespace tab', () => {
        cy.get('.ex-menu').contains('Namespaces').click()
        cy.get('.ex-card-header').should('be.visible')
        cy.get('.table').should('be.visible')
    })

    it('click on mosaic tab', () => {
        cy.get('.ex-menu').contains('Mosaics').click()
        cy.get('.ex-card-header').should('be.visible')
        cy.get('.table').should('be.visible')
    })

    it('click on nodes tab', () => {
        cy.get('.ex-menu').contains('Nodes').click()
        cy.get('.ex-card-header').should('be.visible')
        cy.get('.table').should('be.visible')
    })
})

describe('NEM 2 Explorer footer link', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('click on NEM News', () => {
        cy.get('.footer').contains('NEM News').click()
    })

    it('click on Forum', () => {
        cy.get('.footer').contains('Forum').click()
    })

    it('click on Github', () => {
        cy.get('.footer').contains('Github').click()
    })

    it('click on Telegram', () => {
        cy.get('.footer').contains('Telegram').click()
    })

    it('click on Reddit', () => {
        cy.get('.footer').contains('Reddit').click()
    })
})