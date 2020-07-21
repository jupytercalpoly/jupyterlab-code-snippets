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

// import { URLExt } from '@jupyterlab/coreutils';
// import { ServerConnection } from '@jupyterlab/services';
import insertSVGstr from '../style/icon/insertsnippet.svg';
import { LabIcon } from '@jupyterlab/ui-components';
import {
  ExpandableComponent,
  IExpandableActionButton
} from '@elyra/ui-components';
import {
  ReactWidget,
  UseSignal,
  Clipboard,
  Dialog,
  showDialog
} from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { PathExt } from '@jupyterlab/coreutils';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { IRenderMimeRegistry } from '@jupyterlab/rendermime';
import { copyIcon, closeIcon } from '@jupyterlab/ui-components';
import { Widget, PanelLayout } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';
// import { Cell } from '@jupyterlab/cells';

import React from 'react';

import { ICodeSnippet } from './CodeSnippetService';
import { SearchBar } from './SearchBar';

import { IDragEvent } from '@lumino/dragdrop';

// import { inputDialog } from './CodeSnippetForm';

// import { Cell } from '@jupyterlab/cells';

import { MimeData } from '@lumino/coreutils';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';

//import {Preview} from './PreviewSnippet'

import { showPreview } from './PreviewSnippet';

/**
 * The class added to snippet cells
 */
// const CODE_SNIPPET_CELL_CLASS = 'jp-CodeSnippet-cell';
/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_HEADER_CLASS = 'elyra-codeSnippetsHeader';
const CODE_SNIPPETS_CONTAINER = 'codeSnippetsContainer';

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

const DISPLAY_NAME_CLASS = 'elyra-expandableContainer-name';
const ELYRA_BUTTON_CLASS = 'elyra-button';
const BUTTON_CLASS = 'elyra-expandableContainer-button';
const TITLE_CLASS = 'elyra-expandableContainer-title';
const ACTION_BUTTONS_WRAPPER_CLASS = 'elyra-expandableContainer-action-buttons';
const ACTION_BUTTON_CLASS = 'elyra-expandableContainer-actionButton';

/**
 * CodeSnippetDisplay props.
 */
interface ICodeSnippetDisplayProps {
  codeSnippets: ICodeSnippet[];
  onDelete: (codeSnippet: ICodeSnippet) => void;
  getCurrentWidget: () => Widget;
}

/**
 * CodeSnippetDisplay state.
 */
interface ICodeSnippetDisplayState {
  codeSnippets: ICodeSnippet[];
  filterValue: string;
}

/**
 * A React Component for code-snippets display list.
 */
class CodeSnippetDisplay extends React.Component<
  ICodeSnippetDisplayProps,
  ICodeSnippetDisplayState
> {
  state = { codeSnippets: this.props.codeSnippets, filterValue: '' };

  // Handle code snippet insert into an editor
  private insertCodeSnippet = async (snippet: ICodeSnippet): Promise<void> => {
    const widget: Widget = this.props.getCurrentWidget();
    console.log('current widget: ' + widget);
    const snippetStr: string = snippet.code.join('\n');

    // if the widget is document widget and it's a file?? in the file editor
    if (
      widget instanceof DocumentWidget &&
      (widget as DocumentWidget).content instanceof FileEditor
    ) {
      const documentWidget = widget as DocumentWidget;
      // code editor
      const fileEditor = (documentWidget.content as FileEditor).editor;
      const markdownRegex = /^\.(md|mkdn?|mdown|markdown)$/;

      if (PathExt.extname(widget.context.path).match(markdownRegex) !== null) {
        // Wrap snippet into a code block when inserting it into a markdown file
        fileEditor.replaceSelection(
          '```' + snippet.language + '\n' + snippetStr + '\n```'
        );
      } else if (widget.constructor.name === 'PythonFileEditor') {
        this.verifyLanguageAndInsert(snippet, 'python', fileEditor);
      } else {
        fileEditor.replaceSelection(snippetStr);
      }
    } else if (widget instanceof NotebookPanel) {
      const notebookWidget = widget as NotebookPanel;
      const notebookCell = (notebookWidget.content as Notebook).activeCell;
      // editor
      const notebookCellEditor = notebookCell.editor;

      if (notebookCell instanceof CodeCell) {
        const kernelInfo = await notebookWidget.sessionContext.session?.kernel
          ?.info;
        const kernelLanguage: string = kernelInfo?.language_info.name || '';
        this.verifyLanguageAndInsert(
          snippet,
          kernelLanguage,
          notebookCellEditor
        );
      } else if (notebookCell instanceof MarkdownCell) {
        // Wrap snippet into a code block when inserting it into a markdown cell
        notebookCellEditor.replaceSelection(
          '```' + snippet.language + '\n' + snippetStr + '\n```'
        );
      } else {
        notebookCellEditor.replaceSelection(snippetStr);
      }
    } else {
      this.showErrDialog('Code snippet insert failed: Unsupported widget');
    }
  };

  // Handle deleting code snippet
  private deleteCodeSnippet = async (snippet: ICodeSnippet): Promise<void> => {
    console.log(this.props.getCurrentWidget instanceof CodeSnippetWidget);
    console.log(snippet);
    // const name = snippet.name;
    // const url = 'elyra/metadata/code-snippets/' + name;

    // const settings = ServerConnection.makeSettings();
    // const requestUrl = URLExt.join(settings.baseUrl, url);

    // await ServerConnection.makeRequest(requestUrl, { method: 'DELETE' }, settings)
    this.props.onDelete(snippet);

    // const idx = this.props.codeSnippets.indexOf(snippet);
    // this.props.codeSnippets.splice(idx, 1);
    // console.log(idx);
    // console.log(this.props.codeSnippets);

    // Delete the selected snippet // TODO: give each snippet an id
    // this.setState( { codeSnippets: this.props.codeSnippets } )
  };

  // Handle language compatibility between code snippet and editor
  private verifyLanguageAndInsert = async (
    snippet: ICodeSnippet,
    editorLanguage: string,
    editor: CodeEditor.IEditor
  ): Promise<void> => {
    const snippetStr: string = snippet.code.join('\n');
    if (
      editorLanguage &&
      snippet.language.toLowerCase() !== editorLanguage.toLowerCase()
    ) {
      const result = await this.showWarnDialog(
        editorLanguage,
        snippet.displayName
      );
      if (result.button.accept) {
        editor.replaceSelection(snippetStr);
      }
    } else {
      // Language match or editorLanguage is unavailable
      editor.replaceSelection(snippetStr);
    }
  };

  // Display warning dialog when inserting a code snippet incompatible with editor's language
  private showWarnDialog = async (
    editorLanguage: string,
    snippetName: string
  ): Promise<Dialog.IResult<string>> => {
    return showDialog({
      title: 'Warning',
      body:
        'Code snippet "' +
        snippetName +
        '" is incompatible with ' +
        editorLanguage +
        '. Continue?',
      buttons: [Dialog.cancelButton(), Dialog.okButton()]
    });
  };

  // Display error dialog when inserting a code snippet into unsupported widget (i.e. not an editor)
  private showErrDialog = (errMsg: string): Promise<Dialog.IResult<string>> => {
    return showDialog({
      title: 'Error',
      body: errMsg,
      buttons: [Dialog.okButton()]
    });
  };

  // Pick color for side of snippet box based on number of code lines
  // private codeLinesToColor = (codeSnippet: ICodeSnippet): string => {
  //   let color: string;
  //   let i,
  //     counter = 0;
  //   for (i = 0; i < codeSnippet.code[0].length; i++) {
  //     if (codeSnippet.code[0][i] === '\n') {
  //       counter++;
  //     }
  //   }
  //   if (counter < 25) {
  //     color = '8px solid #BBDEFB';
  //   } else if (counter >= 25 && counter <= 50) {
  //     color = '8px solid #64B5F6';
  //   } else {
  //     color = '8px solid #1976D2';
  //   }
  //   return color;
  // };
  //Render snippet bookmark based on state of bookmarked field
  // private bookmarkSnippetRender = (codeSnippet: ICodeSnippet): string => {
  //     if(codeSnippet.bookmarked===false) {
  //         return "transparent #E5E5E5 transparent transparent";
  //     }
  //     return "transparent blue transparent transparent";
  // }

  //Change bookmark field and color onclick
  private bookmarkSnippetClick = (
    codeSnippet: ICodeSnippet,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const target = event.target as HTMLElement;
    if (codeSnippet.bookmarked === false) {
      codeSnippet.bookmarked = true;
      target.style.borderColor = 'transparent blue transparent transparent';
    } else if (codeSnippet.bookmarked === true) {
      codeSnippet.bookmarked = false;
      console.log('TARGET: ', target.className);
      target.style.borderColor = 'transparent #E5E5E5 transparent transparent';
      target.style.transition = 'border-color 0.2s linear';
    }
  };

  // Render display of code snippet list
  // To get the variety of color based on code length just append -long to CODE_SNIPPET_ITEM
  private renderCodeSnippet = (
    codeSnippet: ICodeSnippet,
    id: string,
    type: string
  ): JSX.Element => {
    const buttonClasses = [ELYRA_BUTTON_CLASS, BUTTON_CLASS].join(' ');

    const displayName =
      '[' + codeSnippet.language + '] ' + codeSnippet.displayName;

    const insertIcon = new LabIcon({
      name: 'ui-compnents:insert',
      svgstr: insertSVGstr
    });
    const actionButtons = [
      {
        title: 'Copy',
        icon: copyIcon,
        onClick: (): void => {
          Clipboard.copyToSystem(codeSnippet.code.join('\n'));
        }
      },
      {
        title: 'Insert',
        icon: insertIcon,
        onClick: (): void => {
          this.insertCodeSnippet(codeSnippet);
        }
      },
      {
        title: 'Delete',
        icon: closeIcon,
        onClick: (): void => {
          this.deleteCodeSnippet(codeSnippet);
        }
      }
    ]; // Replace the borderleft color with options! Save on repetitive code this way!
    /** TODO: if the type is a cell then display cell */
    // type of code snippet: plain code or cell
    return (
      <div key={codeSnippet.name} className={CODE_SNIPPET_ITEM} id={id}>
        <div
          className="triangle"
          title="Bookmark"
          onClick={event => {
            this.bookmarkSnippetClick(codeSnippet, event);
          }}
        ></div>
        <div
          onClick={(): void => {
            showPreview({
              body: new PreviewHandler(codeSnippet, type)
            });
          }}
        >
          <ExpandableComponent
            displayName={displayName}
            tooltip={codeSnippet.description}
            actionButtons={actionButtons}
          >
            <textarea defaultValue={codeSnippet.code.join('\n')}></textarea>
          </ExpandableComponent>
        </div>
      </div>
    );
  };

  static getDerivedStateFromProps(
    props: ICodeSnippetDisplayProps,
    state: ICodeSnippetDisplayState
  ): ICodeSnippetDisplayState {
    console.log(props);
    console.log(state);
    if (
      props.codeSnippets.length !== state.codeSnippets.length &&
      state.filterValue === ''
    ) {
      return {
        codeSnippets: props.codeSnippets,
        filterValue: ''
      };
    }
    return null;
  }

  filterSnippets = (filterValue: string): void => {
    const newSnippets = this.props.codeSnippets.filter(codeSnippet =>
      codeSnippet.displayName.includes(filterValue)
    );
    this.setState(
      { codeSnippets: newSnippets, filterValue: filterValue },
      () => {
        console.log('CodeSnippets are successfully filtered.');
      }
    );
  };

  render(): React.ReactElement {
    return (
      <div>
        <SearchBar onFilter={this.filterSnippets} />
        <header className={CODE_SNIPPETS_HEADER_CLASS}>{'Snippets'}</header>
        <div className={CODE_SNIPPETS_CONTAINER}>
          <div>
            {this.state.codeSnippets.map((codeSnippet, id) =>
              this.renderCodeSnippet(codeSnippet, id.toString(), 'cell')
            )}
          </div>
        </div>
      </div>
    );
  }
}

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
     *  TODO: the one saved in our snippet panel should not be a cell;
     *        NEED TO DEFINE THE STRUCTURE OF SNIPPET!!!!
     * */

    const newSnippet: ICodeSnippet = {
      name: 'testingCodeCell',
      displayName: 'testingCodeCell',
      description: 'testingCodeCell',
      language: 'Python',
      code: data
    };

    this.codeSnippetWidgetModel.addSnippet(
      { codeSnippet: newSnippet, id: idx },
      idx
    );

    const newSnippets = this.codeSnippetWidgetModel.snippets;
    this._codeSnippets = newSnippets;
    console.log(this._codeSnippets);
    this.renderCodeSnippetsSignal.emit(this._codeSnippets);

    // const url = 'elyra/metadata/code-snippets';

    // inputDialog(this, url, data, idx, 'cell');
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

class PreviewHandler extends Widget {
  constructor(codeSnippet: ICodeSnippet, type: string) {
    super({ node: Private.createPreviewNode(codeSnippet, type) });
  }
}

/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * Given a MimeData instance, extract the data, if any.
   */
  export function findCellData(mime: MimeData): string[] {
    // const types = mime.types();
    // console.log(types);
    // application/vnd.jupyter.cells
    const cells = mime.getData(JUPYTER_CELL_MIME);
    const data: string[] = [];
    cells.forEach((cell: any) => data.push(cell.source));

    return data;
  }

  /**
   * Create structure for preview of snippet data.
   */
  export function createPreviewNode(
    codeSnippet: ICodeSnippet,
    type: string
  ): HTMLElement {
    //let code:string = codeSnippet.code[0];

    return createPreviewContent(codeSnippet, type);
  }
}

function createPreviewContent(
  codeSnippet: ICodeSnippet,
  type: string
): HTMLElement {
  const body = document.createElement('div');
  console.log(codeSnippet.code);
  for (let i = 0; i < codeSnippet.code.length; i++) {
    const previewContainer = document.createElement('div');
    const preview = document.createElement('text');
    preview.contentEditable = 'true';

    if (type === 'code') {
      previewContainer.className = 'jp-preview-text';
      preview.className = 'jp-preview-textarea';
      preview.textContent = codeSnippet.code.join('\n').replace('\n', '\r\n');
    } else if (type === 'cell') {
      previewContainer.className = 'jp-preview-cell';
      const previewPrompt = document.createElement('div');
      previewPrompt.className = 'jp-preview-cell-prompt';
      previewPrompt.innerText = '[ ]:';
      previewContainer.appendChild(previewPrompt);
      preview.className = 'jp-preview-cellarea';
      preview.textContent = codeSnippet.code[i];
    } else {
      alert('Invalid type to preview');
    }

    //console.log("this is the text: "+ message.textContent);
    previewContainer.appendChild(preview);
    body.append(previewContainer);
  }
  return body;
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
}
