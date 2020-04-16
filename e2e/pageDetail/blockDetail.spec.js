describe('Symbol Explorer Blocks detail page', () => {
    beforeEach(() => {
        cy.visit('/block/1')
    })

    describe('Block Detail Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Block Detail"]').should('contain', 'Block Detail')
        })

        it('render block pagination button', () => {
            cy.get('[data-cy="Block Detail"] [type="Pagination"]').should('have.length', 1)
            cy.get('[data-cy="Block Detail"] [nextpageaction="block/nextBlock"]').should('have.length', 1)
            cy.get('[data-cy="Block Detail"] [previouspageaction="block/previousBlock"]').should('have.length', 1)
        })

        it('render data info in table', ()=> {
            cy.get('[data-cy="Block Detail"] table')
            .should('be.visible')

            cy.get('[data-cy="Block Detail"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })

        it('render block detail info dataset', ()=> {
            cy.get('[data-cy="Block Detail"] .table-titles').should('have.length', 8)
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Height')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Date')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Total Fee')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Difficulty')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Fee Multiplier')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Transactions')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Harvester')
            cy.get('[data-cy="Block Detail"] .table-titles').should('contain', 'Block Hash')
        })
    })

    describe('Block Transactions Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Block Transactions"]')
            .should('contain', 'Block Transactions')
        })

        it('render data list in table', () => {
            cy.get('[data-cy="Block Transactions"] table')
            .should('be.visible')

            cy.get('[data-cy="Block Transactions"] thead > tr > th')
            .should('have.length', 4)

            cy.get('[data-cy="Block Transactions"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })

    })

    describe('Balance Change Receipt Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Balance Change Receipt"]').should('contain', 'Balance Change Receipt')
        })

        it('render data list in table', () => {
            cy.get('[data-cy="Balance Change Receipt"] table')
            .should('be.visible')

            cy.get('[data-cy="Balance Change Receipt"] thead > tr > th')
            .should('have.length', 6)

            cy.get('[data-cy="Balance Change Receipt"] tbody > tr')
            .then($data => {
                return $data.length
            }).should('be.at.least',1)
        })
    })
  })