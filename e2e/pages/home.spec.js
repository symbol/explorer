// cypress/integration/spec.js
describe('NEM 2 Explorer Home Page should', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('load XEM Price graph', () => {

    cy.contains('XEM Price')

    // view all statistic button is clickable
    // cy.contains('View all statistics').click()
    // cy.url().should('contain', '/statistics')

    // xem price chart is visible
    cy.get('#SvgjsSvg1001').should('be.visible')

  })

  it('load Base Info', () => {
    cy.contains('Base Info')

    // Must have 4 block infomation in Base Info
    cy.get('.ex-item-title')
    .should('be.visible')

    cy.get('.ex-item-title')
    .should('have.length', 4)

    cy.get('.ex-item-value')
    .should('be.visible')

    cy.get('.ex-item-value')
    .should('have.length', 4)
  })

  it('load Recent Transactions', () => {
    cy.contains('Recent Transactions')

    cy.contains('View all transactions')
    .click()

    cy.url()
    .should('contain', '/transactions')

  })

  it('load Recent Blocks', () => {
    cy.contains('Recent Blocks')

    cy.contains('View all blocks')
    .click()

    cy.url()
    .should('contain', '/blocks')

  })
})