// cypress/integration/spec.js
describe('NEM 2 Explorer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads', () => {
    cy.contains('Nem blockchain explorer')
  })
})