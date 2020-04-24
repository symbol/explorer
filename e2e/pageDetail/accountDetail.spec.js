describe('Symbol Explorer Account Detail page', () => {
    beforeEach(() => {
        cy.visit('/account/TDQJKG7OKAPVHZ3YMMTFUVVVDFNR4VTM6AXQG66X')
    })

    describe('Account Detail Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Account Detail"]').should('contain', 'Account Detail')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Account Detail")
        })

        it('render correct table fields.', () => {
            const items = ['Address', 'Address height', 'Public key', 'Importance', 'Type', 'Linked account key']
            cy.renderFieldInTable("Account Detail", items)
        })
    })

    describe('Multisig Cosignatories Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Multisig Cosignatories"]').should('contain', 'Multisig Cosignatories')
        })

        it('render table in card', ()=> {
            cy.renderTableInCard("Multisig Cosignatories")
        })

        it('render correct table fields.', () => {
            const items = ['Minimum Approval', 'Minimum Removal', 'Cosignatories']
            cy.renderFieldInTable("Multisig Cosignatories", items)
        })
    })

    describe('Owned Mosaics Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Owned Mosaics"]').should('contain', 'Owned Mosaics')
        })

        it('render table in card', () => {
            cy.renderTableInCard("Owned Mosaics")
        })

        it('render correct table header.', () => {
            const items = ['Mosaic ID', 'Amount', 'Alias Namespace']
            cy.renderHeaderInTable("Owned Mosaics", items)
        })
    })

    describe('Owned Namespaces Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Owned Namespaces"]').should('contain', 'Owned Namespaces')
        })

        it('render table in card', () => {
            cy.renderTableInCard("Owned Namespaces")
        })

        it('render correct table header.', () => {
            const items = ['Name', 'Status', 'Duration', 'Registration Type']
            cy.renderHeaderInTable("Owned Namespaces", items)
        })
    })

    describe('Importance History Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Importance History"]').should('contain', 'Importance History')
        })

        it('render table in card', () => {
            cy.renderTableInCard("Importance History")
        })

        it('render correct table header.', () => {
            const items = ['Recalculation Block #', 'Total Fees Paid', 'Beneficiary Count', 'Importance Score']
            cy.renderHeaderInTable("Importance History", items)
        })
    })

    describe('Transactions Card should', () => {
        it('load title', () => {
            cy.get('[data-cy="Transactions"]').should('contain', 'Transactions')
        })

        it('render table in card', () => {
            cy.renderTableInCard("Transactions")
        })

        it('render correct table header.', () => {
            const items = ['Deadline', 'Transaction Hash', 'Transaction Type']
            cy.renderHeaderInTable("Transactions", items)
        })
    })






    // Todo: Metadata Entries
    // Todo: Account Restriction

  })