import { ContentsManager, Drive, Contents } from '@jupyterlab/services';

export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  // code separated by new line
  code: string[];
  bookmarked: boolean;
  id: number;
  tags?: string[];
}

/**
 * Singleton contentsService class
 */
export class CodeSnippetContentsService {
  drive: Drive;
  contentsManager: ContentsManager;
  private static instance: CodeSnippetContentsService;
  private constructor() {
    const drive = new Drive({ name: 'snippetDrive ' });
    const contentsManager = new ContentsManager({ defaultDrive: drive });
    this.drive = drive;
    this.contentsManager = contentsManager;
  }

  static getInstance(): CodeSnippetContentsService {
    if (!this.instance) {
      this.instance = new CodeSnippetContentsService();
    }
    return this.instance;
  }

  /**
   * Get the metadata information in the given path
   * @param path path to a file/directory
   */
  async getData(
    path: string,
    type: Contents.ContentType
  ): Promise<Contents.IModel> {
    const data = await this.contentsManager.get(path, {
      type: type,
      //   format: 'text',
      content: true
    });
    // console.log(data);
    return data;
  }

  /**
   * Create a file/directory if it does not exist. Otherwise, save the change in a file/directory in the given path
   * @param path path to a file/directory
   * @param options options that specify if it's a file or directory and additial information
   * Usage: save('snippets', { type: 'directory' }) to create/save a directory
   *        save('snippets/test.json', {type: 'file', format: 'text', content: 'Lorem ipsum dolor sit amet'})
   */
  async save(
    path: string,
    options?: Partial<Contents.IModel>
  ): Promise<Contents.IModel> {
    // TODO: throw an error if file exists
    // if (options.type !== 'directory') {
    //   try {
    //     const myLog = new File()
    //     const http = new XMLHttpRequest();
    //     http.open('HEAD', 'api/contents/' + path, false);
    //     http.send();
    //   } catch {
    //     throw new Error('duplicate name');
    //   }
    // console.log(path);
    // if (http.status === 200) {
    //   throw new Error('duplicate name');
    // }
    // await fetch('api/contents/' + path).then(s => {
    //   console.log(s.status);
    //   if (s.status === 200) {
    //     throw new Error('duplicate name');
    //   }
    // });
    // }
    const changedModel = await this.contentsManager.save(path, options);
    return changedModel;
  }

  /**
   * Change the order of snippets
   * @param oldPath
   * @param newPath
   */

  /**
   * Rename the file or directory
   * @param oldPath change from
   * @param newPath change to
   */
  async rename(oldPath: string, newPath: string): Promise<Contents.IModel> {
    const changedModel = await this.contentsManager.rename(oldPath, newPath);
    return changedModel;
  }

  /**
   * Delete the file/directory in the given path
   * @param path path to a file/directory
   */
  async delete(path: string): Promise<void> {
    await this.contentsManager.delete(path);
  }
}
