describe('Search Box component should', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('throw error given dummy data', () => {

        cy.get('.search-box')
        .type('RB65QSXGV5FUOOP4MDI')
        .type('{enter}')

        cy.get('.search-box')
        .should('have.class', 'is-invalid')
    })

    it('redirect to block detail page given existing block number', () => {

        cy.get('.search-box')
        .type('1')
        .type('{enter}')

        cy.url()
        .should('contain', 'block/1')
    })

    it('redirect to transaction detail page given correct transaction hash', () => {

        const transactionHash = '1F4B55D42C9C91805E73317319DDDA633667D5E44EB0F03678FF7F130555DF4B'

        cy.get('.search-box')
        .type(transactionHash)
        .type('{enter}')

        cy.url()
        .should('contain', `transaction/${transactionHash}`)
    })

    it('redirect to account detail page given correct account address', () => {

        const address = 'TB65QSXGV5FUTRPVMSCVB4RZ7FJLU32LHOOP4MDI'

        cy.get('.search-box')
        .type(address)
        .type('{enter}')

        cy.url()
        .should('contain', `account/${address}`)
    })
})