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

        const transactionHash = '2F3CD776DAEEA2E8E3FFE00D7A38DC6EA670E51175A5390CEEEC00B0DB197508'

        cy.get('.search-box')
        .type(transactionHash)
        .type('{enter}')

        cy.url()
        .should('contain', `transaction/${transactionHash}`)
    })

    it('redirect to account detail page given correct account address', () => {

        const address = 'TDTZ23JBJZP3GTKKM2P6FYCMXS6RQYPB6TIMSPVU'

        cy.get('.search-box')
        .type(address)
        .type('{enter}')

        cy.url()
        .should('contain', `account/${address}`)
    })
})