import { JupyterFrontEnd } from '@jupyterlab/application';
import { Settings } from '@jupyterlab/settingregistry';
import { JSONArray, JSONExt, PartialJSONValue } from '@lumino/coreutils';

import { CodeSnippetWidget } from './CodeSnippetWidget';

export interface ICodeSnippet {
  name: string;
  description?: string;
  language: string;
  // code separated by a new line
  code: string;
  id: number;
  tags?: string[];
}

export class CodeSnippetService {
  private settingManager: Settings;
  private static codeSnippetService: CodeSnippetService;
  private codeSnippetList: ICodeSnippet[];

  private constructor(settings: Settings, app: JupyterFrontEnd) {
    this.settingManager = settings;

    // when user changes the snippets using settingsEditor
    this.settingManager.changed.connect(async (plugin) => {
      const newCodeSnippetList = plugin.get('snippets').user;

      if (
        !JSONExt.deepEqual(
          newCodeSnippetList,
          this.codeSnippetList as unknown as PartialJSONValue
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

        // order code snippet and sync it with setting
        this.orderSnippets();
        await plugin
          .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
          .catch((e) => {
            console.log(
              'Error in syncing orders of snippets with those in settings'
            );
            console.log(e);
          });
      }
    });

    // load user's saved snippets
    if (this.settingManager.get('snippets').user) {
      const userSnippets = this.convertToICodeSnippetList(
        this.settingManager.get('snippets').user as JSONArray
      );
      this.codeSnippetList = userSnippets;
    }

    // set default preview font size
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
      const newSnippet = snippet as unknown as ICodeSnippet;

      snippetList.push(newSnippet);
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

  getSnippetByName(snippetName: string): ICodeSnippet[] {
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
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
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
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
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
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
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
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
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
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }

  // order snippets just in case when it gets shared between users
  async orderSnippets(): Promise<boolean> {
    this.codeSnippetList.sort((a, b) => a.id - b.id);
    this.codeSnippetList.forEach((snippet, i) => (snippet.id = i));

    await this.settingManager
      .set('snippets', this.codeSnippetList as unknown as PartialJSONValue)
      .catch((_) => {
        return false;
      });
    return true;
  }
}
