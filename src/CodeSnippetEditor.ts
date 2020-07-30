import { Widget } from '@lumino/widgets';

export class CodeSnippetEditor extends Widget {
  constructor() {
    super();
    this.addClass('jp-codeSnippet-editor');
    this.id = 'Code-Snippet-Edit';
    this.title.label = 'Edit Code Snippet';
    this.title.closable = true;
  }
}
