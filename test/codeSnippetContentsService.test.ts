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

describe('test get', () => {
  it('test getData', async () => {
    handleRequest(
      codeSnippetContentsService.contentsManager,
      200,
      DEFAULT_FILE
    );
    const model = await codeSnippetContentsService.getData('/foo', 'file');

    expect(model.content).toBe(DEFAULT_FILE.content);
  });

  it('test getDataError', async () => {
    handleRequest(
      codeSnippetContentsService.contentsManager,
      201,
      DEFAULT_FILE
    );

    const model = await codeSnippetContentsService.getData('/foo', 'file');

    expect(model.content).toBe(undefined);
  });
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

describe('test rename', () => {
  it('test rename', async () => {
    handleRequest(
      codeSnippetContentsService.contentsManager,
      200,
      DEFAULT_FILE
    );

    const oldPath = 'foo/test';
    const newPath = 'foo/test2';
    const renamed = await codeSnippetContentsService.rename(oldPath, newPath);

    expect(renamed.path).toBe('foo/test2');
  });

  it('test rename error', async () => {
    handleRequest(
      codeSnippetContentsService.contentsManager,
      201,
      DEFAULT_FILE
    );

    const oldPath = 'foo/test';
    const newPath = 'foo/test2';
    const renamed = await codeSnippetContentsService.rename(oldPath, newPath);

    expect(renamed.content).toBe(undefined);
  });
});

test('test delete', async () => {
  handleRequest(codeSnippetContentsService.contentsManager, 200, DEFAULT_FILE);

  const path = 'foo/test';
  await codeSnippetContentsService.delete(path);
});

// test('test save', () => {
//   const newContent = {
//     name: 'new_array',
//     description:
//       'Scala program of array. Declare, print, and calculate sum of all elements.',
//     language: 'Scala',
//     code: [],
//     id: 11,
//     tags: ['math']
//   };
//   codeSnippetContentsService.save('snippets/sum_array.json', {
//     type: 'file',
//     format: 'text',
//     content: JSON.stringify(newContent)
//   });

//   const data = codeSnippetContentsService.getData(
//     'snippets/sum_array.json',
//     'file'
//   );

//   data.then(val => expect(JSON.parse(val.content).code.length).toBe(0));
// });

// test('test rename', () => {
//   const oldPath = 'snippets/sum_array.json';
//   const newPath = 'snippets/new_array.json';
//   codeSnippetContentsService.rename(oldPath, newPath);

//   codeSnippetContentsService
//     .getData(newPath, 'file')
//     .then(val => expect(val).toBeTruthy());
// });

// test('test delete', () => {
//   const path = 'snippets/sum_array.json';
//   codeSnippetContentsService.delete(path);

//   codeSnippetContentsService
//     .getData(path, 'file')
//     .then(val => expect(val).toBeNull());
// });
