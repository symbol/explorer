describe('NEM 2 Explorer Header', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('check on Title', () => {
        cy.get('.header-title')
        .contains('Nem blockchain explorer')

        cy.get('.header-logo')
        .should('have.attr', 'src')
        .and('equal', '/theme/img/logo-w.png')

    })

    it('click on Language Selector', () => {
        // Todo: Anthony
    })

    it('search dumy should get Error message', () => {

        cy.get('input')
        .type('RB65QSXGV5FUOOP4MDI')
        .type('{enter}')

        cy.get('input')
        .should('have.class', 'is-invalid')
    })

    it('search block by block number should redirect to block detail page', () => {

        cy.get('input')
        .type('1')
        .type('{enter}')

        cy.url()
        .should('contain', 'block/1')
    })

    it('search transaction by hash should redirect to transaction detail page', () => {

        const transactionHash = '626F75EB81D081BAC59DE960EF8B6C44810C3E346B7874652197764EF048B39B'

        cy.get('input')
        .type(transactionHash)
        .type('{enter}')

        cy.url()
        .should('contain', `transaction/${transactionHash}`)
    })

    it('search account by address should redirect to account detail page', () => {

        const address = 'TB65QSXGV5FUTRPVMSCVB4RZ7FJLU32LHOOP4MDI'

        cy.get('input')
        .type(address)
        .type('{enter}')

        cy.wait(5000)

        cy.url()
        .should('contain', `account/${address}`)
    })
})