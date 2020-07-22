import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { Widget, PanelLayout } from '@lumino/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';

// import { CodeSnippetWrapper } from './CodeSnippetWrapper';
// import { CodeSnippetWidget } from './CodeSnippetWidget';

import { inputDialog } from './CodeSnippetForm';
import { INotebookTracker } from '@jupyterlab/notebook';
import { CodeSnippetWrapper } from './CodeSnippetWrapper';
import { CodeSnippetWidget } from './CodeSnippetWidget';
// import { CodeSnippetWidget } from './CodeSnippetWidget';
// import { CodeSnippetWrapper } from './CodeSnippetWrapper';

export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  code: string[];
}

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';

/**
 * Initialization data for the code_snippets extension.
 */
const code_snippet_extension: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, INotebookTracker],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer
  ) => {
    console.log('JupyterLab extension code-snippets is activated!');
    const url = 'elyra/metadata/code-snippets';

    const getCurrentWidget = (): Widget => {
      return app.shell.currentWidget;
    };

    const codeSnippetWrapper = new CodeSnippetWrapper(
      getCurrentWidget
    ) as Widget;
    codeSnippetWrapper.id = CODE_SNIPPET_EXTENSION_ID;
    codeSnippetWrapper.title.icon = codeSnippetIcon;
    codeSnippetWrapper.title.caption = 'Jupyter Code Snippet';

    restorer.add(codeSnippetWrapper, CODE_SNIPPET_EXTENSION_ID);

    // Rank has been chosen somewhat arbitrarily to give priority to the running
    // sessions widget in the sidebar.
    app.shell.add(codeSnippetWrapper, 'left', { rank: 900 });

    //Add an application command
    const commandID = 'save as code snippet';
    const toggled = false;
    app.commands.addCommand(commandID, {
      label: 'Save As Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: () => {
        console.log(`Executed ${commandID}`);
        const highlightedCode = getSelectedText();
        // RequestHandler.makePostRequest(
        //   url,
        //   JSON.stringify({
        //     display_name: "highlighted3",
        //     metadata: {
        //         code: [
        //             temp
        //         ],
        //         description: "Print highlighted code 3",
        //         language: "python",
        //     },
        //     name: "highlighted3",
        //     schema_name: "code-snippet",
        //   }),
        //   false
        // );
        const layout = codeSnippetWrapper.layout as PanelLayout;

        inputDialog(
          (layout.widgets[0] as unknown) as CodeSnippetWidget,
          url,
          [highlightedCode],
          -1
        );
        console.log(`Highlight trial: ${highlightedCode}`);
      }
    });

    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    });

    // Example Get Request
    // RequestHandler.makeGetRequest(
    //  URLExt.join(url, '/example2'),
    //   false);
  }
};

function getSelectedText(): string {
  let selectedText;

  // window.getSelection
  if (window.getSelection) {
    selectedText = window.getSelection();
  }
  // document.getSelection
  else if (document.getSelection) {
    selectedText = document.getSelection();
  }
  return selectedText.toString();
}

export default code_snippet_extension;
