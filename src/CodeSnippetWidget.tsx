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

import { inputDialog } from './index';
import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
import { ExpandableComponent } from '@elyra/ui-components';
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
import { copyIcon, addIcon, closeIcon } from '@jupyterlab/ui-components';
import { Message } from '@lumino/messaging';
import { Signal } from '@lumino/signaling';
import { Widget } from '@lumino/widgets';

import { IDragEvent } from '@lumino/dragdrop';
import { MimeData } from '@lumino/coreutils';

import React from 'react';

import { CodeSnippetService, ICodeSnippet } from './CodeSnippetService';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_CLASS = 'elyra-CodeSnippets';
const CODE_SNIPPETS_HEADER_CLASS = 'elyra-codeSnippetsHeader';
const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';

/**
 * A class used to indicate a drop target.
 */
const DROP_TARGET_CLASS = 'jp-mod-dropTarget';

/**
 * CodeSnippetDisplay props.
 */
interface ICodeSnippetDisplayProps {
  codeSnippets: ICodeSnippet[];
  getCurrentWidget: () => Widget;
}


/**
 * A React Component for code-snippets display list.
 */
class CodeSnippetDisplay extends React.Component<ICodeSnippetDisplayProps> {

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

            if (PathExt.extname(widget.context.path).match(markdownRegex) != null) {
                // Wrap snippet into a code block when inserting it into a markdown file
                fileEditor.replaceSelection(
                    '```' + snippet.language + '\n' + snippetStr + '\n```'
                );
            } else if (widget.constructor.name == 'PythonFileEditor') {
                this.verifyLanguageAndInsert(snippet, 'python', fileEditor);
            } else{
                fileEditor.replaceSelection(snippetStr);
            }
        } else if (widget instanceof NotebookPanel) {
            const notebookWidget = widget as NotebookPanel;
            const notebookCell = (notebookWidget.content as Notebook).activeCell;
            // editor
            const notebookCellEditor = notebookCell.editor;

            if (notebookCell instanceof CodeCell) {
                const kernelInfo = await notebookWidget.sessionContext.session?.kernel?.info;
                const kernelLanguage: string = kernelInfo?.language_info.name || '';
                this.verifyLanguageAndInsert(
                    snippet,
                    kernelLanguage,
                    notebookCellEditor
                );
            } else if (notebookCell instanceof MarkdownCell) {
                // Wrap snippet into a code block when inserting it into a markdown cell
                notebookCellEditor.replaceSelection (
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
        const name = snippet.name;
        const url = 'elyra/metadata/code-snippets/' + name;

        const settings = ServerConnection.makeSettings();
        const requestUrl = URLExt.join(settings.baseUrl, url);

        await ServerConnection.makeRequest(requestUrl, { method: 'DELETE' }, settings)

        const idx = this.props.codeSnippets.indexOf(snippet);
        this.props.codeSnippets.splice(idx, 1);
        console.log(idx);
        console.log(this.props.codeSnippets);

        // Delete the selected snippet // TODO: give each snippet an id
        this.setState( { codeSnippets: this.props.codeSnippets} )
    }

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
    }

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
    private codeLinesToColor = (codeSnippet: ICodeSnippet): string => {
        let color : string;
        let i,counter = 0;
        for (i=0; i<codeSnippet.code[0].length; i++) {
            if (codeSnippet.code[0][i] === "\n") {
                counter++;
            }
        }
        if (counter < 25) {
            color = "8px solid #BBDEFB";
        }
        else if (counter >= 25 && counter<= 50) {
            color = "8px solid #64B5F6";
        }
        else {
            color = "8px solid #1976D2";
        }
        return color;
    }
    
    // Render display of code snippet list
    // To get the variety of color based on code length just append -long to CODE_SNIPPET_ITEM
    private renderCodeSnippet = (codeSnippet: ICodeSnippet): JSX.Element => {
        let barColor = this.codeLinesToColor(codeSnippet);
        const displayName = 
            '[' + codeSnippet.language + '] ' + codeSnippet.displayName;

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
                icon: addIcon,
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
        ]; // REplace the borderleft color with options! Save on repetitive code this way!
        return (
            <div key={codeSnippet.name} className={CODE_SNIPPET_ITEM} style={{borderLeft: barColor}}>
                <ExpandableComponent
                    displayName={displayName}
                    tooltip={codeSnippet.description}
                    actionButtons={actionButtons}
                >
                    <textarea defaultValue={codeSnippet.code.join('\n')}></textarea>
                </ExpandableComponent>
            </div>
        );
    };

    render(): React.ReactElement {
        return (
            <div>
                <div id="codeSnippets">
                    <div>{this.props.codeSnippets.map(this.renderCodeSnippet)}</div>
                </div>
            </div>
        );
    }
}


/**
 * A widget for Code Snippets.
 */
export class CodeSnippetWidget extends ReactWidget {
    codeSnippetManager: CodeSnippetService;
    renderCodeSnippetsSignal: Signal<this, ICodeSnippet[]>;
    getCurrentWidget: () => Widget;

    constructor(getCurrentWidget: () => Widget) {
        super();
        this.getCurrentWidget = getCurrentWidget;
        this.codeSnippetManager = new CodeSnippetService();
        this.renderCodeSnippetsSignal = new Signal<this, ICodeSnippet[]>(this);
    }
  
  // Request code snippets from server
  async fetchData(): Promise<ICodeSnippet[]> {
    return await this.codeSnippetManager.findAll();
  }

  // Triggered when the widget button on side palette is clicked
  onAfterShow(msg: Message): void {
    this.fetchData().then((codeSnippets: ICodeSnippet[]) => {
      this.renderCodeSnippetsSignal.emit(codeSnippets);
    });
  }

  /**
   * Ensure that the notebook has proper focus.
   */
  private _ensureFocus(force = false): void {
      if (force && !this.node.contains(document.activeElement)) {
          this.node.focus();
      }
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
      console.log(node);
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
   * Handle `'activate-request'` messages.
   */
  protected onActivateRequest (msg: Message): void {
      this._ensureFocus(true);
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
      const data = Private.findData(event.mimeData);
      if (data === undefined) {
          return;
      }
      event.preventDefault();
      event.stopPropagation();
      event.dropAction = event.proposedAction;
  }

  /**
   * Hanlde the `'lm-drop'` event for the widget.
   */
    private async _evtDrop(event: IDragEvent): Promise<void> {
      const data = Private.findData(event.mimeData);
      if (data === undefined) {
          return;
      }

      // TODO: remove CLASS
      event.preventDefault();
      event.stopPropagation();

      if (event.proposedAction === 'none'){
          event.dropAction = 'none';
          return;
      }

    /**
     * TODO: WE CAN ADD FUNCTIONALITY TO DRAG AND DROP WITHIN THE SNIPPET PANEL
     */

    // Handle the case where we are copying cells
    event.dropAction = 'copy';
    
    /**
     *  TODO: the one saved in our snippet panel should not be a cell; 
     *        NEED TO DEFINE THE STRUCTURE OF SNIPPET!!!!
     * */ 

    const url = 'elyra/metadata/code-snippets';
    const code = Private.findData(event.mimeData);

    await inputDialog(url, code);
    console.log(code);
    // await RequestHandler.makePostRequest(
    //     url,
    //     JSON.stringify({ 
    //       display_name: 'drag_dropped',
    //       metadata: {
    //           code: [
    //               code
    //           ],
    //           description: 'Print dragged and dropped',
    //           language: 'python',
    //       },
    //       name: 'dragdropped',
    //       schema_name: 'code-snippet',
    //     }),
    //     false
    //   );
    this.fetchData().then((codeSnippets: ICodeSnippet[]) => {
    this.renderCodeSnippetsSignal.emit(codeSnippets);
    });
  }

  render(): React.ReactElement {
    return (
      <div className={CODE_SNIPPETS_CLASS}>
        <header className={CODE_SNIPPETS_HEADER_CLASS}>
          {'</> Code Snippets'}
        </header>
        <UseSignal signal={this.renderCodeSnippetsSignal} initialArgs={[]}>
          {(_, codeSnippets): React.ReactElement => (
            <CodeSnippetDisplay
              codeSnippets={codeSnippets}
              getCurrentWidget={this.getCurrentWidget}
            />
          )}
        </UseSignal>
      </div>
    );
  }
}

/**
 * A namespace for private data.
 */
namespace Private {
    /**
     * Given a MimeData instance, extract the data, if any.
     */
    export function findData(mime: MimeData): string | undefined {
        // const types = mime.types();
        // console.log(types);
        // application/vnd.jupyter.cells
        const data = mime.getData('text/plain');
        return data;
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
