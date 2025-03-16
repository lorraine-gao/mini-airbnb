describe('Second Path', () => {
  it('view this page as a vistor', () => {
    cy.visit('http://localhost:3000');
    cy.contains('Search')

    cy.get('#bar-login-button').click();
    cy.get('#outlined-basic-email').type('ceshi');
    cy.get('#outlined-basic-password').type('11');
    cy.get('#login-button').click();

    cy.get(`[data-id="209321280"]`).click();
    cy.contains('BOOK NOW')

    cy.get('#outlined-multiline-static').type('this is a text review');

    cy.get('[data-testid=rating]').find('label').eq(4).click();

    cy.contains('Submit').click();

    cy.contains('Search') 
    cy.get('#bar-logout-button').click();
});

});
