import '../style/index.css';

import { codeSnippetIcon } from '@elyra/ui-components';

import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  ILayoutRestorer
} from '@jupyterlab/application';

import { ICommandPalette } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';

import { CodeSnippetWidget } from './CodeSnippetWidget';


import { RequestHandler } from '@elyra/application';
import { URLExt } from '@jupyterlab/coreutils';


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { Dialog, showDialog, /*showErrorMessage*/ } from '@jupyterlab/apputils';

//import { PathExt } from '@jupyterlab/coreutils';

import { Contents } from '@jupyterlab/services';

import { JSONObject } from '@lumino/coreutils';

import { Widget } from '@lumino/widgets';

import { IDocumentManager } from '@jupyterlab/docmanager';

/**
 * The class name added to file dialogs.
 */
const FILE_DIALOG_CLASS = 'jp-FileDialog';

/**
 * The class name added for the new name label in the rename dialog
 */
const RENAME_NEWNAME_TITLE_CLASS = 'jp-new-name-title';

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
 * Rename a file with a dialog. This is what actually displays everything. 
 * Result.value is the value retrieved from .getValue(). ---> .getValue() is what I need to change to an array.
 */
export function renameDialog(
  oldPath: string
): Promise<Contents.IModel | null> {
  return showDialog({
    title: 'Save Code Snippet',
    body: new RenameHandler(oldPath),
    focusNodeSelector: 'input',
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Save' })]
  }).then(result => {
    console.log(result.value);
    if (!result.value) {
      return null;
    }
    // if (!isValidFileName(result.value)) {
    //   void showErrorMessage(
    //     'Rename Error',
    //     Error(
    //       `"${result.value}" is not a valid name for a file. ` +
    //         `Names must have nonzero length, ` +
    //         `and cannot include "/", "\\", or ":"`
    //     )
    //   );
    //   return null;
    // }
    //const basePath = PathExt.dirname(oldPath);
    //const newPath = PathExt.join(basePath, result.value);
  });
}

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
  const validNameExp = /[\/\\:]/;
  return name.length > 0 && !validNameExp.test(name);
}

/**
 * A widget used to rename a file.
 */
class RenameHandler extends Widget {
  /**
   * Construct a new "rename" dialog.
   * readonly inputNode: HTMLInputElement; <--- in Widget class
   */
  constructor(oldPath: string) {
    super({ node: Private.createRenameNode(oldPath) });
    this.addClass(FILE_DIALOG_CLASS);
    //const ext = PathExt.extname(oldPath);
    //const value = (this.inputNode.value = PathExt.basename(oldPath));
    //this.inputNode.setSelectionRange(0, value.length - ext.length);
    //let inputs = [];
  }

  /**
   * Get the input text node. Put in loop maybe and append to some sort of class field.
   * Make it a single string separated by commas and then cast the HTMLInputElement.
   */
  // get inputNode(): HTMLInputElement {
  //   let temp = [];
  //   temp.push(this.node.getElementsByTagName('input')[0] as HTMLInputElement, this.node.getElementsByTagName('input')[1] as HTMLInputElement);
  //   console.log(temp[0].value);
  //   console.log(temp[1].value);
  //   return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  //   //gets input as HTMLInputElement object. Can then get the value by doing inputNode.value.
  // }

  getValue(): string[] {
    let inputs = [];
    inputs.push((this.node.getElementsByTagName('input')[0] as HTMLInputElement).value, (this.node.getElementsByTagName('input')[1] as HTMLInputElement).value);
    return inputs;
  }

  /**
   * Get the value of the widget. String of multiple values which can then be split and used separately?
   */
  // getValue(): string {
  //   //console.log(this.inputNode.value);
  //   return this.inputNode.value;
  // }
}

/**
 * A namespace for private data.
 */
namespace Private {
  /**
   * Create the node for a rename handler. This is what's creating all of the elements to be displayed.
   */
  export function createRenameNode(oldPath: string): HTMLElement {
    const body = document.createElement('div');
    const existingLabel = document.createElement('label');
    existingLabel.textContent = 'File Path';
    const existingPath = document.createElement('span');
    existingPath.textContent = oldPath;

    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'Snippet Name*';
    nameTitle.className = RENAME_NEWNAME_TITLE_CLASS;
    const name = document.createElement('input');
    
    const nameTitle2 = document.createElement('label');
    nameTitle2.textContent = 'Description*';
    nameTitle2.className = RENAME_NEWNAME_TITLE_CLASS;
    const name2 = document.createElement('input');

    body.appendChild(existingLabel);
    body.appendChild(existingPath);
    body.appendChild(nameTitle);
    body.appendChild(name);
    body.appendChild(nameTitle2);
    body.appendChild(name2);
    return body;
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  code: string[];
}

const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';

/**
 * Initialization data for the code_snippets extension.
 */
const code_snippet_extension: JupyterFrontEndPlugin<void> = {
  id: CODE_SNIPPET_EXTENSION_ID,
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    restorer: ILayoutRestorer
    ) => {
    console.log('JupyterLab extension code-snippets is activated!');
    const url = "elyra/metadata/code-snippets";

    const getCurrentWidget = (): Widget => {
      return app.shell.currentWidget;
    };

    const codeSnippetWidget = new CodeSnippetWidget(getCurrentWidget);
    codeSnippetWidget.id = CODE_SNIPPET_EXTENSION_ID;
    codeSnippetWidget.title.icon = codeSnippetIcon;
    codeSnippetWidget.title.caption = 'Jupyter Code Snippet';

    restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);

    // Rank has been chosen somewhat arbitrarily to give priority to the running
    // sessions widget in the sidebar.
    app.shell.add(codeSnippetWidget, 'left', { rank: 900 });

    //Add an application command
    const commandID = 'my-command';
    const toggled = false;
    app.commands.addCommand(commandID, {
      label: 'Save As Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: () => {
        console.log(`Executed ${commandID}`);
        let temp = getSelectedText();
        // RequestHandler.makePostRequest(
        //   url,
        //   JSON.stringify({ 
        //     display_name: "highlighted3",
        //     metadata: {
        //         code: [
        //             temp
        //         ],
        //         description: "Print highlighted code 3",
        //         language: "python",
        //     },
        //     name: "highlighted3",
        //     schema_name: "code-snippet",
        //   }),
        //   false
        // );
        // InputDialog.getText({
        //   title: "Please enter the necessary information and the press ok.",
        //   text: "Name",
        //   placeholder: "Trial1"
        // })

        renameDialog("src/codesnippets");

        //console.log(`Highlight trial: ${JSON.stringify(response)}`);
        console.log(`Highlight trial: ${temp}`);
        /* TODO: Replace command with command 
        that saves snippet to snippet bar */
    }});
    
    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    })
    
    // Example Get Request
    RequestHandler.makeGetRequest(
     URLExt.join(url, '/example2'),
      false);
  
  } 
  }

function getSelectedText() : string { 
  let selectedText; 

  // window.getSelection 
  if (window.getSelection) { 
      selectedText = window.getSelection(); 
  } 
  // document.getSelection 
  else if (document.getSelection) { 
      selectedText = document.getSelection(); 
  } 
  return selectedText.toString();
};

export default code_snippet_extension;
