import { PanelLayout, Widget } from '@lumino/widgets';

import { Message } from '@lumino/messaging';

import { CodeSnippetWidget } from './CodeSnippetWidget';

import { CodeSnippetService, ICodeSnippet } from './CodeSnippetService';

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
  codeSnippetManager: CodeSnippetService;
  //  codeSnippetWidget: CodeSnippetWidget;

  constructor(getCurrentWidget: () => Widget) {
    super();
    this.addClass(CODE_SNIPPETS_WRAPPER);
    this.getCurrentWidget = getCurrentWidget;
    this.layout = new Private.SnippetPanelLayout();
    this.codeSnippetManager = new CodeSnippetService();
  }

  /**
   * Create a code snippet widget
   */
  createCodeSnippetWidget(codeSnippets: ICodeSnippet[]) {
    const layout = this.layout as PanelLayout;
    const codeSnippetWidget = CodeSnippetWidget.getInstance(
      codeSnippets,
      this.getCurrentWidget
    );
    codeSnippetWidget.addClass(CODE_SNIPPETS_CLASS);
    layout.insertWidget(0, codeSnippetWidget as Widget);
  }

  // Request code snippets from server
  async fetchData(): Promise<ICodeSnippet[]> {
    return await this.codeSnippetManager.findAll();
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
