import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import { ICodeSnippet } from './CodeSnippetContentsService';
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

export class CodeSnippetEditor extends ReactWidget {
  editorServices: IEditorServices;
  private editor: CodeEditor.IEditor;
  private saved: boolean;
  private oldCodeSnippetName: string;
  private _codeSnippet: ICodeSnippet;
  private _hasRefreshedSinceAttach: boolean;
  contentsService: CodeSnippetContentsService;
  codeSnippetWidget: CodeSnippetWidget;
  tracker: WidgetTracker;

  constructor(
    contentsService: CodeSnippetContentsService,
    editorServices: IEditorServices,
    tracker: WidgetTracker,
    codeSnippetWidget: CodeSnippetWidget,
    args: ICodeSnippet
  ) {
    super();

    this.addClass(CODE_SNIPPET_EDITOR);
    this.contentsService = contentsService;
    this.editorServices = editorServices;
    this.tracker = tracker;

    this._codeSnippet = args;

    this.oldCodeSnippetName = args.name;
    this.saved = true;
    this._hasRefreshedSinceAttach = false;
    this.codeSnippetWidget = codeSnippetWidget;

    this.renderCodeInput = this.renderCodeInput.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.activateCodeMirror = this.activateCodeMirror.bind(this);
    this.saveChange = this.saveChange.bind(this);
    this.updateSnippet = this.updateSnippet.bind(this);
  }

  get codeSnippet(): ICodeSnippet {
    return this._codeSnippet;
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
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_NAME_LABEL}`
    );
    const nameInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    );
    const descriptionLabel = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_DESC_LABEL}`
    );
    const descriptionInput = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    );
    const editor = document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} #code-${this._codeSnippet.id}`
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
        `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_DESC_LABEL}`
      );
    } else if (target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT)) {
      label = document.querySelector(
        `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_NAME_LABEL}`
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
      document.getElementById('code-' + this._codeSnippet.id)
    ) {
      const editorFactory = this.editorServices.factoryService.newInlineEditor;
      const getMimeTypeByLanguage = this.editorServices.mimeTypeService
        .getMimeTypeByLanguage;

      this.editor = editorFactory({
        host: document.getElementById('code-' + this._codeSnippet.id),
        model: new CodeEditor.Model({
          value: this._codeSnippet.code.join('\n'),
          mimeType: getMimeTypeByLanguage({
            name: this._codeSnippet.language,
            codemirror_mode: this._codeSnippet.language
          })
        })
      });
      this.editor.model.value.changed.connect((args: any) => {
        this._codeSnippet.code = args.text.split('\n');
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
            {`"${this._codeSnippet.name}" has unsaved changes, close without saving?`}{' '}
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
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} #code-${this._codeSnippet.id}`
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
    this.updateSnippet();
  }

  async updateSnippet(): Promise<void> {
    const name = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`
    ) as HTMLInputElement).value;
    const description = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`
    ) as HTMLInputElement).value;
    const language = (document.querySelector(
      `.${CODE_SNIPPET_EDITOR}-${this._codeSnippet.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`
    ) as HTMLSelectElement).value;

    this._codeSnippet.name = name;
    this._codeSnippet.description = description;
    this._codeSnippet.language = language;

    this.saved = true;

    const oldPath = 'snippets/' + this.oldCodeSnippetName + '.json';
    const newPath = 'snippets/' + this._codeSnippet.name + '.json';

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
      this.oldCodeSnippetName = this._codeSnippet.name;
    }
    await this.contentsService.save(newPath, {
      type: 'file',
      format: 'text',
      content: JSON.stringify(this._codeSnippet)
    });

    // remove the dirty state
    this.title.className = this.title.className.replace(
      ` ${EDITOR_DIRTY_CLASS}`,
      ''
    );

    // change label
    this.title.label =
      '[' + this._codeSnippet.language + '] ' + this._codeSnippet.name;

    // update tracker
    this.tracker.save(this);

    // update the display in code snippet explorer
    this.codeSnippetWidget.updateCodeSnippets();
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
          id={'code-' + this._codeSnippet.id.toString()}
        ></div>
      </section>
    );
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
            defaultValue={this._codeSnippet.name}
            type="text"
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
          ></input>
          <label className="jp-snippet-editor-description-label">
            Description
          </label>
          <input
            className="jp-snippet-editor-description"
            defaultValue={this._codeSnippet.description}
            type="text"
            onMouseDown={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
              this.handleInputFieldChange(event);
            }}
          ></input>
          {/* <input
            className="jp-snippet-editor-language"
            type="text"
            name="language"
            list="languages"
            defaultValue={this.args.codeSnippet.language}
          ></input>
          <datalist id="languages">
            <option value="Python"></option>
            <option value="R"></option>
            <option value="Scala"></option>
            <option value="Other"></option>
          </datalist> */}
          <select
            className="jp-snippet-editor-language"
            defaultValue={this._codeSnippet.language}
            name="languages"
          >
            <option className="jp-snippet-editor-options" value="python">
              python
            </option>
            <option className="jp-snippet-editor-options" value="R">
              R
            </option>
            <option className="jp-snippet-editor-options" value="Scala">
              Scala
            </option>
            <option className="jp-snippet-editor-options" value="Other">
              Other
            </option>
          </select>
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
