import { CodeSnippetContentsService } from '../src/CodeSnippetContentsService';
import {
  ServerConnection,
  ContentsManager,
  Contents
} from '@jupyterlab/services';
import 'jest';
import { Response } from 'node-fetch';

export const DEFAULT_FILE: Contents.IModel = {
  name: 'test',
  path: 'foo/test',
  type: 'file',
  created: 'yesterday',
  last_modified: 'today',
  writable: true,
  mimetype: 'text/plain',
  content: 'hello, world!',
  format: 'text'
};

interface IService {
  readonly serverSettings: ServerConnection.ISettings;
}

const codeSnippetContentsService = CodeSnippetContentsService.getInstance();
const serverSettings = ServerConnection.makeSettings();
const manager = new ContentsManager({ serverSettings });

codeSnippetContentsService.contentsManager = manager;

function handleRequest(item: IService, status: number, body: any) {
  // Store the existing fetch function.
  const oldFetch = item.serverSettings.fetch;

  // A single use callback.
  const temp = (info: RequestInfo, init: RequestInit) => {
    // Restore fetch.
    (item.serverSettings as any).fetch = oldFetch;

    // Normalize the body.
    if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }

    // Create the response and return it as a promise.
    const response = new Response(body, { status });

    return Promise.resolve(response as any);
  };

  // Override the fetch function.
  (item.serverSettings as any).fetch = temp;
}

test('test get instance', () => {
  expect(codeSnippetContentsService).toBeInstanceOf(CodeSnippetContentsService);
});

test('test save', async () => {
  handleRequest(codeSnippetContentsService.contentsManager, 200, DEFAULT_FILE);

  const saved = await codeSnippetContentsService.save('foo/bar', {
    type: 'file',
    format: 'text'
  });

  expect(saved.content).toBe('hello, world!');
  expect(saved.path).toBe('foo/bar');
});
