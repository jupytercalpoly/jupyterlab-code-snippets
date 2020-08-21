import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
// import { ICodeSnippet } from './CodeSnippetContentsService';
import {
  ReactWidget,
  showDialog,
  Dialog,
  WidgetTracker
} from '@jupyterlab/apputils';
import React from 'react';
import { Message } from '@lumino/messaging';
import { Button } from '@jupyterlab/ui-components';
import { CodeSnippetContentsService } from './CodeSnippetContentsService';
import { CodeSnippetWidget } from './CodeSnippetWidget';
import { SUPPORTED_LANGUAGES } from './index';
import { CodeSnippetEditorTags } from './CodeSnippetEditorTags';

/**
 * CSS style classes
 */
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_EDITOR_NAME_LABEL = 'jp-snippet-editor-name-label';
const CODE_SNIPPET_EDITOR_LABEL_ACTIVE = 'jp-snippet-editor-label-active';
const CODE_SNIPPET_EDITOR_INPUT_ACTIVE = 'jp-snippet-editor-active';
const CODE_SNIPPET_EDITOR_NAME_INPUT = 'jp-snippet-editor-name';
const CODE_SNIPPET_EDITOR_DESC_LABEL = 'jp-snippet-editor-description-label';
const CODE_SNIPPET_EDITOR_DESC_INPUT = 'jp-snippet-editor-description';
const CODE_SNIPPET_EDITOR_LANG_INPUT = 'jp-snippet-editor-language';
const CODE_SNIPPET_EDITOR_MIRROR = 'jp-codeSnippetInput-editor';

const EDITOR_DIRTY_CLASS = 'jp-mod-dirty';

export interface ICodeSnippetEditorMetadata {
  name: string;
  description: string;
  language: string;
  code: string[];
  id: number;
  selectedTags: string[];
  allTags: string[];
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
    // this.getActiveTags = this.getActiveTags.bind(this);
  }

  get codeSnippetEditorMetadata(): ICodeSnippetEditorMetadata {
    return this._codeSnippetEditorMetaData;
  }

  private getActiveTags(): string[] {
    const tags: string[] = ['hello'];

    // await this.codeSnippetWidget
    //   .fetchData()
    //   .then((codeSnippets: ICodeSnippet[]) => {
    //     console.log(codeSnippets);
    //     // for (const codeSnippet of codeSnippets) {
    //     //   if (codeSnippet.tags) {
    //     //     tags.push(...codeSnippet.tags);
    //     //   }
    //     // }
    //     // console.log(tags);
    //   });
    return tags;
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

    const nameLabel = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_LABEL}`
    );
    const nameInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    );
    const descriptionLabel = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_LABEL}`
    );
    const descriptionInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    );
    const editor = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} #code-${this._codeSnippetEditorMetaData.id}`
    );

    if (target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT)) {
      this.deactivateDescriptionField(descriptionLabel, descriptionInput);
      this.deactivateCodeMirror(editor);
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)) {
      this.deactivateNameField(nameLabel, nameInput);
      this.deactivateCodeMirror(editor);
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
      this.deactivateNameField(nameLabel, nameInput);
      this.deactivateDescriptionField(descriptionLabel, descriptionInput);
    } else {
      this.deactivateNameField(nameLabel, nameInput);
      this.deactivateDescriptionField(descriptionLabel, descriptionInput);
      this.deactivateCodeMirror(editor);
    }
  }

  private deactivateNameField(nameLabel: Element, nameInput: Element): void {
    if (
      nameLabel.classList.contains(CODE_SNIPPET_EDITOR_LABEL_ACTIVE) &&
      nameInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)
    ) {
      nameLabel.classList.remove(CODE_SNIPPET_EDITOR_LABEL_ACTIVE);
      nameInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
    }
  }

  private deactivateDescriptionField(
    descriptionLabel: Element,
    descriptionInput: Element
  ): void {
    if (
      descriptionLabel.classList.contains(CODE_SNIPPET_EDITOR_LABEL_ACTIVE) &&
      descriptionInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)
    ) {
      descriptionLabel.classList.remove(CODE_SNIPPET_EDITOR_LABEL_ACTIVE);
      descriptionInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
    }
  }

  private activeFieldState(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ): void {
    const target = event.target as HTMLElement;

    let label;
    // if target is a description input, activate description label; if target is a name input, activate name label
    if (target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)) {
      label = document.querySelector(
        `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_LABEL}`
      );
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT)) {
      label = document.querySelector(
        `.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_LABEL}`
      );
    }

    if (!target.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
      target.classList.add(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
      label.classList.add(CODE_SNIPPET_EDITOR_LABEL_ACTIVE);
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
        buttons: [Dialog.cancelButton(), Dialog.okButton()]
      }).then((response: any): void => {
        if (response.button.accept) {
          this.dispose();
          super.onCloseRequest(msg);
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

    console.log(language);
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

  async updateSnippet(): Promise<void> {
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

    console.log(language);
    this.saved = true;

    const oldPath = 'snippets/' + this.oldCodeSnippetName + '.json';
    const newPath =
      'snippets/' + this._codeSnippetEditorMetaData.name + '.json';

    if (newPath !== oldPath) {
      // renaming code snippet
      try {
        await this.contentsService.rename(oldPath, newPath);
      } catch (error) {
        console.log('duplicate name!');

        await showDialog({
          title: 'Duplicate Name of Code Snippet',
          body: <p> {`"${newPath}" already exists.`} </p>,
          buttons: [Dialog.cancelButton()]
        });
        return;
      }

      // set new name as an old name
      this.oldCodeSnippetName = this._codeSnippetEditorMetaData.name;
    }

    console.log(this._codeSnippetEditorMetaData.selectedTags);
    await this.contentsService.save(newPath, {
      type: 'file',
      format: 'text',
      content: JSON.stringify({
        name: this._codeSnippetEditorMetaData.name,
        description: this._codeSnippetEditorMetaData.description,
        language: this._codeSnippetEditorMetaData.language,
        code: this._codeSnippetEditorMetaData.code,
        id: this._codeSnippetEditorMetaData.id,
        tags: this._codeSnippetEditorMetaData.selectedTags
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

    // update tracker
    this.tracker.save(this);

    // update the display in code snippet explorer
    this.codeSnippetWidget.updateCodeSnippets();
  }

  handleChangeOnTag(selectedTags: string[], allTags: string[]): void {
    if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
      this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
    }

    this._codeSnippetEditorMetaData.selectedTags = selectedTags;
    this._codeSnippetEditorMetaData.allTags = allTags;

    this.saved = false;
  }

  /**
   * TODO: clean CSS style class - "Use constant"
   */
  renderCodeInput(): React.ReactElement {
    return (
      <section
        className="jp-codeSnippetInputArea-editor"
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
    return (
      <div
        className="jp-codeSnippetInputArea"
        onMouseDown={(
          event: React.MouseEvent<HTMLDivElement, MouseEvent>
        ): void => {
          // this.deactivateEditor(event);
          this.deactivateEditor(event);
        }}
      >
        <span className="jp-snippet-editor-title">Edit Code Snippet</span>
        <section className="jp-snippet-editor-metadata">
          <label className="jp-snippet-editor-name-label">Name</label>
          <input
            className="jp-snippet-editor-name"
            defaultValue={this._codeSnippetEditorMetaData.name}
            type="text"
            required
            pattern={'[a-zA-Z0-9_]+'}
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
          ></input>
          <p className="jp-inputName-validity">
            {
              'Name of the code snippet MUST be alphanumeric or composed of underscore(_)'
            }
          </p>
          <label className="jp-snippet-editor-description-label">
            Description
          </label>
          <input
            className="jp-snippet-editor-description"
            defaultValue={this._codeSnippetEditorMetaData.description}
            type="text"
            required
            pattern={'[a-zA-Z0-9_ ,.?!]+'}
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
          ></input>
          <p className="jp-inputDesc-validity">
            {
              'Description of the code snippet MUST be alphanumeric or composed of underscore(_) or space'
            }
          </p>
          {this.renderLanguages()}
          <label className="jp-snippet-editor-tags-label">Tags</label>
          <CodeSnippetEditorTags
            selectedTags={this.codeSnippetEditorMetadata.selectedTags}
            tags={this.codeSnippetEditorMetadata.allTags}
            handleChange={this.handleChangeOnTag}
          />
        </section>
        <span className="jp-codeSnippetInputArea-editorTitle">Code</span>
        {this.renderCodeInput()}
        <Button className="saveBtn" onClick={this.saveChange}>
          Save
        </Button>
      </div>
    );
  }
}
