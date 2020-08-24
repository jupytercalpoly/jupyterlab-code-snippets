import '../style/index.css';

import codeSnippetIconSVGstr from '../style/icon/jupyter_snippeticon.svg';

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

import { CodeSnippetInputDialog } from './CodeSnippetInputDialog';
import { CodeSnippetWidget } from './CodeSnippetWidget';

import { CodeSnippetContentsService } from './CodeSnippetContentsService';
import {
  CodeSnippetEditor,
  ICodeSnippetEditorMetadata
} from './CodeSnippetEditor';

// import undoDeleteSVG from '../style/icon/undoDelete.svg';
// import { showUndoMessage } from './UndoDelete';

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

/**
 * Snippet Icon
 */
const codeSnippetIcon = new LabIcon({
  name: 'custom-ui-compnents:codeSnippetIcon',
  svgstr: codeSnippetIconSVGstr
});

// get item that is right clicked (what opens the context menu)
//let clicked: EventTarget;

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
  const openCodeSnippetEditor = (args: ICodeSnippetEditorMetadata): void => {
    console.log(args);

    // if (!args.name) {
    //   return;
    // }
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

    if (!args.fromScratch && !tracker.has(codeSnippetEditor)) {
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
    execute: () => {
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
  const saveCommand = 'save as code snippet';
  // const delCommand = 'delete code snippet';
  const toggled = false;
  app.commands.addCommand(saveCommand, {
    label: 'Save As Code Snippet',
    isEnabled: () => true,
    isVisible: () => true,
    isToggled: () => toggled,
    iconClass: 'some-css-icon-class',
    execute: () => {
      const highlightedCode = getSelectedText();

      CodeSnippetInputDialog(
        codeSnippetWidget,
        highlightedCode.split('\n'),
        -1
      );
    }
  });

  // eventListener to get access to element that is right clicked.
  // document.addEventListener(
  //   'contextmenu',
  //   event => {
  //     const clickedEl = event.target;
  //     clicked = clickedEl;
  //   },
  //   true
  // );

  //Application command to delete code snippet
  // app.commands.addCommand(delCommand, {
  //   label: 'Delete Code Snippet',
  //   isEnabled: () => true,
  //   isVisible: () => true,
  //   isToggled: () => toggled,
  //   iconClass: 'some-css-icon-class',
  //   execute: async () => {
  //     const target = clicked as HTMLElement;
  //     const _id = parseInt(target.id, 10);
  //     console.log(target.id);
  //     const frontEndSnippets = codeSnippetWidget.codeSnippetWidgetModel.snippets.slice();
  //     frontEndSnippets.splice(_id, 1);
  //     codeSnippetWidget.codeSnippets = frontEndSnippets;
  //     codeSnippetWidget.renderCodeSnippetsSignal.emit(frontEndSnippets);
  //     showUndoMessage({
  //       body: /*"Undo delete"*/ new MessageHandler(codeSnippetWidget, _id)
  //     });
  //   }
  // });

  //Put the command above in context menu
  app.contextMenu.addItem({
    command: saveCommand,
    selector: '.jp-CodeCell'
  });

  // Add keybinding to save
  app.commands.addKeyBinding({
    command: saveCommand,
    args: {},
    keys: ['Shift S'],
    selector: '.jp-CodeCell'
  });

  // //Put the command above in context menu
  // app.contextMenu.addItem({
  //   command: commandID,
  //   selector: '.jp-InputArea-editor'
  // });

  // app.contextMenu.addItem({
  //   command: delCommand,
  //   selector: '.codeSnippet-item'
  // });

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
      const editorMetadata = widget.codeSnippetEditorMetadata;
      return {
        name: editorMetadata.name,
        description: editorMetadata.description,
        language: editorMetadata.language,
        code: editorMetadata.code,
        id: editorMetadata.id,
        selectedTags: editorMetadata.selectedTags,
        allTags: editorMetadata.allTags,
        fromScratch: editorMetadata.fromScratch
      };
    },
    name: widget => {
      return widget.id;
    }
  });
}

function getSelectedText(): string {
  let selectedText;
  console.log('This is the code: ', selectedText);
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

export default code_snippet_extension;
