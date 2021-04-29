// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

// import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';
// import { PromiseDelegate } from '@lumino/coreutils';
// import { ArrayExt } from '@lumino/algorithm';

import checkSVGstr from '../style/icon/jupyter_checkmark.svg';

/**
 * The class name for confirmation box
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
export function showMessage<T>(): Promise<Dialog.IResult<T>> {
  const confirmMessage = new ConfirmMessage({
    body: new MessageHandler(),
    buttons: [],
  });
  return confirmMessage.launch();
}

/**
 * A widget used to show confirmation message.
 */
export class ConfirmMessage<T> extends Dialog<any> {
  constructor(options: Partial<Dialog.IOptions<T>> = {}) {
    super(options);
    this.children().next().addClass(CONFIRM_CONTENT);
  }

  protected onAfterAttach(msg: Message): void {
    const node = this.node;
    node.addEventListener('click', this, true);
  }

  /**
   *  A message handler invoked on an `'after-detach'` message.
   */
  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('click', this, true);
  }
}

class MessageHandler extends Widget {
  constructor() {
    super({ node: Private.createConfirmMessageNode() });
    this.addClass(CONFIRM_BODY);
  }
}

/**
 * The namespace for module private data.
 */
namespace Private {
  // create a confirm message when new snippet is created successfully
  export function createConfirmMessageNode(): HTMLElement {
    const body = document.createElement('div');
    body.innerHTML = checkSVGstr;

    const messageContainer = document.createElement('div');
    messageContainer.className = CODE_SNIPPET_CONFIRM_TEXT;
    const message = document.createElement('text');
    message.textContent = 'Saved as Snippet!';
    messageContainer.appendChild(message);
    body.append(messageContainer);
    return body;
  }
}
