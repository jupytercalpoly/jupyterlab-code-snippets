import { ICodeSnippet } from './CodeSnippetContentsService';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';

import { ICodeSnippetModel } from './CodeSnippetModel';

export class SnippetList {
  /**
   * A list of snippets
   */
  snippetModelList: ICodeSnippetModel[];

  /**
   * A snippet map - entry (id, snippet)
   */
  snippetMap: Map<number, ICodeSnippetModel>;

  /**
   * Construct the snippet list.
   */
  constructor(
    codeSnippets: ICodeSnippet[],
    factory: CodeSnippetWidgetModel.IContentFactory
  ) {
    this.snippetModelList = [];
    this.snippetMap = new Map();
    codeSnippets.forEach(codeSnippet => {
      const newSnippetModel = factory.createSnippet({
        codeSnippet: codeSnippet,
        id: codeSnippet.id
      });
      this.snippetModelList.push(newSnippetModel);
      this.snippetMap.set(newSnippetModel.id, newSnippetModel);
    });
  }

  get snippets(): ICodeSnippet[] {
    const snippetList: ICodeSnippet[] = [];
    this.sort();
    this.snippetModelList.forEach(codeSnippetModel => {
      codeSnippetModel.codeSnippet.id = codeSnippetModel.id;
      snippetList.push(codeSnippetModel.codeSnippet);
    });
    return snippetList;
  }

  get modelSnippets(): ICodeSnippetModel[] {
    return this.snippetModelList;
  }

  sort(): void {
    this.snippetModelList.sort((a, b) => a.id - b.id);
  }

  /**
   * insert a snippet to the certain index of the snippet list
   * @param newSnippet new snippet to insert
   * @param index index to insert. If it's not given, the snippet is added at the end of the list.
   */
  insertSnippet(newSnippet: ICodeSnippetModel, index = -1): void {
    const numSnippets = this.snippetModelList.length;

    // add it at the end of the list
    if (index < 0 || index > numSnippets) {
      this.snippetModelList.push(newSnippet);
    } else {
      // Update list
      for (let i = index; i < numSnippets; i++) {
        this.snippetModelList[i].id = this.snippetModelList[i].id + 1;
      }
      this.snippetModelList.splice(index, 0, newSnippet);

      // Update map
      for (let i = numSnippets - 2; i >= index; i--) {
        console.log(i);
        this.snippetMap.set(i + 1, this.snippetMap.get(i));
      }
      this.snippetMap.set(index, newSnippet);
    }
  }

  /**
   * Delete a snippet from the list
   * @param index index to delete. If it's not given, the last one gets deleted.
   */
  deleteSnippet(index = -1): void {
    const numSnippets = this.snippetModelList.length;
    if (index < 0 || index > numSnippets) {
      this.snippetModelList.pop();
    } else {
      // Update list
      for (let i = index + 1; i < numSnippets; i++) {
        this.snippetModelList[i].id = this.snippetModelList[i].id - 1;
      }
      console.log(this.snippetModelList);
      this.snippetModelList.splice(index, 1);
      console.log(this.snippetModelList);

      // Update map
      for (let i = index + 1; i < numSnippets; i++) {
        this.snippetMap.set(i - 1, this.snippetMap.get(i));
      }
    }
  }
}
