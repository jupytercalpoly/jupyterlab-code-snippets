import { CodeSnippetModel, ICodeSnippetModel } from './CodeSnippetModel';
import { SnippetList } from './SnippetList';
import {
  ICodeSnippet,
  CodeSnippetContentsService
} from './CodeSnippetContentsService';

export interface ICodeSnippetWidgetModel {
  /**
   * The list of code snippets in the code snippet explorer
   */
  readonly _snippets: SnippetList;

  /**
   * The snippet model factory for the explorer
   */
  readonly contentFactory: CodeSnippetWidgetModel.IContentFactory;
}

export class CodeSnippetWidgetModel implements ICodeSnippetWidgetModel {
  _snippets: SnippetList;
  contentFactory: CodeSnippetWidgetModel.IContentFactory;

  constructor(
    snippets: ICodeSnippet[],
    options: CodeSnippetWidgetModel.IOptions
  ) {
    this.contentFactory =
      options.contentFactory || CodeSnippetWidgetModel.defaultContentFactory;
    this._snippets = new SnippetList(snippets, this.contentFactory);
  }

  get snippets(): ICodeSnippet[] {
    return this._snippets.snippets;
  }

  addSnippet(snippetOpt: CodeSnippetModel.IOptions, index: number): void {
    if (snippetOpt.id === -1) {
      snippetOpt.id = this.snippets.length;
    }
    const newSnippet = this.contentFactory.createSnippet(snippetOpt);
    this._snippets.insertSnippet(newSnippet, index);
    console.log(this._snippets.snippets);
    this.updateSnippetContents();
  }

  sortSnippets(): void {
    this._snippets.sort();
  }

  moveSnippet(fromIdx: number, toIdx: number): void {
    // console.log(fromIdx);
    // console.log(toIdx);
    const snippetToInsert = this._snippets.snippetModelList[fromIdx];
    // console.log(snippetToInsert);
    snippetToInsert.id = toIdx;
    this._snippets.insertSnippet(snippetToInsert, toIdx);
    this._snippets.deleteSnippet(fromIdx);
    // console.log(this._snippets);
    console.log(this._snippets.snippets);
    // this.updateSnippetContents();
    // { codeSnippet: newSnippet, id: idx },
  }

  deleteSnippet(index: number): void {
    this._snippets.deleteSnippet(index);
    this.updateSnippetContents();
  }

  updateSnippetContents(): void {
    this._snippets.snippets.forEach(snippet => {
      console.log(snippet);
      CodeSnippetContentsService.getInstance().save(
        'snippets/' + snippet.name + '.json',
        { type: 'file', format: 'text', content: JSON.stringify(snippet) }
      );
    });
  }
}

/**
 * The namespace for the `CodeSnippetExplorerModel` class statics.
 */
export namespace CodeSnippetWidgetModel {
  export interface IOptions {
    contentFactory?: IContentFactory;
  }

  /**
   * A factory for creating code snippet explorer content.
   */
  export interface IContentFactory {
    /**
     * TODO: ADD IN MEMORY DATASTORE
     */
    /**
     * Create a new snippet
     * @param options { codeSnippet: ICodeSnippet, id: string }
     */
    createSnippet(options: CodeSnippetModel.IOptions): ICodeSnippetModel;
  }

  export class ContentFactory implements IContentFactory {
    createSnippet(options: CodeSnippetModel.IOptions): CodeSnippetModel {
      return new CodeSnippetModel(options);
    }
  }

  export const defaultContentFactory = new ContentFactory();
}
