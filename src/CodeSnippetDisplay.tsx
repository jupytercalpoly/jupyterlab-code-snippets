import insertSVGstr from '../style/icon/insertsnippet.svg';
import { SearchBar } from './SearchBar';
import { showPreview } from './PreviewSnippet';
import { ICodeSnippet } from './CodeSnippetService';
import { CodeSnippetWidget } from './CodeSnippetWidget';

import { Clipboard, Dialog, showDialog } from '@jupyterlab/apputils';
import { CodeCell, MarkdownCell } from '@jupyterlab/cells';
import { CodeEditor } from '@jupyterlab/codeeditor';
import { PathExt, URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
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
    console.log(this.props.getCurrentWidget instanceof CodeSnippetWidget);
    console.log(snippet);
    const name = snippet.name;
    const url = 'elyra/metadata/code-snippets/' + name;

    const settings = ServerConnection.makeSettings();
    const requestUrl = URLExt.join(settings.baseUrl, url);

    await ServerConnection.makeRequest(
      requestUrl,
      { method: 'DELETE' },
      settings
    );

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
        <div>
          <div key={displayName} className={TITLE_CLASS}>
            <span
              title={codeSnippet.displayName}
              className={DISPLAY_NAME_CLASS}
              onClick={(): void => {
                showPreview({
                  title: displayName,
                  body: new PreviewHandler(codeSnippet, type)
                });
              }}
            >
              {displayName}
            </span>
            <div className={ACTION_BUTTONS_WRAPPER_CLASS}>
              {actionButtons.map((btn: IExpandableActionButton) => {
                return (
                  <button
                    key={btn.title}
                    title={btn.title}
                    className={buttonClasses + ' ' + ACTION_BUTTON_CLASS}
                    onClick={(): void => {
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
