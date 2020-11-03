// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { closeIcon, Button, LabIcon } from '@jupyterlab/ui-components';
import { WidgetTracker, ReactWidget, Styling } from '@jupyterlab/apputils';

import { Widget, PanelLayout, Panel } from '@lumino/widgets';
import { Message, MessageLoop } from '@lumino/messaging';
import { PromiseDelegate } from '@lumino/coreutils';
import { ArrayExt, each, map, toArray } from '@lumino/algorithm';

import * as React from 'react';

/**
 * CSS styling
 */
const CODE_SNIPPET_FORM = 'jp-codeSnippet-form';
const DIALOG_CONTENT = 'jp-Dialog-content';

/**
 * Create and show a code snippet form.
 *
 * @param options - The code snippet form setup options.
 *
 * @returns A promise that resolves with whether the form was accepted.
 */
export function showCodeSnippetForm<T>(
  options: Partial<CodeSnippetForm.IOptions<T>> = {}
): Promise<CodeSnippetForm.IResult<T>> {
  const codeSnippetForm = new CodeSnippetForm(options);
  return codeSnippetForm.launch();
}

/**
 * A widget used to show code snippet form
 */
export class CodeSnippetForm<T> extends Widget {
  constructor(options: Partial<CodeSnippetForm.IOptions<T>> = {}) {
    super();
    this.addClass(CODE_SNIPPET_FORM);
    const normalized = Private.handleOptions(options);
    const renderer = normalized.renderer;

    this._host = normalized.host;
    this._defaultButton = normalized.defaultButton;
    this._buttons = normalized.buttons;
    this._buttonNodes = toArray(
      map(this._buttons, button => {
        return renderer.createButtonNode(button);
      })
    );

    const layout = (this.layout = new PanelLayout());
    const content = new Panel();
    content.addClass(DIALOG_CONTENT);
    layout.addWidget(content);

    this._body = normalized.body;

    const header = renderer.createHeader(
      normalized.title,
      () => this.reject(),
      options
    );

    const body = renderer.createBody(normalized.body);
    const footer = renderer.createFooter(this._buttonNodes);
    content.addWidget(header);
    content.addWidget(body);
    content.addWidget(footer);

    this._primary = this._buttonNodes[this._defaultButton];
    this._focusNodeSelector = options.focusNodeSelector;

    // Add new code snippet form to the tracker.
    void CodeSnippetForm.tracker.add(this);
  }

  /**
   * Dispose of the resources used by the code snippet form.
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
   * Launch the code snippet form as a modal window.
   *
   * @returns a promise that resolves with the result of the code snippet form.
   */
  launch(): Promise<CodeSnippetForm.IResult<T>> {
    // Return the existing code snippet form if already open.
    if (this._promise) {
      return this._promise.promise;
    }
    const promise = (this._promise = new PromiseDelegate<
      CodeSnippetForm.IResult<T>
    >());
    const promises = Promise.all(Private.launchQueue);
    Private.launchQueue.push(this._promise.promise);
    return promises.then(() => {
      Widget.attach(this, this._host);
      return promise.promise;
    });
  }

  /**
   * Resolve the current code snippet form.
   *
   * @param index - An optional index to the button to resolve.
   *
   * #### Notes
   * Will default to the defaultIndex.
   * Will resolve the current `show()` with the button value.
   * Will be a no-op if the code snippet form is not shown.
   */
  resolve(index?: number): void {
    if (!this._promise) {
      return;
    }
    if (index === undefined) {
      index = this._defaultButton;
    }
    this._resolve(this._buttons[index]);
  }

  /**
   * Reject the current code snippet form with a default reject value.
   *
   * #### Notes
   * Will be a no-op if the code snippet form is not shown.
   */
  reject(): void {
    if (!this._promise) {
      return;
    }
    this._resolve(CodeSnippetForm.cancelButton());
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
      case 'focus':
        this._evtFocus(event as FocusEvent);
        break;
      default:
        break;
    }
  }

  /**
   *  A message handler invoked on an `'after-attach'` message.
   */
  protected onAfterAttach(msg: Message): void {
    const node = this.node;
    node.addEventListener('keydown', this, true);
    node.addEventListener('click', this, true);
    document.addEventListener('focus', this, true);
    this._first = Private.findFirstFocusable(this.node);
    this._original = document.activeElement as HTMLElement;
    if (this._focusNodeSelector) {
      const body = this.node.querySelector('.jp-Dialog-body');
      const el = body?.querySelector(this._focusNodeSelector);

      if (el) {
        this._primary = el as HTMLElement;
      }
    }
    this._primary.focus();
  }

  /**
   *  A message handler invoked on an `'after-detach'` message.
   */
  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('keydown', this, true);
    node.removeEventListener('click', this, true);
    document.removeEventListener('focus', this, true);
    this._original.focus();
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
   * Handle the `'click'` event for a code snippet form button.
   *
   * @param event - The DOM event sent to the widget
   */
  protected _evtClick(event: MouseEvent): void {
    const content = this.node.getElementsByClassName(
      'jp-Dialog-content'
    )[0] as HTMLElement;
    if (!content.contains(event.target as HTMLElement)) {
      event.stopPropagation();
      event.preventDefault();
      this.reject();
      return;
    }
    for (const buttonNode of this._buttonNodes) {
      if (buttonNode.contains(event.target as HTMLElement)) {
        const index = this._buttonNodes.indexOf(buttonNode);
        this.resolve(index);
      }
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
        event.stopPropagation();
        event.preventDefault();
        this.reject();
        break;
      case 9: {
        // Tab.

        // Handle a tab on the last button.
        const node = this._buttonNodes[this._buttons.length - 1];
        if (document.activeElement === node && !event.shiftKey) {
          event.stopPropagation();
          event.preventDefault();
          this._first.focus();
        }
        break;
      }
      default:
        break;
    }
  }

  /**
   * Handle the `'focus'` event for the widget.
   *
   * @param event - The DOM event sent to the widget
   */
  protected _evtFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    if (!this.node.contains(target as HTMLElement)) {
      event.stopPropagation();
      this._buttonNodes[this._defaultButton].focus();
    }
  }

  /**
   * Resolve a button item.
   */
  private _resolve(button: CodeSnippetForm.IButton): void {
    // Prevent loopback.
    const promise = this._promise;
    if (!promise) {
      this.dispose();
      return;
    }
    this._promise = null;
    ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
    const body = this._body;
    let value: T | null = null;
    if (
      button.accept &&
      body instanceof Widget &&
      typeof body.getValue === 'function'
    ) {
      value = body.getValue();
    }
    this.dispose();
    promise.resolve({ button, value });
  }

  private _buttonNodes: ReadonlyArray<HTMLElement>;
  private _buttons: ReadonlyArray<CodeSnippetForm.IButton>;
  private _original: HTMLElement;
  private _first: HTMLElement;
  private _primary: HTMLElement;
  private _promise: PromiseDelegate<CodeSnippetForm.IResult<T>> | null;
  private _defaultButton: number;
  private _host: HTMLElement;
  private _body: CodeSnippetForm.Body<T>;
  private _focusNodeSelector: string | undefined = '';
}

export namespace CodeSnippetForm {
  /**
   * The body input types.
   */
  export type Body<T> = IBodyWidget<T> | React.ReactElement<any> | string;
  /**
   * The header input types.
   */
  export type Header = React.ReactElement<any> | string;
  /**
   * A widget used as a code snippet form body.
   */
  export interface IBodyWidget<T = string> extends Widget {
    /**
     * Get the serialized value of the widget.
     */
    getValue?(): T;
  }

  /**
   * The options used to make a button item.
   */
  export interface IButton {
    /**
     * The label for the button.
     */
    label: string;

    /**
     * The icon class for the button.
     */
    iconClass: string;

    /**
     * The icon label for the button.
     */
    iconLabel: string;

    /**
     * The caption for the button.
     */
    caption: string;

    /**
     * The extra class name for the button.
     */
    className: string;

    /**
     * The code snippet form action to perform when the button is clicked.
     */
    accept: boolean;

    /**
     * The additional code snippet form actions to perform when the button is clicked.
     */
    actions: Array<string>;

    /**
     * The button display type.
     */
    displayType: 'default' | 'warn';
  }

  export interface IOptions<T> {
    /**
     * The top level text for the code snippet form.  Defaults to an empty string.
     */
    title: Header;

    /**
     * The main body element for the code snippet form to display.
     * Defaults to an empty string.
     *
     * #### Notes
     * If a widget is given as the body, it will be disposed after the
     * code snippet form is resolved.  If the widget has a `getValue()` method,
     * the method will be called prior to disposal and the value
     * will be provided as part of the code snippet form result.
     * A string argument will be used as raw `textContent`.
     * All `input` and `select` nodes will be wrapped and styled.
     */
    body: Body<T>;

    /**
     * The host element for the code snippet form. Defaults to `document.body`.
     */
    host: HTMLElement;

    /**
     * The buttons to display. Defaults to cancel and accept buttons.
     */
    buttons: ReadonlyArray<IButton>;

    /**
     * The index of the default button.  Defaults to the last button.
     */
    defaultButton: number;

    /**
     * A selector for the primary element that should take focus in the code snippet form.
     * Defaults to an empty string, causing the [[defaultButton]] to take
     * focus.
     */
    focusNodeSelector: string;

    /**
     * When "true", renders a close button for the code snippet form
     */
    hasClose: boolean;

    /**
     * An optional renderer for code snippet form items.  Defaults to a shared
     * default renderer.
     */
    renderer: IRenderer;
  }

  /**
   * A code snippet form renderer.
   */
  export interface IRenderer {
    /**
     * Create the header of the code snippet form.
     *
     * @param title - The title of the code snippet form.
     *
     * @returns A widget for the code snippet form header.
     */
    createHeader<T>(
      title: Header,
      reject: () => void,
      options: Partial<CodeSnippetForm.IOptions<T>>
    ): Widget;

    /**
     * Create the body of the code snippet form.
     *
     * @param value - The input value for the body.
     *
     * @returns A widget for the body.
     */
    createBody(body: Body<any>): Widget;

    /**
     * Create the footer of the code snippet form.
     *
     * @param buttons - The button nodes to add to the footer.
     *
     * @returns A widget for the footer.
     */
    createFooter(buttons: ReadonlyArray<HTMLElement>): Widget;

    /**
     * Create a button node for the code snippet form.
     *
     * @param button - The button data.
     *
     * @returns A node for the button.
     */
    createButtonNode(button: IButton): HTMLElement;
  }

  /**
   * The result of a code snippet form.
   */
  export interface IResult<T> {
    /**
     * The button that was pressed.
     */
    button: IButton;

    /**
     * The value retrieved from `.getValue()` if given on the widget.
     */
    value: T | null;
  }

  /**
   * Create a button item.
   */
  export function createButton(value: Partial<IButton>): Readonly<IButton> {
    value.accept = value.accept !== false;
    const defaultLabel = value.accept ? 'OK' : 'Cancel';
    return {
      label: value.label || defaultLabel,
      iconClass: value.iconClass || '',
      iconLabel: value.iconLabel || '',
      caption: value.caption || '',
      className: value.className || '',
      accept: value.accept,
      actions: value.actions || [],
      displayType: value.displayType || 'default'
    };
  }

  /**
   * Create a reject button.
   */
  export function cancelButton(
    options: Partial<IButton> = {}
  ): Readonly<IButton> {
    options.accept = false;
    return createButton(options);
  }

  /**
   * Create an accept button.
   */
  export function okButton(options: Partial<IButton> = {}): Readonly<IButton> {
    options.accept = true;
    return createButton(options);
  }

  /**
   * Create a warn button.
   */
  export function warnButton(
    options: Partial<IButton> = {}
  ): Readonly<IButton> {
    options.displayType = 'warn';
    return createButton(options);
  }

  /**
   * Disposes all code snippet form instances.
   *
   * #### Notes
   * This function should only be used in tests or cases where application state
   * may be discarded.
   */
  export function flush(): void {
    tracker.forEach(form => {
      form.dispose();
    });
  }

  /**
   * The default implementation of a code snippet form renderer.
   */
  export class Renderer {
    /**
     * Create the header of the code snippet form.
     *
     * @param title - The title of the code snippet form.
     *
     * @returns A widget for the code snippet form header.
     */
    createHeader<T>(
      title: Header,
      reject: () => void = (): void => {
        /* empty */
      },
      options: Partial<CodeSnippetForm.IOptions<T>> = {}
    ): Widget {
      let header: Widget;

      const handleMouseDown = (event: React.MouseEvent): void => {
        // Fire action only when left button is pressed.
        if (event.button === 0) {
          event.preventDefault();
          reject();
        }
      };

      const handleKeyDown = (event: React.KeyboardEvent): void => {
        const { key } = event;
        if (key === 'Enter' || key === ' ') {
          reject();
        }
      };

      if (typeof title === 'string') {
        header = ReactWidget.create(
          <>
            {title}
            {options.hasClose && (
              <Button
                className="jp-Dialog-close-button"
                onMouseDown={handleMouseDown}
                onKeyDown={handleKeyDown}
                title="Cancel"
                minimal
              >
                <LabIcon.resolveReact
                  icon={closeIcon}
                  iconClass="jp-Icon"
                  className="jp-ToolbarButtonComponent-icon"
                  tag="span"
                />
              </Button>
            )}
          </>
        );
      } else {
        header = ReactWidget.create(title);
      }
      header.addClass('jp-Dialog-header');
      Styling.styleNode(header.node);
      return header;
    }

    /**
     * Create the body of the code snippet form.
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
      body.addClass('jp-Dialog-body');
      Styling.styleNode(body.node);
      return body;
    }

    /**
     * Create the footer of the code snippet form.
     *
     * @param buttonNodes - The buttons nodes to add to the footer.
     *
     * @returns A widget for the footer.
     */
    createFooter(buttons: ReadonlyArray<HTMLElement>): Widget {
      const footer = new Widget();
      footer.addClass('jp-Dialog-footer');
      each(buttons, button => {
        footer.node.appendChild(button);
      });
      Styling.styleNode(footer.node);
      return footer;
    }

    /**
     * Create a button node for the code snippet form.
     *
     * @param button - The button data.
     *
     * @returns A node for the button.
     */
    createButtonNode(button: IButton): HTMLElement {
      const e = document.createElement('button');
      e.className = this.createItemClass(button);
      e.appendChild(this.renderIcon(button));
      e.appendChild(this.renderLabel(button));
      return e;
    }

    /**
     * Create the class name for the button.
     *
     * @param data - The data to use for the class name.
     *
     * @returns The full class name for the button.
     */
    createItemClass(data: IButton): string {
      // Setup the initial class name.
      let name = 'jp-Dialog-button';

      // Add the other state classes.
      if (data.accept) {
        name += ' jp-mod-accept';
      } else {
        name += ' jp-mod-reject';
      }
      if (data.displayType === 'warn') {
        name += ' jp-mod-warn';
      }

      // Add the extra class.
      const extra = data.className;
      if (extra) {
        name += ` ${extra}`;
      }

      // Return the complete class name.
      return name;
    }

    /**
     * Render an icon element for a code snippet form item.
     *
     * @param data - The data to use for rendering the icon.
     *
     * @returns An HTML element representing the icon.
     */
    renderIcon(data: IButton): HTMLElement {
      const e = document.createElement('div');
      e.className = this.createIconClass(data);
      e.appendChild(document.createTextNode(data.iconLabel));
      return e;
    }

    /**
     * Create the class name for the button icon.
     *
     * @param data - The data to use for the class name.
     *
     * @returns The full class name for the item icon.
     */
    createIconClass(data: IButton): string {
      const name = 'jp-Dialog-buttonIcon';
      const extra = data.iconClass;
      return extra ? `${name} ${extra}` : name;
    }

    /**
     * Render the label element for a button.
     *
     * @param data - The data to use for rendering the label.
     *
     * @returns An HTML element representing the item label.
     */
    renderLabel(data: IButton): HTMLElement {
      const e = document.createElement('div');
      e.className = 'jp-Dialog-buttonLabel';
      e.title = data.caption;
      e.appendChild(document.createTextNode(data.label));
      return e;
    }
  }

  /**
   * The default renderer instance.
   */
  export const defaultRenderer = new Renderer();

  /**
   * The code snippet form widget tracker.
   */
  export const tracker = new WidgetTracker<CodeSnippetForm<any>>({
    namespace: '@jupyterlab/apputils:CodeSnippetForm'
  });
}

/**
 * The namespace for module private data.
 */
namespace Private {
  /**
   * The queue for launching code snippet forms.
   */
  export const launchQueue: Promise<CodeSnippetForm.IResult<any>>[] = [];

  export const errorMessagePromiseCache: Map<string, Promise<void>> = new Map();

  /**
   * Handle the input options for a code snippet form.
   *
   * @param options - The input options.
   *
   * @returns A new options object with defaults applied.
   */
  export function handleOptions<T>(
    options: Partial<CodeSnippetForm.IOptions<T>> = {}
  ): CodeSnippetForm.IOptions<T> {
    const buttons = options.buttons || [
      CodeSnippetForm.cancelButton(),
      CodeSnippetForm.okButton()
    ];
    let defaultButton = buttons.length - 1;
    if (options.defaultButton !== undefined) {
      defaultButton = options.defaultButton;
    }
    return {
      title: options.title || '',
      body: options.body || '',
      host: options.host || document.body,
      buttons,
      defaultButton,
      renderer: options.renderer || CodeSnippetForm.defaultRenderer,
      focusNodeSelector: options.focusNodeSelector || '',
      hasClose: options.hasClose || false
    };
  }

  /**
   *  Find the first focusable item in the code snippet form.
   */
  export function findFirstFocusable(node: HTMLElement): HTMLElement {
    const candidateSelectors = [
      'input',
      'select',
      'a[href]',
      'textarea',
      'button',
      '[tabindex]'
    ].join(',');
    return node.querySelectorAll(candidateSelectors)[0] as HTMLElement;
  }
}
