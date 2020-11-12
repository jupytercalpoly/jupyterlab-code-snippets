// unit test
import { CodeSnippetWidgetModel } from '../src/CodeSnippetWidgetModel';
import { ICodeSnippet } from '../src/CodeSnippetContentsService';

const codeSnippets: ICodeSnippet[] = [
  {
    name: 'test_snippet',
    description: 'testing code snippet widget model',
    language: 'Python',
    code: ["print('hello world')"],
    id: 0,
    tags: ['test']
  },
  {
    name: 'test_snippet_two',
    description: 'testing code snippet widget model',
    language: 'Python',
    code: ["print('hello world again!')"],
    id: 1
  }
];

const codeSnippetWidgetModel = new CodeSnippetWidgetModel(codeSnippets);

test('creates the code snippet widget model', () => {
  expect(codeSnippetWidgetModel).toBeInstanceOf(CodeSnippetWidgetModel);
});

describe('test getter and setter', () => {
  it('test get snippet', () => {
    const snippets = codeSnippetWidgetModel.snippets;

    expect(snippets).toBe(codeSnippets);
  });

  it('test set snippet', () => {
    const newSnippets = [
      {
        name: 'test_snippet_one',
        description: 'testing code snippet widget model',
        language: 'Python',
        code: ["print('hello world')"],
        id: 0,
        tags: ['test']
      },
      {
        name: 'test_snippet_two',
        description: 'testing code snippet widget model',
        language: 'Python',
        code: ["print('hello world again!')"],
        id: 1
      }
    ];
    codeSnippetWidgetModel.snippets = newSnippets;
    expect(codeSnippetWidgetModel.snippets).toBe(newSnippets);
  });
});

// describe('test snippet manipulation', () => {
//   it('test add snippet', () => {
//     const newSnippet = {
//       name: 'test_snippet_three',
//       description: 'testing code snippet widget model',
//       language: 'Python',
//       code: ["print('testing')"],
//       id: 2
//     };
//     codeSnippetWidgetModel.addSnippet(newSnippet);
//   });
// });
