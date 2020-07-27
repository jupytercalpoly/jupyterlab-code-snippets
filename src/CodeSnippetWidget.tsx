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
// import { Cell } from '@jupyterlab/cells';

import React from 'react';

import { ICodeSnippet } from './CodeSnippetService';

import { IDragEvent } from '@lumino/dragdrop';

// import { inputDialog } from './CodeSnippetForm';

// import { Cell } from '@jupyterlab/cells';

import { MimeData } from '@lumino/coreutils';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';

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

/**
 * A widget for Code Snippets.
 */
export class CodeSnippetWidget extends ReactWidget {
  // state: ICodeSnippetWidgetState;
  getCurrentWidget: () => Widget;
  private _codeSnippets: ICodeSnippet[];
  private _codeSnippetWidgetModel: CodeSnippetWidgetModel;
  renderCodeSnippetsSignal: Signal<this, ICodeSnippet[]>;
  private static instance: CodeSnippetWidget;

  private constructor(
    codeSnippets: ICodeSnippet[],
    getCurrentWidget: () => Widget
  ) {
    super();
    this.getCurrentWidget = getCurrentWidget;
    this._codeSnippetWidgetModel = new CodeSnippetWidgetModel(codeSnippets, {});
    console.log(this);
    console.log(this._codeSnippetWidgetModel);
    this._codeSnippets = this._codeSnippetWidgetModel.snippets;
    this.renderCodeSnippetsSignal = new Signal<this, ICodeSnippet[]>(this);
    CodeSnippetWidget.tracker.add(this);
  }

  static getInstance(
    codeSnippets: ICodeSnippet[],
    getCurrentWidget: () => Widget
  ): CodeSnippetWidget {
    if (!CodeSnippetWidget.instance) {
      CodeSnippetWidget.instance = new CodeSnippetWidget(
        codeSnippets,
        getCurrentWidget
      );
    }
    return CodeSnippetWidget.instance;
  }

  get codeSnippetWidgetModel(): CodeSnippetWidgetModel {
    return this._codeSnippetWidgetModel;
  }

  set codeSnippets(codeSnippets: ICodeSnippet[]) {
    this._codeSnippets = codeSnippets;
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
        this._evtMouseDown(event as MouseEvent);
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
    super.onAfterAttach(msg);
    this.renderCodeSnippetsSignal.emit(this._codeSnippets);

    const node = this.node;
    console.log(node);
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
  private _findSnippet(node: HTMLElement): (HTMLElement | number)[] {
    // Trace up the DOM hierarchy to find the root cell node.
    // Then find the corresponding child and select it.
    let n: HTMLElement | null = node;

    while (n && n !== this.node) {
      if (n.classList.contains(CODE_SNIPPET_ITEM)) {
        const i = n.id;
        return [n, parseInt(i)];
      }
      n = n.parentElement;
    }
    return undefined;
  }

  private _evtMouseDown(event: MouseEvent): void {
    //get rid of preview by clicking anything
    const target = event.target as HTMLElement;
    console.log(target);

    const preview = document.querySelector('.jp-preview');
    if (preview) {
      console.log('here');
      // if target is not the code snippet name area, then add inactive
      // if target area is the code snippet name area, previewSnippet widget will handle preview.
      if (
        !preview.classList.contains('inactive') &&
        !target.classList.contains('elyra-expandableContainer-name')
      ) {
        preview.classList.add('inactive');
        for (let elem of document.getElementsByClassName('drag-hover')) {
          if (elem.classList.contains('drag-hover-clicked')) {
            elem.classList.remove('drag-hover-clicked');
          }
        }
        for (let item of document.getElementsByClassName(
          'elyra-codeSnippet-item'
        )) {
          if (item.classList.contains('elyra-codeSnippet-item-clicked')) {
            item.classList.remove('elyra-codeSnippet-item-clicked');
          }
        }
      }
    }
    // If target is on the widget, do not display preview
    // if (target.classList.contains('elyra-CodeSnippets')) {

    // }

    console.log(event.clientX);
    console.log(event.clientY);
  }

  /**
   * Handle the `'lm-dragenter'` event for the widget.
   */
  private _evtDragEnter(event: IDragEvent): void {
    console.log(event.mimeData.getData(JUPYTER_CELL_MIME));
    if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    console.log(target);
    const snippet = this._findSnippet(target);
    if (snippet === undefined) {
      return;
    }
    const snippetNode = snippet[0] as HTMLElement;
    console.log(snippetNode);

    snippetNode.classList.add(DROP_TARGET_CLASS);
    console.log('adding class');
    console.log(snippetNode);
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
    console.log('left');
    console.log(elements);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
    console.log(elements);
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
    const snippetNode = snippet[0] as HTMLElement;

    snippetNode.classList.add(DROP_TARGET_CLASS);
    console.log('adding class drag over');
    console.log(snippetNode);
  }

  /**
   * Hanlde the `'lm-drop'` event for the widget.
   */
  private _evtDrop(event: IDragEvent): Promise<void> {
    const data = Private.findCellData(event.mimeData);
    if (data === undefined) {
      return;
    }

    console.log(data);

    // const cell_mime = event.mimeData.getData(JUPYTER_CELL_MIME);
    // // const cells = event.mimeData.getData('internal:cells');

    // console.log(cell_mime);

    // console.log(cells);

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
    let idx = -1;
    if (snippet !== undefined) {
      idx = this._findSnippet(target)[1] as number;
    }

    // get the index of the target
    console.log(this.node);
    console.log('target');
    console.log(target);

    // const cell_mime = event.mimeData.getData(JUPYTER_CELL_MIME);

    /**
     * Dragged and dropped cells onto the snippet panel
     */
    // const cells: Cell[] = event.mimeData.getData('internal:cells');
    // const cellList: string[] = [];
    // const data = cells.forEach(cell => cellList.push(cell.node.innerHTML));
    // console.log(cellList.join(''));
    // console.log(data);

    // // console.log(cell_mime);
    // console.log(cells);

    // path to the list of snippets from the current widget
    // const path = this.node.childNodes[0].childNodes[1].childNodes[0].childNodes[1].childNodes[0].childNodes;
    // const index = Array.prototype.indexOf.call(path, target);

    // const newSnippet: ICodeSnippet = {
    //   "name": "test40",
    //   "displayName": "test3",
    //   "description": "testing",
    //   "language": "python",
    //   "code": [data]
    // }

    console.log(idx);
    // this.update({ codeSnippets: this.codeSnippets });
    // this.setState({ codeSnippets: this.codeSnippets });
    //   console.log(this._model.snippets);
    // add it to the original snippet
    //   this._model.snippets = this._model.snippets.then((snippets) => snippets.splice(index, 0, newSnippet));

    //   const source = event;
    //   console.log(source);
    // console.log(event.mimeData.types());

    //     const cells: Cell[] = event.mimeData.getData('internal:cells');
    //     const layout = this.layout as PanelLayout;
    //     console.log("layout");
    //     console.log(layout);
    //     layout.insertWidget(0, cells[0]);
    //     console.log(cells[0]);
    //     console.log(cells[0].parent);

    //     const element = cells[0].node.outerHTML;

    //   //   console.log(cells[0].node.outerHTML);

    //     let domparser = new DOMParser();
    //     let doc = domparser.parseFromString(element, 'text/html');

    //     // change the cell prompt
    //     console.log(doc.getElementsByClassName('jp-InputArea-prompt'));
    //     doc.getElementsByClassName('jp-InputArea-prompt')[0].innerHTML = "[]:";

    //     // remove output area
    //     let outputArea = doc.getElementsByClassName('jp-Cell-outputWrapper')[0];
    //     outputArea.parentNode.removeChild(outputArea);
    //     snippetNode.insertAdjacentHTML('afterend', doc.documentElement.innerHTML);

    /**
     * TODO: WE CAN ADD FUNCTIONALITY TO DRAG AND DROP WITHIN THE SNIPPET PANEL
     * dropAction = 'move';
     */

    // Handle the case where we are copying cells
    event.dropAction = 'copy';

    /**
     * Use this for testing
     */
    // const newSnippet: ICodeSnippet = {
    //   name: 'testingCodeCell',
    //   displayName: 'testingCodeCell',
    //   description: 'testingCodeCell',
    //   language: 'Python',
    //   code: data
    // };

    // this.codeSnippetWidgetModel.addSnippet(
    //   { codeSnippet: newSnippet, id: idx },
    //   idx
    // );

    // const newSnippets = this.codeSnippetWidgetModel.snippets;
    // this._codeSnippets = newSnippets;
    // console.log(this._codeSnippets);
    // this.renderCodeSnippetsSignal.emit(this._codeSnippets);

    const url = 'elyra/metadata/code-snippets';

    inputDialog(this, url, data, idx);
    // console.log(data.split('\n'));
  }

  deleteCodeSnippet(snippet: ICodeSnippet): void {
    const idx = this._codeSnippets.indexOf(snippet);
    this._codeSnippetWidgetModel.deleteSnippet(idx);
    this._codeSnippets = this._codeSnippetWidgetModel.snippets;
    this.renderCodeSnippetsSignal.emit(this._codeSnippets);
  }

  render(): React.ReactElement {
    return (
      <div>
        <UseSignal signal={this.renderCodeSnippetsSignal} initialArgs={[]}>
          {(_, codeSnippets): React.ReactElement => (
            <div>
              <CodeSnippetDisplay
                codeSnippets={codeSnippets}
                onDelete={this.deleteCodeSnippet.bind(this)}
                getCurrentWidget={this.getCurrentWidget}
              />
            </div>
          )}
        </UseSignal>
      </div>
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
    const cells = mime.getData(JUPYTER_CELL_MIME);
    const data: string[] = [];
    cells.forEach((cell: any) => data.push(cell.source));

    return data;
  }
}
