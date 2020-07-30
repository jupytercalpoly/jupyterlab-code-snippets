import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { Widget, PanelLayout } from '@lumino/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';
<<<<<<< HEAD
//import { ServerConnection } from '@jupyterlab/services';
//import { URLExt } from '@jupyterlab/coreutils';
=======
import { ServerConnection } from '@jupyterlab/services';
import { URLExt } from '@jupyterlab/coreutils';
import { IEditorServices } from '@jupyterlab/codeeditor';
>>>>>>> Create a new tab for code snippet editor

import { inputDialog } from './CodeSnippetForm';
import { INotebookTracker } from '@jupyterlab/notebook';
import { CodeSnippetWrapper } from './CodeSnippetWrapper';
import { CodeSnippetWidget } from './CodeSnippetWidget';
import { CodeSnippetContentsService } from './CodeSnippetContentsService';
import { CodeSnippetEditor } from './CodeSnippetEditor';

// import { CodeSnippetWidget } from './CodeSnippetWidget';
// import { CodeSnippetWrapper } from './CodeSnippetWrapper';

import undoDeleteSVG from '../style/icon/undoDelete.svg';
//import undoDeleteCloseIcon from '../style/icon/close_jupyter.svg';
import { showUndoMessage } from './UndoDelete';

export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  code: string[];
}

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';
let clicked: EventTarget;

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
<<<<<<< HEAD
    restorer: ILayoutRestorer
=======
    restorer: ILayoutRestorer,
    tracker: NotebookTracker,
    editorServices: IEditorServices
>>>>>>> Create a new tab for code snippet editor
  ) => {
    console.log('JupyterLab extension code-snippets is activated!');
    const url = 'elyra/metadata/code-snippets';

    const getCurrentWidget = (): Widget => {
      return app.shell.currentWidget;
    };

    const codeSnippetWrapper = new CodeSnippetWrapper(
      getCurrentWidget,
      app,
      editorServices
    ) as Widget;
    codeSnippetWrapper.id = CODE_SNIPPET_EXTENSION_ID;
    codeSnippetWrapper.title.icon = codeSnippetIcon;
    codeSnippetWrapper.title.caption = 'Jupyter Code Snippet';

    const service = CodeSnippetContentsService.getInstance();
    service.save('snippets', { type: 'directory' });

    restorer.add(codeSnippetWrapper, CODE_SNIPPET_EXTENSION_ID);

    // Rank has been chosen somewhat arbitrarily to give priority to the running
    // sessions widget in the sidebar.
    app.shell.add(codeSnippetWrapper, 'left', { rank: 900 });

<<<<<<< HEAD
    //Application command to save snippet
=======
    app.commands.addCommand('elyra-metadata-editor:open', {
      label: 'Code Snippet Editor',
      isEnabled: () => true,
      isVisible: () => true,
      execute: () => {
        const codeSnippetEditor = new CodeSnippetEditor();
        app.shell.add(codeSnippetEditor, 'main');
      }
    });

    //Add an application command
>>>>>>> Create a new tab for code snippet editor
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
        const highlightedCode = getSelectedText();
        const layout = codeSnippetWrapper.layout as PanelLayout;

        inputDialog(
          (layout.widgets[0] as unknown) as CodeSnippetWidget,
          url,
          highlightedCode.split('\n'),
          -1
        );
      }
    });

    // eventListener to get access to element that is right clicked.
    document.addEventListener(
      'contextmenu',
      event => {
        const clickedEl = event.target;
        clicked = clickedEl;
      },
      true
    );

    //Application command to delete code snippet
    app.commands.addCommand(delCommand, {
      label: 'Delete Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: async () => {
        const target = clicked as HTMLElement;
        const _id = parseInt(target.id, 10);
        const layout = codeSnippetWrapper.layout as PanelLayout;
        const codeSnip = (layout.widgets[0] as unknown) as CodeSnippetWidget;
<<<<<<< HEAD
        const frontEndSnippets = codeSnip.codeSnippetWidgetModel.snippets;
        frontEndSnippets.splice(_id, 1);
        codeSnip.codeSnippets = frontEndSnippets;
        codeSnip.renderCodeSnippetsSignal.emit(frontEndSnippets);
        showUndoMessage({
          body: /*"Undo delete"*/ new MessageHandler(codeSnip, _id)
        });
=======
        const snippetToDeleteName =
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
        const newSnippets = codeSnip.codeSnippetWidgetModel.snippets;
        codeSnip.codeSnippets = newSnippets;
        codeSnip.renderCodeSnippetsSignal.emit(newSnippets);
        console.log(codeSnip.codeSnippets);
        console.log(codeSnip.codeSnippetWidgetModel.snippets);
>>>>>>> Create a new tab for code snippet editor
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

class MessageHandler extends Widget {
  constructor(codeSnippet: CodeSnippetWidget, id: number) {
    super({ node: createUndoDeleteNode(codeSnippet, id) });
  }
}

function onDelete(codeSnippet: CodeSnippetWidget, id: number): void {
  const temp: HTMLElement = document.getElementById('jp-undo-delete-id');
  temp.parentElement.parentElement.removeChild(temp.parentElement);
  const snippetToDeleteName =
    codeSnippet.codeSnippetWidgetModel.snippets[id].name;
  CodeSnippetContentsService.getInstance().delete(
    'snippets/' + snippetToDeleteName + '.json'
  );
  codeSnippet.codeSnippetWidgetModel.deleteSnippet(id);
  const savedSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
  codeSnippet.codeSnippets = savedSnippets;
  codeSnippet.renderCodeSnippetsSignal.emit(savedSnippets);
}

function onUndo(codeSnippet: CodeSnippetWidget): void {
  codeSnippet.codeSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
  codeSnippet.renderCodeSnippetsSignal.emit(
    codeSnippet.codeSnippetWidgetModel.snippets
  );
  const temp: HTMLElement = document.getElementById('jp-undo-delete-id');
  temp.parentElement.parentElement.removeChild(temp.parentElement);
}

function createUndoDeleteNode(
  codeSnippet: CodeSnippetWidget,
  snippetID: number
): HTMLElement {
  const body = document.createElement('div');
  body.innerHTML = undoDeleteSVG;
  body.id = 'jp-undo-delete-id';

  const messageContainer = document.createElement('div');
  messageContainer.className = 'jp-confirm-text';
  const message = document.createElement('text');
  message.textContent = 'Click to ';
  const undo = document.createElement('span');
  undo.textContent = 'undo';
  undo.className = 'jp-click-undo';
  undo.onclick = function(): void {
    onUndo(codeSnippet);
  };
  const messageEnd = document.createElement('text');
  messageEnd.textContent = ' delete';
  messageContainer.appendChild(message);
  messageContainer.appendChild(undo);
  messageContainer.appendChild(messageEnd);
  body.append(messageContainer);

  const deleteMessage = document.createElement('div');
  deleteMessage.className = 'jp-undo-delete-close';
  deleteMessage.onclick = function(): void {
    onDelete(codeSnippet, snippetID);
  };
  body.append(deleteMessage);
  return body;
}

export default code_snippet_extension;
