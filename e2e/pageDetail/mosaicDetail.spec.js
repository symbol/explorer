describe('Symbol Explorer Mosaic Detail page', () => {
    beforeEach(() => {
        cy.visit('/mosaic/747B276C30626442')
    })

    describe('Mosaic Detail Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Mosaic Detail"]').should('contain', 'Mosaic Detail')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Mosaic Detail")
        })

        it('render correct table fields.', () => {
            const items = ['Alias Namespace', 'Divisibility', 'Address', 'Supply', 'Relative Amount', 'Revision', 'Registered at Height', 'Duration', 'Supply Mutable', 'Transferable', 'Restrictable']
            cy.renderFieldInTable("Mosaic Detail", items)
        })
    })

    // Todo: Metadata Entries
    // Todo: Mosaic Restriction
    // Todo: Mosaic Restriction List
  })