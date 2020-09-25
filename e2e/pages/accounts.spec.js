describe('Symbol Explorer Accounts list page should', () => {
    beforeEach(() => {
        cy.visit('/accounts')
    })

    it('load pages titles', () => {
        cy.contains('Accounts')
    })

    it('render table header and table body', () => {
        cy.renderTable()
    })

    it('render 5 items in table header', () => {
        cy.renderHeaderItem(5)
    })

    it('render at least 1 row data in the table list', () => {
        cy.renderData()
    })

    it('redirect to account detail page given click on Address', () => {
        cy.get('tbody tr .address a')
        .then($data => {
            return $data[0]
        }).click({ force:true })

        cy.url().should('contain', '/account')
    })

    // Todo
    // it('redirect to block detail page given click on Last Activity', () => {
    //     cy.get('tbody tr .lastActivity a')
    //     .then($data => {
    //         return $data[0]
    //     }).click({ force:true })

    //     cy.url().should('contain', '/block')
    // })
})