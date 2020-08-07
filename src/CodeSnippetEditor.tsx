import { CodeEditor, IEditorServices } from '@jupyterlab/codeeditor';
import { ICodeSnippet } from './CodeSnippetContentsService';
import { ReactWidget, showDialog, Dialog } from '@jupyterlab/apputils';
import React from 'react';
import { Message } from '@lumino/messaging';
import { Button } from '@jupyterlab/ui-components';
// import { DocumentWidget } from '@jupyterlab/docregistry';
// import { Widget } from '@lumino/widgets';

// const CODE_SNIPPET_EDITOR_ID = 'jp-codeSnippet-editor';

export class CodeSnippetEditor extends ReactWidget {
  editorServices: IEditorServices;
  /*function(e) {
      console.log(e.target);
      const clickedElement = e.target as HTMLElement;
      if(clickedElement.className !== target.className) {
        target.classList.remove('jp-snippet-editor-active');
        label.classList.remove('jp-snippet-editor-label-active');
      }*/
  /*window.removeEventListener('click', e =>
      this._deactivateField(e, target, label)*/
  editor: CodeEditor.IEditor;
  saved: boolean;
  codeSnippet: ICodeSnippet;
  _hasRefreshedSinceAttach: boolean;

  constructor(editorServices: IEditorServices, args: ICodeSnippet) {
    super();
    // this.id = 'Code-Snippet-Edit';

    this.editorServices = editorServices;
    this.codeSnippet = args;
    this.saved = false;
    this._hasRefreshedSinceAttach = false;

    this.renderCodeInput = this.renderCodeInput.bind(this);
  }

  private _deactivateField(
    e: MouseEvent,
    target: HTMLElement,
    label: HTMLElement
  ): void {
    const clickedElement = e.target as HTMLElement;
    if (clickedElement.className !== target.className) {
      target.classList.remove('jp-snippet-editor-active');
      label.classList.remove('jp-snippet-editor-label-active');
      window.removeEventListener(
        'click',
        e => this._deactivateField(e, target, label),
        true
      );
    }
  }

  private activeFieldState(
    event: React.MouseEvent<HTMLInputElement, MouseEvent>
  ): void {
    const target = event.target as HTMLElement;
    const labelClassName = target.className + '-label';
    const label = document.getElementsByClassName(
      labelClassName
    )[0] as HTMLElement;
    if (!target.classList.contains('jp-snippet-editor-active')) {
      target.classList.add('jp-snippet-editor-active');
      label.classList.add('jp-snippet-editor-label-active');
    }
    window.addEventListener(
      'click',
      e => this._deactivateField(e, target, label),
      true
    );
  }

  // updateCodeSnippetCode(): void {

  // }

  // /**
  //  * Gets called by update() call or when first rendered
  //  * @param msg
  //  */
  onUpdateRequest(msg: Message): void {
    super.onUpdateRequest(msg);

    if (
      !this.editor &&
      document.getElementById('code-' + this.codeSnippet.id)
    ) {
      const editorFactory = this.editorServices.factoryService.newInlineEditor;
      const getMimeTypeByLanguage = this.editorServices.mimeTypeService
        .getMimeTypeByLanguage;

      this.editor = editorFactory({
        host: document.getElementById('code-' + this.codeSnippet.id),
        model: new CodeEditor.Model({
          value: this.codeSnippet.code.join('\n'),
          mimeType: getMimeTypeByLanguage({
            name: this.codeSnippet.language,
            codemirror_mode: this.codeSnippet.language
          })
        })
      });
      // this.editor.model.value.changed.connect((args: any) => {
      //   this.
      // })
      // console.log(document.querySelector(`#code-${this.codeSnippet.id}`));
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
    if (this.saved) {
      showDialog({
        title: 'Close without saving?',
        body: (
          <p>
            {' '}
            {`"${this.codeSnippet.displayName}" has unsaved changes, close without saving?`}{' '}
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
  handleEditorActivity(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void {
    let target = event.target as HTMLElement;
    while (target && target.parentElement) {
      if (target.classList.contains('jp-codeSnippetInput-editor')) {
        break;
      }
      target = target.parentElement;
    }

    // console.log(target);
    const editor = document.querySelector(`#code-${this.codeSnippet.id}`);

    if (target.classList.contains('jp-codeSnippetInput-editor')) {
      if (!editor.classList.contains('active')) {
        editor.classList.add('active');
      }
    } else {
      if (editor.classList.contains('active')) {
        editor.classList.remove('active');
      }
    }
  }

  renderCodeInput(): React.ReactElement {
    return (
      <section className="jp-codeSnippetInputArea-editor">
        <div
          className={'jp-codeSnippetInput-editor'}
          id={'code-' + this.codeSnippet.id.toString()}
        ></div>
      </section>
    );
  }

  render(): React.ReactElement {
    return (
      // <div className="jp-snippet-editor">
      //   <h2 className="jp-snippet-editor-title">Edit Code Snippet</h2>
      //   <div className="jp-snippet-editor-metadata">
      //     <label className="jp-snippet-editor-name-label">Name</label>
      //     <input
      //       className="jp-snippet-editor-name"
      //       defaultValue={this.codeSnippet.displayName}
      //       onClick={event => this.activeFieldState(event)}
      //     ></input>
      //     <label className="jp-snippet-editor-description-label">
      //       Description
      //     </label>
      //     <input
      //       className="jp-snippet-editor-description"
      //       defaultValue={this.codeSnippet.description}
      //       onClick={event => this.activeFieldState(event)}
      //     ></input>
      //     {/* <input
      //       className="jp-snippet-editor-language"
      //       type="text"
      //       name="language"
      //       list="languages"
      //       defaultValue={this.args.codeSnippet.language}
      //     ></input>
      //     <datalist id="languages">
      //       <option value="Python"></option>
      //       <option value="R"></option>
      //       <option value="Scala"></option>
      //       <option value="Other"></option>
      //     </datalist> */}
      //     <select
      //       className="jp-snippet-editor-language"
      //       defaultValue={this.codeSnippet.language}
      //       name="languages"
      //     >
      //       <option className="jp-snippet-editor-options" value="python">
      //         python
      //       </option>
      //       <option className="jp-snippet-editor-options" value="R">
      //         R
      //       </option>
      //       <option className="jp-snippet-editor-options" value="Scala">
      //         Scala
      //       </option>
      //       <option className="jp-snippet-editor-options" value="Other">
      //         Other
      //       </option>
      //     </select>
      //   </div>
      <div
        className="jp-codeSnippetInputArea"
        onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>): void =>
          this.handleEditorActivity(event)
        }
      >
        <h2 className="jp-snippet-editor-title">Edit Code Snippet</h2>
        <div className="jp-snippet-editor-metadata">
          <label className="jp-snippet-editor-name-label">Name</label>
          <input
            className="jp-snippet-editor-name"
            defaultValue={this.codeSnippet.displayName}
            onClick={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
          ></input>
          <label className="jp-snippet-editor-description-label">
            Description
          </label>
          <input
            className="jp-snippet-editor-description"
            defaultValue={this.codeSnippet.description}
            onClick={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.activeFieldState(event)}
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
            defaultValue={this.codeSnippet.language}
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
        </div>
        <span className="jp-codeSnippetInputArea-editorTitle">Code</span>
        {this.renderCodeInput()}
        <Button className="saveBtn">Save</Button>
      </div>
    );
  }
}
