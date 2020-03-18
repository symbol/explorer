describe('NEM 2 Explorer Blocks list page should', () => {
    beforeEach(() => {
      cy.visit('/blocks')
    })

    it('load pages titles', () => {
        cy.get('.ex-card-header')
        .should('be.visible')
        .should('not.empty')
        .should('contain','Blocks')
    })

    it('load chain height and block height is more than 0', () => {
        cy.get('.ex-infotext')
        .should('be.visible')
        .should('not.empty')

        cy.server({ force404: true })
        cy.route('GET', '/blocks/from/latest/limit/**').as('getLatestBlock')

        cy.visit('/blocks')
        cy.wait('@getLatestBlock')

        cy.get('.ex-infotext')
        .then(($data) => {
            return $data.text().split(': ')[1]
        }).should('be.at.least', 1)
    })

    it('render table header and table body', () => {
        cy.get('table')
        .should('be.visible')

        cy.get('thead')
        .should('be.visible')

        cy.get('tbody')
        .should('be.visible')
    })

    it('render 6 items in table header', () => {
        cy.get('thead > tr > th')
        .should('have.length', 6)
    })

    it('render at least 1 row data in the table list', () => {
        cy.get('tbody > tr')
        .then($data => {
            return $data.length
        }).should('be.at.least',1)
    })
  })