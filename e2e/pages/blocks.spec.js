describe('Symbol Explorer Blocks list page should', () => {
    it('load pages titles', () => {
        cy.visit('/blocks')
        cy.contains('Blocks')
    })

    it('load chain height and block height is more than 0', () => {
        cy.server({ force404: true })
        cy.route('GET', '/transactions/from/**/limit/**').as('getLatestBlock')

        cy.visit('/blocks')
        cy.wait('@getLatestBlock')

        cy.get('.ex-infotext')
        .should('be.visible')
        .should('not.empty')

        cy.get('.ex-infotext')
        .then(($data) => {
            return $data.text().split(': ')[1]
        }).should('be.at.least', 1)
    })

    it('render table header and table body', () => {
        cy.visit('/blocks')

        cy.renderTable()
    })

    it('render 6 items in table header', () => {
        cy.visit('/blocks')

        cy.renderHeaderItem(6)
    })

    it('render at least 1 row data in the table list', () => {
        cy.visit('/blocks')

        cy.renderData()
    })

    it('redirect to account detail page given click on harvester address', () => {
        cy.visit('/blocks')

        cy.get('tbody tr .harvester')
        .then($data => {
            return $data[0]
        }).click()

        cy.url().should('contain', '/account')
    })

    it('redirect to block detail page given click on block height', () => {
        cy.visit('/blocks')

        cy.get('tbody tr .height')
        .then($data => {
            return $data[0]
        }).click()

        cy.url().should('contain', '/block')
    })
  })