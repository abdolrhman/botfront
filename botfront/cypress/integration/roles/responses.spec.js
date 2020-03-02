/* global cy */

const responses = [{
    key: 'utter_go_go',
    values: [{ sequence: [{ content: 'text: GO GO GO' }], lang: 'en' }],
}];

describe('responses:r restricted permissions', () => {
    before(() => {
        cy.createProject('bf', 'My Project', 'en');
        cy.addResponses('bf', responses);
        cy.createDummyRoleAndUser({ permission: ['responses:r'] });
    });

    beforeEach(() => cy.login({ admin: false }));

    after(() => {
        cy.deleteProject('bf');
        cy.removeDummyRoleAndUser();
    });

    it('should not show edit features in responses', () => {
        cy.visit('/project/bf/dialogue/templates');
        cy.dataCy('response-text').should('contain', 'GO GO GO');
        cy.dataCy('remove-response-0').should('not.exist');
        cy.dataCy('create-response').should('not.exist');
        cy.dataCy('edit-response-0').click();
        cy.dataCy('response-name-input').parent().should('have.class', 'read-only');
        cy.dataCy('variation-container').should('have.class', 'read-only');
        cy.dataCy('icon-trash').should('not.exist');
        cy.dataCy('metadata-tab').click();
        cy.get('.required.field').should('have.class', 'disabled');
    });
});
