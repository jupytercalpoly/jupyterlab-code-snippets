import insertSVGstr from '../style/icon/insertsnippet.svg';
import { SearchBar } from './SearchBar';
import { showPreview } from './PreviewSnippet';
import {
  ICodeSnippet
  // CodeSnippetContentsService
} from './CodeSnippetContentsService';
// import { CodeSnippetWidget } from './CodeSnippetWidget';

import { Clipboard, Dialog, showDialog } from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { PathExt } from '@jupyterlab/coreutils';
// import { ServerConnection } from '@jupyterlab/services';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { copyIcon, closeIcon } from '@jupyterlab/ui-components';
import { LabIcon } from '@jupyterlab/ui-components';

import { IExpandableActionButton } from '@elyra/ui-components';

import { Widget } from '@lumino/widgets';

// import { MouseEvent } from 'react';
import React from 'react';
import { Drag } from '@lumino/dragdrop';
import { Cell, CodeCellModel, ICodeCellModel } from '@jupyterlab/cells';
import { MimeData } from '@lumino/coreutils';

import * as nbformat from '@jupyterlab/nbformat';

/**
 * The class added to snippet cells
 */
// const CODE_SNIPPET_CELL_CLASS = 'jp-CodeSnippet-cell';
/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_HEADER_CLASS = 'elyra-codeSnippetsHeader';
const CODE_SNIPPETS_CONTAINER = 'codeSnippetsContainer';

const DISPLAY_NAME_CLASS = 'elyra-expandableContainer-name';
const ELYRA_BUTTON_CLASS = 'elyra-button';
const BUTTON_CLASS = 'elyra-expandableContainer-button';
const TITLE_CLASS = 'elyra-expandableContainer-title';
const ACTION_BUTTONS_WRAPPER_CLASS = 'elyra-expandableContainer-action-buttons';
const ACTION_BUTTON_CLASS = 'elyra-expandableContainer-actionButton';

/**
 * The threshold in pixels to start a drag event.
 */
const DRAG_THRESHOLD = 5;

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * CodeSnippetDisplay props.
 */
interface ICodeSnippetDisplayProps {
  codeSnippets: ICodeSnippet[];
  getCurrentWidget: () => Widget;
  openCodeSnippetEditor: (args: any) => void;
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
export class CodeSnippetDisplay extends React.Component<
  ICodeSnippetDisplayProps,
  ICodeSnippetDisplayState
> {
  _drag: Drag;
  _dragData: { pressX: number; pressY: number; dragImage: HTMLElement };
  constructor(props: ICodeSnippetDisplayProps) {
    super(props);
    this.state = { codeSnippets: this.props.codeSnippets, filterValue: '' };
    this._drag = null;
    this._dragData = null;
    this.handleDragMove = this.handleDragMove.bind(this);
    this._evtMouseUp = this._evtMouseUp.bind(this);
  }

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
    const name = snippet.name;
    // const url = 'elyra/metadata/code-snippets/' + name;

    this.props.openCodeSnippetEditor({ namespace: name });
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
  // private codeLines = (codeSnippet: ICodeSnippet): string => {
  //   let i;
  //   let counter = 0;
  //   for (i = 0; i < codeSnippet.code[0].length; i++) {
  //     if (codeSnippet.code[0][i] === '\n') {
  //       counter++;
  //     }
  //   }
  //   counter += 1;
  //   console.log(counter);
  //   return 'LOC\t\t' + counter;
  // };

  //Change bookmark field and color onclick
  private bookmarkSnippetClick = (
    codeSnippet: ICodeSnippet,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    const target = event.target as HTMLElement;
    if (codeSnippet.bookmarked === false) {
      codeSnippet.bookmarked = true;
      target.style.borderColor = 'transparent #1976d2 transparent transparent';
    } else if (codeSnippet.bookmarked === true) {
      codeSnippet.bookmarked = false;
      console.log('TARGET: ', target.className);
      target.style.borderColor = 'transparent #E5E5E5 transparent transparent';
      target.style.transition = 'border-color 0.2s linear';
    }
  };

  // Insert 6 dots on hover
  private dragHoverStyle = (id: string): void => {
    const _id: number = parseInt(id, 10);

    document
      .getElementsByClassName('drag-hover')
      [_id].classList.add('drag-hover-selected');
  };

  // Remove 6 dots off hover
  private dragHoverStyleRemove = (id: string): void => {
    const _id: number = parseInt(id, 10);
    document
      .getElementsByClassName('drag-hover')
      [_id].classList.remove('drag-hover-selected');
  };

  // Grey out snippet and include blue six dots when snippet is previewing (clicked)
  private snippetClicked = (id: string): void => {
    const _id: number = parseInt(id, 10);

    if (
      document
        .getElementsByClassName('drag-hover')
        [_id].classList.contains('drag-hover-clicked')
    ) {
      document
        .getElementsByClassName('drag-hover')
        [_id].classList.remove('drag-hover-clicked');
    } else {
      document
        .getElementsByClassName('drag-hover')
        [_id].classList.add('drag-hover-clicked');
    }
    if (
      document
        .getElementsByClassName(CODE_SNIPPET_ITEM)
        [_id].classList.contains('elyra-codeSnippet-item-clicked')
    ) {
      document
        .getElementsByClassName(CODE_SNIPPET_ITEM)
        [_id].classList.remove('elyra-codeSnippet-item-clicked');
    } else {
      document
        .getElementsByClassName(CODE_SNIPPET_ITEM)
        [_id].classList.add('elyra-codeSnippet-item-clicked');
    }
  };

  // Bold text in snippet DisplayName based on search
  private boldNameOnSearch = (filter: string, displayed: string): any => {
    const name: string = displayed;
    if (filter !== '') {
      const startIndex: number = name.indexOf(filter);
      const endIndex: number = startIndex + filter.length;
      const start = name.substring(0, startIndex);
      const bolded = name.substring(startIndex, endIndex);
      const end = name.substring(endIndex);
      return (
        <span>
          {start}
          <mark className="jp-search-bolding">{bolded}</mark>
          {end}
        </span>
      );
    }
    return name;
  };

  private handleDragSnippet(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    const { button } = event;

    // if button is not the left click
    if (!(button === 0)) {
      return;
    }

    const target = event.target as HTMLElement;

    this._dragData = {
      pressX: event.clientX,
      pressY: event.clientY,
      dragImage: target.parentNode.cloneNode(true) as HTMLElement
    };

    // add CSS style
    this._dragData.dragImage.classList.add('jp-codesnippet-drag-image');

    console.log('draggin');
    console.log(event);
    target.addEventListener('mouseup', this._evtMouseUp, true);
    target.addEventListener('mousemove', this.handleDragMove, true);

    event.preventDefault();
    // event.stopPropagation();
  }

  private _evtMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    console.log('cancelled');

    const target = event.target as HTMLElement;

    target.removeEventListener('mousemove', this.handleDragMove, true);

    target.removeEventListener('mouseup', this._evtMouseUp, true);
  }

  private handleDragMove(event: MouseEvent): void {
    // event.preventDefault();
    // event.stopPropagation();
    const data = this._dragData;

    // console.log(data);
    // console.log(event);
    // console.log(this);
    // console.log(
    //   this.shouldStartDrag(
    //     data.pressX,
    //     data.pressY,
    //     event.clientX,
    //     event.clientY
    //   )
    // );

    if (
      data &&
      this.shouldStartDrag(
        data.pressX,
        data.pressY,
        event.clientX,
        event.clientY
      )
    ) {
      console.log('moving start');

      const idx = (event.target as HTMLElement).id;
      const codeSnippet = this.state.codeSnippets[parseInt(idx)];

      this.startDrag(data.dragImage, codeSnippet, event.clientX, event.clientY);
    }
  }

  /**
   * Detect if a drag event should be started. This is down if the
   * mouse is moved beyond a certain distance (DRAG_THRESHOLD).
   *
   * @param prevX - X Coordinate of the mouse pointer during the mousedown event
   * @param prevY - Y Coordinate of the mouse pointer during the mousedown event
   * @param nextX - Current X Coordinate of the mouse pointer
   * @param nextY - Current Y Coordinate of the mouse pointer
   */
  private shouldStartDrag(
    prevX: number,
    prevY: number,
    nextX: number,
    nextY: number
  ): boolean {
    const dx = Math.abs(nextX - prevX);
    const dy = Math.abs(nextY - prevY);
    return dx >= DRAG_THRESHOLD || dy >= DRAG_THRESHOLD;
  }

  private async startDrag(
    dragImage: HTMLElement,
    codeSnippet: ICodeSnippet,
    clientX: number,
    clientY: number
  ): Promise<void> {
    /**
     * TODO: check what the current widget is
     */
    // const widget = this.props.getCurrentWidget();
    const target = event.target as HTMLElement;

    // if (widget instanceof NotebookPanel) {
    //   const notebookWidget = widget as NotebookPanel;

    //   const kernelInfo = await notebookWidget.sessionContext.session?.kernel
    //     ?.info;
    //   const kernelLanguage: string = kernelInfo?.language_info.name || '';

    //   if (
    //     kernelLanguage &&
    //     codeSnippet.language.toLowerCase() !== kernelLanguage.toLowerCase()
    //   ) {
    //     const result = await this.showWarnDialog(
    //       kernelLanguage,
    //       codeSnippet.displayName
    //     );
    //     if (!result.button.accept) {
    //       target.removeEventListener('mousemove', this.handleDragMove, true);
    //       target.removeEventListener('mouseup', this._evtMouseUp, true);
    //       this._dragData = null;
    //       return;
    //     }
    //   }
    // }

    const modelFactory = new ModelFactory();
    const model = modelFactory.createCodeCell({});
    model.value.text = codeSnippet.code.join('\n');
    model.metadata;

    const selected: nbformat.ICell[] = [model.toJSON()];

    this._drag = new Drag({
      mimeData: new MimeData(),
      dragImage: dragImage,
      supportedActions: 'copy-move',
      proposedAction: 'copy',
      source: this
    });

    this._drag.mimeData.setData(JUPYTER_CELL_MIME, selected);
    const textContent = codeSnippet.code.join('\n');
    this._drag.mimeData.setData('text/plain', textContent);

    console.log('removing events');

    // Remove mousemove and mouseup listeners and start the drag.
    target.removeEventListener('mousemove', this.handleDragMove, true);
    target.removeEventListener('mouseup', this._evtMouseUp, true);

    return this._drag.start(clientX, clientY).then(() => {
      console.log('drag done');
      this.dragHoverStyleRemove(codeSnippet.id.toString());
      this._drag = null;
      this._dragData = null;
    });
  }

  // Render display of code snippet list
  // To get the variety of color based on code length just append -long to CODE_SNIPPET_ITEM
  private renderCodeSnippet = (
    codeSnippet: ICodeSnippet,
    id: string
  ): JSX.Element => {
    const buttonClasses = [ELYRA_BUTTON_CLASS, BUTTON_CLASS].join(' ');
    const displayName =
      '[' + codeSnippet.language + '] ' + codeSnippet.displayName;
    //this.boldNameOnSearch(this.state.filterValue,displayName,parseInt(id,10));

    const insertIcon = new LabIcon({
      name: 'custom-ui-compnents:insert',
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
    ];
    /** TODO: if the type is a cell then display cell */
    // type of code snippet: plain code or cell
    return (
      <div
        key={codeSnippet.name}
        className={CODE_SNIPPET_ITEM}
        id={id}
        onMouseOver={(): void => {
          this.dragHoverStyle(id);
        }}
        onMouseOut={(): void => {
          this.dragHoverStyleRemove(id);
        }}
      >
        <div
          className="drag-hover"
          id={id}
          onMouseDown={(event): void => {
            this.handleDragSnippet(event);
          }}
        ></div>
        <div
          className="triangle"
          title="Bookmark"
          onClick={(event): void => {
            this.bookmarkSnippetClick(codeSnippet, event);
          }}
        ></div>
        <div>
          <div
            key={displayName}
            className={TITLE_CLASS}
            // onMouseOver={() => {
            //   this.dragHoverStyle(id);
            // }}
            // onMouseOut={() => {
            //   this.dragHoverStyleRemove(id);
            // }}
          >
            <span
              id={id}
              title={codeSnippet.displayName}
              className={DISPLAY_NAME_CLASS}
              onClick={(): void => {
                showPreview(
                  {
                    id: parseInt(id, 10),
                    title: displayName,
                    body: new PreviewHandler(codeSnippet),
                    codeSnippet: codeSnippet
                  },
                  this.props.openCodeSnippetEditor
                );
                this.snippetClicked(id);
              }}
            >
              {this.boldNameOnSearch(this.state.filterValue, displayName)}
            </span>
            <div className={ACTION_BUTTONS_WRAPPER_CLASS}>
              {actionButtons.map((btn: IExpandableActionButton) => {
                return (
                  <button
                    key={btn.title}
                    title={btn.title}
                    className={buttonClasses + ' ' + ACTION_BUTTON_CLASS}
                    onClick={(): void => {
                      if (btn.title === 'Copy') {
                        alert('saved to clipboard');
                      }
                      btn.onClick();
                    }}
                  >
                    <btn.icon.react
                      tag="span"
                      elementPosition="center"
                      width="16px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  static getDerivedStateFromProps(
    props: ICodeSnippetDisplayProps,
    state: ICodeSnippetDisplayState
  ): ICodeSnippetDisplayState {
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
    const newSnippets = this.props.codeSnippets.filter(
      codeSnippet =>
        codeSnippet.displayName.includes(filterValue) ||
        codeSnippet.language.includes(filterValue)
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
              this.renderCodeSnippet(codeSnippet, id.toString())
            )}
          </div>
        </div>
      </div>
    );
  }
}

class PreviewHandler extends Widget {
  constructor(codeSnippet: ICodeSnippet) {
    super({ node: Private.createPreviewNode(codeSnippet) });
  }
}

class Private {
  static createPreviewContent(codeSnippet: ICodeSnippet): HTMLElement {
    const body = document.createElement('div');
    const previewContainer = document.createElement('div');
    const descriptionContainer = document.createElement('div');
    const descriptionTitle = document.createElement('h6');
    const description = document.createElement('text');
    const preview = document.createElement('text');

    previewContainer.className = 'jp-preview-text';
    descriptionContainer.className = 'jp-preview-description-container';
    descriptionTitle.className = 'jp-preview-description-title';
    description.className = 'jp-preview-description';
    preview.className = 'jp-preview-textarea';

    descriptionTitle.textContent = 'DESCRIPTION';
    description.textContent = codeSnippet.description;
    preview.textContent = codeSnippet.code.join('\n');

    descriptionContainer.appendChild(descriptionTitle);
    descriptionContainer.appendChild(description);
    previewContainer.appendChild(descriptionContainer);

    previewContainer.appendChild(preview);
    body.append(previewContainer);

    return body;
  }
  /**
   * Create structure for preview of snippet data.
   */
  static createPreviewNode(codeSnippet: ICodeSnippet): HTMLElement {
    return this.createPreviewContent(codeSnippet);
  }
}

/**
 * A content factory for console children.
 */
export interface IContentFactory extends Cell.IContentFactory {
  /**
   * Create a new code cell widget.
   */
  createCodeCell(options: CodeCell.IOptions): CodeCell;
}

/**
 * The default implementation of an `IModelFactory`.
 */
export class ModelFactory {
  /**
   * The factory for output area models.
   */
  readonly codeCellContentFactory: CodeCellModel.IContentFactory;

  /**
   * Create a new code cell.
   *
   * @param source - The data to use for the original source data.
   *
   * @returns A new code cell. If a source cell is provided, the
   *   new cell will be initialized with the data from the source.
   *   If the contentFactory is not provided, the instance
   *   `codeCellContentFactory` will be used.
   */
  createCodeCell(options: CodeCellModel.IOptions): ICodeCellModel {
    if (!options.contentFactory) {
      options.contentFactory = this.codeCellContentFactory;
    }
    return new CodeCellModel(options);
  }
}
