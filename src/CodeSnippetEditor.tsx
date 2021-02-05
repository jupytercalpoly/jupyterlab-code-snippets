// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

// Some lines of code are from Elyra Code Snippet.

/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */

import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import {
  ReactWidget,
  showDialog,
  Dialog,
  WidgetTracker
} from '@jupyterlab/apputils';
import { Button } from '@jupyterlab/ui-components';
import { Contents } from '@jupyterlab/services';

import { Message } from '@lumino/messaging';

import React from 'react';

import { CodeSnippetContentsService } from './CodeSnippetContentsService';
import { CodeSnippetWidget } from './CodeSnippetWidget';
import { SUPPORTED_LANGUAGES } from './CodeSnippetLanguages';
import { CodeSnippetEditorTags } from './CodeSnippetEditorTags';

/**
 * CSS style classes
 */
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_EDITOR_TITLE = 'jp-codeSnippet-editor-title';
const CODE_SNIPPET_EDITOR_METADATA = 'jp-codeSnippet-editor-metadata';
const CODE_SNIPPET_EDITOR_INPUT_ACTIVE = 'jp-codeSnippet-editor-active';
const CODE_SNIPPET_EDITOR_NAME_INPUT = 'jp-codeSnippet-editor-name';
const CODE_SNIPPET_EDITOR_LABEL = 'jp-codeSnippet-editor-label';
const CODE_SNIPPET_EDITOR_DESC_INPUT = 'jp-codeSnippet-editor-description';
const CODE_SNIPPET_EDITOR_LANG_INPUT = 'jp-codeSnippet-editor-language';
const CODE_SNIPPET_EDITOR_MIRROR = 'jp-codeSnippetInput-editor';
const CODE_SNIPPET_EDITOR_INPUTAREA = 'jp-codeSnippetInputArea';
const CODE_SNIPPET_EDITOR_INPUTAREA_MIRROR = 'jp-codeSnippetInputArea-editor';

const CODE_SNIPPET_EDITOR_INPUTNAME_VALIDITY =
  'jp-codeSnippet-inputName-validity';
const CODE_SNIPPET_EDITOR_INPUTDESC_VALIDITY =
  'jp-codeSnippet-inputDesc-validity';

const EDITOR_DIRTY_CLASS = 'jp-mod-dirty';

export interface ICodeSnippetEditorMetadata {
  name: string;
  description: string;
  language: string;
  code: string[];
  id: number;
  selectedTags: string[];
  allTags: string[];
  fromScratch: boolean;
  date_created: string;
  date_modified: string;
}

export class CodeSnippetEditor extends ReactWidget {
  editorServices: IEditorServices;
  private editor: CodeEditor.IEditor;
  private saved: boolean;
  private oldCodeSnippetName: string;
  private _codeSnippetEditorMetaData: ICodeSnippetEditorMetadata;
  private _hasRefreshedSinceAttach: boolean;
  contentsService: CodeSnippetContentsService;
  codeSnippetWidget: CodeSnippetWidget;
  tracker: WidgetTracker;

  constructor(
    contentsService: CodeSnippetContentsService,
    editorServices: IEditorServices,
    tracker: WidgetTracker,
    codeSnippetWidget: CodeSnippetWidget,
    args: ICodeSnippetEditorMetadata
  ) {
    super();

    this.addClass(CODE_SNIPPET_EDITOR);
    this.contentsService = contentsService;
    this.editorServices = editorServices;
    this.tracker = tracker;

    this._codeSnippetEditorMetaData = args;

    this.oldCodeSnippetName = args.name;
    this.saved = true;
    this._hasRefreshedSinceAttach = false;
    this.codeSnippetWidget = codeSnippetWidget;

    this.renderCodeInput = this.renderCodeInput.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.activateCodeMirror = this.activateCodeMirror.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.updateSnippet = this.updateSnippet.bind(this);
    this.handleChangeOnTag = this.handleChangeOnTag.bind(this);
  }

  get codeSnippetEditorMetadata(): ICodeSnippetEditorMetadata {
    return this._codeSnippetEditorMetaData;
  }

  private deactivateEditor(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    let target = event.target as HTMLElement;

    while (target && target.parentElement) {
      if (
        target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR) ||
        target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT) ||
        target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)
      ) {
        break;
      }
      target = target.parentElement;
    }

    const nameInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    );
    const descriptionInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    );
    const editor = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} #code-${this._codeSnippetEditorMetaData.id}`
    );

    if (target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT)) {
      this.deactivateDescriptionField(descriptionInput);
      this.deactivateCodeMirror(editor);
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)) {
      this.deactivateNameField(nameInput);
      this.deactivateCodeMirror(editor);
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
      this.deactivateNameField(nameInput);
      this.deactivateDescriptionField(descriptionInput);
    } else {
      this.deactivateNameField(nameInput);
      this.deactivateDescriptionField(descriptionInput);
      this.deactivateCodeMirror(editor);
    }
  }

  private deactivateNameField(nameInput: Element): void {
    if (nameInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
      nameInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
    }
  }

  private deactivateDescriptionField(descriptionInput: Element): void {
    if (descriptionInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
      descriptionInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
    }
  }

  private activeFieldState(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
      target.classList.add(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
    }
  }

  onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);

    if (
      !this.editor &&
      document.getElementById('code-' + this._codeSnippetEditorMetaData.id)
    ) {
      const editorFactory = this.editorServices.factoryService.newInlineEditor;
      const getMimeTypeByLanguage = this.editorServices.mimeTypeService
        .getMimeTypeByLanguage;

      this.editor = editorFactory({
        host: document.getElementById(
          'code-' + this._codeSnippetEditorMetaData.id
        ),
        model: new CodeEditor.Model({
          value: this._codeSnippetEditorMetaData.code.join('\n'),
          mimeType: getMimeTypeByLanguage({
            name: this._codeSnippetEditorMetaData.language,
            codemirror_mode: this._codeSnippetEditorMetaData.language
          })
        })
      });
      this.editor.model.value.changed.connect((args: any) => {
        this._codeSnippetEditorMetaData.code = args.text.split('\n');
        if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
          this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
        }
        this.saved = false;
      });
    }
    if (this.isVisible) {
      this._hasRefreshedSinceAttach = true;
      this.editor.refresh();
    }
  }

  onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);

    this._hasRefreshedSinceAttach = false;
    if (this.isVisible) {
      this.update();
    }

    window.addEventListener('beforeunload', e => {
      if (!this.saved) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  onAfterShow(msg: Message): void {
    if (!this._hasRefreshedSinceAttach) {
      this.update();
    }
  }

  /**
   * Initial focus on the editor when it gets activated!
   * @param msg
   */
  onActivateRequest(msg: Message): void {
    this.editor.focus();
  }

  onCloseRequest(msg: Message): void {
    if (!this.saved) {
      showDialog({
        title: 'Close without saving?',
        body: (
          <p>
            {' '}
            {`"${this._codeSnippetEditorMetaData.name}" has unsaved changes, close without saving?`}{' '}
          </p>
        ),
        buttons: [
          Dialog.cancelButton(),
          Dialog.warnButton({ label: 'Discard' }),
          Dialog.okButton({ label: 'Save' })
        ]
      }).then((response: any): void => {
        console.log(response.button);
        if (response.button.accept) {
          if (response.button.label === 'Discard') {
            this.dispose();
            super.onCloseRequest(msg);
          } else if (response.button.label === 'Save') {
            const name = (document.querySelector(
              `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
            ) as HTMLInputElement).value;
            const description = (document.querySelector(
              `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
            ) as HTMLInputElement).value;
            const language = (document.querySelector(
              `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`
            ) as HTMLSelectElement).value;

            const validity = this.validateInputs(name, description, language);
            if (validity) {
              this.updateSnippet().then(value => {
                if (value) {
                  this.dispose();
                  super.onCloseRequest(msg);
                }
              });
            }
          }
        }
      });
    } else {
      this.dispose();
      super.onCloseRequest(msg);
    }
  }

  /**
   * Visualize the editor more look like an editor
   * @param event
   */
  activateCodeMirror(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    let target = event.target as HTMLElement;

    while (target && target.parentElement) {
      if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
        break;
      }
      target = target.parentElement;
    }

    const editor = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} #code-${this._codeSnippetEditorMetaData.id}`
    );

    if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
      if (!editor.classList.contains('active')) {
        editor.classList.add('active');
      }
    }
  }

  deactivateCodeMirror(editor: Element): void {
    if (editor.classList.contains('active')) {
      editor.classList.remove('active');
    }
  }

  handleInputFieldChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
      this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
    }

    const target = event.target as HTMLElement;

    if (!target.classList.contains('FieldChanged')) {
      target.classList.add('FieldChanged');
    }

    this.saved = false;
  }

  saveChange(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    const name = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    ) as HTMLInputElement).value;
    const description = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    ) as HTMLInputElement).value;
    const language = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`
    ) as HTMLSelectElement).value;

    const validity = this.validateInputs(name, description, language);
    if (validity) {
      this.updateSnippet();
    }
  }

  private validateInputs(
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
    if (name.match(/[^a-z0-9_]+/)) {
      message += 'Wrong format of the name\n';
      status = false;
    }
    if (description === '') {
      message += 'Description must be filled out\n';
      status = false;
    }
    if (description.match(/[^a-zA-Z0-9_ ,.?!]+/)) {
      message += 'Wrong format of the description\n';
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

  async updateSnippet(): Promise<boolean> {
    const name = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    ) as HTMLInputElement).value;
    const description = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    ) as HTMLInputElement).value;
    const language = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`
    ) as HTMLSelectElement).value;

    this._codeSnippetEditorMetaData.name = name;
    this._codeSnippetEditorMetaData.description = description;
    this._codeSnippetEditorMetaData.language = language;
    this._codeSnippetEditorMetaData.date_modified = new Date().toLocaleString();

    const newPath =
      'snippets/' + this._codeSnippetEditorMetaData.name + '.json';

    if (!this._codeSnippetEditorMetaData.fromScratch) {
      const oldPath = 'snippets/' + this.oldCodeSnippetName + '.json';

      if (newPath !== oldPath) {
        // renaming code snippet
        try {
          await this.contentsService.rename(oldPath, newPath);
        } catch (error) {
          await showDialog({
            title: 'Duplicate Name of Code Snippet',
            body: <p> {`"${newPath}" already exists.`} </p>,
            buttons: [Dialog.okButton({ label: 'Dismiss' })]
          });
          return false;
        }

        // set new name as an old name
        this.oldCodeSnippetName = this._codeSnippetEditorMetaData.name;
      }
    } else {
      let nameCheck = false;
      await this.contentsService
        .getData(newPath, 'file')
        .then(async (value: Contents.IModel) => {
          if (value.name) {
            await showDialog({
              title: 'Duplicate Name of Code Snippet',
              body: <p> {`"${newPath}" already exists.`} </p>,
              buttons: [Dialog.okButton({ label: 'Dismiss' })]
            });
          }
        })
        .catch(() => {
          nameCheck = true;
        });
      if (!nameCheck) {
        return false;
      }
    }

    this.saved = true;

    await this.contentsService.save(newPath, {
      type: 'file',
      format: 'text',
      content: JSON.stringify({
        name: this._codeSnippetEditorMetaData.name,
        description: this._codeSnippetEditorMetaData.description,
        language: this._codeSnippetEditorMetaData.language,
        code: this._codeSnippetEditorMetaData.code,
        id: this._codeSnippetEditorMetaData.id,
        tags: this._codeSnippetEditorMetaData.selectedTags,
        date_created: this._codeSnippetEditorMetaData.date_created,
        date_modified: this._codeSnippetEditorMetaData.date_modified
      })
    });

    // remove the dirty state
    this.title.className = this.title.className.replace(
      ` ${EDITOR_DIRTY_CLASS}`,
      ''
    );

    // change label
    this.title.label =
      '[' +
      this._codeSnippetEditorMetaData.language +
      '] ' +
      this._codeSnippetEditorMetaData.name;

    if (!this._codeSnippetEditorMetaData.fromScratch) {
      // update tracker
      this.tracker.save(this);
    }

    // update the display in code snippet explorer
    this.codeSnippetWidget.updateCodeSnippets();

    // close editor if it's from scratch
    if (this._codeSnippetEditorMetaData.fromScratch) {
      this.dispose();
    }
    return true;
  }

  handleChangeOnTag(selectedTags: string[], allTags: string[]): void {
    if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
      this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
    }

    this._codeSnippetEditorMetaData.selectedTags = selectedTags;
    this._codeSnippetEditorMetaData.allTags = allTags;

    this.saved = false;
  }

  handleOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('touched')) {
      target.classList.add('touched');
    }
  }

  /**
   * TODO: clean CSS style class - "Use constant"
   */
  renderCodeInput(): React.ReactElement {
    return (
      <section
        className={CODE_SNIPPET_EDITOR_INPUTAREA_MIRROR}
        onMouseDown={this.activateCodeMirror}
      >
        <div
          className={CODE_SNIPPET_EDITOR_MIRROR}
          id={'code-' + this._codeSnippetEditorMetaData.id.toString()}
        ></div>
      </section>
    );
  }

  renderLanguages(): React.ReactElement {
    SUPPORTED_LANGUAGES.sort();

    return (
      <div>
        <input
          className={CODE_SNIPPET_EDITOR_LANG_INPUT}
          list="languages"
          name="language"
          defaultValue={this._codeSnippetEditorMetaData.language}
          onChange={this.handleInputFieldChange}
          required
        />
        <datalist id="languages">
          {SUPPORTED_LANGUAGES.map(lang => this.renderLanguageOptions(lang))}
        </datalist>
      </div>
    );
  }

  renderLanguageOptions(option: string): JSX.Element {
    return <option key={option} value={option} />;
  }

  render(): React.ReactElement {
    const fromScratch = this._codeSnippetEditorMetaData.fromScratch;
    return (
      <div
        className={CODE_SNIPPET_EDITOR_INPUTAREA}
        onMouseDown={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          this.deactivateEditor(event);
        }}
      >
        <span className={CODE_SNIPPET_EDITOR_TITLE}>
          {fromScratch ? 'New Code Snippet' : 'Edit Code Snippet'}
        </span>
        <section className={CODE_SNIPPET_EDITOR_METADATA}>
          <label className={CODE_SNIPPET_EDITOR_LABEL}>Name (required)</label>
          <input
            className={CODE_SNIPPET_EDITOR_NAME_INPUT}
            defaultValue={this._codeSnippetEditorMetaData.name}
            placeholder={'Ex. starter_code'}
            type="text"
            required
            pattern={'[a-zA-Z0-9_]+'}
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
            onBlur={this.handleOnBlur}
          ></input>
          <p className={CODE_SNIPPET_EDITOR_INPUTNAME_VALIDITY}>
            {
              'Name of the code snippet MUST be lowercased, alphanumeric or composed of underscore(_)'
            }
          </p>
          <label className={CODE_SNIPPET_EDITOR_LABEL}>
            Description (required)
          </label>
          <input
            className={CODE_SNIPPET_EDITOR_DESC_INPUT}
            defaultValue={this._codeSnippetEditorMetaData.description}
            placeholder={'Description'}
            type="text"
            required
            pattern={'[a-zA-Z0-9_ ,.?!]+'}
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
            onBlur={this.handleOnBlur}
          ></input>
          <p className={CODE_SNIPPET_EDITOR_INPUTDESC_VALIDITY}>
            {
              'Description of the code snippet MUST be alphanumeric but can include space or punctuation'
            }
          </p>
          <label className={CODE_SNIPPET_EDITOR_LABEL}>
            Language (required)
          </label>
          {this.renderLanguages()}
          <label className={CODE_SNIPPET_EDITOR_LABEL}>Tags</label>
          <CodeSnippetEditorTags
            selectedTags={this.codeSnippetEditorMetadata.selectedTags}
            tags={this.codeSnippetEditorMetadata.allTags}
            handleChange={this.handleChangeOnTag}
          />
        </section>
        <span className={CODE_SNIPPET_EDITOR_LABEL}>Code</span>
        {this.renderCodeInput()}
        <Button className="saveBtn" onClick={this.saveChange}>
          {fromScratch ? 'Create & Close' : 'Save'}
        </Button>
      </div>
    );
  }
}
