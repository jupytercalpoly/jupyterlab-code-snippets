import { ICodeSnippet } from './CodeSnippetService';

import { CodeSnippetWidgetModel } from './CodeSnippetWidgetModel';

import { ICodeSnippetModel } from './CodeSnippetModel';

import { Signal } from '@lumino/signaling';

export class SnippetList {
  /**
   * A list of snippets
   */
  snippetList: ICodeSnippetModel[];

  /**
   * A snippet map - entry (id, snippet)
   */
  snippetMap: Map<number, ICodeSnippetModel>;

  /**
   * A signal for change in snippet list
   */
  changeSignal: Signal<this, ICodeSnippetModel[]>;

  /**
   * Construct the snippet list.
   */
  constructor(
    codeSnippets: ICodeSnippet[],
    factory: CodeSnippetWidgetModel.IContentFactory
  ) {
    this.snippetList = [];
    this.snippetMap = new Map();
    codeSnippets.forEach((codeSnippet, i) => {
      const newSnippetModel = factory.createSnippet({
        codeSnippet: codeSnippet,
        id: i
      });
      this.snippetList.push(newSnippetModel);
      this.snippetMap.set(newSnippetModel.id, newSnippetModel);
    });
    this.changeSignal = new Signal<this, ICodeSnippetModel[]>(this);
  }

  get snippets(): ICodeSnippet[] {
    const snippetList: ICodeSnippet[] = [];
    this.sort();
    this.snippetList.forEach(codeSnippetModel =>
      snippetList.push(codeSnippetModel.codeSnippet)
    );
    return snippetList;
  }

  sort() {
    this.snippetList.sort((a, b) => a.id - b.id);
  }

  /**
   * insert a snippet to the certain index of the snippet list
   * @param newSnippet new snippet to insert
   * @param index index to insert. If it's not given, the snippet is added at the end of the list.
   */
  insertSnippet(newSnippet: ICodeSnippetModel, index: number = -1) {
    const numSnippets = this.snippetList.length;

    // add it at the end of the list
    if (index < 0 || index > numSnippets) {
      this.snippetList.push(newSnippet);
    } else {
      // Update list
      for (let i = index; i < numSnippets; i++) {
        this.snippetList[i].id = this.snippetList[i].id + 1;
      }
      this.snippetList.splice(index, 0, newSnippet);

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
  deleteSnippet(index: number = -1) {
    const numSnippets = this.snippetList.length;
    if (index < 0 || index > numSnippets) {
      this.snippetList.pop();
    } else {
      // Update list
      for (let i = index + 1; i < numSnippets; i++) {
        this.snippetList[i].id = this.snippetList[i].id - 1;
      }
      this.snippetList.splice(index, 1);

      // Update map
      for (let i = index + 1; i < numSnippets; i++) {
        this.snippetMap.set(i - 1, this.snippetMap.get(i));
      }
    }
  }
}
