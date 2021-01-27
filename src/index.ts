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
  ILayoutRestorer
} from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { IEditorServices } from '@jupyterlab/codeeditor';
import { LabIcon } from '@jupyterlab/ui-components';

import { Widget } from '@lumino/widgets';
import { find } from '@lumino/algorithm';

import editorIconSVGstr from '../style/icon/jupyter_snippeteditoricon.svg';
import codeSnippetIconSVGstr from '../style/icon/jupyter_snippeticon.svg';

import { CodeSnippetInputDialog } from './CodeSnippetInputDialog';
import { CodeSnippetWidget } from './CodeSnippetWidget';
import { CodeSnippetContentsService } from './CodeSnippetContentsService';
import {
  CodeSnippetEditor,
  ICodeSnippetEditorMetadata
} from './CodeSnippetEditor';

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';

const CODE_SNIPPET_SETTING_ID = 'jupyterlab-code-snippets:settings';
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

  const contentsService = CodeSnippetContentsService.getInstance();
  contentsService.save('snippets', { type: 'directory' });

  restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);

  // Rank has been chosen somewhat arbitrarily to give priority to the running
  // sessions widget in the sidebar.
  app.shell.add(codeSnippetWidget, 'left', { rank: 900 });

  // open code Snippet Editor
  const openCodeSnippetEditor = (args: ICodeSnippetEditorMetadata): void => {
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
  const saveCommand = 'codeSnippet:save-as-snippet';
  const toggled = false;
  app.commands.addCommand(saveCommand, {
    label: 'Save As Code Snippet',
    isEnabled: () => true,
    isVisible: () => true,
    isToggled: () => toggled,
    iconClass: 'some-css-icon-class',
    execute: () => {
      const highlightedCode = getSelectedText();
      if (highlightedCode === '') {
        //if user just right-clicks cell(s) to save
        const curr = document.getElementsByClassName('jp-Cell jp-mod-selected');
        const resultArray = [];
        // changed i = 1 to i = 0.
        for (let i = 0; i < curr.length; i++) {
          //loop through each cell
          const text = curr[i] as HTMLElement;
          const textContent = text.innerText;
          const arrayInput = textContent.split('\n');
          const indexedInput = arrayInput.slice(1);
          for (let i = 0; i < indexedInput.length; i++) {
            // looping through each line in cell
            if (indexedInput[i].charCodeAt(0) === 8203) {
              //check if first char in line is invalid
              indexedInput[i] = ''; //replace invalid line with empty string
            }
            resultArray.push(indexedInput[i]); //push cell code lines into result
          }
        }
        CodeSnippetInputDialog(codeSnippetWidget, resultArray, -1);
      } else {
        CodeSnippetInputDialog(
          codeSnippetWidget,
          highlightedCode.split('\n'),
          -1
        );
      }
      // if highlightedCode is empty, check the code of the entire cell.
    }
  });

  // Put the saveCommand above in context menu
  app.contextMenu.addItem({
    command: saveCommand,
    selector: '.jp-Cell'
  });

  // Put the saveCommand in non-notebook file context menu
  app.contextMenu.addItem({
    command: saveCommand,
    selector: '.jp-FileEditor'
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
      const editorMetadata = widget.codeSnippetEditorMetadata;
      return {
        name: editorMetadata.name,
        description: editorMetadata.description,
        language: editorMetadata.language,
        code: editorMetadata.code,
        id: editorMetadata.id,
        selectedTags: editorMetadata.selectedTags,
        allTags: editorMetadata.allTags
      };
    },
    name: widget => {
      return widget.id;
    }
  });
}

const codeSnippetExtensionSetting: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_SETTING_ID,
  autoStart: true,
  requires: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry) => {
    void settingRegistry
      .load(CODE_SNIPPET_SETTING_ID)
      .then(_ => console.log('settingRegistry successfully loaded!'))
      .catch(e => console.log(e));
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

export default [code_snippet_extension, codeSnippetExtensionSetting];
