/**
 * CodeSnippetDisplay props.
 */

import { ReactWidget } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

import React from 'react';

import { CodeSnippetService } from './CodeSnippetService';

// interface ICodeSnippetDisplayProps {
//     codeSnippets: ICodeSnippet[];
//     getCurrentWidget: () => Widget;
//   }

/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_CLASS = 'elyra-CodeSnippets';
const CODE_SNIPPETS_HEADER_CLASS = 'elyra-codeSnippetsHeader';
// const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';

export class CodeSnippetWidget extends ReactWidget {
    codeSnippetManager: CodeSnippetService;
    getCurrentWidget: () => Widget;

    constructor(getCurrentWidget: () => Widget) {
        super();
        this.getCurrentWidget = getCurrentWidget;
        this.codeSnippetManager = new CodeSnippetService();
    }

    render(): React.ReactElement {
        return (
          <div className={CODE_SNIPPETS_CLASS}>
            <header className={CODE_SNIPPETS_HEADER_CLASS}>{'</> Code Snippets'}</header>  
          </div>  
        );
    }
}

// export class CodeSnippetWidget;