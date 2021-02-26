// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { ContentsManager, Drive, Contents } from '@jupyterlab/services';

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
    try {
      const changedModel = await this.contentsManager.save(path, options);
      return changedModel;
    } catch (error) {
      return error;
    }
  }
}
