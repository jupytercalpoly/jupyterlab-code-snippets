import { ISettingRegistry, Settings } from '@jupyterlab/settingregistry';

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

  private constructor(
    settingRegistry: ISettingRegistry,
    settings: ISettingRegistry.ISettings
  ) {
    const settingManager = new Settings({
      plugin: settings.plugin,
      registry: settingRegistry
    });
    this.settingManager = settingManager;

    this.settingManager.changed.connect(plugin => {
      const newCodeSnippetList = plugin.get('snippets').user.toString();
      this.codeSnippetList = JSON.parse(newCodeSnippetList);
      // in case of id's of snippets are mixed
      this.orderSnippets();
      this.settingManager.set('snippets', this.codeSnippetList.toString());
    });

    this.codeSnippetList = JSON.parse(
      this.settingManager.default('snippets').toString()
    );
  }

  static init(
    settingRegistry: ISettingRegistry,
    settings: ISettingRegistry.ISettings
  ): void {
    if (!this.codeSnippetService) {
      this.codeSnippetService = new CodeSnippetService(
        settingRegistry,
        settings
      );
    }
  }

  static getCodeSnippetService(): CodeSnippetService {
    return this.codeSnippetService;
  }

  get snippets(): ICodeSnippet[] {
    return this.codeSnippetList;
  }

  // isValidSnippet(): boolean {
  //   // check duplicate name
  //   // check required fields

  // }

  addSnippet(snippet: ICodeSnippet): void {
    const numSnippets = this.codeSnippetList.length;
    const id = snippet.id;
    this.codeSnippetList.splice(id, 0, snippet);

    let i = id;
    for (; i < numSnippets; i++) {
      this.codeSnippetList[i].id += 1;
    }

    this.settingManager.set('snippets', this.codeSnippetList.toString());
  }

  deleteSnippet(id: number): void {
    const numSnippets = this.codeSnippetList.length;
    // should never satisfy this condition
    if (id >= numSnippets) {
      console.log('error in codeSnippetService');
    }

    if (id == numSnippets - 1) {
      this.codeSnippetList.pop();
    } else {
      this.codeSnippetList.splice(id, 1);
      let i = id;
      for (; i < numSnippets; i++) {
        this.codeSnippetList[i].id -= 1;
      }
    }
  }

  renameSnippet(oldName: string, newName: string): void {
    for (const snippet of this.codeSnippetList) {
      if (snippet.name == oldName) {
        snippet.name = newName;
        break;
      }
    }
    this.settingManager.set('snippets', this.codeSnippetList.toString());
  }

  moveSnippet(fromIdx: number, toIdx: number): void {
    if (toIdx > fromIdx) {
      toIdx = toIdx - 1;
    }

    if (toIdx == fromIdx) {
      return;
    }
  }

  sortSnippets(): void {
    this.codeSnippetList.sort((a, b) => a.id - b.id);
  }

  // order snippets just in case when it gets shared between users
  orderSnippets(): void {
    this.sortSnippets();
    this.codeSnippetList.forEach((snippet, i) => (snippet.id = i));
  }
}
