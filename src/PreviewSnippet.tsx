import { Widget, PanelLayout, Panel } from '@lumino/widgets';
import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';
import { Message, MessageLoop } from '@lumino/messaging';
import { PromiseDelegate } from '@lumino/coreutils';
import { ArrayExt } from '@lumino/algorithm';

import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';

import { ICodeSnippet } from './CodeSnippetContentsService';

/**
 * The class name for confirmation box
 */
const PREVIEW_CLASS = 'jp-codeSnippet-preview';
const PREVIEW_CONTENT = 'jp-codeSnippet-preview-content';
const PREVIEW_BODY = 'jp-codeSnippet-preview-body';

/**
 * Create and show a dialog.
 *
 * @param options - The dialog setup options.
 *
 * @returns A promise that resolves with whether the dialog was accepted.
 */
export function showPreview<T>(
  options: Partial<Preview.IOptions<T>> = {},
  editorServices: IEditorServices
): Promise<void> {
  //Insert check method to see if the preview is already open
  const preview = new Preview(options, editorServices);
  if (preview.ready === false) {
    return;
  }
  return preview.launch();
}

/**
 * A widget used to show confirmation message.
 */
export class Preview<T> extends Widget {
  ready: boolean;
  _title: string;
  _id: number;
  editor: CodeEditor.IEditor;
  codeSnippet: ICodeSnippet;
  editorServices: IEditorServices;
  private _hasRefreshedSinceAttach: boolean;
  constructor(
    options: Partial<Preview.IOptions<T>> = {},
    editorServices: IEditorServices
  ) {
    super();
    this.ready = true;
    this._title = options.title;
    this._id = options.id;
    this.codeSnippet = options.codeSnippet;
    this.editorServices = editorServices;
    this.addClass(PREVIEW_CLASS);
    const layout = (this.layout = new PanelLayout());
    const content = new Panel();
    content.addClass(PREVIEW_CONTENT);
    content.id = PREVIEW_CONTENT + this._id;
    layout.addWidget(content);

    if (Preview.tracker.size > 0) {
      const previous = Preview.tracker.currentWidget;
      previous.reject();
      Preview.tracker.dispose();
    }
    if (this.ready === true) {
      void Preview.tracker.add(this);
    }
  }
  /**
   * Launch the dialog as a modal window.
   *
   * @returns a promise that resolves with the result of the dialog.
   */
  launch(): Promise<void> {
    // Return the existing dialog if already open.
    if (this._promise) {
      return this._promise.promise;
    }
    const promise = (this._promise = new PromiseDelegate<void>());
    const promises = Promise.all(Private.launchQueue);
    Private.launchQueue.push(this._promise.promise);
    return promises.then(() => {
      Widget.attach(this, document.getElementById('jp-main-dock-panel'));
      return promise.promise;
    });
  }

  /**
   * Reject the current dialog with a default reject value.
   *
   * #### Notes
   * Will be a no-op if the dialog is not shown.
   */
  reject(): void {
    if (!this._promise) {
      return;
    }
    this._resolve();
  }

  /**
   * Resolve a button item.
   */
  private _resolve(): void {
    // Prevent loopback.
    const promise = this._promise;
    if (!promise) {
      this.dispose();
      return;
    }
    this._promise = null;
    ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
    this.dispose();
    promise.resolve();
  }

  /**
   * Dispose of the resources used by the dialog.
   */
  dispose(): void {
    const promise = this._promise;
    if (promise) {
      this._promise = null;
      promise.reject(void 0);
      ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
    }
    super.dispose();
  }

  /**
   *  A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    this._hasRefreshedSinceAttach = false;
    if (this.isVisible) {
      this.update();
    }
  }

  onAfterShow(msg: Message): void {
    if (!this._hasRefreshedSinceAttach) {
      this.update();
    }
  }

  onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);

    if (!this.editor && document.getElementById(PREVIEW_CONTENT + this._id)) {
      const editorFactory = this.editorServices.factoryService.newInlineEditor;
      const getMimeTypeByLanguage = this.editorServices.mimeTypeService
        .getMimeTypeByLanguage;

      this.editor = editorFactory({
        host: document.getElementById(PREVIEW_CONTENT + this._id),
        config: { readOnly: true, fontSize: 3 },
        model: new CodeEditor.Model({
          value: this.codeSnippet.code.join('\n'),
          mimeType: getMimeTypeByLanguage({
            name: this.codeSnippet.language,
            codemirror_mode: this.codeSnippet.language
          })
        })
      });
    }
    this.editor.setSize({ width: 200, height: 106 });
    if (this.isVisible) {
      this._hasRefreshedSinceAttach = true;
      this.editor.refresh();
    }
  }

  private _promise: PromiseDelegate<void> | null;
}

export namespace Preview {
  /**
   * The body input types.
   */
  export type Body = Widget;

  export interface IOptions<T> {
    title: string;
    id: number;
    /**
     * The main body element for the dialog or a message to display.
     * Defaults to an empty string.
     *
     * #### Notes
     * If a widget is given as the body, it will be disposed after the
     * dialog is resolved.  If the widget has a `getValue()` method,
     * the method will be called prior to disposal and the value
     * will be provided as part of the dialog result.
     * A string argument will be used as raw `textContent`.
     * All `input` and `select` nodes will be wrapped and styled.
     */
    body: Body;
    codeSnippet: ICodeSnippet;
  }

  export interface IRenderer {
    // createHeader(title: string): Widget;

    /**
     * Create the body of the dialog.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(body: Body): Widget;
  }

  export class Renderer {
    /**
     * Create the body of the dialog.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(value: Body): Widget {
      let body: Widget;
      if (typeof value === 'string') {
        body = new Widget({ node: document.createElement('span') });
        body.node.textContent = value;
      } else if (value instanceof Widget) {
        body = value;
      } else {
        body = ReactWidget.create(value);
        // Immediately update the body even though it has not yet attached in
        // order to trigger a render of the DOM nodes from the React element.
        MessageLoop.sendMessage(body, Widget.Msg.UpdateRequest);
      }
      body.addClass(PREVIEW_BODY);
      return body;
    }
  }
  /**
   * The default renderer instance.
   */
  export const defaultRenderer = new Renderer();

  /**
   * The dialog widget tracker.
   */
  export const tracker = new WidgetTracker<Preview<any>>({
    namespace: '@jupyterlab/code_snippet:ConfirmWidget'
  });
}

/**
 * The namespace for module private data.
 */
namespace Private {
  /**
   * The queue for launching dialogs.
   */
  export const launchQueue: Promise<void>[] = [];
}
