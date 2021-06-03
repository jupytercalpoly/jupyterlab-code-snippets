// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

// import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';

import checkSVGstr from '../style/icon/jupyter_checkmark.svg';

/**
 * The class name for message
 */
// const CONFIRM_CLASS = 'jp-codeSnippet-confirm';
const CONFIRM_CONTENT = 'jp-codeSnippet-Message-content';
const CONFIRM_BODY = 'jp-codeSnippet-Message-body';
const CODE_SNIPPET_CONFIRM_TEXT = 'jp-codeSnippet-confirm-text';

/**
 * Create and show a dialog.
 *
 * @param options - The dialog setup options.
 *
 * @returns A promise that resolves with whether the dialog was accepted.
 */
export function showMessage<T>(type: string): Promise<Dialog.IResult<T>> {
  const confirmMessage = new CodeSnippetMessage({
    body: new MessageHandler(type),
    buttons: [],
  });
  return confirmMessage.launch();
}

/**
 * A widget used to show message.
 */
export class CodeSnippetMessage<T> extends Dialog<any> {
  constructor(options: Partial<Dialog.IOptions<T>> = {}) {
    super(options);
    this.children().next().addClass(CONFIRM_CONTENT);
  }

  protected onAfterAttach(msg: Message): void {
    const node = this.node;

    node.addEventListener('click', this, true);
    document.addEventListener('keydown', this, false);
  }

  /**
   *  A message handler invoked on an `'after-detach'` message.
   */
  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('click', this, true);
    document.removeEventListener('keydown', this, false);
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case 'keydown':
        this._evtKeydown(event as KeyboardEvent);
        break;
      case 'click':
        this._evtClick(event as MouseEvent);
        break;
    }
  }

  protected _evtKeydown(event: KeyboardEvent): void {
    // Check for escape key
    switch (event.key) {
      case 'Escape':
        event.stopPropagation();
        event.preventDefault();
        this.reject();
        break;
    }
  }
}

class MessageHandler extends Widget {
  constructor(type: string) {
    super({ node: Private.createMessageNode(type) });
    this.addClass(CONFIRM_BODY);
  }
}

/**
 * The namespace for module private data.
 */
namespace Private {
  // create a confirm message when new snippet is created successfully
  export function createMessageNode(type: string): HTMLElement {
    const body = document.createElement('div');
    body.innerHTML = checkSVGstr;

    const messageContainer = document.createElement('div');
    messageContainer.className = CODE_SNIPPET_CONFIRM_TEXT;
    const message = document.createElement('text');
    if (type === 'confirm') {
      message.textContent = 'Saved as Snippet!';
    } else if (type === 'copy') {
      message.textContent = 'Saved to Clipboard!';
    } else if (type === 'export') {
      message.textContent = 'Exported the Snippet!';
    }
    messageContainer.appendChild(message);
    body.append(messageContainer);
    return body;
  }
}
