import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { Widget } from '@lumino/widgets';
import { find } from '@lumino/algorithm';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';

import { IEditorServices } from '@jupyterlab/codeeditor';
import { LabIcon } from '@jupyterlab/ui-components';
import editorIconSVGstr from '../style/icon/jupyter_snippeteditoricon.svg';

import { inputDialog } from './CodeSnippetForm';
import { CodeSnippetWidget } from './CodeSnippetWidget';

import {
  CodeSnippetContentsService,
  ICodeSnippet
} from './CodeSnippetContentsService';
import { CodeSnippetEditor } from './CodeSnippetEditor';

import undoDeleteSVG from '../style/icon/undoDelete.svg';
import { showUndoMessage } from './UndoDelete';

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';

/**
 * List of languages supported by JupyterLab
 */
export const SUPPORTED_LANGUAGES = [
  'Python',
  'Java',
  'R',
  'Julia',
  'Matlab',
  'Octave',
  'Scheme',
  'Processing',
  'Scala',
  'Groovy',
  'Agda',
  'Fortran',
  'Haskell',
  'Ruby',
  'TypeScript',
  'JavaScript',
  'CoffeeScript',
  'LiveScript',
  'C#',
  'F#',
  'Go',
  'Galileo',
  'Erlang',
  'PARI/GP',
  'Aldor',
  'OCaml',
  'Forth',
  'Perl',
  'PHP',
  'Scilab',
  'bash',
  'zsh',
  'Clojure',
  'Hy',
  'Lua',
  'PureScript',
  'Q',
  'Cryptol',
  'C++',
  'Xonsh',
  'Prolog',
  'Common Lisp',
  'Maxima',
  'C',
  'Kotlin',
  'Pike',
  'NodeJS',
  'Singular',
  'TaQL',
  'Coconut',
  'Babel',
  'Clojurescript',
  'sbt',
  'Guile',
  'Stata',
  'Racekt',
  'SQL',
  'HiveQL',
  'Rust',
  'Rascal',
  'Q#'
];

/**
 * Snippet Editor Icon
 */
const editorIcon = new LabIcon({
  name: 'custom-ui-compnents:codeSnippetEditorIcon',
  svgstr: editorIconSVGstr
});

let clicked: EventTarget;

/**
 * Initialization data for the code_snippets extension.
 */
const code_snippet_extension: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, IEditorServices],
  activate: activateCodeSnippet
};

function activateCodeSnippet(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  editorServices: IEditorServices
): void {
  console.log('JupyterLab extension code-snippets is activated!');

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
  codeSnippetWidget.title.caption = 'Code Snippet Explorer';

  console.log('creating snippets folder!');
  const contentsService = CodeSnippetContentsService.getInstance();
  contentsService.save('snippets', { type: 'directory' });

  restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);

  // Rank has been chosen somewhat arbitrarily to give priority to the running
  // sessions widget in the sidebar.
  app.shell.add(codeSnippetWidget, 'left', { rank: 900 });

  // open code Snippet Editor
  const openCodeSnippetEditor = (args: ICodeSnippet): void => {
    console.log(args);

    if (!args.name) {
      return;
    }
    // codeSnippetEditors are in the main area
    const widgetId = `jp-codeSnippet-editor-${args.id}`;

    const openEditor = find(
      app.shell.widgets('main'),
      (widget: Widget, _: number) => {
        return widget.id === widgetId;
      }
    );
    if (openEditor) {
      app.shell.activateById(widgetId);
      return;
    }

    const codeSnippetEditor = new CodeSnippetEditor(
      contentsService,
      editorServices,
      tracker,
      codeSnippetWidget,
      args
    );
    console.log('editor created!');
    codeSnippetEditor.id = widgetId;
    codeSnippetEditor.addClass(widgetId);
    codeSnippetEditor.title.label = '[' + args.language + '] ' + args.name;
    codeSnippetEditor.title.closable = true;
    codeSnippetEditor.title.icon = editorIcon;

    if (!tracker.has(codeSnippetEditor)) {
      tracker.add(codeSnippetEditor);
    }

    if (!codeSnippetEditor.isAttached) {
      app.shell.add(codeSnippetEditor, 'main', {
        mode: 'tab-after'
      });
    }

    // Activate the code Snippet Editor
    app.shell.activateById(codeSnippetEditor.id);
  };

  const editorSaveCommand = 'jp-codeSnippet-editor:save';
  app.commands.addCommand(editorSaveCommand, {
    execute: (args: any) => {
      const editor = tracker.currentWidget;
      editor.updateSnippet();
    }
  });

  // Add keybinding to save
  app.commands.addKeyBinding({
    command: editorSaveCommand,
    args: {},
    keys: ['Accel S'],
    selector: '.jp-codeSnippet-editor'
  });

  const editorCommand = 'jp-codeSnippet-editor:open';
  app.commands.addCommand(editorCommand, {
    execute: (args: any) => {
      openCodeSnippetEditor(args);
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
      const highlightedCode = getSelectedText();

      inputDialog(codeSnippetWidget, highlightedCode.split('\n'), -1);
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
      console.log(target.id);
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
    selector: '.codeSnippet-item'
  });

  // Track and restore the widget state
  const tracker = new WidgetTracker<CodeSnippetEditor>({
    namespace: 'codeSnippetEditor'
  });

  /**
   * Check the name and go to args. Why does it get restored twice ???
   */
  restorer.restore(tracker, {
    command: editorCommand,
    args: widget => {
      const codeSnippet = widget.codeSnippet;
      return {
        name: codeSnippet.name,
        description: codeSnippet.description,
        language: codeSnippet.language,
        code: codeSnippet.code,
        id: codeSnippet.id,
        tags: codeSnippet.tags
      };
    },
    name: widget => {
      return widget.id;
    }
  });
}

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

/**
 * Wouldn't it be better to factor this class out to different class with a better name?
 */
class MessageHandler extends Widget {
  constructor(codeSnippet: CodeSnippetWidget, id: number) {
    super({ node: createUndoDeleteNode(codeSnippet, id) });
  }
}

function onDelete(codeSnippet: CodeSnippetWidget, id: number): void {
  const temp: HTMLElement = document.getElementById('jp-undo-delete-id');
  temp.parentElement.parentElement.removeChild(temp.parentElement);
  console.log(temp);
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
