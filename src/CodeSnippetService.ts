import { JupyterFrontEnd } from '@jupyterlab/application';
import { Settings } from '@jupyterlab/settingregistry';
import { JSONArray, JSONExt, PartialJSONValue } from '@lumino/coreutils';

import { CodeSnippetWidget } from './CodeSnippetWidget';

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

  private constructor(settings: Settings, app: JupyterFrontEnd) {
    this.settingManager = settings;

    // just in case when user changes the snippets using settingsEditor
    this.settingManager.changed.connect(async (plugin) => {
      const newCodeSnippetList = plugin.get('snippets').user;

      if (
        !JSONExt.deepEqual(
          newCodeSnippetList,
          (this.codeSnippetList as unknown) as PartialJSONValue
        )
      ) {
        this.codeSnippetList = this.convertToICodeSnippetList(
          newCodeSnippetList as JSONArray
        );

        const leftWidgets = app.shell.widgets('left').iter();

        let current = leftWidgets.next();
        while (current) {
          if (current instanceof CodeSnippetWidget) {
            current.updateCodeSnippetWidget();
            break;
          }
          current = leftWidgets.next();
        }
      }
    });

    const defaultSnippets = this.convertToICodeSnippetList(
      this.settingManager.default('snippets') as JSONArray
    );
    if (this.settingManager.get('snippets').user === undefined) {
      // set the user setting + default in the beginning
      this.settingManager
        .set('snippets', (defaultSnippets as unknown) as PartialJSONValue)
        .then(() => {
          const userSnippets = this.convertToICodeSnippetList(
            this.settingManager.get('snippets').user as JSONArray
          );
          this.codeSnippetList = userSnippets;
        });
    } else {
      const userSnippets = this.convertToICodeSnippetList(
        this.settingManager.get('snippets').user as JSONArray
      );

      this.codeSnippetList = userSnippets;
    }

    if (this.settingManager.get('snippetPreviewFontSize').user === undefined) {
      this.settingManager.set(
        'snippetPreviewFontSize',
        this.settingManager.default('snippetPreviewFontSize')
      );
    }
  }

  private convertToICodeSnippetList(snippets: JSONArray): ICodeSnippet[] {
    const snippetList: ICodeSnippet[] = [];

    snippets.forEach((snippet) => {
      snippetList.push((snippet as unknown) as ICodeSnippet);
    });
    return snippetList;
  }

  static init(settings: Settings, app: JupyterFrontEnd): void {
    if (!this.codeSnippetService) {
      this.codeSnippetService = new CodeSnippetService(settings, app);
    }
  }

  static getCodeSnippetService(): CodeSnippetService {
    return this.codeSnippetService;
  }

  get settings(): Settings {
    return this.settingManager;
  }

  get snippets(): ICodeSnippet[] {
    return this.codeSnippetList;
  }

  getSnippet(snippetName: string): ICodeSnippet[] {
    return this.codeSnippetList.filter(
      (snippet) => snippet.name.toLowerCase() === snippetName.toLowerCase()
    );
  }

  async addSnippet(snippet: ICodeSnippet): Promise<boolean> {
    const id = snippet.id;
    this.codeSnippetList.splice(id, 0, snippet);

    const numSnippets = this.codeSnippetList.length;

    // update id's of snippets.
    let i = id + 1;
    for (; i < numSnippets; i++) {
      this.codeSnippetList[i].id += 1;
    }

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }

  async deleteSnippet(id: number): Promise<boolean> {
    let numSnippets = this.codeSnippetList.length;

    // should never satisfy this condition
    if (id >= numSnippets) {
      console.log('error in codeSnippetService');
    }

    if (id === numSnippets - 1) {
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
      .catch((_) => {
        return false;
      });

    return true;
  }

  async renameSnippet(oldName: string, newName: string): Promise<boolean> {
    for (const snippet of this.codeSnippetList) {
      if (snippet.name === oldName) {
        snippet.name = newName;
        break;
      }
    }
    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }

  duplicateNameExists(newName: string): boolean {
    for (const snippet of this.codeSnippetList) {
      if (snippet.name.toLowerCase() === newName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

  async modifyExistingSnippet(
    oldName: string,
    newSnippet: ICodeSnippet
  ): Promise<boolean> {
    for (const snippet of this.codeSnippetList) {
      if (snippet.name.toLowerCase() === oldName.toLowerCase()) {
        this.codeSnippetList.splice(snippet.id, 1, newSnippet);
        break;
      }
    }

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }

  async moveSnippet(fromIdx: number, toIdx: number): Promise<boolean> {
    if (toIdx > fromIdx) {
      toIdx = toIdx - 1;
    }

    if (toIdx === fromIdx) {
      return;
    }

    const snippetToMove = this.codeSnippetList[fromIdx];
    this.deleteSnippet(fromIdx).then((res: boolean) => {
      if (!res) {
        console.log('Error in moving snippet(delete)');
        return false;
      }
    });
    snippetToMove.id = toIdx;
    this.addSnippet(snippetToMove).then((res: boolean) => {
      if (!res) {
        console.log('Error in moving snippet(add)');
        return false;
      }
    });

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }

  private sortSnippets(): void {
    this.codeSnippetList.sort((a, b) => a.id - b.id);
  }

  // order snippets just in case when it gets shared between users
  async orderSnippets(): Promise<boolean> {
    this.sortSnippets();
    this.codeSnippetList.forEach((snippet, i) => (snippet.id = i));

    await this.settingManager
      .set('snippets', (this.codeSnippetList as unknown) as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }
}
