import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';
import { ICommandPalette } from '@jupyterlab/apputils';
//import { ServerConnection } from '@jupyterlab/services';
//import { URLExt } from '@jupyterlab/coreutils';

import { IEditorServices } from '@jupyterlab/codeeditor';

import { inputDialog } from './CodeSnippetForm';
// import { CodeSnippetWrapper } from './CodeSnippetWrapper';
import { CodeSnippetWidget } from './CodeSnippetWidget';
// import { CodeSnippetWrapper } from './CodeSnippetWrapper';

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
  requires: [ICommandPalette, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer,
    editorServices: IEditorServices
  ) => {
    console.log('JupyterLab extension code-snippets is activated!');
    const url = 'elyra/metadata/code-snippets';

    const getCurrentWidget = (): Widget => {
      return app.shell.currentWidget;
    };

    const codeSnippetWidget = new CodeSnippetWidget(
      getCurrentWidget,
      app,
      editorServices
    );
    codeSnippetWidget.id = CODE_SNIPPET_EXTENSION_ID;
    codeSnippetWidget.title.icon = codeSnippetIcon;
    codeSnippetWidget.title.caption = 'Jupyter Code Snippet';

    console.log('creating snippets folder!');
    const service = CodeSnippetContentsService.getInstance();
    service.save('snippets', { type: 'directory' });

    restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);

    // Rank has been chosen somewhat arbitrarily to give priority to the running
    // sessions widget in the sidebar.
    app.shell.add(codeSnippetWidget, 'left', { rank: 900 });

    app.commands.addCommand('elyra-metadata-editor:open', {
      label: 'Code Snippet Editor',
      isEnabled: () => true,
      isVisible: () => true,
      execute: (args: any) => {
        const codeSnippetEditor = new CodeSnippetEditor(editorServices, args);
        codeSnippetEditor.id = 'jp-codeSnippet-editor';
        app.shell.add(codeSnippetEditor, 'main');
        restorer.add(codeSnippetEditor, 'jp-codeSnippet-editor');
      }
    });

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
        const highlightedCode = getSelectedText();
        console.log(highlightedCode);
        // const layout = codeSnippetWidget.layout as PanelLayout;

        inputDialog(codeSnippetWidget, url, highlightedCode.split('\n'), -1);
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

        const frontEndSnippets = codeSnippetWidget.codeSnippetWidgetModel.snippets.slice();
        frontEndSnippets.splice(_id, 1);
        codeSnippetWidget.codeSnippets = frontEndSnippets;
        codeSnippetWidget.renderCodeSnippetsSignal.emit(frontEndSnippets);
        showUndoMessage({
          body: /*"Undo delete"*/ new MessageHandler(codeSnippetWidget, _id)
        });
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
    console.log(selectedText.toString);
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
