// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

// Some lines of code are from Elyra Code Snippet.

/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer,
} from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { ISettingRegistry, Settings } from '@jupyterlab/settingregistry';

import { IEditorServices } from '@jupyterlab/codeeditor';
import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';
import { find } from '@lumino/algorithm';

import editorIconSVGstr from '../style/icon/jupyter_snippeteditoricon.svg';
import codeSnippetIconSVGstr from '../style/icon/jupyter_snippeticon.svg';

import { CodeSnippetInputDialog } from './CodeSnippetInputDialog';
import { CodeSnippetWidget } from './CodeSnippetWidget';
import {
  CodeSnippetEditor,
  ICodeSnippetEditorMetadata,
} from './CodeSnippetEditor';
import { CodeSnippetService } from './CodeSnippetService';
import { NotebookPanel } from '@jupyterlab/notebook';
import { DocumentWidget } from '@jupyterlab/docregistry';

// Code Snippet Constants
const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';

const CODE_SNIPPET_SETTING_ID = 'jupyterlab-code-snippets:snippets';

/**
 * Snippet Editor Icon
 */
const editorIcon = new LabIcon({
  name: 'custom-ui-components:codeSnippetEditorIcon',
  svgstr: editorIconSVGstr,
});

/**
 * Snippet Icon
 */
const codeSnippetIcon = new LabIcon({
  name: 'custom-ui-components:codeSnippetIcon',
  svgstr: codeSnippetIconSVGstr,
});

/**
 * Initialization data for the code_snippets extension.
 */
const code_snippet_extension: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, IEditorServices],
  activate: activateCodeSnippet,
};

function activateCodeSnippet(
  app: JupyterFrontEnd,
  palette: ICommandPalette,
  restorer: ILayoutRestorer,
  editorServices: IEditorServices
): void {
  console.log('JupyterLab extension jupyterlab-code-snippets is activated!');

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

  restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);

  // Rank has been chosen somewhat arbitrarily to give priority to the running
  // sessions widget in the sidebar.
  app.shell.add(codeSnippetWidget, 'left', { rank: 900 });

  // open code Snippet Editor
  const openCodeSnippetEditor = (args: ICodeSnippetEditorMetadata): void => {
    // codeSnippetEditors are in the main area
    const widgetId = `jp-codeSnippet-editor-${args.id}`;

    // when the editor is already open
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
      editorServices,
      tracker,
      codeSnippetWidget,
      args
    );

    codeSnippetEditor.id = widgetId;
    codeSnippetEditor.addClass(widgetId);
    codeSnippetEditor.title.label =
      args.name === ''
        ? 'New Code Snippet'
        : '[' + args.language + '] ' + args.name;
    codeSnippetEditor.title.closable = true;
    codeSnippetEditor.title.icon = editorIcon;

    if (!tracker.has(codeSnippetEditor)) {
      tracker.add(codeSnippetEditor);
    }

    if (!codeSnippetEditor.isAttached) {
      app.shell.add(codeSnippetEditor, 'main', {
        mode: 'tab-after',
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
    },
  });

  // Add keybinding to save
  app.commands.addKeyBinding({
    command: editorSaveCommand,
    args: {},
    keys: ['Accel S'],
    selector: '.jp-codeSnippet-editor',
  });

  const editorCommand = 'jp-codeSnippet-editor:open';
  app.commands.addCommand(editorCommand, {
    execute: (args: any) => {
      openCodeSnippetEditor(args);
    },
  });

  // Add an application command
  const saveCommand = 'codeSnippet:save-as-snippet';
  const toggled = false;
  app.commands.addCommand(saveCommand, {
    label: 'Save As Code Snippet',
    isEnabled: () => true,
    isVisible: () => true,
    isToggled: () => toggled,
    iconClass: 'some-css-icon-class',
    execute: () => {
      let language = '';
      // get the language of document or notebook
      if (app.shell.currentWidget instanceof NotebookPanel) {
        language = (app.shell.currentWidget as NotebookPanel).sessionContext
          .kernelPreference.language;
      } else if (app.shell.currentWidget instanceof DocumentWidget) {
        language = (app.shell.currentWidget as DocumentWidget).context.model
          .defaultKernelLanguage;
      }

      const highlightedCode = getSelectedText();
      if (highlightedCode === '') {
        //if user just right-clicks cell(s) to save
        const curr = document.getElementsByClassName('jp-Cell jp-mod-selected');

        let code = '';
        // changed i = 1 to i = 0.
        for (let i = 0; i < curr.length; i++) {
          //loop through each cell
          const text = curr[i] as HTMLElement;
          const cellInputWrappers = text.getElementsByClassName(
            'jp-Cell-inputWrapper'
          );

          for (const cellInputWrapper of cellInputWrappers) {
            const codeLines =
              cellInputWrapper.querySelectorAll('.CodeMirror-line');
            for (const codeLine of codeLines) {
              let codeLineText = codeLine.textContent;
              if (codeLineText.charCodeAt(0) === 8203) {
                //check if first char in line is invalid
                codeLineText = ''; //replace invalid line with empty string
              }
              code += codeLineText + '\n';
            }
          }
        }
        CodeSnippetInputDialog(
          codeSnippetWidget,
          code,
          language,
          codeSnippetWidget.codeSnippetManager.snippets.length
        );
      } else {
        CodeSnippetInputDialog(
          codeSnippetWidget,
          highlightedCode,
          language,
          codeSnippetWidget.codeSnippetManager.snippets.length
        );
      }
    },
  });

  // Put the saveCommand above in context menu
  app.contextMenu.addItem({
    type: 'separator',
    selector: '.jp-Notebook',
    rank: 13,
  });

  app.contextMenu.addItem({
    command: saveCommand,
    selector: '.jp-Notebook',
    rank: 14,
  });

  app.contextMenu.addItem({
    type: 'separator',
    selector: '.jp-Notebook',
    rank: 15,
  });

  // Put the saveCommand in non-notebook file context menu
  app.contextMenu.addItem({
    type: 'separator',
    selector: '.jp-FileEditor',
    rank: 7,
  });

  app.contextMenu.addItem({
    command: saveCommand,
    selector: '.jp-FileEditor',
    rank: 8,
  });

  app.contextMenu.addItem({
    type: 'separator',
    selector: '.jp-FileEditor',
    rank: 9,
  });

  // Track and restore the widget state
  const tracker = new WidgetTracker<CodeSnippetEditor>({
    namespace: 'codeSnippetEditor',
  });

  restorer.restore(tracker, {
    command: editorCommand,
    args: (widget) => {
      const editorMetadata = widget.codeSnippetEditorMetadata;
      return {
        name: editorMetadata.name,
        description: editorMetadata.description,
        language: editorMetadata.language,
        code: editorMetadata.code,
        id: editorMetadata.id,
        tags: editorMetadata.tags,
        allSnippetTags: editorMetadata.allSnippetTags,
        allLangTags: editorMetadata.allLangTags,
        fromScratch: editorMetadata.fromScratch,
      };
    },
    name: (widget) => {
      return widget.id;
    },
  });
}

const codeSnippetExtensionSetting: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_SETTING_ID,
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry) => {
    void settingRegistry
      .load(CODE_SNIPPET_SETTING_ID)
      .then((settings) => {
        CodeSnippetService.init(settings as Settings, app);
        console.log(
          'JupyterLab extension jupyterlab-code-snippets setting is activated!'
        );
      })
      .catch((e) => console.log(e));
  },
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

export default [code_snippet_extension, codeSnippetExtensionSetting];
