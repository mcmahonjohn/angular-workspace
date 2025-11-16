describe('Angular App E2E Tests', () => {
  it('should display the welcome message', () => {
    cy.visit('/')
    cy.contains('Hello, my-app')
    cy.contains('Congratulations! Your app is running. 🎉')
  })

  it('should display the Angular logo', () => {
    cy.visit('/')
    cy.get('svg.angular-logo').should('be.visible')
  })

  it('should have navigation links', () => {
    cy.visit('/')
    cy.contains('Explore the Docs').should('be.visible')
    cy.contains('Learn with Tutorials').should('be.visible')
    cy.contains('CLI Docs').should('be.visible')
  })
})
