import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

export interface ICodeSnippetWidgetModel {
  /**
   * The list of code snippets in the code snippet explorer
   */
  readonly _snippets: ICodeSnippet[];
}

export class CodeSnippetWidgetModel implements ICodeSnippetWidgetModel {
  _snippets: ICodeSnippet[];

  constructor(snippets: ICodeSnippet[]) {
    this._snippets = snippets;
  }

  get snippets(): ICodeSnippet[] {
    this.sortSnippets();
    return this._snippets;
  }

  addSnippet(newSnippet: ICodeSnippet, index: number): void {
    if (newSnippet.id === -1) {
      newSnippet.id = this.snippets.length;
    }
    this.insertSnippet(newSnippet, index);
    this.updateSnippetContents();
  }

  sortSnippets(): void {
    this._snippets.sort((a, b) => a.id - b.id);
  }

  moveSnippet(fromIdx: number, toIdx: number): void {
    if (toIdx > fromIdx) {
      toIdx = toIdx - 1;
    }
    if (toIdx === fromIdx) {
      return;
    }
    const snippetToInsert = this._snippets[fromIdx];
    this.deleteSnippet(fromIdx);
    snippetToInsert.id = toIdx;

    this.insertSnippet(snippetToInsert, toIdx);
    this.updateSnippetContents();
  }

  /**
   * Delete a snippet from the list
   * @param index index to delete. If it's not given, the last one gets deleted.
   */
  deleteSnippet(index = -1): void {
    const numSnippets = this._snippets.length;
    if (index < 0 || index > numSnippets) {
      this._snippets.pop();
    } else {
      // Update list
      for (let i = index + 1; i < numSnippets; i++) {
        this._snippets[i].id = this._snippets[i].id - 1;
      }
      this._snippets.splice(index, 1);
    }
  }

  updateSnippetContents(): void {
    this._snippets.forEach(snippet => {
      CodeSnippetContentsService.getInstance().save(
        'snippets/' + snippet.name + '.json',
        { type: 'file', format: 'text', content: JSON.stringify(snippet) }
      );
    });
  }

  /**
   * insert a snippet to the certain index of the snippet list
   * @param newSnippet new snippet to insert
   * @param index index to insert. If it's not given, the snippet is added at the end of the list.
   */
  private insertSnippet(newSnippet: ICodeSnippet, index = -1): void {
    const numSnippets = this._snippets.length;

    // add it at the end of the list
    if (index < 0 || index > numSnippets) {
      this._snippets.push(newSnippet);
    } else {
      // Update list
      for (let i = index; i < numSnippets; i++) {
        this._snippets[i].id = this._snippets[i].id + 1;
      }
      this._snippets.splice(index, 0, newSnippet);
    }
  }
}
