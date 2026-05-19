describe('Cloud Resume — Mahlatse Madiseng', () => {

  beforeEach(() => {
    cy.visit('/');
  });

  // ─── Section rendering ───────────────────────────────────────────────────

  describe('Home section', () => {
    it('renders the hero heading with correct name', () => {
      cy.get('h1').should('contain.text', 'Mahlatse');
    });

    it('renders the subtitle tagline', () => {
      cy.get('h1').next('p')
        .should('contain.text', 'Angular Engineer');
    });

    it('renders the Get to know me button', () => {
      cy.contains('Get to know me').should('be.visible');
    });

    it('renders the Download Resume button', () => {
      cy.contains('Download Resume').should('be.visible');
    });
  });

  describe('About section', () => {
    it('is present in the DOM', () => {
      cy.get('#about').should('exist');
    });

    it('renders the About Me heading', () => {
      cy.get('#about').contains('About Me').should('be.visible');
    });

    it('renders the profile summary text', () => {
      cy.get('#about p')
        .should('contain.text', 'Frontend-focused Software Engineer');
    });

    it('renders the profile image', () => {
      cy.get('#about img')
        .should('be.visible')
        .and('have.attr', 'src')
        .and('include', 'profile-pic');
    });
  });

  describe('Resume section', () => {
    it('is present in the DOM', () => {
      cy.get('#resume').should('exist');
    });

    it('renders the Education heading', () => {
      cy.get('#resume').contains('Education').should('exist');
    });

    it('renders the Work Experience heading', () => {
      cy.get('#resume').contains('Work Experience').should('exist');
    });

    it('renders at least one job entry', () => {
      cy.get('#resume').contains('Verisec').should('exist');
    });

    it('renders skill badges', () => {
      cy.get('#resume span')
        .filter(':contains("Angular")')
        .should('have.length.at.least', 1);
    });
  });

  // ─── Visitor counter ─────────────────────────────────────────────────────

  describe('Visitor counter', () => {
    it('renders the Live Views label', () => {
      cy.contains('Live Views').should('be.visible');
    });

    it('displays a number after the API responds', () => {
      // Wait up to 8s for the counter to resolve from "..." to a real number
      cy.contains('Live Views')
        .parent()
        .find('span.font-mono')
        .should(($el) => {
          const text = $el.text().trim();
          expect(text).to.match(/^[\d,]+$/);
        });
    });

    it('renders the Powered by Azure Serverless label', () => {
      cy.contains('Powered by Azure Serverless').should('be.visible');
    });
  });

  // ─── CV download ─────────────────────────────────────────────────────────

  describe('CV download', () => {
    it('has a Download Resume link pointing to the CV pdf', () => {
      cy.contains('Download Resume')
        .should('have.attr', 'href')
        .and('include', 'CV.pdf');
    });

    it('has the download attribute set', () => {
      cy.contains('Download Resume')
        .should('have.attr', 'download');
    });
  });

  // ─── Navigation ──────────────────────────────────────────────────────────

  describe('Navigation', () => {
    it('renders all three nav links', () => {
      cy.get('nav').within(() => {
        cy.contains('Home').should('be.visible');
        cy.contains('About').should('be.visible');
        cy.contains('Resume').should('be.visible');
      });
    });

    it('nav is fixed to the top of the page', () => {
      cy.get('header').should('have.css', 'position', 'fixed');
    });
  });

});