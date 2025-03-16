import 'cypress-file-upload';

describe('Happy Path', () => {
  it('completes and submits the registration form', () => {
    cy.visit('http://localhost:3000/register');
    cy.get('#outlined-email').type('user@example.com');
    cy.get('#outlined-password').type('password123');
    cy.get('#outlined-confirm-password').type('password123');
    cy.get('#outlined-name').type('New User');
    cy.get('#register-button').click();
    
    cy.contains('button', 'Hosted Listing').click(); 
    cy.contains('button', 'create a new listing').click();

    cy.get('#outlined-basic-title').type('Beautiful Beach House');
    cy.get('#outlined-basic-address').type('123 Ocean Drive');
    cy.get('#outlined-basic-price').type('250');


    cy.fixture('Orca.png', 'base64').then(fileContent => {
      cy.get('#outlined-basic-thumbnail').attachFile({
        fileContent: fileContent,
        fileName: 'testImage.png',
        mimeType: 'image/png',
        encoding: 'base64'
      });
    });


    cy.get('#outlined-basic-propertyType').type('House');

    cy.get('#outlined-basic-amenities').type('Wifi, Pool, Parking');

    cy.get('#outlined-basic-submit').click();

    // cy.get('#publish-button').click();

    // cy.get('div').eq(0).find('#start-date input').clear().type('2023-01-01');
    // cy.get('div').eq(0).find('#end-date input').clear().type('2023-01-10');
    // cy.get('#publish-submit').click();

    cy.contains('Logout').click();

    cy.contains('Login').click();

    cy.get('#outlined-basic-email').type('user@example.com');

    cy.get('#outlined-basic-password').type('password123');

    cy.get('#login-button').click();

  });
});


