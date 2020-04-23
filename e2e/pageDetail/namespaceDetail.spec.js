describe('Symbol Explorer Namespace detail page', () => {
    beforeEach(() => {
        cy.visit('/namespace/symbol.xym')
    })

    describe('Namespace Detail Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Namespace Detail"]').should('contain', 'Namespace Detail')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Namespace Detail")
        })

        it('render correct table fields.', () => {
            const items = ['Owner Address', 'Name', 'Namespace ID', 'Registration Type', 'Status', 'Alias Type', 'Alias', 'Registered at Height', 'Expired In Block', 'End at Height']
            cy.renderFieldInTable("Namespace Detail", items)
        })
    })

    describe('Namespace Level Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Namespace Level"]')
            .should('contain', 'Namespace Level')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Namespace Level")
        })

        it('render correct table header.', () => {
            const items = ['Name', 'Namespace ID', 'Parent ID']
            cy.renderHeaderInTable("Namespace Level", items)
        })
    })

    // Todo: Metadata Entries
  })