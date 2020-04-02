describe('Symbol Explorer Footer should', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('link to correct nemflash.io given click on NEM News', () => {
        cy.get('.footer').contains('NEM News')
        .click()
        .should('have.attr', 'href')
        .and('include', 'nemflash.io')
    })

    it('link to correct forum.nem.io given click on Forum', () => {
        cy.get('.footer')
        .contains('Forum')
        .click()
        .should('have.attr', 'href')
        .and('include', 'forum.nem.io')
    })

    it('link to correct nemtech github given click on Github', () => {
        cy.get('.footer')
        .contains('Github')
        .click()
        .should('have.attr', 'href')
        .and('include', 'github.com/nemtech')
    })

    it('link to correct nemred telegram given click on Telegram', () => {
        cy.get('.footer')
        .contains('Telegram')
        .click()
        .should('have.attr', 'href')
        .and('include', 't.me/nemred')
    })

    it('link to correct /r/nem/ reddit given click on Reddit', () => {
        cy.get('.footer')
        .contains('Reddit')
        .click()
        .should('have.attr', 'href')
        .and('include', 'reddit.com/r/nem')
    })

    it('link to correct terms page given click on Terms', () => {
        cy.get('.footer')
        .contains('Terms')
        .click()

        cy.url()
        .should('contain', '/terms')
    })

    it('link to correct privacy page given click on Privacy', () => {
        cy.get('.footer')
        .contains('Privacy')
        .click()

        cy.url()
        .should('contain', '/privacy')
    })

    it('contain Node Selector component', () => {
        cy.get('.node-selector')
    })

})
