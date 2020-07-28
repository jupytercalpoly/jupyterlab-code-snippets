import { ICodeSnippet } from './CodeSnippetContentsService';

/**
 * The definition of a model object for a code snippet widget.
 */

export interface ICodeSnippetModel {
  /**
   * A metadata for snippet
   */
  readonly codeSnippet: ICodeSnippet;

  /**
   * A unique identifier for the snippet.
   */
  id: number;
}

/**
 * An implementation of the snippet model.
 */
export class CodeSnippetModel implements ICodeSnippetModel {
  id: number;
  readonly codeSnippet: ICodeSnippet;

  constructor(options: CodeSnippetModel.IOptions) {
    this.id = options.id;
    this.codeSnippet = options.codeSnippet;
  }
}

/**
 * The namespace for `CodeSnippetModel` statics.
 */
export namespace CodeSnippetModel {
  /**
   * The options used to initialize a `CellModel`.
   */
  export interface IOptions {
    /**
     * The source snippet data.
     */
    codeSnippet: ICodeSnippet;
    /**
     * A unique identifier for this snippet.
     */
    id: number;
  }
}
