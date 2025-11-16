import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'projects/my-app/cypress/support/e2e.ts',
    specPattern: 'projects/my-app/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}'
  }
})