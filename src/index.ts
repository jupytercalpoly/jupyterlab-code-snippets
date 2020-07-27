import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { Widget, PanelLayout } from '@lumino/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';

import { inputDialog } from './CodeSnippetForm';
import { INotebookTracker, NotebookTracker } from '@jupyterlab/notebook';
import { CodeSnippetWrapper } from './CodeSnippetWrapper';
import { CodeSnippetWidget } from './CodeSnippetWidget';

export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  code: string[];
}

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';
var clicked: EventTarget;

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
    restorer: ILayoutRestorer,
    tracker: NotebookTracker
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
    const delCommand = 'delete code snippet';
    const toggled = false;
    app.commands.addCommand(commandID, {
      label: 'Save As Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: () => {
        console.log(`Executed ${commandID}`);
        let highlightedCode = getSelectedText();
        const layout = codeSnippetWrapper.layout as PanelLayout;

        inputDialog(
          (layout.widgets[0] as unknown) as CodeSnippetWidget,
          url,
          [highlightedCode],
          -1
        );
      }
    });

    // function getCurrent(args: ReadonlyPartialJSONObject): NotebookPanel | null {
    //   const widget = tracker.currentWidget;
    //   const activate = args['activate'] !== false;

    //   if (activate && widget) {
    //     app.shell.activateById(widget.id);
    //   }

    //   return widget;
    // }

    // eventListener to get access to element that is right clicked.
    document.addEventListener(
      'contextmenu',
      function temp(event) {
        var clickedEl = event.target;
        clicked = clickedEl;
      },
      true
    );

    app.commands.addCommand(delCommand, {
      label: 'Delete Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: async () => {
        let target = clicked as HTMLElement;
        let _id = parseInt(target.id, 10);
        const layout = codeSnippetWrapper.layout as PanelLayout;
        let codeSnip = (layout.widgets[0] as unknown) as CodeSnippetWidget;
        let snippetToDeleteName =
          codeSnip.codeSnippetWidgetModel.snippets[_id].name;
        const url = 'elyra/metadata/code-snippets/' + snippetToDeleteName;

        const settings = ServerConnection.makeSettings();
        const requestUrl = URLExt.join(settings.baseUrl, url);

        await ServerConnection.makeRequest(
          requestUrl,
          { method: 'DELETE' },
          settings
        );
        codeSnip.codeSnippetWidgetModel.deleteSnippet(_id);
        let newSnippets = codeSnip.codeSnippetWidgetModel.snippets;
        codeSnip.codeSnippets = newSnippets;
        codeSnip.renderCodeSnippetsSignal.emit(newSnippets);
        console.log(codeSnip.codeSnippets);
        console.log(codeSnip.codeSnippetWidgetModel.snippets);
      }
    });

    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    });

    app.contextMenu.addItem({
      command: delCommand,
      selector: '.elyra-expandableContainer-title'
    });
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
