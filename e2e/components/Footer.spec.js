describe('NEM 2 Explorer Footer', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('click on NEM News', () => {
        cy.get('.footer').contains('NEM News')
        .click()
        .should('have.attr', 'href')
        .and('include', 'nemflash.io')
    })

    it('click on Forum', () => {
        cy.get('.footer')
        .contains('Forum')
        .click()
        .should('have.attr', 'href')
        .and('include', 'forum.nem.io')
    })

    it('click on Github', () => {
        cy.get('.footer')
        .contains('Github')
        .click()
        .should('have.attr', 'href')
        .and('include', 'github.com/nemtech')
    })

    it('click on Telegram', () => {
        cy.get('.footer')
        .contains('Telegram')
        .click()
        .should('have.attr', 'href')
        .and('include', 't.me/nemred')
    })

    it('click on Reddit', () => {
        cy.get('.footer')
        .contains('Reddit')
        .click()
        .should('have.attr', 'href')
        .and('include', 'reddit.com/r/nem')
    })

    it('click on Terms', () => {
        cy.get('.footer')
        .contains('Terms')
        .click()

        cy.url()
        .should('contain', '/terms')
    })

    it('click on Privacy', () => {
        cy.get('.footer')
        .contains('Privacy')
        .click()

        cy.url()
        .should('contain', '/privacy')
    })

    it('click on Node Selector', () => {
        // Todo: Anthony
    })

})
