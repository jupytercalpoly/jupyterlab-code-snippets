import { PanelLayout, Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { CodeSnippetWidget } from './CodeSnippetWidget';

import {
  CodeSnippetContentsService,
  ICodeSnippet
} from './CodeSnippetContentsService';
import { Contents } from '@jupyterlab/services';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IEditorServices } from '@jupyterlab/codeeditor';

/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_WRAPPER = 'CodeSnippets-Wrapper';
const CODE_SNIPPETS_CLASS = 'elyra-CodeSnippets';

/**
 * A lumino widget that wraps all the react widget/component
 */
export class CodeSnippetWrapper extends Widget {
  /**
   * Construct a new code snippet widget
   */
  getCurrentWidget: () => Widget;
  codeSnippetManager: CodeSnippetContentsService;
  app: JupyterFrontEnd;
  editorServices: IEditorServices;
  //  codeSnippetWidget: CodeSnippetWidget;

  constructor(
    getCurrentWidget: () => Widget,
    app: JupyterFrontEnd,
    editorServices: IEditorServices
  ) {
    super();
    this.addClass(CODE_SNIPPETS_WRAPPER);
    this.getCurrentWidget = getCurrentWidget;
    this.layout = new Private.SnippetPanelLayout();
    this.app = app;
    this.editorServices = editorServices;
    // this.codeSnippetManager = new CodeSnippetService();
    this.codeSnippetManager = CodeSnippetContentsService.getInstance();
  }

  /**
   * Create a code snippet widget
   */
  createCodeSnippetWidget(codeSnippets: ICodeSnippet[]): void {
    const layout = this.layout as PanelLayout;
    // console.log(this.app);
    const codeSnippetWidget = CodeSnippetWidget.getInstance(
      codeSnippets,
      this.getCurrentWidget,
      this.app,
      this.editorServices
    );
    codeSnippetWidget.addClass(CODE_SNIPPETS_CLASS);
    // console.log(codeSnippetWidget);
    layout.insertWidget(0, codeSnippetWidget as Widget);
  }

  // Request code snippets from server
  async fetchData(): Promise<ICodeSnippet[]> {
    const fileModels: Contents.IModel[] = [];
    const paths: string[] = [];
    const data: ICodeSnippet[] = [];
    await this.codeSnippetManager
      .getData('snippets', 'directory')
      .then(model => {
        fileModels.push(...model.content);
      });

    fileModels.forEach(fileModel => paths.push(fileModel.path));

<<<<<<< HEAD
<<<<<<< HEAD
    for (const path of paths) {
=======
    for (let path of paths) {
>>>>>>> Integrate contents service into frontend
=======
    for (const path of paths) {
>>>>>>> Create a new tab for code snippet editor
      await this.codeSnippetManager.getData(path, 'file').then(model => {
        data.push(JSON.parse(model.content));
      });
    }

    return data;
  }

  // Triggered when the widget button on side palette is clicked
  onAfterShow(msg: Message): void {
    this.fetchData().then((codeSnippets: ICodeSnippet[]) => {
      this.createCodeSnippetWidget(codeSnippets);
    });
  }

  // Triggered when the widget button on side palette is clicked to hide
  onAfterHide(msg: Message): void {
    /**
     * Update snippets in the server
     */
    // this.codeSnippetWidget = undefined;
  }
}

namespace Private {
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
}
