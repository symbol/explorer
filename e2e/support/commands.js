Cypress.Commands.add("renderTable", () => {
    cy.get('table')
    .should('be.visible')

    cy.get('thead')
    .should('be.visible')

    cy.get('tbody')
    .should('be.visible')
 })

Cypress.Commands.add("renderHeaderItem", (length) => {
    cy.get('thead > tr > th')
    .should('have.length', length)
 })

 Cypress.Commands.add("renderData", () => {
    cy.get('tbody > tr')
    .then($data => {
        return $data.length
    }).should('be.at.least',1)
 })

