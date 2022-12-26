// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { Dialog } from '@jupyterlab/apputils';
import { addIcon, checkIcon } from '@jupyterlab/ui-components';
import { Contents } from '@jupyterlab/services';

import { Widget } from '@lumino/widgets';
import { Message } from '@lumino/messaging';

import { ICodeSnippet, CodeSnippetService } from './CodeSnippetService';
import { showMessage } from './CodeSnippetMessage';

import { CodeSnippetWidget } from './CodeSnippetWidget';
import { SUPPORTED_LANGUAGES } from './CodeSnippetLanguages';
import { validateInputs, saveOverWriteFile } from './CodeSnippetUtilities';

/**
 * The class name added to file dialogs.
 */
const FILE_DIALOG_CLASS = 'jp-codeSnippet-fileDialog';

/**
 * CSS STYLING
 */
const CODE_SNIPPET_DIALOG_NAME_INPUT = 'jp-codeSnippet-dialog-name-input';
const CODE_SNIPPET_DIALOG_DESC_INPUT = 'jp-codeSnippet-dialog-desc-input';
const CODE_SNIPPET_DIALOG_LANG_INPUT = 'jp-codeSnippet-dialog-lang-input';
const CODE_SNIPPET_INPUTTAG_PLUS_ICON = 'jp-codeSnippet-inputTag-plusIcon';
const CODE_SNIPPET_INPUTTAG_LIST = 'jp-codeSnippet-inputTagList';
const CODE_SNIPPET_INPUT_TAG = 'jp-codeSnippet-inputTag';
const CODE_SNIPPET_INPUT_TAG_CHECK = 'jp-codeSnippet-inputTag-check';

class CodeSnippetDialog extends Dialog<any> {
  first: HTMLElement;
  protected onAfterAttach(msg: Message): void {
    const node = this.node;
    node.addEventListener('keydown', this, false);
    node.addEventListener('contextmenu', this, true);
    node.addEventListener('click', this, true);
    document.addEventListener('focus', this, true);

    const body = this.node.querySelector('.jp-Dialog-body');
    const el = body.querySelector(
      `.${CODE_SNIPPET_DIALOG_NAME_INPUT}`
    ) as HTMLElement;
    this.first = el;
    el.focus();
  }

  protected onAfterDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('keydown', this, false);
    node.removeEventListener('contextmenu', this, true);
    node.removeEventListener('click', this, true);
    document.removeEventListener('focus', this, true);
  }

  protected _evtKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        event.stopPropagation();
        event.preventDefault();
        this.reject();
        break;
      case 'Tab': {
        const last_button = document.querySelector('.jp-mod-accept');
        if (document.activeElement === last_button && !event.shiftKey) {
          event.stopPropagation();
          event.preventDefault();
          this.first.focus();
        }
        break;
      }
      case 'Enter':
        event.stopPropagation();
        event.preventDefault();
        this.resolve();
        break;
      default:
        break;
    }
  }
}

function showCodeSnippetDialog<T>(
  options: Partial<Dialog.IOptions<T>> = {}
): Promise<Dialog.IResult<T>> {
  const dialog = new CodeSnippetDialog(options);
  return dialog.launch();
}

/**
 * Save an input with a dialog. This is what actually displays everything.
 * Result.value is the value retrieved from .getValue(). ---> .getValue() returns an array of inputs.
 */
export function CodeSnippetInputDialog(
  codeSnippetWidget: CodeSnippetWidget,
  code: string,
  language: string,
  idx: number
): Promise<Contents.IModel | null> {
  const tags: string[] = [];
  const langTags: string[] = [];
  const codeSnippetManager = CodeSnippetService.getCodeSnippetService();

  const snippets = codeSnippetManager.snippets;

  // get all active tags
  for (const snippet of snippets) {
    if (snippet.tags) {
      for (const tag of snippet.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
    }
    if (!langTags.includes(snippet.language)) {
      langTags.push(snippet.language);
    }
  }

  const body: InputHandler = new InputHandler(tags, language, langTags);

  return showInputDialog(
    codeSnippetWidget,
    tags,
    idx,
    codeSnippetManager,
    code,
    language,
    body
  );
}

/**
 * This function creates the actual input form and processes the inputs given.
 */
export function showInputDialog(
  codeSnippetWidget: CodeSnippetWidget,
  tags: string[],
  idx: number,
  codeSnippetManager: CodeSnippetService,
  code: string,
  language: string,
  body: InputHandler
): Promise<Contents.IModel | null> {
  return showCodeSnippetDialog({
    title: 'Save Code Snippet',
    body: body,
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Save' })],
  }).then((result: Dialog.IResult<string[]>) => {
    if (!result.value) {
      return null;
    }

    const nameInput = result.value[0];
    const descriptionInput = result.value[1];
    const languageInput = result.value[2];

    if (!validateInputs(nameInput, descriptionInput, languageInput)) {
      showInputDialog(
        codeSnippetWidget,
        tags,
        idx,
        codeSnippetManager,
        code,
        language,
        body
      );
    } else {
      const tags = result.value.slice(3);
      const newSnippet: ICodeSnippet = {
        name: nameInput.replace(' ', ''),
        description: descriptionInput,
        language: languageInput,
        code: code,
        id: idx,
        tags: tags,
      };

      for (const snippet of codeSnippetManager.snippets) {
        if (snippet.name === newSnippet.name) {
          saveOverWriteFile(codeSnippetManager, snippet, newSnippet).then(
            (res: boolean) => {
              if (res) {
                codeSnippetWidget.renderCodeSnippetsSignal.emit(
                  codeSnippetManager.snippets
                );
              }
            }
          );
          return;
        }
      }

      createNewSnippet(codeSnippetWidget, newSnippet, codeSnippetManager);
    }
  });
}

function createNewSnippet(
  codeSnippetWidget: CodeSnippetWidget,
  newSnippet: ICodeSnippet,
  codeSnippetManager: CodeSnippetService
): void {
  codeSnippetManager.addSnippet(newSnippet).then((res: boolean) => {
    if (!res) {
      console.log('Error in adding snippet');
      return;
    }
  });

  codeSnippetWidget.renderCodeSnippetsSignal.emit(codeSnippetManager.snippets);
  showMessage('confirm');
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
 * A widget used to get input data.
 */
class InputHandler extends Widget {
  /**
   * Construct a new "code snippet" dialog.
   * readonly inputNode: HTMLInputElement; <--- in Widget class
   */
  constructor(snippetTags: string[], language: string, langTags: string[]) {
    super({ node: Private.createInputNode(snippetTags, language, langTags) });
    this.addClass(FILE_DIALOG_CLASS);
  }

  getValue(): string[] {
    const inputs = [];
    inputs.push(
      (
        this.node.querySelector(
          `.${CODE_SNIPPET_DIALOG_NAME_INPUT}`
        ) as HTMLInputElement
      ).value,
      (
        this.node.querySelector(
          `.${CODE_SNIPPET_DIALOG_DESC_INPUT}`
        ) as HTMLInputElement
      ).value,
      (
        this.node.querySelector(
          `.${CODE_SNIPPET_DIALOG_LANG_INPUT}`
        ) as HTMLInputElement
      ).value
    );

    inputs.push(...Private.selectedTags);

    // reset selectedTags
    Private.selectedTags = [];

    return inputs;
  }
}

/**
 * A namespace for private data.
 */
class Private {
  static selectedTags: string[] = [];
  static allSnippetTags: string[];
  static allLangTags: string[];

  static handleOnBlur(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('touched')) {
      target.classList.add('touched');
    }
  }

  /**
   * Create the node for a code snippet form handler. This is what's creating all of the elements to be displayed.
   */
  static createInputNode(
    snippetTags: string[],
    language: string,
    langTags: string[]
  ): HTMLElement {
    Private.allSnippetTags = snippetTags;
    Private.allLangTags = langTags;
    const body = document.createElement('form');

    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'Snippet Name (required)';
    const name = document.createElement('input');
    name.className = CODE_SNIPPET_DIALOG_NAME_INPUT;
    name.required = true;
    name.placeholder = 'Ex. starter code';
    name.onblur = Private.handleOnBlur;

    const descriptionTitle = document.createElement('label');
    descriptionTitle.textContent = 'Description (optional)';
    const description = document.createElement('input');
    description.className = CODE_SNIPPET_DIALOG_DESC_INPUT;
    description.placeholder = 'Description';
    description.onblur = Private.handleOnBlur;

    const languageTitle = document.createElement('label');
    languageTitle.textContent = 'Language (required)';
    const languageInput = document.createElement('input');
    languageInput.className = CODE_SNIPPET_DIALOG_LANG_INPUT;
    languageInput.setAttribute('list', 'languages');
    // capitalize the first character
    languageInput.value = language[0].toUpperCase() + language.slice(1);
    languageInput.required = true;
    const languageOption = document.createElement('datalist');
    languageOption.id = 'languages';
    languageOption.onblur = Private.handleOnBlur;

    SUPPORTED_LANGUAGES.sort();
    for (const supportedLanguage of SUPPORTED_LANGUAGES) {
      const option = document.createElement('option');
      option.value = supportedLanguage;
      languageOption.appendChild(option);
    }

    const tagList = document.createElement('li');
    tagList.classList.add(CODE_SNIPPET_INPUTTAG_LIST);
    for (const tag of snippetTags) {
      const tagElem = document.createElement('ul');
      tagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag unapplied-tag`;
      const tagBtn = document.createElement('button');
      tagBtn.innerText = tag;
      tagBtn.onclick = Private.handleClick;
      tagElem.appendChild(tagBtn);
      tagList.appendChild(tagElem);
    }

    const addTagElem = document.createElement('ul');
    addTagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag unapplied-tag`;
    const newTagName = document.createElement('button');
    newTagName.innerText = 'Add Tag';
    newTagName.style.cursor = 'pointer';
    addTagElem.appendChild(newTagName);
    const plusIcon = addIcon.element({
      tag: 'span',
      className: CODE_SNIPPET_INPUTTAG_PLUS_ICON,
      elementPosition: 'center',
      height: '16px',
      width: '16px',
      marginLeft: '2px',
    });

    newTagName.onclick = Private.addTag;

    addTagElem.appendChild(plusIcon);
    tagList.append(addTagElem);

    body.appendChild(nameTitle);
    body.appendChild(name);
    body.appendChild(descriptionTitle);
    body.appendChild(description);
    body.appendChild(languageTitle);
    body.appendChild(languageInput);
    body.appendChild(languageOption);
    body.appendChild(tagList);
    return body;
  }

  // replace the newTagName to input and delete plusIcon and insertbefore current tag on keydown or blur (refer to cell tags)
  static addTag(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;

    const plusIcon = document.querySelector(
      '.jp-codeSnippet-inputTag-plusIcon'
    );
    plusIcon.remove();

    const newTagName = document.createElement('input');
    target.parentElement.replaceChild(newTagName, target);

    newTagName.onkeydown = Private.addTagOnKeyDown;
    newTagName.onblur = Private.addTagOnBlur;
    newTagName.focus();
    return false;
  }

  static addTagOnKeyDown(event: KeyboardEvent): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value !== '' && event.key === 'Enter') {
      // duplicate tag
      if (Private.allSnippetTags.includes(inputElement.value)) {
        alert('Duplicate Tag Name!');
        return;
      }

      if (Private.allLangTags.includes(inputElement.value)) {
        alert(
          'This tag already exists in language tags!\nIf you want to create this tag, lowercase the first letter.'
        );
        return;
      }

      event.preventDefault();

      // create new tag
      const tagList = document.querySelector('.jp-codeSnippet-inputTagList');
      const tagElem = document.createElement('ul');
      tagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag applied-tag`;
      const tagBtn = document.createElement('button');
      tagBtn.innerText = inputElement.value;
      tagBtn.onclick = Private.handleClick;
      tagElem.appendChild(tagBtn);
      tagList.insertBefore(tagElem, inputElement.parentElement);

      // add check mark when tag gets selected
      const iconContainer = checkIcon.element({
        className: CODE_SNIPPET_INPUT_TAG_CHECK,
        tag: 'span',
        elementPosition: 'center',
        height: '18px',
        width: '18px',
        marginLeft: '5px',
        marginRight: '-3px',
      });
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color1'
      );
      tagBtn.style.color = color;
      tagElem.appendChild(iconContainer);

      // add it to the selected tags
      Private.selectedTags.push(tagBtn.innerText);
      Private.allSnippetTags.push(tagBtn.innerText);

      // reset InputElement
      inputElement.blur();
      event.stopPropagation();
    } else if (event.key === 'Escape') {
      inputElement.blur();
      event.stopPropagation();
    }
  }

  static addTagOnBlur(event: FocusEvent): void {
    const inputElement = event.target as HTMLInputElement;

    // add plusIcon
    const plusIcon = addIcon.element({
      tag: 'span',
      className: CODE_SNIPPET_INPUTTAG_PLUS_ICON,
      elementPosition: 'center',
      height: '16px',
      width: '16px',
      marginLeft: '2px',
    });

    // change input to span
    const newTagName = document.createElement('button');
    newTagName.innerText = 'Add Tag';
    newTagName.style.cursor = 'pointer';
    inputElement.parentElement.replaceChild(newTagName, inputElement);

    newTagName.parentElement.appendChild(plusIcon);
    newTagName.onclick = Private.addTag;
  }

  static handleClick(event: MouseEvent): boolean {
    const target = event.target as HTMLElement;
    const parent = target.parentElement;

    if (parent.classList.contains('unapplied-tag')) {
      Private.selectedTags.push(target.innerText);
      parent.classList.replace('unapplied-tag', 'applied-tag');
      const iconContainer = checkIcon.element({
        className: CODE_SNIPPET_INPUT_TAG_CHECK,
        tag: 'span',
        elementPosition: 'center',
        height: '18px',
        width: '18px',
        marginLeft: '5px',
        marginRight: '-3px',
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
}
