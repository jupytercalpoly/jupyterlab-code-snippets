/*
 * Copyright 2018-2020 IBM Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import '../style/index.css';
import { CodeSnippetDisplay } from './CodeSnippetDisplay';
import { inputDialog } from './CodeSnippetForm';

import { ReactWidget, UseSignal, WidgetTracker } from '@jupyterlab/apputils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { Widget, PanelLayout } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';

import React from 'react';

import {
  CodeSnippetContentsService,
  ICodeSnippet
} from './CodeSnippetContentsService';
import { Contents } from '@jupyterlab/services';

import { IDragEvent } from '@lumino/dragdrop';

import { MimeData } from '@lumino/coreutils';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * A class used to indicate a drop target.
 */
const DROP_TARGET_CLASS = 'jp-snippet-dropTarget';

const METADATA_EDITOR_ID = 'elyra-metadata-editor';

const commands = {
  OPEN_METADATA_EDITOR: `${METADATA_EDITOR_ID}:open`
};

// const CODE_SNIPPET_NAMESPACE = 'code-snippets';
// const CODE_SNIPPET_SCHEMA = 'code-snippet';

/**
 * A widget for Code Snippets.
 */
export class CodeSnippetWidget extends ReactWidget {
  // state: ICodeSnippetWidgetState;
  getCurrentWidget: () => Widget;
  private _codeSnippetWidgetModel: CodeSnippetWidgetModel;
  _codeSnippets: ICodeSnippet[];
  renderCodeSnippetsSignal: Signal<this, ICodeSnippet[]>;
  app: JupyterFrontEnd;
  codeSnippetManager: CodeSnippetContentsService;
  // private editorServices: IEditorServices;

  constructor(
    // codeSnippets: ICodeSnippet[],
    getCurrentWidget: () => Widget,
    app: JupyterFrontEnd,
    editorServices: IEditorServices
  ) {
    super();
    this.app = app;
    // this.editorServices = editorServices;
    this.getCurrentWidget = getCurrentWidget;
    this._codeSnippetWidgetModel = new CodeSnippetWidgetModel([]);
    this._codeSnippets = this._codeSnippetWidgetModel.snippets;
    this.renderCodeSnippetsSignal = new Signal<this, ICodeSnippet[]>(this);
    this.moveCodeSnippet.bind(this);
    this.openCodeSnippetEditor.bind(this);
    this.updateCodeSnippets.bind(this);
    this.codeSnippetManager = CodeSnippetContentsService.getInstance();
    // CodeSnippetWidget.tracker.add(this);
  }

  // Request code snippets from server
  async fetchData(): Promise<ICodeSnippet[]> {
    const fileModels: Contents.IModel[] = [];
    const paths: string[] = [];

    // Clear the current snippets
    // this._codeSnippetWidgetModel.clearSnippets();

    // const data: ICodeSnippet[] = [];
    if (this._codeSnippetWidgetModel.snippets.length === 0) {
      await this.codeSnippetManager
        .getData('snippets', 'directory')
        .then(model => {
          fileModels.push(...model.content);
        });

      fileModels.forEach(fileModel => paths.push(fileModel.path));

      for (let i = 0; i < paths.length; i++) {
        await this.codeSnippetManager.getData(paths[i], 'file').then(model => {
          // data.push(JSON.parse(model.content));
          this._codeSnippetWidgetModel.addSnippet(JSON.parse(model.content), i);
        });
      }
    }
    // console.log(data);

    return this._codeSnippetWidgetModel.snippets;
  }

  updateCodeSnippets(): void {
    this.fetchData().then((codeSnippets: ICodeSnippet[]) => {
      this.renderCodeSnippetsSignal.emit(codeSnippets);
    });
  }

  onAfterShow(msg: Message): void {
    console.log('On after show!');
    this.updateCodeSnippets();
  }

  get codeSnippetWidgetModel(): CodeSnippetWidgetModel {
    return this._codeSnippetWidgetModel;
  }

  set codeSnippets(codeSnippets: ICodeSnippet[]) {
    this._codeSnippets = codeSnippets;
  }

  openCodeSnippetEditor(args: any): void {
    this.app.commands.execute(commands.OPEN_METADATA_EDITOR, args);
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
      case 'mousedown':
        this._evtMouseDown(event as IDragEvent);
        break;
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
    console.log('On after Attach');
    super.onAfterAttach(msg);
    // this.renderCodeSnippetsSignal.emit(this._codeSnippets);

    const node = this.node;
    node.addEventListener('lm-dragenter', this);
    node.addEventListener('lm-dragleave', this);
    node.addEventListener('lm-dragover', this);
    node.addEventListener('lm-drop', this);
    node.addEventListener('mousedown', this);
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
   * Find the snippet index containing the target html element.
   *
   * #### Notes
   * Returns -1 if the cell is not found.
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

  private _evtMouseDown(event: MouseEvent): void {
    //get rid of preview by clicking anything
    const target = event.target as HTMLElement;

    const preview = document.querySelector('.jp-preview');
    if (preview) {
      // if target is not the code snippet name area, then add inactive
      // if target area is the code snippet name area, previewSnippet widget will handle preview.
      if (
        !preview.classList.contains('inactive') &&
        !target.classList.contains('elyra-expandableContainer-name')
      ) {
        preview.classList.add('inactive');
        for (const elem of document.getElementsByClassName('drag-hover')) {
          if (elem.classList.contains('drag-hover-clicked')) {
            elem.classList.remove('drag-hover-clicked');
          }
        }
        for (const item of document.getElementsByClassName(
          'elyra-codeSnippet-item'
        )) {
          if (item.classList.contains('elyra-codeSnippet-item-clicked')) {
            item.classList.remove('elyra-codeSnippet-item-clicked');
          }
        }
      }
    }
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
      event.mimeData.setData('snippet/id', parseInt(target.id));
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
    const data = Private.findCellData(event.mimeData);
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

  /**
   * Hanlde the `'lm-drop'` event for the widget.
   */
  private async _evtDrop(event: IDragEvent): Promise<void> {
    const data = Private.findCellData(event.mimeData);
    console.log(event);
    // console.log(event.mimeData.getData('internal:cells'));
    console.log(data);
    if (data === undefined) {
      return;
    }

    const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    console.log(elements);

    event.preventDefault();
    event.stopPropagation();

    if (event.proposedAction === 'none') {
      event.dropAction = 'none';
      return;
    }

    let target = event.target as HTMLElement;
    console.log(target);

    while (target && target.parentElement) {
      if (target.classList.contains(DROP_TARGET_CLASS)) {
        target.classList.remove(DROP_TARGET_CLASS);
        break;
      }
      target = target.parentElement;
    }

    const snippet = this._findSnippet(target);

    // if target is CodeSnippetWidget, then snippet is undefined
    let idx = -1;
    if (snippet !== undefined) {
      idx = parseInt(snippet.id);
    }

    /**
     * moving snippets inside the snippet panel
     */
    const source = event.source;
    if (source instanceof CodeSnippetDisplay) {
      event.dropAction = 'move';
      if (event.mimeData.hasData('snippet/id')) {
        const srcIdx = event.mimeData.getData('snippet/id') as number;
        // console.log(srcIdx);
        // move snippet from src index to target index
        // this._codeSnippetWidgetModel.moveSnippet(srcIdx, idx);
        // this._codeSnippets = this._codeSnippetWidgetModel.snippets;
        // // const newSnippets = this._codeSnippets;
        // console.log(this._codeSnippets);
        // this.updateSnippet(this._codeSnippets);
        if (idx === -1) {
          idx = this._codeSnippets.length;
        }
        this.moveCodeSnippet(srcIdx, idx);
      }
    } else {
      // Handle the case where we are copying cells
      event.dropAction = 'copy';

      const url = 'elyra/metadata/code-snippets';

      inputDialog(this, url, data, idx);
    }
  }
  // deleteCodeSnippet(snippet: ICodeSnippet): void {
  //   const idx = this._codeSnippets.indexOf(snippet);
  //   this._codeSnippetWidgetModel.deleteSnippet(idx);
  //   this._codeSnippets = this._codeSnippetWidgetModel.snippets;
  //   this.renderCodeSnippetsSignal.emit(this._codeSnippets);
  // }

  moveCodeSnippet(srcIdx: number, targetIdx: number): void {
    this._codeSnippetWidgetModel.moveSnippet(srcIdx, targetIdx);
    const newSnippets = this._codeSnippetWidgetModel.snippets;
    this.renderCodeSnippetsSignal.emit(newSnippets);
  }

  render(): React.ReactElement {
    return (
      <UseSignal signal={this.renderCodeSnippetsSignal} initialArgs={[]}>
        {(_, codeSnippets): React.ReactElement => (
          <div>
            <CodeSnippetDisplay
              codeSnippets={codeSnippets}
              getCurrentWidget={this.getCurrentWidget}
              openCodeSnippetEditor={this.openCodeSnippetEditor.bind(this)}
            />
          </div>
        )}
      </UseSignal>
    );
  }
}

/**
 * A custom panel layout for the notebook.
 */
export class SnippetPanelLayout extends PanelLayout {
  /**
   * A message handler invoked on an `'update-request'` message.
   *
   * #### Notes
   * This is a reimplementation of the base class method,
   * and is a no-op.
   */
  protected onUpdateRequest(msg: Message): void {
    // This is a no-op.
  }
}

/**
 * A namespace for CodeSnippet statics.
 */
export namespace CodeSnippetWidget {
  /**
   * Interface describing table of contents widget options.
   */
  export interface IOptions {
    /**
     * Application document manager.
     */
    docmanager: IDocumentManager;

    /**
     * Application rendered MIME type.
     */
    rendermime: IRenderMimeRegistry;
  }

  /**
   * The dialog widget tracker.
   */
  export const tracker = new WidgetTracker<CodeSnippetWidget>({
    namespace: '@jupyterlab/code_snippet:CodeSnippetWidget'
  });
}

class Private {
  /**
   * Given a MimeData instance, extract the data, if any.
   */
  static findCellData(mime: MimeData): string[] {
    // const types = mime.types();
    // console.log(types);
    // application/vnd.jupyter.cells
    const code = mime.getData('text/plain');

    return code.split('\n');
  }
}
