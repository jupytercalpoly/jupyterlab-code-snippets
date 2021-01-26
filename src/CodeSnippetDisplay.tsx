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

import { Clipboard, Dialog, showDialog } from '@jupyterlab/apputils';
import { PathExt } from '@jupyterlab/coreutils';
import { DocumentWidget } from '@jupyterlab/docregistry';
import { FileEditor } from '@jupyterlab/fileeditor';
import { Notebook, NotebookPanel } from '@jupyterlab/notebook';
import {
  LabIcon,
  addIcon,
  pythonIcon,
  fileIcon,
  rKernelIcon
} from '@jupyterlab/ui-components';
import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import * as nbformat from '@jupyterlab/nbformat';
import { JupyterFrontEnd } from '@jupyterlab/application';
import {
  Cell,
  CodeCellModel,
  ICodeCellModel,
  MarkdownCell,
  CodeCell
} from '@jupyterlab/cells';

import { Widget } from '@lumino/widgets';
import { find, StringExt } from '@lumino/algorithm';
import { Drag } from '@lumino/dragdrop';
import { MimeData } from '@lumino/coreutils';

import React from 'react';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';
import { FilterTools } from './FilterTools';
import { showPreview } from './PreviewSnippet';
import { showMoreOptions } from './MoreOptions';
import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

import moreSVGstr from '../style/icon/jupyter_moreicon.svg';
import {
  babelIcon,
  javaIcon,
  juliaIcon,
  matlabIcon,
  schemeIcon,
  processingIcon,
  scalaIcon,
  groovyIcon,
  forthIcon,
  haskellIcon,
  rubyIcon,
  typescriptIcon,
  javascriptIcon,
  coffeescriptIcon,
  livescriptIcon,
  csharpIcon,
  fsharpIcon,
  goIcon,
  erlangIcon,
  ocamlIcon,
  fortranIcon,
  perlIcon,
  phpIcon,
  clojureIcon,
  luaIcon,
  purescriptIcon,
  cppIcon,
  prologIcon,
  lispIcon,
  cIcon,
  kotlinIcon,
  nodejsIcon,
  coconutIcon,
  sbtIcon,
  rustIcon,
  qsharpIcon,
  sasIcon
} from './CodeSnippetLanguages';

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
const DRAG_THRESHOLD = 3;

/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'jp-codeSnippet-item';

/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';

/**
 * Icon for more options
 */
const moreOptionsIcon = new LabIcon({
  name: 'custom-ui-components:moreOptions',
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
  matchIndices: number[][];
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
      matchIndices: [],
      searchValue: '',
      filterTags: []
    };
    this._drag = null;
    this._dragData = null;
    this.handleDragMove = this.handleDragMove.bind(this);
    this._evtMouseUp = this._evtMouseUp.bind(this);
    this.handleRenameSnippet = this.handleRenameSnippet.bind(this);
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

  // Create 6 dots drag/drop image on hover
  private dragHoverStyle = (id: number): void => {
    document
      .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
      [id].classList.add(CODE_SNIPPET_DRAG_HOVER_SELECTED);
  };

  // Remove 6 dots off hover
  private dragHoverStyleRemove = (id: number): void => {
    if (document.getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)) {
      document
        .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
        [id].classList.remove(CODE_SNIPPET_DRAG_HOVER_SELECTED);
    }
  };

  // Bold text in snippet name based on search
  private boldNameOnSearch = (
    id: number,
    language: string,
    name: string
  ): JSX.Element => {
    const displayName = language + name;

    // check if the searchValue is not ''
    if (this.state.searchValue !== '') {
      const elements = [];
      const boldIndices = this.state.matchIndices[id].slice();

      // get first match index in the name
      let i = 0;
      while (i < boldIndices.length) {
        if (boldIndices[i] >= language.length) {
          elements.push(displayName.substring(language.length, boldIndices[i]));
          break;
        }
        i++;
      }

      // when there is no match in name but language
      if (i >= boldIndices.length) {
        return <span>{name}</span>;
      } else {
        // current and next indices are bold indices
        let currIndex = boldIndices[i];
        let nextIndex;
        // check if the match is the end of the name
        if (i < boldIndices.length - 1) {
          i++;
          nextIndex = boldIndices[i];
        } else {
          nextIndex = null;
        }
        while (nextIndex !== null) {
          // make the current index bold
          elements.push(
            <mark key={id + '_' + currIndex} className={SEARCH_BOLD}>
              {displayName.substring(currIndex, currIndex + 1)}
            </mark>
          );
          // add the regular string until we reach the next bold index
          elements.push(displayName.substring(currIndex + 1, nextIndex));
          currIndex = nextIndex;
          if (i < boldIndices.length - 1) {
            i++;
            nextIndex = boldIndices[i];
          } else {
            nextIndex = null;
          }
        }
        if (nextIndex === null) {
          elements.push(
            <mark key={id + '_' + currIndex} className={SEARCH_BOLD}>
              {displayName.substring(currIndex, currIndex + 1)}
            </mark>
          );
          elements.push(
            displayName.substring(currIndex + 1, displayName.length)
          );
        }
        return <span>{elements}</span>;
      }
    }
    return <span onDoubleClick={this.handleRenameSnippet}>{name}</span>;
  };

  // rename snippet on double click
  // TODO: duplicate name check!
  private async handleRenameSnippet(
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ): Promise<void> {
    const contentsService = CodeSnippetContentsService.getInstance();
    const target = event.target as HTMLElement;
    const oldPath = 'snippets/' + target.innerHTML + '.json';

    const new_element = document.createElement('input');
    new_element.setAttribute('type', 'text');
    new_element.id = 'jp-codeSnippet-rename';
    new_element.innerHTML = target.innerHTML;

    target.replaceWith(new_element);
    new_element.value = target.innerHTML;

    new_element.focus();
    new_element.setSelectionRange(0, new_element.value.length);

    new_element.onblur = async (): Promise<void> => {
      if (target.innerHTML !== new_element.value) {
        const newPath = 'snippets/' + new_element.value + '.json';
        try {
          await contentsService.rename(oldPath, newPath);
        } catch (error) {
          new_element.replaceWith(target);

          await showDialog({
            title: 'Duplicate Name of Code Snippet',
            body: <p> {`"${newPath}" already exists.`} </p>,
            buttons: [Dialog.okButton({ label: 'Dismiss' })]
          });
          return;
        }
        this.props._codeSnippetWidgetModel.renameSnippet(
          target.innerHTML,
          new_element.value
        );
        target.innerHTML = new_element.value;
      }
      new_element.replaceWith(target);
    };
    new_element.onkeydown = (event: KeyboardEvent): void => {
      switch (event.code) {
        case 'Enter' || 'NumpadEnter': // Enter
          event.stopPropagation();
          event.preventDefault();
          new_element.blur();
          break;
        case 'Escape': // Escape
          event.stopPropagation();
          event.preventDefault();
          new_element.blur();
          break;
        case 'ArrowUp': // Up arrow
          event.stopPropagation();
          event.preventDefault();
          new_element.selectionStart = new_element.selectionEnd = 0;
          break;
        case 'ArrowDown': // Down arrow
          event.stopPropagation();
          event.preventDefault();
          new_element.selectionStart = new_element.selectionEnd =
            new_element.value.length;
          break;
        default:
          break;
      }
    };
  }

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

    // since a browser has its own drag'n'drop support for images and some other elements.
    target.ondragstart = (): boolean => false;

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
    event.preventDefault();
    event.stopPropagation();

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

      void this.startDrag(
        data.dragImage,
        codeSnippet,
        event.clientX,
        event.clientY
      );
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
    return dx >= 0 || dy >= DRAG_THRESHOLD;
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
      this.dragHoverStyleRemove(codeSnippet.id);
      this._drag = null;
      this._dragData = null;
    });
  }

  private _evtMouseLeave(): void {
    const preview = document.querySelector('.jp-codeSnippet-preview');
    if (preview) {
      if (!preview.classList.contains('inactive')) {
        preview.classList.add('inactive');
      }
    }
  }

  //Set the position of the preview to be next to the snippet title.

  private _setPreviewPosition(id: number): void {
    const realTarget = document.getElementsByClassName(TITLE_CLASS)[id];
    const newTarget = document.getElementsByClassName(CODE_SNIPPET_ITEM)[id];
    // distDown is the number of pixels to shift the preview down
    const distDown: number = realTarget.getBoundingClientRect().top - 43; //this is bumping it up
    const elementSnippet = newTarget as HTMLElement;
    const heightSnippet = elementSnippet.clientHeight;
    const heightPreview = heightSnippet.toString(10) + 'px';
    document.documentElement.style.setProperty(
      '--preview-max-height',
      heightPreview
    );
    // if (realTarget.getBoundingClientRect().top > window.screen.height / 2) {
    //   distDown = distDown - 66; //this is bumping it up further if it's close to the end of the screen
    // }
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

  private renderLanguageIcon(language: string): JSX.Element {
    switch (language) {
      case 'Python': {
        return (
          <pythonIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Java': {
        return (
          <javaIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'R': {
        return (
          <rKernelIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Julia': {
        return (
          <juliaIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Matlab': {
        return (
          <matlabIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Scheme': {
        return (
          <schemeIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Processing': {
        return (
          <processingIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Scala': {
        return (
          <scalaIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Groovy': {
        return (
          <groovyIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Fortran': {
        return (
          <fortranIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Haskell': {
        return (
          <haskellIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Ruby': {
        return (
          <rubyIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'TypeScript': {
        return (
          <typescriptIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'JavaScript': {
        return (
          <javascriptIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'CoffeeScript': {
        return (
          <coffeescriptIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'LiveScript': {
        return (
          <livescriptIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'C#': {
        return (
          <csharpIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'F#': {
        return (
          <fsharpIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Go': {
        return (
          <goIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Erlang': {
        return (
          <erlangIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'OCaml': {
        return (
          <ocamlIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Forth': {
        return (
          <forthIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Perl': {
        return (
          <perlIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'PHP': {
        return (
          <phpIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Clojure': {
        return (
          <clojureIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Lua': {
        return (
          <luaIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'PureScript': {
        return (
          <purescriptIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'C++': {
        return (
          <cppIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Prolog': {
        return (
          <prologIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Common Lisp': {
        return (
          <lispIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'C': {
        return (
          <cIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Kotlin': {
        return (
          <kotlinIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'NodeJS': {
        return (
          <nodejsIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Coconut': {
        return (
          <coconutIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Babel': {
        return (
          <babelIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'SAS': {
        return (
          <sasIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'sbt': {
        return (
          <sbtIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Rust': {
        return (
          <rustIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      case 'Q#': {
        return (
          <qsharpIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
      default: {
        return (
          <fileIcon.react
            tag="span"
            height="16px"
            width="16px"
            right="7px"
            top="5px"
            margin-right="3px"
          />
        );
      }
    }
  }

  // Render display of code snippet list
  private renderCodeSnippet = (
    codeSnippet: ICodeSnippet,
    id: number
  ): JSX.Element => {
    const buttonClasses = BUTTON_CLASS;
    const displayName = '[' + codeSnippet.language + '] ' + codeSnippet.name;
    const name = codeSnippet.name;
    const language = codeSnippet.language;

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
    return (
      <div
        key={codeSnippet.name}
        className={CODE_SNIPPET_ITEM}
        id={id.toString()}
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
          id={id.toString()}
          onMouseDown={(event): void => {
            this.handleDragSnippet(event);
          }}
        ></div>
        <div
          className={CODE_SNIPPET_METADATA}
          onMouseEnter={(): void => {
            showPreview(
              {
                id: id,
                title: displayName,
                body: new PreviewHandler(),
                codeSnippet: codeSnippet
              },
              this.props.editorServices
            );
            this._setPreviewPosition(id);
          }}
          onMouseLeave={(): void => {
            this._evtMouseLeave();
          }}
        >
          <div key={displayName} className={TITLE_CLASS} id={id.toString()}>
            <div id={id.toString()} title={name} className={DISPLAY_NAME_CLASS}>
              {this.renderLanguageIcon(language)}
              {this.boldNameOnSearch(id, language, name)}
            </div>
            <div className={ACTION_BUTTONS_WRAPPER_CLASS} id={id.toString()}>
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
                      width="16px"
                      height="16px"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className={CODE_SNIPPET_DESC} id={id.toString()}>
            <p id={id.toString()}>{`${codeSnippet.description}`}</p>
          </div>
        </div>
      </div>
    );
  };

  static getDerivedStateFromProps(
    props: ICodeSnippetDisplayProps,
    state: ICodeSnippetDisplayState
  ): ICodeSnippetDisplayState {
    if (state.searchValue === '' && state.filterTags.length === 0) {
      return {
        codeSnippets: props.codeSnippets,
        matchIndices: [],
        searchValue: '',
        filterTags: []
      };
    }

    if (state.searchValue !== '' || state.filterTags.length !== 0) {
      // const newSnippets = props.codeSnippets.filter(codeSnippet => {
      //   return (
      //     state.matchIndices[codeSnippet.id] !== null ||
      //     // (state.searchValue !== '' &&
      //     //   codeSnippet.name.toLowerCase().includes(state.searchValue)) ||
      //     // (state.searchValue !== '' &&
      //     //   codeSnippet.language.toLowerCase().includes(state.searchValue)) ||
      //     (codeSnippet.tags &&
      //       codeSnippet.tags.some(tag => state.filterTags.includes(tag)))
      //   );
      // });
      return {
        codeSnippets: state.codeSnippets,
        matchIndices: state.matchIndices,
        searchValue: state.searchValue,
        filterTags: state.filterTags
      };
    }
    return null;
  }

  filterSnippets = (searchValue: string, filterTags: string[]): void => {
    // filter with search
    let matchIndices: number[][] = [];
    const matchResults: StringExt.IMatchResult[] = [];
    let filteredSnippets = this.props.codeSnippets;
    const filteredSnippetsScore: {
      score: number;
      snippet: ICodeSnippet;
    }[] = [];
    if (searchValue !== '') {
      filteredSnippets.forEach(snippet => {
        const matchResult = StringExt.matchSumOfSquares(
          (snippet.language + snippet.name).toLowerCase(),
          searchValue.replace(' ', '').toLowerCase()
        );

        if (matchResult) {
          matchResults.push(matchResult);
          filteredSnippetsScore.push({
            score: matchResult.score,
            snippet: snippet
          });
        }
      });

      // sort snippets by its score
      filteredSnippetsScore.sort((a, b) => a.score - b.score);
      const newFilteredSnippets: ICodeSnippet[] = [];
      filteredSnippetsScore.forEach(snippetScore =>
        newFilteredSnippets.push(snippetScore.snippet)
      );
      filteredSnippets = newFilteredSnippets;

      // sort the matchResults by its score
      matchResults.sort((a, b) => a.score - b.score);
      matchResults.forEach(res => matchIndices.push(res.indices));
    }

    // filter with tags
    if (filterTags.length !== 0) {
      const newMatchIndices = matchIndices.slice();
      filteredSnippets = filteredSnippets.filter((codeSnippet, id) => {
        return filterTags.some(tag => {
          if (codeSnippet.tags) {
            if (codeSnippet.tags.includes(tag)) {
              return true;
            }
          }
          // if the snippet does not have the tag, remove its mathed index
          const matchedIndex = matchIndices[id];
          const indexToDelete = newMatchIndices.indexOf(matchedIndex);
          newMatchIndices.splice(indexToDelete, 1);
          return false;
        });
      });
      matchIndices = newMatchIndices;
    }

    this.setState(
      {
        codeSnippets: filteredSnippets,
        matchIndices: matchIndices,
        searchValue: searchValue,
        filterTags: filterTags
      },
      () => {
        console.log('snippets filtered');
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

        // deleting snippets when there is one snippet active
        contentsService.delete('snippets/' + codeSnippet.name + '.json');
        this.props._codeSnippetWidgetModel.deleteSnippet(codeSnippet.id);
        this.props._codeSnippetWidgetModel.reorderSnippet();
        this.props._codeSnippetWidgetModel.updateSnippetContents();

        // active tags after delete
        const activeTags = this.getActiveTags();

        // filterTags: only the tags that are still being used
        this.setState(state => ({
          codeSnippets: this.props._codeSnippetWidgetModel.snippets,
          filterTags: state.filterTags.filter(tag => activeTags.includes(tag))
        }));
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
              this.renderCodeSnippet(codeSnippet, id)
            )}
          </div>
        </div>
      </div>
    );
  }
}

class OptionsHandler extends Widget {
  constructor(display: CodeSnippetDisplay, codeSnippet: ICodeSnippet) {
    super({ node: display.createOptionsNode(codeSnippet) });
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
