import { Clipboard, Dialog, showDialog } from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import { PathExt } from '@jupyterlab/coreutils';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { LabIcon, addIcon } from '@jupyterlab/ui-components';
import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import * as nbformat from '@jupyterlab/nbformat';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { Cell, CodeCellModel, ICodeCellModel } from '@jupyterlab/cells';

import { Widget } from '@lumino/widgets';
import { find } from '@lumino/algorithm';
import { Drag } from '@lumino/dragdrop';
import { MimeData } from '@lumino/coreutils';

import React from 'react';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';
import { FilterTools } from './FilterTools';
import moreSVGstr from '../style/icon/jupyter_moreicon.svg';
import { showPreview } from './PreviewSnippet';
import { showMoreOptions } from './MoreOptions';
import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_HEADER_CLASS = 'jp-codeSnippetsHeader';
const CODE_SNIPPET_TITLE = 'jp-codeSnippet-title';
const CODE_SNIPPETS_CONTAINER = 'jp-codeSnippetsContainer';
const DISPLAY_NAME_CLASS = 'jp-codeSnippetsContainer-name';
const BUTTON_CLASS = 'jp-codeSnippetsContainer-button';
const TITLE_CLASS = 'jp-codeSnippetsContainer-title';
const ACTION_BUTTONS_WRAPPER_CLASS = 'jp-codeSnippetsContainer-action-buttons';
const ACTION_BUTTON_CLASS = 'jp-codeSnippetsContainer-actionButton';
const SEARCH_BOLD = 'jp-codeSnippet-search-bolding';
const SNIPPET_DRAG_IMAGE = 'jp-codeSnippet-drag-image';
const CODE_SNIPPET_DRAG_HOVER = 'jp-codeSnippet-drag-hover';
const CODE_SNIPPET_DRAG_HOVER_CLICKED = 'jp-codeSnippet-drag-hover-clicked';
const CODE_SNIPPET_DRAG_HOVER_SELECTED = 'jp-codeSnippet-drag-hover-selected';
const CODE_SNIPPET_METADATA = 'jp-codeSnippet-metadata';
const CODE_SNIPPET_DESC = 'jp-codeSnippet-description';
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_MORE_OPTIONS = 'jp-codeSnippet-options';
const CODE_SNIPPET_MORE_OTPIONS_CONTENT = 'jp-codeSnippet-more-options-content';
const CODE_SNIPPET_MORE_OTPIONS_COPY = 'jp-codeSnippet-more-options-copy';
const CODE_SNIPPET_MORE_OTPIONS_INSERT = 'jp-codeSnippet-more-options-insert';
const CODE_SNIPPET_MORE_OTPIONS_EDIT = 'jp-codeSnippet-more-options-edit';
const CODE_SNIPPET_MORE_OTPIONS_DELETE = 'jp-codeSnippet-more-options-delete';
const CODE_SNIPPET_CREATE_NEW_BTN = 'jp-createSnippetBtn';

/**
 * The threshold in pixels to start a drag event.
 */
const DRAG_THRESHOLD = 5;

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'jp-codeSnippet-item';
const CODE_SNIPPET_ITEM_CLICKED = 'jp-codeSnippet-item-clicked';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * Icon for more options
 */
const moreOptionsIcon = new LabIcon({
  name: 'custom-ui-compnents:moreOptions',
  svgstr: moreSVGstr
});

/**
 * CodeSnippetDisplay props.
 */
interface ICodeSnippetDisplayProps {
  codeSnippets: ICodeSnippet[];
  app: JupyterFrontEnd;
  getCurrentWidget: () => Widget;
  openCodeSnippetEditor: (args: any) => void;
  editorServices: IEditorServices;
  _codeSnippetWidgetModel: CodeSnippetWidgetModel;
  updateCodeSnippets: () => void;
}

/**
 * CodeSnippetDisplay state.
 */
interface ICodeSnippetDisplayState {
  codeSnippets: ICodeSnippet[];
  searchValue: string;
  filterTags: string[];
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
    this.state = {
      codeSnippets: this.props.codeSnippets,
      searchValue: '',
      filterTags: []
    };
    this._drag = null;
    this._dragData = null;
    this.handleDragMove = this.handleDragMove.bind(this);
    this._evtMouseUp = this._evtMouseUp.bind(this);
  }

  // Handle code snippet insert into an editor
  private insertCodeSnippet = async (snippet: ICodeSnippet): Promise<void> => {
    const widget: Widget = this.props.getCurrentWidget();
    const snippetStr: string = snippet.code.join('\n');

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

  // Insert 6 dots on hover
  private dragHoverStyle = (id: string): void => {
    const _id: number = parseInt(id, 10);

    document
      .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
      [_id].classList.add(CODE_SNIPPET_DRAG_HOVER_SELECTED);
  };

  // Remove 6 dots off hover
  private dragHoverStyleRemove = (id: string): void => {
    const _id: number = parseInt(id, 10);
    if (document.getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)) {
      document
        .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
        [_id].classList.remove(CODE_SNIPPET_DRAG_HOVER_SELECTED);
    }
  };

  // Grey out snippet and include blue six dots when snippet is previewing (clicked)
  private snippetClicked = (id: string): void => {
    const _id: number = parseInt(id, 10);

    if (
      document
        .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
        [_id].classList.contains(CODE_SNIPPET_DRAG_HOVER_CLICKED)
    ) {
      document
        .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
        [_id].classList.remove(CODE_SNIPPET_DRAG_HOVER_CLICKED);
    } else {
      document
        .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
        [_id].classList.add(CODE_SNIPPET_DRAG_HOVER_CLICKED);
    }
  };

  // Bold text in snippet name based on search
  private boldNameOnSearch = (
    filter: string,
    displayed: string
  ): JSX.Element => {
    const name: string = displayed;
    if (
      filter !== '' &&
      displayed.toLowerCase().includes(filter.toLowerCase())
    ) {
      const startIndex: number = name
        .toLowerCase()
        .indexOf(filter.toLowerCase());
      const endIndex: number = startIndex + filter.length;
      const start = name.substring(0, startIndex);
      const bolded = name.substring(startIndex, endIndex);
      const end = name.substring(endIndex);
      return (
        <span>
          {start}
          <mark className={SEARCH_BOLD}>{bolded}</mark>
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
      dragImage: target.nextSibling.firstChild.cloneNode(true) as HTMLElement
    };

    const dragImageTextColor = getComputedStyle(document.body).getPropertyValue(
      '--jp-content-font-color3'
    );

    (this._dragData.dragImage
      .children[0] as HTMLElement).style.color = dragImageTextColor;

    // add CSS style
    this._dragData.dragImage.classList.add(SNIPPET_DRAG_IMAGE);
    target.addEventListener('mouseup', this._evtMouseUp, true);
    target.addEventListener('mousemove', this.handleDragMove, true);

    event.preventDefault();
  }

  private _evtMouseUp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    target.removeEventListener('mousemove', this.handleDragMove, true);

    target.removeEventListener('mouseup', this._evtMouseUp, true);
  }

  private handleDragMove(event: MouseEvent): void {
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
    const preview = document.querySelector('.jp-codeSnippet-preview');
    if (preview) {
      // if target is not the code snippet name area, then add inactive
      // if target area is the code snippet name area, previewSnippet widget will handle preview.
      if (!preview.classList.contains('inactive')) {
        preview.classList.add('inactive');
        for (const elem of document.getElementsByClassName(
          CODE_SNIPPET_DRAG_HOVER
        )) {
          if (elem.classList.contains(CODE_SNIPPET_DRAG_HOVER_CLICKED)) {
            elem.classList.remove(CODE_SNIPPET_DRAG_HOVER_CLICKED);
          }
        }
        for (const item of document.getElementsByClassName(CODE_SNIPPET_ITEM)) {
          if (item.classList.contains(CODE_SNIPPET_ITEM_CLICKED)) {
            item.classList.remove(CODE_SNIPPET_ITEM_CLICKED);
          }
        }
      }
    }
  }

  //Set the position of the preview to be next to the snippet title.
  private _setPreviewPosition(id: string): void {
    const intID = parseInt(id, 10);
    const realTarget = document.getElementsByClassName(TITLE_CLASS)[intID];
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
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const target = event.target as HTMLElement;
    let top: number;
    if (target.tagName === 'path') {
      top = target.getBoundingClientRect().top + 10;
    } else {
      top = target.getBoundingClientRect().top + 18;
    }
    if (top > 0.7 * window.screen.height) {
      top -= 120;
    }
    const leftAsString =
      target.getBoundingClientRect().left.toString(10) + 'px';
    const topAsString = top.toString(10) + 'px';
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
    const buttonClasses = BUTTON_CLASS;
    const displayName = '[' + codeSnippet.language + '] ' + codeSnippet.name;

    const actionButtons = [
      {
        title: 'Insert, copy, edit, and delete',
        icon: moreOptionsIcon,
        onClick: (
          event: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ): void => {
          showMoreOptions({ body: new OptionsHandler(this, codeSnippet) });
          this._setOptionsPosition(event);
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
          className={CODE_SNIPPET_DRAG_HOVER}
          title="Drag to move"
          id={id}
          onMouseDown={(event): void => {
            this.handleDragSnippet(event);
          }}
        ></div>
        <div
          className={CODE_SNIPPET_METADATA}
          onMouseEnter={(): void => {
            showPreview(
              {
                id: parseInt(id, 10),
                title: displayName,
                body: new PreviewHandler(),
                codeSnippet: codeSnippet
              },
              this.props.editorServices
            );
            this.snippetClicked(id);
            this._setPreviewPosition(id);
          }}
          onMouseLeave={(): void => {
            this._evtMouseLeave();
          }}
        >
          <div key={displayName} className={TITLE_CLASS} id={id}>
            <div
              id={id}
              title={codeSnippet.name}
              className={DISPLAY_NAME_CLASS}
            >
              {this.boldNameOnSearch(this.state.searchValue, displayName)}
            </div>
            <div className={ACTION_BUTTONS_WRAPPER_CLASS} id={id}>
              {actionButtons.map(btn => {
                return (
                  <button
                    key={btn.title}
                    title={btn.title}
                    className={buttonClasses + ' ' + ACTION_BUTTON_CLASS}
                    onClick={(
                      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
                    ): void => {
                      btn.onClick(event);
                    }}
                  >
                    <btn.icon.react
                      tag="span"
                      elementPosition="center"
                      // right="7px"
                      // top="5px"
                      width="16px"
                      height="16px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className={CODE_SNIPPET_DESC} id={id}>
            <p id={id}>{`${codeSnippet.description}`}</p>
          </div>
          {/* <div className={'jp-codeSnippet-tags'}>
            {tags ? tags.map((tag: string) => this.renderTag(tag, id)) : null}
          </div> */}
        </div>
      </div>
    );
  };

  // private renderTag(tag: string, id: string): JSX.Element {
  //   return (
  //     <div className={'tag applied-tag'} key={tag + '-' + id}>
  //       <label className={'tag-header'}>{tag}</label>
  //     </div>
  //   );
  // }

  static getDerivedStateFromProps(
    props: ICodeSnippetDisplayProps,
    state: ICodeSnippetDisplayState
  ): ICodeSnippetDisplayState {
    console.log(props.codeSnippets);
    console.log(state.codeSnippets);
    // console.log(state.searchValue);
    // console.log(state.filterTags === []);
    if (
      props.codeSnippets !== state.codeSnippets &&
      state.searchValue === '' &&
      state.filterTags.length === 0
    ) {
      return {
        codeSnippets: props.codeSnippets,
        searchValue: '',
        filterTags: []
      };
    }
    return null;
  }

  filterSnippets = (searchValue: string, filterTags: string[]): void => {
    // filter with search
    let filteredSnippets = this.props.codeSnippets.filter(
      codeSnippet =>
        codeSnippet.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        codeSnippet.language.toLowerCase().includes(searchValue.toLowerCase())
    );

    // filter with tags
    if (filterTags.length !== 0) {
      filteredSnippets = filteredSnippets.filter(codeSnippet => {
        return filterTags.some(tag => {
          if (codeSnippet.tags) {
            return codeSnippet.tags.includes(tag);
          }
          return false;
        });
      });
    }

    this.setState(
      {
        codeSnippets: filteredSnippets,
        searchValue: searchValue,
        filterTags: filterTags
      },

      // { codeSnippets: newSnippets, searchValue: this.state.searchValue },
      () => {
        console.log('CodeSnippets are succesfully filtered.');
      }
    );
  };

  getActiveTags(): string[] {
    const tags: string[] = [];
    for (const codeSnippet of this.props.codeSnippets) {
      if (codeSnippet.tags) {
        for (const tag of codeSnippet.tags) {
          if (!tags.includes(tag)) {
            tags.push(tag);
          }
        }
      }
    }
    return tags;
  }

  private deleteCommand(codeSnippet: ICodeSnippet): void {
    const contentsService = CodeSnippetContentsService.getInstance();
    showDialog({
      title: 'Delete snippet?',
      body: 'Are you sure you want to delete "' + codeSnippet.name + '"? ',
      buttons: [
        Dialog.okButton({
          label: 'Delete',
          displayType: 'warn'
        }),
        Dialog.cancelButton()
      ]
    }).then((response: any): void => {
      if (response.button.accept) {
        const widgetId = `${CODE_SNIPPET_EDITOR}-${codeSnippet.id}`;
        const editor = find(
          this.props.app.shell.widgets('main'),
          (widget: Widget, _: number) => {
            return widget.id === widgetId;
          }
        );

        if (editor) {
          editor.dispose();
        }

        contentsService.delete('snippets/' + codeSnippet.name + '.json');
        this.props._codeSnippetWidgetModel.deleteSnippet(codeSnippet.id);
        this.props._codeSnippetWidgetModel.updateSnippetContents();
        this.setState({
          codeSnippets: this.props._codeSnippetWidgetModel.snippets
        });
      }
    });
  }

  // remove dropdown menu
  private removeOptionsNode(): void {
    const temp = document.getElementsByClassName(CODE_SNIPPET_MORE_OPTIONS)[0];
    if (!temp.classList.contains('inactive')) {
      temp.classList.add('inactive');
    }
  }

  // create dropdown menu
  public createOptionsNode(codeSnippet: ICodeSnippet): HTMLElement {
    const body = document.createElement('div');

    const optionsContainer = document.createElement('div');
    optionsContainer.className = CODE_SNIPPET_MORE_OTPIONS_CONTENT;
    const insertSnip = document.createElement('div');
    insertSnip.className = CODE_SNIPPET_MORE_OTPIONS_INSERT;
    insertSnip.textContent = 'Insert snippet';
    insertSnip.onclick = (): void => {
      this.insertCodeSnippet(codeSnippet);
      this.removeOptionsNode();
    };
    const copySnip = document.createElement('div');
    copySnip.className = CODE_SNIPPET_MORE_OTPIONS_COPY;
    copySnip.textContent = 'Copy snippet to clipboard';
    copySnip.onclick = (): void => {
      Clipboard.copyToSystem(codeSnippet.code.join('\n'));
      alert('saved to clipboard');
      this.removeOptionsNode();
    };
    const editSnip = document.createElement('div');
    editSnip.className = CODE_SNIPPET_MORE_OTPIONS_EDIT;
    editSnip.textContent = 'Edit snippet';
    editSnip.onclick = (): void => {
      console.log(codeSnippet);
      const allTags = this.getActiveTags();
      this.props.openCodeSnippetEditor({
        name: codeSnippet.name,
        description: codeSnippet.description,
        language: codeSnippet.language,
        code: codeSnippet.code,
        id: codeSnippet.id,
        selectedTags: codeSnippet.tags,
        allTags: allTags,
        fromScratch: false
      });
      this.removeOptionsNode();
    };
    const deleteSnip = document.createElement('div');
    deleteSnip.className = CODE_SNIPPET_MORE_OTPIONS_DELETE;
    deleteSnip.textContent = 'Delete snippet';
    deleteSnip.onclick = (): void => {
      this.deleteCommand(codeSnippet);
      this.removeOptionsNode();
    };
    optionsContainer.appendChild(insertSnip);
    optionsContainer.appendChild(copySnip);
    optionsContainer.appendChild(editSnip);
    optionsContainer.appendChild(deleteSnip);
    body.append(optionsContainer);
    return body;
  }

  render(): React.ReactElement {
    return (
      <div>
        <header className={CODE_SNIPPETS_HEADER_CLASS}>
          <span className={CODE_SNIPPET_TITLE}>{'Snippets'}</span>
          <button
            className={CODE_SNIPPET_CREATE_NEW_BTN}
            onClick={(): void => {
              this.props.openCodeSnippetEditor({
                name: '',
                description: '',
                language: 'Python',
                code: [],
                id: -1,
                allTags: this.getActiveTags(),
                fromScratch: true
              });
            }}
          >
            <addIcon.react tag="span" right="7px" top="5px" />
          </button>
        </header>
        <FilterTools
          tags={this.getActiveTags()}
          onFilter={this.filterSnippets}
        />
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
  constructor(object: CodeSnippetDisplay, codeSnippet: ICodeSnippet) {
    super({ node: object.createOptionsNode(codeSnippet) });
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
