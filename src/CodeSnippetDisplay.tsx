import insertSVGstr from '../style/icon/insertsnippet.svg';
import moreSVGstr from '../style/icon/jupyter_moreicon.svg';
import launchEditorSVGstr from '../style/icon/jupyter_launcher.svg';
import { SearchBar } from './SearchBar';
import { FilterSnippet } from './FilterSnippet';
import { showPreview } from './PreviewSnippet';
import { showMoreOptions } from './MoreOptions';
import {
  ICodeSnippet
  // CodeSnippetContentsService
} from './CodeSnippetContentsService';
// import { CodeSnippetWidget } from './CodeSnippetWidget';

import { /**Clipboard,*/ Dialog, showDialog } from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { PathExt } from '@jupyterlab/coreutils';
// import { ServerConnection } from '@jupyterlab/services';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { /**copyIcon,*/ LabIcon, addIcon } from '@jupyterlab/ui-components';
import { IEditorServices } from '@jupyterlab/codeeditor';

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
const CODE_SNIPPETS_HEADER_CLASS = 'codeSnippetsHeader';
const CODE_SNIPPETS_CONTAINER = 'codeSnippetsContainer';

const DISPLAY_NAME_CLASS = 'expandableContainer-name';
const ELYRA_BUTTON_CLASS = 'jp-button';
const BUTTON_CLASS = 'expandableContainer-button';
const TITLE_CLASS = 'expandableContainer-title';
const ACTION_BUTTONS_WRAPPER_CLASS = 'expandableContainer-action-buttons';
const ACTION_BUTTON_CLASS = 'expandableContainer-actionButton';

/**
 * The threshold in pixels to start a drag event.
 */
const DRAG_THRESHOLD = 5;

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'codeSnippet-item';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * Icons used for snippet
 */
const insertIcon = new LabIcon({
  name: 'custom-ui-compnents:insert',
  svgstr: insertSVGstr
});

const launchEditorIcon = new LabIcon({
  name: 'custom-ui-compnents:launchEditor',
  svgstr: launchEditorSVGstr
});

const moreOptionsIcon = new LabIcon({
  name: 'custom-ui-compnents:moreOptions',
  svgstr: moreSVGstr
});

/**
 * CodeSnippetDisplay props.
 */
interface ICodeSnippetDisplayProps {
  codeSnippets: ICodeSnippet[];
  getCurrentWidget: () => Widget;
  openCodeSnippetEditor: (args: any) => void;
  editorServices: IEditorServices;
}

/**
 * CodeSnippetDisplay state.
 */
interface ICodeSnippetDisplayState {
  codeSnippets: ICodeSnippet[];
  searchValue: string;
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
    this.state = { codeSnippets: this.props.codeSnippets, searchValue: '' };
    this._drag = null;
    this._dragData = null;
    this.handleDragMove = this.handleDragMove.bind(this);
    this._evtMouseUp = this._evtMouseUp.bind(this);
  }

  // Handle code snippet insert into an editor
  private insertCodeSnippet = async (snippet: ICodeSnippet): Promise<void> => {
    const widget: Widget = this.props.getCurrentWidget();
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

  // // Handle deleting code snippet
  // private deleteCodeSnippet = async (snippet: ICodeSnippet): Promise<void> => {
  //   const name = snippet.name;
  //   // const url = 'elyra/metadata/code-snippets/' + name;

  //   this.props.openCodeSnippetEditor({ namespace: name, codeSnippet: snippet });
  // };

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
      const result = await this.showWarnDialog(editorLanguage, snippet.name);
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
  //   return 'LOC\t\t' + counter;
  // };

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
    // if (
    //   document
    //     .getElementsByClassName(CODE_SNIPPET_ITEM)
    //     [_id].classList.contains('codeSnippet-item-clicked')
    // ) {
    //   document
    //     .getElementsByClassName(CODE_SNIPPET_ITEM)
    //     [_id].classList.remove('codeSnippet-item-clicked');
    // } else {
    //   document
    //     .getElementsByClassName(CODE_SNIPPET_ITEM)
    //     [_id].classList.add('codeSnippet-item-clicked');
    // }
  };

  // Bold text in snippet name based on search
  private boldNameOnSearch = (
    filter: string,
    displayed: string
  ): JSX.Element => {
    const name: string = displayed;
    if (filter !== '' && displayed.includes(filter)) {
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
    return <span>{name}</span>;
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
    target.addEventListener('mouseup', this._evtMouseUp, true);
    target.addEventListener('mousemove', this.handleDragMove, true);

    event.preventDefault();
    // event.stopPropagation();
  }

  private _evtMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    target.removeEventListener('mousemove', this.handleDragMove, true);

    target.removeEventListener('mouseup', this._evtMouseUp, true);
  }

  private handleDragMove(event: MouseEvent): void {
    // event.preventDefault();
    // event.stopPropagation();
    const data = this._dragData;

    if (
      data &&
      this.shouldStartDrag(
        data.pressX,
        data.pressY,
        event.clientX,
        event.clientY
      )
    ) {
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
    const target = event.target as HTMLElement;

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

    // Remove mousemove and mouseup listeners and start the drag.
    target.removeEventListener('mousemove', this.handleDragMove, true);
    target.removeEventListener('mouseup', this._evtMouseUp, true);

    return this._drag.start(clientX, clientY).then(() => {
      this.dragHoverStyleRemove(codeSnippet.id.toString());
      this._drag = null;
      this._dragData = null;
    });
  }

  private _evtMouseLeave(): void {
    //get rid of preview by clicking anything
    const preview = document.querySelector('.jp-preview');
    if (preview) {
      // if target is not the code snippet name area, then add inactive
      // if target area is the code snippet name area, previewSnippet widget will handle preview.
      if (!preview.classList.contains('inactive')) {
        preview.classList.add('inactive');
        for (const elem of document.getElementsByClassName('drag-hover')) {
          if (elem.classList.contains('drag-hover-clicked')) {
            elem.classList.remove('drag-hover-clicked');
          }
        }
        for (const item of document.getElementsByClassName(
          'codeSnippet-item'
        )) {
          if (item.classList.contains('codeSnippet-item-clicked')) {
            item.classList.remove('codeSnippet-item-clicked');
          }
        }
      }
    }
  }

  //Set the position of the preview to be next to the snippet title.
  private _setPreviewPosition(id: string): void {
    const intID = parseInt(id, 10);
    const realTarget = document.getElementsByClassName(
      'expandableContainer-title'
    )[intID];
    // distDown is the number of pixels to shift the preview down
    let distDown: number = realTarget.getBoundingClientRect().top - 40;
    if (realTarget.getBoundingClientRect().top > window.screen.height / 2) {
      distDown = distDown - 66;
    }
    const final = distDown.toString(10) + 'px';
    document.documentElement.style.setProperty('--preview-distance', final);
  }

  //Set the position of the option to be under to the three dots on snippet.
  private _setOptionsPosition(
    id: string,
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    let target = event.target as HTMLElement;
    let topAsString: string;
    console.log(target);
    console.log(target.getBoundingClientRect().top + 10);
    console.log(target.getBoundingClientRect().left);
    if (target.tagName === 'path') {
      topAsString =
        (target.getBoundingClientRect().top + 10).toString(10) + 'px';
    } else {
      topAsString =
        (target.getBoundingClientRect().top + 18).toString(10) + 'px';
    }
    const leftAsString =
      target.getBoundingClientRect().left.toString(10) + 'px';
    document.documentElement.style.setProperty(
      '--more-options-top',
      topAsString
    );
    document.documentElement.style.setProperty(
      '--more-options-left',
      leftAsString
    );
  }

  // Render display of code snippet list
  // To get the variety of color based on code length just append -long to CODE_SNIPPET_ITEM
  private renderCodeSnippet = (
    codeSnippet: ICodeSnippet,
    id: string
  ): JSX.Element => {
    const buttonClasses = [ELYRA_BUTTON_CLASS, BUTTON_CLASS].join(' ');
    const displayName = '[' + codeSnippet.language + '] ' + codeSnippet.name;
    const tags = codeSnippet.tags;
    console.log('Why are you not updating!!!');

    const actionButtons = [
      // {
      //   title: 'Copy',
      //   icon: copyIcon,
      //   onClick: (): void => {
      //     Clipboard.copyToSystem(codeSnippet.code.join('\n'));
      //   }
      // },
      {
        title: 'Insert',
        icon: insertIcon,
        onClick: (): void => {
          this.insertCodeSnippet(codeSnippet);
        }
      },
      {
        title: 'Launch Editor',
        icon: launchEditorIcon,
        onClick: (): void => {
          // showPreview(
          //   {
          //     id: parseInt(id, 10),
          //     title: displayName,
          //     body: new PreviewHandler(codeSnippet),
          //     codeSnippet: codeSnippet
          //   }
          //   );
          this.props.openCodeSnippetEditor(codeSnippet);
          // this.snippetClicked(id);
        }
      },
      {
        title: 'More options',
        icon: moreOptionsIcon,
        onClick: (
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          showMoreOptions({ body: new OptionsHandler(this, codeSnippet) });
          this._setOptionsPosition(id, event);
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
        onMouseEnter={(event): void => {
          showPreview(
            {
              id: parseInt(id, 10),
              title: displayName,
              body: new PreviewHandler(),
              codeSnippet: codeSnippet
            },
            this.props.openCodeSnippetEditor,
            this.props.editorServices
          );
          this.snippetClicked(id);
          this._setPreviewPosition(id);
        }}
        onMouseLeave={(): void => {
          this._evtMouseLeave();
        }}
      >
        <div
          className="drag-hover"
          title="Drag to move"
          id={id}
          onMouseDown={(event): void => {
            this.handleDragSnippet(event);
          }}
        ></div>
        <div className={'jp-codeSnippet-metadata'}>
          <div
            key={displayName}
            className={TITLE_CLASS}
            id={id}
            // onMouseOver={() => {
            //   this.dragHoverStyle(id);
            // }}
            // onMouseOut={() => {
            //   this.dragHoverStyleRemove(id);
            // }}
          >
            <div
              id={id}
              title={codeSnippet.name}
              className={DISPLAY_NAME_CLASS}
            >
              {this.boldNameOnSearch(this.state.searchValue, displayName)}
            </div>
            <div className={ACTION_BUTTONS_WRAPPER_CLASS} id={id}>
              {actionButtons.map((btn: IExpandableActionButton) => {
                return (
                  <button
                    key={btn.title}
                    title={btn.title}
                    className={buttonClasses + ' ' + ACTION_BUTTON_CLASS}
                    onClick={(event): void => {
                      if (btn.title === 'Copy') {
                        alert('saved to clipboard');
                      }
                      if (btn.title === 'More options') {
                        btn.onClick(event);
                      } else {
                        btn.onClick();
                      }
                    }}
                  >
                    <btn.icon.react
                      tag="span"
                      elementPosition="center"
                      width="21px"
                      height="21px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className={'jp-codeSnippet-description'} id={id}>
            <p id={id}>{`${codeSnippet.description}`}</p>
          </div>
          <div className={'jp-codeSnippet-tags'} id={id}>
            {tags ? tags.map((tag: string) => this.renderTag(tag, id)) : null}
          </div>
        </div>
      </div>
    );
  };

  private renderTag(tag: string, id: string): JSX.Element {
    return (
      <div
        className={'jp-codeSnippet-tag tag applied-tag'}
        key={tag + '-' + id}
      >
        <label>{tag}</label>
      </div>
    );
  }

  static getDerivedStateFromProps(
    props: ICodeSnippetDisplayProps,
    state: ICodeSnippetDisplayState
  ): ICodeSnippetDisplayState {
    if (props.codeSnippets !== state.codeSnippets && state.searchValue === '') {
      return {
        codeSnippets: props.codeSnippets,
        searchValue: ''
      };
    }
    return null;
  }

  searchSnippets = (searchValue: string): void => {
    const newSnippets = this.props.codeSnippets.filter(
      codeSnippet =>
        codeSnippet.name.includes(searchValue) ||
        codeSnippet.language.includes(searchValue)
    );
    this.setState(
      { codeSnippets: newSnippets, searchValue: searchValue },
      () => {
        console.log('CodeSnippets are successfully filtered.');
      }
    );
  };

  getActiveTags(): string[] {
    const tags: string[] = [];
    for (const codeSnippet of this.props.codeSnippets) {
      if (codeSnippet.tags) {
        tags.push(...codeSnippet.tags);
      }
    }
    return tags;
  }

  render(): React.ReactElement {
    return (
      <div>
        <header className={CODE_SNIPPETS_HEADER_CLASS}>
          <span className={'jp-codeSnippet-title'}>{'Snippets'}</span>
          <addIcon.react
            className={'jp-createSnippetBtn'}
            tag="span"
            right="7px"
            top="5px"
          />
        </header>
        <div className={'jp-codeSnippet-tools'}>
          <SearchBar onSearch={this.searchSnippets} />
          <FilterSnippet tags={this.getActiveTags()} />
        </div>
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

class OptionsHandler extends Widget {
  constructor(object: any, codeSnippet: ICodeSnippet) {
    super({ node: Private.createOptionsNode(object, codeSnippet) });
  }
}

class PreviewHandler extends Widget {
  constructor() {
    super({ node: Private.createPreviewNode() });
  }
}

class Private {
  static createPreviewContent(): HTMLElement {
    const body = document.createElement('div');
    return body;
  }
  /**
   * Create structure for preview of snippet data.
   */
  static createPreviewNode(): HTMLElement {
    return this.createPreviewContent();
  }

  static createOptionsNode(
    object: any,
    codeSnippet: ICodeSnippet
  ): HTMLElement {
    const body = document.createElement('div');

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'jp-more-options-content';
    const insertSnip = document.createElement('div');
    insertSnip.className = 'jp-more-options-insert';
    insertSnip.textContent = 'Insert snippet';
    insertSnip.onclick = (): void => {
      object.insertCodeSnippet(codeSnippet);
    };
    const copySnip = document.createElement('div');
    copySnip.className = 'jp-more-options-copy';
    copySnip.textContent = 'Copy snippet to clipboard';
    const editSnip = document.createElement('div');
    editSnip.className = 'jp-more-options-edit';
    editSnip.textContent = 'Edit snippet';
    const deleteSnip = document.createElement('div');
    deleteSnip.className = 'jp-more-options-delete';
    deleteSnip.textContent = 'Delete snippet';
    optionsContainer.appendChild(insertSnip);
    optionsContainer.appendChild(copySnip);
    optionsContainer.appendChild(editSnip);
    optionsContainer.appendChild(deleteSnip);
    body.append(optionsContainer);
    return body;
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
