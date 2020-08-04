import '../style/index.css';

import { Widget, PanelLayout, Panel } from '@lumino/widgets';
import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';
import { Message, MessageLoop } from '@lumino/messaging';
import { PromiseDelegate } from '@lumino/coreutils';
import { ArrayExt } from '@lumino/algorithm';
import { ICodeSnippet } from '.';

import * as React from 'react';

/**
 * The class name for confirmation box
 */
const PREVIEW_CLASS = 'jp-preview';

const PREVIEW_CONTENT = 'jp-Preview-content';
/**
 * Create and show a dialog.
 *
 * @param options - The dialog setup options.
 *
 * @returns A promise that resolves with whether the dialog was accepted.
 */
export function showPreview<T>(
  options: Partial<Preview.IOptions<T>> = {},
  openCodeSnippetEditor: (args: any) => void
): Promise<void> {
  //Insert check method to see if the preview is already open
  const preview = new Preview(options, openCodeSnippetEditor);
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
  constructor(
    options: Partial<Preview.IOptions<T>> = {},
    openCodeSnippetEditor: (args: any) => void
  ) {
    super();
    this.ready = true;
    this._title = options.title;
    this._id = options.id;
    this.addClass(PREVIEW_CLASS);
    const renderer = Preview.defaultRenderer;
    //this._host = options.host || document.body;
    const layout = (this.layout = new PanelLayout());
    const content = new Panel();
    content.addClass(PREVIEW_CONTENT);
    layout.addWidget(content);

    const header = renderer.createHeader(options.title);
    content.addWidget(header);
    const body = renderer.createBody(options.body || '');
    content.addWidget(body);
    const editButton = renderer.createEditButton(
      this,
      openCodeSnippetEditor,
      options.codeSnippet
    );
    content.addWidget(editButton);

    if (Preview.tracker.size > 0) {
      const previous = Preview.tracker.currentWidget;
      if (previous._title !== this._title) {
        document
          .getElementsByClassName('drag-hover')
          [previous._id].classList.remove('drag-hover-clicked');
        document
          .getElementsByClassName('elyra-codeSnippet-item')
          [previous._id].classList.remove('elyra-codeSnippet-item-clicked');
      }
      if (previous._title === this._title) {
        if (previous.node.classList.contains('inactive')) {
          previous.node.classList.remove('inactive');
          this.ready = false;
          return this;
        } else {
          this.ready = false;
        }
      }
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
   * Handle the DOM events for the directory listing.
   *
   * @param event - The DOM event sent to the widget.
   *
   * #### Notes
   * This method implements the DOM `EventListener` interface and is
   * called in response to events on the panel's DOM node. It should
   * not be called directly by user code.
   */
  handleEvent(event: Event): void {
    switch (event.type) {
      case 'keydown':
        this._evtKeydown(event as KeyboardEvent);
        break;
      case 'click':
        this._evtClick(event as MouseEvent);
        break;
      case 'contextmenu':
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        break;
    }
  }

  /**
   * Handle the `'click'` event for a dialog button.
   *
   * @param event - The DOM event sent to the widget
   */
  protected _evtClick(event: MouseEvent): void {
    //gray area
    console.log(
      "If this function hasn't been hit for the same snippet then don't launchhhh for that snippet"
    );
    const content = this.node.getElementsByClassName(
      PREVIEW_CONTENT
    )[0] as HTMLElement;
    if (!content.contains(event.target as HTMLElement)) {
      document
        .getElementsByClassName('drag-hover')
        [this._id].classList.remove('drag-hover-clicked');
      document
        .getElementsByClassName('elyra-codeSnippet-item')
        [this._id].classList.remove('elyra-codeSnippet-item-clicked');
      event.stopPropagation();
      event.preventDefault();
      this.reject();
      return;
    }
  }

  /**
   * Handle the `'keydown'` event for the widget.
   *
   * @param event - The DOM event sent to the widget
   */
  protected _evtKeydown(event: KeyboardEvent): void {
    // Check for escape key
    switch (event.keyCode) {
      case 27: // Escape.
        document
          .getElementsByClassName('drag-hover')
          [this._id].classList.remove('drag-hover-clicked');
        document
          .getElementsByClassName('elyra-codeSnippet-item')
          [this._id].classList.remove('elyra-codeSnippet-item-clicked');
        event.stopPropagation();
        event.preventDefault();
        this.reject();
        break;
      // case 13: // Enter.
      //   event.stopPropagation();
      //   event.preventDefault();
      //   this.resolve();
      //   break;
      default:
        break;
    }
  }

  /**
   * Resolve the current dialog.
   *
   * @param index - An optional index to the button to resolve.
   *
   * #### Notes
   * Will default to the defaultIndex.
   * Will resolve the current `show()` with the button value.
   * Will be a no-op if the dialog is not shown.
   */
  resolve(): void {
    if (!this._promise) {
      return;
    }
    this._resolve();
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
   * A message handler invoked on a `'close-request'` message.
   */
  protected onCloseRequest(msg: Message): void {
    if (this._promise) {
      this.reject();
    }
    super.onCloseRequest(msg);
  }

  /**
   *  A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    console.log('I have reached this stageeee');
    const node = this.node;
    node.addEventListener('keydown', this, true);
    node.addEventListener('contextmenu', this, true);
    node.addEventListener('click', this, true);
    this._original = document.activeElement as HTMLElement;
  }

  /**
   *  A message handler invoked on an `'after-detach'` message.
   */
  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('keydown', this, true);
    node.removeEventListener('contextmenu', this, true);
    node.removeEventListener('click', this, true);
    document.removeEventListener('focus', this, true);
    this._original.focus();
  }

  private _promise: PromiseDelegate<void> | null;
  //private _host: HTMLElement;
  private _original: HTMLElement;
}

export namespace Preview {
  /**
   * The body input types.
   */
  export type Body<T> = IBodyWidget<T> | React.ReactElement<any> | string;
  /**
   * The options used to create a dialog.
   */
  /**
   * A widget used as a dialog body.
   */
  export interface IBodyWidget<T = string> extends Widget {
    /**
     * Get the serialized value of the widget.
     */
    getValue?(): T;
  }

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
    body: Body<T>;
    codeSnippet: ICodeSnippet;
  }

  export interface IRenderer {
    createHeader(title: string): Widget;

    /**
     * Create the body of the dialog.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(body: Body<any>): Widget;
    createEditButton(): Widget;
  }

  export class Renderer {
    /**
     * Create the header of the dialog.
     *
     * @param title - The title of the snippet.
     *
     * @returns A widget for the header of the preview.
     */
    createHeader(title: string): Widget {
      const header = ReactWidget.create(<>{title}</>);

      header.addClass('jp-Preview-header');
      // Styling.styleNode(header.node);
      return header;
    }

    /**
     * Create the body of the dialog.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(value: Body<any>): Widget {
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

      // const iconNode = new Widget({ node: document.createElement('div') });
      // iconNode.title.icon = checkIcon;
      // body.
      body.addClass('jp-Preview-body');
      // Styling.styleNode(body.node);
      return body;
    }

    // createIcon(): Widget {
    //   let iconWidget: Widget;
    //   iconWidget = new Widget({ node: document.createElement('img') });
    //   console.log(checkSVGstr);
    //   const checkIcon = new LabIcon( { name: "checkIcon", svgstr: checkSVGstr} );

    //   <img src={`data:image/svg+xml;utf8,${image}` />

    //   iconWidget.title.icon = checkIcon;
    //   console.log(iconWidget.title.icon instanceof LabIcon);
    //   iconWidget.addClass('jp-confirm-icon');
    //   return iconWidget
    // }

    /**
     * Create the edit button in the dialog.
     *
     * @returns A widget for the edit button.
     */
    createEditButton(
      prev: any,
      openCodeSnippetEditor: (args: any) => void,
      codeSnippet: ICodeSnippet
    ): Widget {
      const editButton: Widget = new Widget({
        node: document.createElement('span')
      });
      editButton.addClass('jp-Preview-button');
      editButton.node.onmouseover = (): void => {
        editButton.addClass('jp-Preview-button-hover');
      };
      editButton.node.onmouseout = (): void => {
        editButton.removeClass('jp-Preview-button-hover');
      };
      editButton.node.onclick = (): void => {
        openCodeSnippetEditor({
          namespace: codeSnippet.name,
          codeSnippet: codeSnippet
        });
        document
          .getElementsByClassName('drag-hover')
          [prev._id].classList.remove('drag-hover-clicked');
        document
          .getElementsByClassName('elyra-codeSnippet-item')
          [prev._id].classList.remove('elyra-codeSnippet-item-clicked');
        event.stopPropagation();
        event.preventDefault();
        prev.reject();
      };
      return editButton;
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
