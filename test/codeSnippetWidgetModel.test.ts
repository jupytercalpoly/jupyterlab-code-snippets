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

describe('test snippet manipulation', () => {
  it('test add insert snippet', () => {
    const insertSnippet = jest.spyOn(
      CodeSnippetWidgetModel.prototype as any,
      'insertSnippet'
    );

    const newSnippet = {
      name: 'test_snippet_three',
      description: 'testing code snippet widget model',
      language: 'Python',
      code: ["print('testing')"],
      id: 2
    };
    codeSnippetWidgetModel.addSnippet(newSnippet, newSnippet.id);

    expect(
      codeSnippetWidgetModel.snippets[
        codeSnippetWidgetModel.snippets.length - 1
      ]
    ).toBe(newSnippet);

    expect(insertSnippet).toHaveBeenCalled();
  });

  it('test delete snippet', () => {
    const originalSnippet = [
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
    codeSnippetWidgetModel.deleteSnippet(-1);
    expect(codeSnippetWidgetModel.snippets).toStrictEqual(originalSnippet);
  });

  it('test move snippet', () => {
    codeSnippetWidgetModel.moveSnippet(0, 3);
    expect(codeSnippetWidgetModel.snippets[1].id).toBe(2);
  });

  it('test reorder snippet', () => {
    codeSnippetWidgetModel.reorderSnippet();
    expect(codeSnippetWidgetModel.snippets[1].id).toBe(1);
  });

  it('test rename snippet', () => {
    codeSnippetWidgetModel.renameSnippet('test_snippet_one', 'test_snippet');

    expect(codeSnippetWidgetModel.snippets[1].name).toBe('test_snippet');
  });

  it('test sort snippet', () => {
    const unsortedSnippets: ICodeSnippet[] = [
      {
        name: 'test_snippet',
        description: 'testing code snippet widget model',
        language: 'Python',
        code: ["print('hello world')"],
        id: 1,
        tags: ['test']
      },
      {
        name: 'test_snippet_two',
        description: 'testing code snippet widget model',
        language: 'Python',
        code: ["print('hello world again!')"],
        id: 0
      }
    ];
    codeSnippetWidgetModel.snippets = unsortedSnippets;

    codeSnippetWidgetModel.sortSnippets();
    expect(codeSnippetWidgetModel.snippets[0].id).toBe(0);
  });

  it('test clear snippet', () => {
    codeSnippetWidgetModel.clearSnippets();

    expect(codeSnippetWidgetModel.snippets.length).toBe(0);
  });
});
