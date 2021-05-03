import { showDialog, Dialog } from '@jupyterlab/apputils';

import { SUPPORTED_LANGUAGES } from './CodeSnippetLanguages';
import { CodeSnippetService, ICodeSnippet } from './CodeSnippetService';

/**
 * Test whether user typed in all required inputs.
 */
export function validateInputs(
  name: string,
  description: string,
  language: string
): boolean {
  let status = true;
  let message = '';
  if (name === '') {
    message += 'Name must be filled out\n';
    status = false;
  }
  if (language === '') {
    message += 'Language must be filled out';
    status = false;
  }
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    message += 'Language must be one of the options';
    status = false;
  }
  if (status === false) {
    alert(message);
  }
  return status;
}

/**
 * Rename a file, warning for overwriting another.
 */
export async function saveOverWriteFile(
  codeSnippetManager: CodeSnippetService,
  oldSnippet: ICodeSnippet,
  newSnippet: ICodeSnippet
): Promise<boolean> {
  const newName = newSnippet.name;

  return await shouldOverwrite(newName).then((res) => {
    if (res) {
      newSnippet.id = oldSnippet.id;

      codeSnippetManager.deleteSnippet(oldSnippet.id).then((res: boolean) => {
        if (!res) {
          console.log('Error in overwriting a snippet (delete)');
          return false;
        }
      });
      codeSnippetManager.addSnippet(newSnippet).then((res: boolean) => {
        if (!res) {
          console.log('Error in overwriting a snippet (add)');
          return false;
        }
      });
      return true;
    }
  });
}

/**
 * Ask the user whether to overwrite a file.
 */
async function shouldOverwrite(newName: string): Promise<boolean> {
  const options = {
    title: 'Overwrite code snippet?',
    body: `"${newName}" already exists, overwrite?`,
    buttons: [Dialog.cancelButton(), Dialog.warnButton({ label: 'Overwrite' })],
  };
  return showDialog(options).then((result) => {
    return result.button.accept;
  });
}
