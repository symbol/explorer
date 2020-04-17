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

        it('render table in card', ()=> {
            cy.renderTableInCard("Block Detail")
        })

        it('render correct table fields.', () => {
            const items = ['Height', 'Date', 'Total Fee', 'Difficulty', 'Fee Multiplier', 'Transactions', 'Harvester', 'Block Hash']
            cy.renderFieldInTable("Block Detail", items)
        })
    })

    describe('Block Transactions Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Block Transactions"]')
            .should('contain', 'Block Transactions')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Block Transactions")
        })

        it('render correct table header.', () => {
            const items = ['Deadline', 'Transaction ID', 'Transaction Hash', 'Type']
            cy.renderHeaderInTable("Block Transactions", items)
        })
    })

    describe('Balance Change Receipt Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Balance Change Receipt"]').should('contain', 'Balance Change Receipt')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Balance Change Receipt")
        })

        it('render correct table header.', () => {
            const items = ['Version', 'Type', 'Size', 'Address', 'Mosaic ID', 'Amount']
            cy.renderHeaderInTable("Balance Change Receipt", items)
        })
    })
    // Todo: Test the rest of Reicept
})