import insertSVGstr from '../style/icon/insertsnippet.svg';
import { SearchBar } from './SearchBar';
import { showPreview } from './PreviewSnippet';
import {
  ICodeSnippet,
  CodeSnippetContentsService
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

import React from 'react';

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
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'elyra-codeSnippet-item';

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
export class CodeSnippetDisplay extends React.Component<
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
    const name = snippet.name;
    // const url = 'elyra/metadata/code-snippets/' + name;

    CodeSnippetContentsService.getInstance().delete(
      'snippets/' + name + '.json'
    );

    // const settings = ServerConnection.makeSettings();
    // const requestUrl = URLExt.join(settings.baseUrl, url);

    // await ServerConnection.makeRequest(
    //   requestUrl,
    //   { method: 'DELETE' },
    //   settings
    // );

    this.props.onDelete(snippet);
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
    ];
    /** TODO: if the type is a cell then display cell */
    // type of code snippet: plain code or cell
    return (
      <div
        key={codeSnippet.name}
        className={CODE_SNIPPET_ITEM}
        id={
          id
        } /*onMouseOver={() => {
        this.dragHoverStyle(id);
      }} onMouseOut={() => { this.dragHoverStyleRemove(id); }}*/
      >
        <div className="drag-hover" id={id}></div>
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
            onMouseOver={(): void => {
              this.dragHoverStyle(id);
            }}
            onMouseOut={(): void => {
              this.dragHoverStyleRemove(id);
            }}
          >
            <span
              id={id}
              title={codeSnippet.displayName}
              className={DISPLAY_NAME_CLASS}
              onClick={(): void => {
                showPreview({
                  id: parseInt(id, 10),
                  title: displayName,
                  body: new PreviewHandler(codeSnippet)
                });
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
