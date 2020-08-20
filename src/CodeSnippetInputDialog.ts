import { Widget } from '@lumino/widgets';
import checkSVGstr from '../style/icon/check.svg';
import { showMessage } from './ConfirmMessage';

import { showCodeSnippetForm, CodeSnippetForm } from './CodeSnippetForm';
import { showDialog, Dialog } from '@jupyterlab/apputils';
import { addIcon, checkIcon } from '@jupyterlab/ui-components';

import { Contents } from '@jupyterlab/services';

import { JSONObject } from '@lumino/coreutils';

import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

import { CodeSnippetWidget } from './CodeSnippetWidget';
import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';
import { SUPPORTED_LANGUAGES } from './index';

/**
 * The class name added to file dialogs.
 */
const FILE_DIALOG_CLASS = 'jp-FileDialog';

/**
 * The class name added for the new name label in the rename dialog
 */
const INPUT_NEW_SNIPPET_CLASS = 'jp-newSnippet-input';

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
export function CodeSnippetInputDialog(
  codeSnippet: CodeSnippetWidget,
  code: string[],
  idx: number
): Promise<Contents.IModel | null> {
  const tags: string[] = [];
  const snippets = codeSnippet.codeSnippetWidgetModel.snippets;

  for (const snippet of snippets) {
    if (snippet.tags) {
      tags.push(...snippet.tags);
    }
  }

  return showCodeSnippetForm({
    title: 'Save Code Snippet',
    body: new InputHandler(tags),
    // focusNodeSelector: 'input',
    buttons: [
      CodeSnippetForm.cancelButton(),
      CodeSnippetForm.okButton({ label: 'Save' })
    ]
  }).then((result: CodeSnippetForm.IResult<string[]>) => {
    if (validateForm(result) === false) {
      return CodeSnippetInputDialog(codeSnippet, code, idx); // This works but it wipes out all the data they entered previously...
    }
    if (!result.value) {
      return null;
    } else {
      if (idx === -1) {
        idx = codeSnippet.codeSnippetWidgetModel.snippets.length;
      }

      const tags = result.value.slice(3);
      console.log(tags);
      const newSnippet: ICodeSnippet = {
        name: result.value[0].replace(' ', '').toLowerCase(),
        description: result.value[1],
        language: result.value[2],
        code: code,
        id: idx,
        tags: tags
      };
      const contentsService = CodeSnippetContentsService.getInstance();
      const currSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
      for (const snippet of currSnippets) {
        if (snippet.name === newSnippet.name) {
          // const oldPath = 'snippets/' + snippet.name + '.json';
          const result = saveOverWriteFile(
            codeSnippet.codeSnippetWidgetModel,
            snippet,
            newSnippet
          );

          result
            .then(newSnippets => {
              codeSnippet.renderCodeSnippetsSignal.emit(newSnippets);
            })
            .catch(_ => {
              console.log('cancelling overwrite!');
            });
          return;
        }
      }

      createNewSnippet(codeSnippet, newSnippet, contentsService);
    }
  });
}

function createNewSnippet(
  codeSnippet: CodeSnippetWidget,
  newSnippet: ICodeSnippet,
  contentsService: CodeSnippetContentsService
): void {
  const request = contentsService.save(
    'snippets/' + newSnippet.name + '.json',
    {
      type: 'file',
      format: 'text',
      content: JSON.stringify(newSnippet)
    }
  );

  request.then(_ => {
    // add the new snippet to the snippet model
    codeSnippet.codeSnippetWidgetModel.addSnippet(newSnippet, newSnippet.id);
    codeSnippet.codeSnippetWidgetModel.updateSnippetContents();
    const newSnippets = codeSnippet.codeSnippetWidgetModel.snippets;
    codeSnippet.codeSnippets = newSnippets;
    codeSnippet.renderCodeSnippetsSignal.emit(newSnippets);
    showMessage({
      body: /*"Saved as Snippet"*/ new MessageHandler()
    });
  });
}

/**
 * Rename a file, asking for confirmation if it is overwriting another.
 */
async function saveOverWriteFile(
  codeSnippetWidgetModel: CodeSnippetWidgetModel,
  oldSnippet: ICodeSnippet,
  newSnippet: ICodeSnippet
): Promise<ICodeSnippet[] | null> {
  const newPath = 'snippets/' + newSnippet.name + '.json';

  return await shouldOverwrite(newPath).then(value => {
    if (value) {
      newSnippet.id = oldSnippet.id;

      codeSnippetWidgetModel.deleteSnippet(oldSnippet.id);
      codeSnippetWidgetModel.addSnippet(newSnippet, oldSnippet.id);
      codeSnippetWidgetModel.updateSnippetContents();
      return codeSnippetWidgetModel.snippets;
    }
    return Promise.reject('File not renamed');
  });
}

/**
 * Ask the user whether to overwrite a file.
 */
async function shouldOverwrite(path: string): Promise<boolean> {
  const options = {
    title: 'Overwrite code snippet?',
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
export function validateForm(
  input: CodeSnippetForm.IResult<string[]>
): boolean {
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
 * A widget used to get input data.
 */
class InputHandler extends Widget {
  /**
   * Construct a new "rename" dialog.
   * readonly inputNode: HTMLInputElement; <--- in Widget class
   */
  constructor(tags: string[]) {
    super({ node: Private.createInputNode(tags) });
    this.addClass(FILE_DIALOG_CLASS);
  }

  getValue(): string[] {
    const inputs = [];
    inputs.push(
      (this.node.getElementsByTagName('input')[0] as HTMLInputElement).value,
      (this.node.getElementsByTagName('input')[1] as HTMLInputElement).value,
      (this.node.getElementsByTagName('input')[2] as HTMLInputElement).value
    );

    inputs.push(...Private.selectedTags);

    return inputs;
  }
}

class MessageHandler extends Widget {
  constructor() {
    super({ node: Private.createConfirmMessageNode() });
  }
}

// /**
//  * A method to create an input when the user selects the Other option.
//  */
// function createLanguageInput(form: HTMLFormElement): void {
//   const newInput = document.createElement('input');
//   newInput.id = 'alternate-user-input';
//   form.appendChild(newInput);
// }

// /**
//  * A method to remove an input when the user selects the Other option.
//  */
// function removeLanguageInput(form: HTMLFormElement): void {
//   const unusedInput = document.getElementById('alternate-user-input');
//   if (form.contains(unusedInput)) {
//     form.removeChild(unusedInput);
//   }
// }

/**
 * A namespace for private data.
 */
class Private {
  static selectedTags: string[] = [];
  /**
   * Create the node for a rename handler. This is what's creating all of the elements to be displayed.
   */
  static createInputNode(tags: string[]): HTMLElement {
    const body = document.createElement('form');
    const nameValidity = document.createElement('p');
    nameValidity.textContent =
      'Name of the code snippet MUST be alphanumeric or composed of underscore(_)';
    nameValidity.className = 'jp-inputName-validity';

    const descriptionValidity = document.createElement('p');
    descriptionValidity.textContent =
      'Description of the code snippet MUST be alphanumeric or composed of underscore(_)';
    descriptionValidity.className = 'jp-inputDesc-validity';

    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'Snippet Name*';
    const name = document.createElement('input');
    name.className = INPUT_NEW_SNIPPET_CLASS;
    name.required = true;
    // prettier-ignore
    name.pattern = '[a-zA-Z0-9_]+';

    const descriptionTitle = document.createElement('label');
    descriptionTitle.textContent = 'Description*';
    const description = document.createElement('input');
    description.className = INPUT_NEW_SNIPPET_CLASS;
    description.required = true;
    // prettier-ignore
    description.pattern = '[a-zA-Z0-9_]+';

    const languageTitle = document.createElement('label');
    languageTitle.textContent = 'Language*';
    const languageInput = document.createElement('input');
    languageInput.className = INPUT_NEW_SNIPPET_CLASS;
    languageInput.setAttribute('list', 'languages');
    languageInput.required = true;
    const languageOption = document.createElement('datalist');
    languageOption.id = 'languages';

    SUPPORTED_LANGUAGES.sort();
    for (const language of SUPPORTED_LANGUAGES) {
      const option = document.createElement('option');
      option.value = language;
      languageOption.appendChild(option);
    }

    const tagList = document.createElement('li');
    tagList.classList.add('jp-codeSnippet-inputTagList');
    for (const tag of tags) {
      const tagElem = document.createElement('ul');
      tagElem.className = 'jp-codeSnippet-inputTag tag unapplied-tag';
      const tagBtn = document.createElement('button');
      tagBtn.innerText = tag;
      tagBtn.onclick = Private.handleClick;
      tagElem.appendChild(tagBtn);
      tagList.appendChild(tagElem);
    }

    const addTagElem = document.createElement('ul');
    addTagElem.className = 'jp-codeSnippet-inputTag tag unapplied-tag';
    const newTagName = document.createElement('span');
    newTagName.innerText = 'Add Tag';
    newTagName.style.cursor = 'pointer';
    addTagElem.appendChild(newTagName);
    const plusIcon = addIcon.element({
      tag: 'span',
      className: 'jp-codeSnippet-inputTag-plusIcon',
      elementPosition: 'center',
      height: '16px',
      width: '16px',
      marginLeft: '2px'
    });

    newTagName.onclick = Private.addTag;

    addTagElem.appendChild(plusIcon);
    tagList.append(addTagElem);

    // const optionPython = document.createElement('option');
    // optionPython.textContent = 'python';
    // const optionR = document.createElement('option');
    // optionR.textContent = 'R';
    // const optionScala = document.createElement('option');
    // optionScala.textContent = 'Scala';
    // const optionOther = document.createElement('option');
    // optionOther.textContent = 'Other';
    // optionOther.onclick = (): void => {
    //   createLanguageInput(body);
    // };
    // optionPython.onclick = (): void => {
    //   removeLanguageInput(body);
    // };
    // optionScala.onclick = (): void => {
    //   removeLanguageInput(body);
    // };
    // optionR.onclick = (): void => {
    //   removeLanguageInput(body);
    // };
    // language.appendChild(optionPython);
    // language.appendChild(optionR);
    // language.appendChild(optionScala);
    // language.appendChild(optionOther);

    // if (language.value === 'Other') {
    //   createLanguageInput(body);
    // } else {
    //   removeLanguageInput(body);
    // }

    body.appendChild(nameTitle);
    body.appendChild(name);
    body.appendChild(nameValidity);
    body.appendChild(descriptionTitle);
    body.appendChild(description);
    body.appendChild(descriptionValidity);
    body.appendChild(languageTitle);
    body.appendChild(languageInput);
    body.appendChild(languageOption);
    body.appendChild(tagList);
    return body;
  }

  // replace the newTagName to input and delete plusIcon and insertbefore current tag on keydown or blur (refer to cell tags)
  static addTag(event: MouseEvent): boolean {
    event.preventDefault();
    const target = event.target as HTMLElement;

    const plusIcon = document.querySelector(
      '.jp-codeSnippet-inputTag-plusIcon'
    );
    plusIcon.remove();

    const newTagName = document.createElement('input');
    target.parentElement.replaceChild(newTagName, target);

    // document.addEventListener('keydown', this.addTagOnKeyDown, true);
    newTagName.onkeydown = Private.addTagOnKeyDown;
    newTagName.onblur = Private.addTagOnBlur;

    // (document.querySelector('.jp-Dialog') as HTMLElement).onkeydown = null;

    newTagName.focus();

    // newTagName.addEventListener('ch)

    // newTagName.addEventListener('blur', Private.addTagOnBlur, true);

    // newTagName.addEventListener('blur', this.addTagOnBlur, false);

    return false;
  }

  static addTagOnKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value !== '' && event.keyCode === 13) {
      // duplicate tag
      if (Private.selectedTags.includes(inputElement.value)) {
        alert('Duplicate Tag Name!');
      }
      event.preventDefault();

      // create new tag
      const tagList = document.querySelector('.jp-codeSnippet-inputTagList');
      const tagElem = document.createElement('ul');
      tagElem.className = 'jp-codeSnippet-inputTag tag applied-tag';
      const tagBtn = document.createElement('button');
      tagBtn.innerText = inputElement.value;
      tagBtn.onclick = Private.handleClick;
      tagElem.appendChild(tagBtn);
      tagList.insertBefore(tagElem, inputElement.parentElement);
      // this.selectedTags.push(tagBtn.innerText);

      // add selected checked mark
      const iconContainer = checkIcon.element({
        className: 'jp-codeSnippet-inputTag-check',
        tag: 'span',
        elementPosition: 'center',
        height: '18px',
        width: '18px',
        marginLeft: '5px',
        marginRight: '-3px'
      });
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color1'
      );
      tagBtn.style.color = color;
      tagElem.appendChild(iconContainer);

      // add it to the selected tags
      Private.selectedTags.push(tagBtn.innerText);

      // add plusIcon
      const plusIcon = addIcon.element({
        tag: 'span',
        className: 'jp-codeSnippet-inputTag-plusIcon',
        elementPosition: 'center',
        height: '16px',
        width: '16px',
        marginLeft: '2px'
      });

      // change input to span
      const newTagName = document.createElement('span');
      newTagName.innerText = 'Add Tag';
      newTagName.style.cursor = 'pointer';
      inputElement.parentElement.replaceChild(newTagName, inputElement);

      newTagName.parentElement.appendChild(plusIcon);
      newTagName.onclick = Private.addTag;

      event.stopPropagation();
    }
    // return false;
  }

  static addTagOnBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;

    // add plusIcon
    const plusIcon = addIcon.element({
      tag: 'span',
      className: 'jp-codeSnippet-inputTag-plusIcon',
      elementPosition: 'center',
      height: '16px',
      width: '16px',
      marginLeft: '2px'
    });

    // change input to span
    const newTagName = document.createElement('span');
    newTagName.innerText = 'Add Tag';
    newTagName.style.cursor = 'pointer';
    inputElement.parentElement.replaceChild(newTagName, inputElement);

    newTagName.parentElement.appendChild(plusIcon);
    newTagName.onclick = Private.addTag;
  }

  static handleClick(event: MouseEvent): boolean {
    // event.preventDefault();

    const target = event.target as HTMLElement;
    const parent = target.parentElement;
    // const filteredTags = this.state.filteredTags.slice();

    // console.log(Private.selectedTags);
    if (parent.classList.contains('unapplied-tag')) {
      Private.selectedTags.push(target.innerText);
      parent.classList.replace('unapplied-tag', 'applied-tag');
      const iconContainer = checkIcon.element({
        className: 'jp-codeSnippet-inputTag-check',
        tag: 'span',
        elementPosition: 'center',
        height: '18px',
        width: '18px',
        marginLeft: '5px',
        marginRight: '-3px'
      });
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color1'
      );
      target.style.color = color;
      if (parent.children.length === 1) {
        parent.appendChild(iconContainer);
      }
    } else if (parent.classList.contains('applied-tag')) {
      const idx = Private.selectedTags.indexOf(target.innerText);
      Private.selectedTags.splice(idx, 1);

      parent.classList.replace('applied-tag', 'unapplied-tag');
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color2'
      );
      target.style.color = color;

      if (parent.children.length !== 1) {
        // remove check icon
        parent.removeChild(parent.children.item(1));
      }
    }
    return false;
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
