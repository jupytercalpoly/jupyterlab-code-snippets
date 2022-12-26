// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';

import { Widget, PanelLayout, Panel } from '@lumino/widgets';
import { Message, MessageLoop } from '@lumino/messaging';
import { PromiseDelegate } from '@lumino/coreutils';
import { ArrayExt } from '@lumino/algorithm';

/**
 * The class name for options box
 */
const OPTIONS_CLASS = 'jp-codeSnippet-options';
const OPTIONS_CONTENT = 'jp-codeSnippet-options-content';
const OPTIONS_BODY = 'jp-codeSnippet-options-body';

/**
 * Create and show a code snippet options.
 *
 * @param options - The code snippet options setup options.
 *
 * @returns A promise that resolves with whether the code snippet options was accepted.
 */
export function showMoreOptions(
  options: Partial<OptionsMessage.IOptions> = {}
): Promise<void> {
  const optionsMessage = new OptionsMessage(options);
  return optionsMessage.launch();
}

/**
 * A widget used to show options message.
 */
export class OptionsMessage extends Widget {
  constructor(options: Partial<OptionsMessage.IOptions> = {}) {
    super();
    this.addClass(OPTIONS_CLASS);
    const renderer = OptionsMessage.defaultRenderer;

    this._host = options.host || document.body;
    const layout = (this.layout = new PanelLayout());
    const content = new Panel();
    content.addClass(OPTIONS_CONTENT);
    layout.addWidget(content);

    const body = renderer.createBody(options.body);
    content.addWidget(body);

    if (OptionsMessage.tracker.size > 0) {
      const previous = OptionsMessage.tracker.currentWidget;
      previous.reject();
      OptionsMessage.tracker.dispose();
    }

    void OptionsMessage.tracker.add(this);
  }
  /**
   * Launch the code snippet options as a modal window.
   *
   * @returns a promise that resolves with the result of the code snippet options.
   */
  launch(): Promise<void> {
    // Return the existing code snippet options if already open.
    if (this._promise) {
      return this._promise.promise;
    }
    const promise = (this._promise = new PromiseDelegate<void>());
    const promises = Promise.all(Private.launchQueue);
    Private.launchQueue.push(this._promise.promise);
    return promises.then(() => {
      Widget.attach(this, this._host);
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
      case 'click':
        this._evtClick(event as MouseEvent);
        break;
      case 'contextmenu':
        this._evtClick(event as MouseEvent);
        break;
      default:
        break;
    }
  }

  /**
   * Handle the `'click'` event for a code snippet options button.
   *
   * @param event - The DOM event sent to the widget
   */
  protected _evtClick(event: MouseEvent): void {
    const content = this.node.getElementsByClassName(
      OPTIONS_CONTENT
    )[0] as HTMLElement;
    if (!content.contains(event.target as HTMLElement)) {
      event.stopPropagation();
      event.preventDefault();
      this.reject();
    }
  }

  /**
   * Reject the current code snippet options with a default reject value.
   *
   * #### Notes
   * Will be a no-op if the code snippet options is not shown.
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
   * Dispose of the resources used by the code snippet options.
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
    const node = this.node;
    node.addEventListener('click', this, true);
    node.addEventListener('contextmenu', this, true);
  }

  /**
   *  A message handler invoked on an `'after-detach'` message.
   */
  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('click', this, true);
    node.removeEventListener('contextmenu', this, true);
  }

  private _promise: PromiseDelegate<void> | null;
  private _host: HTMLElement;
}

export namespace OptionsMessage {
  /**
   * The body input types.
   */
  export type Body = Widget;

  export interface IOptions {
    /**
     * The main body element for the code snippet options or a message to display.
     * Defaults to an empty string.
     *
     * #### Notes
     * If a widget is given as the body, it will be disposed after the
     * code snippet options is resolved.  If the widget has a `getValue()` method,
     * the method will be called prior to disposal and the value
     * will be provided as part of the code snippet options result.
     * A string argument will be used as raw `textContent`.
     * All `input` and `select` nodes will be wrapped and styled.
     */
    body: Body;

    /**
     * The host element for the code snippet options. Defaults to `document.body`.
     */
    host: HTMLElement;

    /**
     * An optional renderer for code snippet options items.  Defaults to a shared
     * default renderer.
     */
    renderer: IRenderer;
  }

  export interface IRenderer {
    /**
     * Create the body of the code snippet options.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(body: Body): Widget;
  }

  export class Renderer {
    /**
     * Create the body of the code snippet options.
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
        body = ReactWidget.create(value) as Widget;
        // Immediately update the body even though it has not yet attached in
        // order to trigger a render of the DOM nodes from the React element.
        MessageLoop.sendMessage(body, Widget.Msg.UpdateRequest);
      }
      body.addClass(OPTIONS_BODY);
      return body;
    }
  }
  /**
   * The default renderer instance.
   */
  export const defaultRenderer = new Renderer();

  /**
   * The code snippet options widget tracker.
   */
  export const tracker = new WidgetTracker<OptionsMessage>({
    namespace: '@jupyterlab/code_snippet:OptionsWidget',
  });
}

/**
 * The namespace for module private data.
 */
namespace Private {
  /**
   * The queue for launching code snippet optionss.
   */
  export const launchQueue: Promise<void>[] = [];
}
