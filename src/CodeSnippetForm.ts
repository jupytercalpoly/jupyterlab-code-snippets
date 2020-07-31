import { Widget } from '@lumino/widgets';
// import { RequestHandler } from '@elyra/application';

import checkSVGstr from '../style/icon/check.svg';
import { showMessage } from './ConfirmMessage';

import { Dialog, showDialog } from '@jupyterlab/apputils';

import { Contents } from '@jupyterlab/services';

import { JSONObject } from '@lumino/coreutils';

import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

import { IDocumentManager } from '@jupyterlab/docmanager';
import { CodeSnippetWidget } from './CodeSnippetWidget';

/**
 * The class name added to file dialogs.
 */
const FILE_DIALOG_CLASS = 'jp-FileDialog';

/**
 * The class name added for the new name label in the rename dialog
 */
const INPUT_NEWNAME_TITLE_CLASS = 'jp-new-name-title';

/**
 * Metadata schema name
 */
// const SCHEMA_NAME = 'code-snippet';

/**
 * A stripped-down interface for a file container.
 */
export interface IFileContainer extends JSONObject {
  /**
   * The list of item names in the current working directory.
   */
  items: string[];
  /**
   * The current working directory of the file container.
   */
  path: string;
}

/**
 * Save an input with a dialog. This is what actually displays everything.
 * Result.value is the value retrieved from .getValue(). ---> .getValue() returns an array of inputs.
 */
export function inputDialog(
  codeSnippet: CodeSnippetWidget,
  url: string,
  code: string[],
  idx: number
): Promise<Contents.IModel | null> {
  return showDialog({
    title: 'Save Code Snippet',
    body: new InputHandler(),
    focusNodeSelector: 'input',
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Save' })]
  }).then((result: Dialog.IResult<string[]>) => {
    if (validateForm(result) === false) {
      return inputDialog(codeSnippet, url, code, idx); // This works but it wipes out all the data they entered previously...
    }
    if (!result.value) {
      return null;
    } else {
      if (idx === -1) {
        idx = codeSnippet.codeSnippetWidgetModel.snippets.length;
      }
      const newSnippet: ICodeSnippet = {
        name: result.value[0].replace(' ', '').toLowerCase(),
        displayName: result.value[0],
        description: result.value[1],
        language: result.value[2],
        code: code,
        id: idx,
        bookmarked: false
      };
      /**
       * TODO: NEED in memory data store instead of making request every time.
       */
      /* TODO: if name is already there call shouldOverwrite and change to a put request*/
      // Workaround: make a get request with result.value[0] to check... but could be slow
      // const request = RequestHandler.makePostRequest(
      //   //If i use their handler then I can't interrupt any error messages without editing their stuff.
      //   url,
      //   JSON.stringify({
      //     display_name: newSnippet.displayName,
      //     metadata: {
      //       code: inputCode,
      //       description: newSnippet.description,
      //       language: newSnippet.language
      //     },
      //     name: newSnippet.name,
      //     schema_name: SCHEMA_NAME
      //   }),
      //   false
      // );
      const currSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
      for (const snippet of currSnippets) {
        if (snippet.name === newSnippet.name) {
          alert('duplicate name');
          return;
        }
      }

      const request = CodeSnippetContentsService.getInstance().save(
        'snippets/' + newSnippet.name + '.json',
        {
          type: 'file',
          format: 'text',
          content: JSON.stringify(newSnippet)
        }
      );

      // console.log(request);
      request.then(_ => {
        // add the new snippet to the snippet model
        //   console.log(idx);
        codeSnippet.codeSnippetWidgetModel.addSnippet(newSnippet, idx);

        const newSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
        codeSnippet.codeSnippets = newSnippets;
        codeSnippet.renderCodeSnippetsSignal.emit(newSnippets);
        showMessage({
          body: /*"Saved as Snippet"*/ new MessageHandler()
        });
      });
    }
  });
}

// /**
//  * Compare two snippets based on the unique name.
//  * @param thisSnippet
//  * @param otherSnippet
//  */
// function compareSnippets(thisSnippet: ICodeSnippet, otherSnippet: ICodeSnippet) {
//   return thisSnippet.name === otherSnippet.name;
// }

/**
 * Rename a file, asking for confirmation if it is overwriting another.
 */
export function renameFile(
  manager: IDocumentManager,
  oldPath: string,
  newPath: string
): Promise<Contents.IModel | null> {
  return manager.rename(oldPath, newPath).catch(error => {
    if (error.message.indexOf('409') === -1) {
      throw error;
    }
    return shouldOverwrite(newPath).then(value => {
      if (value) {
        return manager.overwrite(oldPath, newPath);
      }
      return Promise.reject('File not renamed');
    });
  });
}

/**
 * Ask the user whether to overwrite a file.
 */
export function shouldOverwrite(path: string): Promise<boolean> {
  const options = {
    title: 'Overwrite file?',
    body: `"${path}" already exists, overwrite?`,
    buttons: [Dialog.cancelButton(), Dialog.warnButton({ label: 'Overwrite' })]
  };
  return showDialog(options).then(result => {
    return Promise.resolve(result.button.accept);
  });
}

/**
 * Test whether a name is a valid file name
 *
 * Disallows "/", "\", and ":" in file names, as well as names with zero length.
 */
export function isValidFileName(name: string): boolean {
  const validNameExp = /[/\\:]/;
  return name.length > 0 && !validNameExp.test(name);
}

/**
 * Test whether user typed in all required inputs.
 */
export function validateForm(input: Dialog.IResult<string[]>): boolean {
  let status = true;
  let message = '';
  const name = input.value[0];
  const description = input.value[1];
  const language = input.value[2];
  if (name === '') {
    message += 'Name must be filled out\n';
    //alert("Description must be filled out");
    status = false;
  }
  if (description === '') {
    message += 'Description must be filled out\n';
    //alert("");
    status = false;
  }
  if (language === '') {
    message += 'Language must be filled out';
    //alert("Description ");
    status = false;
  }
  if (status === false) {
    alert(message);
  }
  return status;
}
/**
 * A widget used to get input data.
 */
class InputHandler extends Widget {
  /**
   * Construct a new "rename" dialog.
   * readonly inputNode: HTMLInputElement; <--- in Widget class
   */
  constructor() {
    super({ node: Private.createInputNode() });
    this.addClass(FILE_DIALOG_CLASS);
  }

  getValue(): string[] {
    const inputs = [];
    inputs.push(
      (this.node.getElementsByTagName('input')[0] as HTMLInputElement).value,
      (this.node.getElementsByTagName('input')[1] as HTMLInputElement).value,
      (this.node.getElementsByTagName('input')[2] as HTMLInputElement).value
    );
    return inputs;
  }
}

class MessageHandler extends Widget {
  constructor() {
    super({ node: Private.createConfirmMessageNode() });
  }
}

/**
 * A namespace for private data.
 */
class Private {
  /**
   * Create the node for a rename handler. This is what's creating all of the elements to be displayed.
   */
  static createInputNode(): HTMLElement {
    const body = document.createElement('form');

    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'Snippet Name*';
    nameTitle.className = INPUT_NEWNAME_TITLE_CLASS;
    const name = document.createElement('input');

    const descriptionTitle = document.createElement('label');
    descriptionTitle.textContent = 'Description*';
    descriptionTitle.className = INPUT_NEWNAME_TITLE_CLASS;
    const description = document.createElement('input');
    description.required = true;

    const languageTitle = document.createElement('label');
    languageTitle.textContent = 'Language*';
    languageTitle.className = INPUT_NEWNAME_TITLE_CLASS;
    const language = document.createElement('input');

    body.appendChild(nameTitle);
    body.appendChild(name);
    body.appendChild(descriptionTitle);
    body.appendChild(description);
    body.appendChild(languageTitle);
    body.appendChild(language);
    return body;
  }

  static createConfirmMessageNode(): HTMLElement {
    const body = document.createElement('div');
    body.innerHTML = checkSVGstr;

    const messageContainer = document.createElement('div');
    messageContainer.className = 'jp-confirm-text';
    const message = document.createElement('text');
    message.textContent = 'Saved as Snippet!';
    messageContainer.appendChild(message);
    body.append(messageContainer);
    return body;
  }
}
