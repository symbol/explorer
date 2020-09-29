import config from '../config/network.conf.json'

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
        .type(config.testBlock.height)
        .type('{enter}')

        cy.url()
        .should('contain', 'blocks/1')
    })

    it('redirect to transaction detail page given correct transaction hash', () => {

        cy.get('.search-box')
        .type(config.testTransactions.transferTransaction)
        .type('{enter}')

        cy.url()
        .should('contain', `transactions/${config.testTransactions.transferTransaction}`)
    })

    it('redirect to account detail page given correct account address in plain format', () => {

        cy.get('.search-box')
        .type(config.testAccount.address)
        .type('{enter}')

        cy.url()
        .should('contain', `accounts/${config.testAccount.address}`)
    })

    it('redirect to account detail page given correct account address in pretty format', () => {

        const prettyAddress = config.testAccount.address.match(/.{1,6}/g).join('-');

        cy.get('.search-box')
        .type(prettyAddress)
        .type('{enter}')

        cy.url()
        .should('contain', `accounts/${config.testAccount.address}`)
    })
})