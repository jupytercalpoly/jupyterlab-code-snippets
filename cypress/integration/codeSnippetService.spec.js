describe('Test Code Snippet Extension on load', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8888/lab')
    })

    // it('Create code snippet settings on load', () => {
    //     cy.get('.jp-PluginList > ul > li').eq(1).should('have.attr', 'data-id', 'jupyterlab-code-snippets:snippets')
    // })

    it('Create default snippets in the beginning', () => {
        cy.get('.jp-codeSnippetsContainer').find('.jp-codeSnippet-item').should('have.length', 3)
    })
})

describe('Test Code Snippet Manipulation', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8888/lab')
    })

    it('Create a new code snippet', () => {
        // adding a snippet
        cy.get('.jp-Notebook').rightclick()
            .get('.lm-Menu-itemLabel').eq(13).click()
            .wait(500)
            .get('.jp-codeSnippet-dialog-input').eq(0).click().type("test").should('have.value', 'test')
            .wait(500)
            .get('.jp-codeSnippet-dialog-input').eq(1).click().type("testing with cypress").should('have.value', 'testing with cypress')
            .wait(500)
            .get('.jp-codeSnippet-dialog-input').eq(2).click().type("Python").should('have.value', 'Python')
            .get('.jp-mod-accept').click();

        cy.get('.lm-Widget').eq(0).click({force: true});

        // checking the snippet
        cy.get('.jp-codeSnippetsContainer').find('.jp-codeSnippet-item').should('have.length', 4);
    })

    it('Delete a new code snippet', () => {
        // delete snippet
        cy.get('.jp-codeSnippet-item #0 > .jp-codeSnippetsContainer-button').click()
            .get('.jp-codeSnippet-more-options-delete').click()
            .get('.jp-mod-accept').click()

        // checking the snippet
        cy.get('.jp-codeSnippetsContainer').find('.jp-codeSnippet-item').should('have.length', 3);
    })
    
    it('Renaming a snippet', () => {
        cy.wait(500)
        // rename snippet
        cy.get('.jp-codeSnippet-item #0 > .jp-codeSnippetsContainer-name > span').eq(1).dblclick()
            .get('#jp-codeSnippet-rename').type('new_test')

        cy.wait(500)
        // rename with duplicate name
        cy.get('.jp-codeSnippet-item #1 > .jp-codeSnippetsContainer-name > span').eq(1).dblclick()
        .get('#jp-codeSnippet-rename').type('new_test')
        .get('.lm-StackedPanel').eq(0).click({force:true})
        .get('.jp-mod-accept').click()

    })

    it('Create a new code snippet from scratch', () => {
        cy.get('.jp-createSnippetBtn').click().get('.jp-codeSnippet-editor-name').type('create_test').should('have.value', 'create_test')
            .get('.jp-codeSnippet-editor-description').type('testing').should('have.value', 'testing')
            .get('.saveBtn').click()
    })

    it.only('Edit a snippet', () => {
        cy.get('.jp-codeSnippet-item #0 > .jp-codeSnippetsContainer-button').click()
            .get('.jp-codeSnippet-more-options-edit').click()
            .wait(500)
            .get('.jp-codeSnippet-editor-name').clear().type('test_editing').should('have.value', 'test_editing')
            .wait(500)
            .get('.jp-codeSnippet-editor-name').clear().type('test_editing').should('have.value', 'test_editing')
            .get('.saveBtn').click()

        cy.get('.jp-codeSnippet-item #0 > .jp-codeSnippetsContainer-name > span').eq(1).contains('test_editing')
    })
    // it.only('moving a snippet', () => {
    //     cy.visit('http://localhost:8888/lab')

    //     cy.wait(500)
    //     cy.get('.jp-codeSnippet-drag-hover').eq(0)
    //         .dragTo(':nth-child(3) > .jp-codeSnippet-metadata')
    //         .get('.jp-codeSnippet-item #1 > .jp-codeSnippetsContainer-name > span').eq(1).contains('test')
    // })
})