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

import { ReactWidget, UseSignal } from '@jupyterlab/apputils';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';
import { IDragEvent } from '@lumino/dragdrop';
import { MimeData, ReadonlyPartialJSONObject } from '@lumino/coreutils';

import { CodeSnippetService, ICodeSnippet } from './CodeSnippetService';
import { CodeSnippetDisplay } from './CodeSnippetDisplay';
import { CodeSnippetInputDialog } from './CodeSnippetInputDialog';

import React from 'react';
import { Notebook } from '@jupyterlab/notebook';

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'jp-codeSnippet-item';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * A class used to indicate a drop target.
 */
const DROP_TARGET_CLASS = 'jp-codeSnippet-dropTarget';
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_DRAG_HOVER = 'jp-codeSnippet-drag-hover';

const commands = {
  OPEN_CODE_SNIPPET_EDITOR: `${CODE_SNIPPET_EDITOR}:open`,
};

/**
 * A widget for Code Snippets.
 */
export class CodeSnippetWidget extends ReactWidget {
  getCurrentWidget: () => Widget;
  // private _codeSnippetWidgetModel: CodeSnippetWidgetModel;
  renderCodeSnippetsSignal: Signal<this, ICodeSnippet[]>;
  app: JupyterFrontEnd;
  codeSnippetManager: CodeSnippetService;
  private editorServices: IEditorServices;

  constructor(
    getCurrentWidget: () => Widget,
    app: JupyterFrontEnd,
    editorServices: IEditorServices
  ) {
    super();
    this.app = app;
    this.editorServices = editorServices;
    this.getCurrentWidget = getCurrentWidget;
    this.renderCodeSnippetsSignal = new Signal<this, ICodeSnippet[]>(this);
    this.codeSnippetManager = CodeSnippetService.getCodeSnippetService();

    this.moveCodeSnippet = this.moveCodeSnippet.bind(this);
    this.openCodeSnippetEditor = this.openCodeSnippetEditor.bind(this);
    this.updateCodeSnippetWidget = this.updateCodeSnippetWidget.bind(this);

    this.node.setAttribute('data-lm-dragscroll', 'true');
  }

  updateCodeSnippetWidget(): void {
    if (this.codeSnippetManager) {
      const newSnippets = this.codeSnippetManager.snippets;
      newSnippets && this.renderCodeSnippetsSignal.emit(newSnippets);
    }
  }

  onAfterShow(msg: Message): void {
    this.updateCodeSnippetWidget();
  }

  openCodeSnippetEditor(args: ReadonlyPartialJSONObject): void {
    this.app.commands.execute(commands.OPEN_CODE_SNIPPET_EDITOR, args);
  }

  /**
   * Handle the DOM events for the widget.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the notebook panel's node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
      case 'lm-dragenter':
        this._evtDragEnter(event as IDragEvent);
        break;
      case 'lm-dragleave':
        this._evtDragLeave(event as IDragEvent);
        break;
      case 'lm-dragover':
        this._evtDragOver(event as IDragEvent);
        break;
      case 'lm-drop':
        this._evtDrop(event as IDragEvent);
        break;
      default:
        break;
    }
  }

  /**
   * A message handler invoked on an `'after-attach'` message.
   * @param msg
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);

    const node = this.node;
    node.addEventListener('lm-dragenter', this);
    node.addEventListener('lm-dragleave', this);
    node.addEventListener('lm-dragover', this);
    node.addEventListener('lm-drop', this);
  }

  /**
   * Handle `before-detach` messages for the widget.
   * @param msg
   */
  protected onBeforeDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('lm-dragenter', this);
    node.removeEventListener('lm-dragleave', this);
    node.removeEventListener('lm-dragover', this);
    node.removeEventListener('lm-drop', this);
  }

  /**
   * Find the snippet containing the target html element.
   *
   * #### Notes
   * Returns undefined if the cell is not found.
   */
  private _findSnippet(node: HTMLElement): HTMLElement {
    // Trace up the DOM hierarchy to find the root cell node.
    // Then find the corresponding child and select it.
    let n: HTMLElement | null = node;

    while (n && n !== this.node) {
      if (n.classList.contains(CODE_SNIPPET_ITEM)) {
        return n;
      }
      n = n.parentElement;
    }
    return undefined;
  }

  /**
   * Handle the `'lm-dragenter'` event for the widget.
   */
  private _evtDragEnter(event: IDragEvent): void {
    if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;

    if (!event.mimeData.hasData('snippet/id')) {
      const snippetId = target.id.slice(CODE_SNIPPET_DRAG_HOVER.length);
      event.mimeData.setData('snippet/id', parseInt(snippetId));
    }

    const snippet = this._findSnippet(target);
    if (snippet === undefined) {
      return;
    }
    const snippetNode = snippet as HTMLElement;

    snippetNode.classList.add(DROP_TARGET_CLASS);
  }

  /**
   * Handle the `'lm-dragleave'` event for the widget.
   */
  private _evtDragLeave(event: IDragEvent): void {
    if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);

    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
  }

  /**
   * Handle the `'lm-dragover'` event for the widget.
   */
  private _evtDragOver(event: IDragEvent): void {
    const data = this.findCellData(event.mimeData);
    if (data === undefined) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dropAction = event.proposedAction;
    const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
    const target = event.target as HTMLElement;
    const snippet = this._findSnippet(target);
    if (snippet === undefined) {
      return;
    }
    const snippetNode = snippet as HTMLElement;

    snippetNode.classList.add(DROP_TARGET_CLASS);
  }

  private findCellData(mime: MimeData): string {
    const code = mime.getData('text/plain');

    return code;
  }
  /**
   * Handle the `'lm-drop'` event for the widget.
   */
  private async _evtDrop(event: IDragEvent): Promise<void> {
    const data = this.findCellData(event.mimeData);
    if (data === undefined) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (event.proposedAction === 'none') {
      event.dropAction = 'none';
      return;
    }

    let target = event.target as HTMLElement;

    while (target && target.parentElement) {
      if (target.classList.contains(DROP_TARGET_CLASS)) {
        target.classList.remove(DROP_TARGET_CLASS);
        break;
      }
      target = target.parentElement;
    }

    const snippet = this._findSnippet(target);

    // if target is CodeSnippetWidget, then snippet is undefined
    let idx;
    if (snippet !== undefined) {
      idx = parseInt(snippet.id.slice(CODE_SNIPPET_ITEM.length));
    } else {
      idx = this.codeSnippetManager.snippets.length;
    }

    /**
     * moving snippets inside the snippet panel
     */
    const source = event.source;
    if (source instanceof CodeSnippetDisplay) {
      event.dropAction = 'move';
      if (event.mimeData.hasData('snippet/id')) {
        const srcIdx = event.mimeData.getData('snippet/id') as number;
        this.moveCodeSnippet(srcIdx, idx);
      }
    } else {
      const notebook: Notebook =
        event.mimeData.getData('internal:cells')[0].parent;

      const language = notebook.model.defaultKernelLanguage;
      // Handle the case where we are copying cells
      event.dropAction = 'copy';

      CodeSnippetInputDialog(this, data, language, idx);
    }

    // Reorder snippet just to make sure id's are in order.
    this.codeSnippetManager.orderSnippets().then((res: boolean) => {
      if (!res) {
        console.log('Error in ordering snippets');
        return;
      }
    });
  }

  // move code snippet within code snippet explorer
  private moveCodeSnippet(srcIdx: number, targetIdx: number): void {
    this.codeSnippetManager
      .moveSnippet(srcIdx, targetIdx)
      .then((res: boolean) => {
        if (!res) {
          console.log('Error in moving snippet');
          return;
        }
      });
    const newSnippets = this.codeSnippetManager.snippets;
    this.renderCodeSnippetsSignal.emit(newSnippets);
  }

  render(): React.ReactElement {
    return (
      <UseSignal signal={this.renderCodeSnippetsSignal} initialArgs={[]}>
        {(_, codeSnippets): React.ReactElement => (
          <div>
            <CodeSnippetDisplay
              codeSnippets={codeSnippets}
              codeSnippetManager={this.codeSnippetManager}
              app={this.app}
              getCurrentWidget={this.getCurrentWidget}
              openCodeSnippetEditor={this.openCodeSnippetEditor}
              editorServices={this.editorServices}
              updateCodeSnippetWidget={this.updateCodeSnippetWidget}
            />
          </div>
        )}
      </UseSignal>
    );
  }
}
