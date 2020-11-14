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

test('test getData', async () => {
  handleRequest(codeSnippetContentsService.contentsManager, 200, DEFAULT_FILE);
  const options: Contents.IFetchOptions = { type: 'file' };
  const model = await codeSnippetContentsService.contentsManager.get(
    '/foo',
    options
  );

  console.log(model.content);

  // const res = {
  //   name: 'sum_array',
  //   description:
  //     'Scala program of array. Declare, print, and calculate sum of all elements.',
  //   language: 'Scala',
  //   code: [
  //     'object ExampleArray1 {',
  //     '    ',
  //     '   def main(args: Array[String]) {',
  //     '       ',
  //     '      var numbers = Array(10,20,30,40,50);',
  //     '      var N:Int=0;',
  //     '      ',
  //     '      //print all array elements',
  //     '      println("All array elements: ");',
  //     '      for ( N <- numbers ) {',
  //     '         println(N);',
  //     '      }',
  //     '      //calculating SUM of all elements',
  //     '      var sum: Int=0;',
  //     '      for ( N <- numbers ) {',
  //     '         sum+=N;',
  //     '      }      ',
  //     '      println("Sum of all array elements: "+sum);',
  //     '',
  //     '   }',
  //     '}'
  //   ],
  //   id: 11,
  //   tags: ['math']
  // };
  const data = codeSnippetContentsService.getData(
    'snippets/sum_array.json',
    'file'
  );

  data.then(val => {
    console.log(val.content);
    // console.log(JSON.stringify(val));
    // expect(val).toBe(res);
  });
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
