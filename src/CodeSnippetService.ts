import { Settings } from '@jupyterlab/settingregistry';
import { JSONArray, PartialJSONValue } from '@lumino/coreutils';

export interface ICodeSnippet {
  name: string;
  description: string;
  language: string;
  // code separated by new line
  code: string[];
  id: number;
  tags?: string[];
}

export class CodeSnippetService {
  private settingManager: Settings;
  private static codeSnippetService: CodeSnippetService;
  private codeSnippetList: ICodeSnippet[];

  private constructor(settings: Settings) {
    this.settingManager = settings;

    // just in case when user changes the snippets using settingsEditor
    this.settingManager.changed.connect(plugin => {
      console.log('changed');
      const newCodeSnippetList = plugin.get('snippets').user;
      console.log(newCodeSnippetList);
      this.codeSnippetList = this.convertToICodeSnippetList(
        newCodeSnippetList as JSONArray
      );
    });

    const defaultSnippets = this.convertToICodeSnippetList(
      this.settingManager.default('snippets') as JSONArray
    );
    const userSnippets = this.convertToICodeSnippetList(
      this.settingManager.get('snippets').user as JSONArray
    );

    console.log(userSnippets.length);
    if (userSnippets.length !== 0) {
      this.codeSnippetList = userSnippets;
    } else {
      this.codeSnippetList = defaultSnippets;
    }

    // set the user setting + default in the beginning
    this.settingManager.set(
      'snippets',
      (this.codeSnippetList as unknown) as PartialJSONValue
    );

    console.log(this.codeSnippetList);
  }

  private convertToICodeSnippetList(snippets: JSONArray) {
    const snippetList: ICodeSnippet[] = [];

    snippets.forEach(snippet => {
      snippetList.push((snippet as unknown) as ICodeSnippet);
    });
    return snippetList;
  }

  static init(settings: Settings): void {
    if (!this.codeSnippetService) {
      this.codeSnippetService = new CodeSnippetService(settings);
    }
  }

  static getCodeSnippetService(): CodeSnippetService {
    console.log(this.codeSnippetService);
    return this.codeSnippetService;
  }

  get snippets(): ICodeSnippet[] {
    return this.codeSnippetList;
  }

  getSnippet(snippetName: string): ICodeSnippet[] {
    return this.codeSnippetList.filter(snippet => snippet.name == snippetName);
  }

  // isValidSnippet(): boolean {
  //   // check duplicate name
  //   // check required fields

  // }

  async addSnippet(snippet: ICodeSnippet): Promise<void> {
    const numSnippets = this.codeSnippetList.length;
    const id = snippet.id;
    this.codeSnippetList.splice(id, 0, snippet);

    let i = id;
    for (; i < numSnippets; i++) {
      this.codeSnippetList[i].id += 1;
    }

    console.log(this.codeSnippetList);
    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });
  }

  async deleteSnippet(id: number): Promise<ICodeSnippet[]> {
    let numSnippets = this.codeSnippetList.length;

    // should never satisfy this condition
    if (id >= numSnippets) {
      console.log('error in codeSnippetService');
    }

    if (id == numSnippets - 1) {
      this.codeSnippetList.pop();
    } else {
      this.codeSnippetList.splice(id, 1);

      numSnippets = this.codeSnippetList.length;
      let i = id;
      for (; i < numSnippets; i++) {
        this.codeSnippetList[i].id -= 1;
      }
    }

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });

    return this.codeSnippetList;
  }

  async renameSnippet(oldName: string, newName: string): Promise<void> {
    try {
      this.duplicateNameExists(newName);
    } catch (e) {
      throw e;
    }

    for (const snippet of this.codeSnippetList) {
      if (snippet.name == oldName) {
        snippet.name = newName;
        break;
      }
    }
    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });
  }

  duplicateNameExists(newName: string): void {
    for (const snippet of this.codeSnippetList) {
      if (snippet.name == newName) {
        throw Error('Duplicate Name of Code Snippet');
      }
    }
  }

  async modifyExistingSnippet(
    oldName: string,
    newSnippet: ICodeSnippet
  ): Promise<void> {
    for (let snippet of this.codeSnippetList) {
      if (snippet.name == oldName) {
        snippet = newSnippet;
        break;
      }
    }

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });
  }

  async moveSnippet(fromIdx: number, toIdx: number): Promise<void> {
    if (toIdx > fromIdx) {
      toIdx = toIdx - 1;
    }

    if (toIdx == fromIdx) {
      return;
    }

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });
  }

  private sortSnippets(): void {
    this.codeSnippetList.sort((a, b) => a.id - b.id);
  }

  // order snippets just in case when it gets shared between users
  async orderSnippets(): Promise<void> {
    this.sortSnippets();
    this.codeSnippetList.forEach((snippet, i) => (snippet.id = i));

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch(e => {
        throw e;
      });
  }
}
