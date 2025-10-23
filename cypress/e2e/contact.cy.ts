const fillContactForm = () => {
  cy.get('[data-cy="contact-input-name"]').type('John Doe');
  cy.get('[data-cy="contact-input-email"]').type('john@example.com');
  cy.get('[data-cy="contact-input-subject"]').type('Project inquiry');
  cy.get('[data-cy="contact-input-message"]').type(
    'I would love to discuss a new Angular project.',
  );
};

describe('Contact form', () => {
  beforeEach(() => {
    cy.visit('/contact', {
      onBeforeLoad: (win) => {
        win.localStorage.setItem('portfolio-language', 'en');
        win.localStorage.setItem('portfolio-theme', 'light');
      },
    });
  });

  it('submits successfully when the email client is available', () => {
    cy.window().then((win) => {
      cy.stub(win.location, 'assign').as('locationAssign');
    });

    fillContactForm();

    cy.get('[data-cy="contact-submit"]').click();

    cy.get('@locationAssign').should('have.been.calledOnce');
    cy.get('[data-cy="contact-status-success"]').should('be.visible');
    cy.get('[data-cy="contact-input-name"]').should('have.value', '');
    cy.get('[data-cy="contact-input-email"]').should('have.value', '');
    cy.get('[data-cy="contact-input-subject"]').should('have.value', '');
    cy.get('[data-cy="contact-input-message"]').should('have.value', '');
  });

  it('displays an error message when the email client cannot be opened', () => {
    cy.window().then((win) => {
      cy.stub(win.location, 'assign')
        .callsFake(() => {
          throw new Error('MAILTO_UNAVAILABLE');
        })
        .as('locationAssign');
    });

    fillContactForm();

    cy.get('[data-cy="contact-submit"]').click();

    cy.get('@locationAssign').should('have.been.calledOnce');
    cy.get('[data-cy="contact-status-error"]').should('be.visible');
  });
});
