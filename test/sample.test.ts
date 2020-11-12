test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});

// mock function
// const add = jest.fn();

// import { cleanup } from '@testing-library/react';
// // import { CodeSnippetDisplay } from '../src/CodeSnippetDisplay';
// // import { ICodeSnippet } from '../src/CodeSnippetContentsService';
// import { JupyterFrontEnd } from '@jupyterlab/application';
// import { Widget } from '@lumino/widgets';
// import { IEditorServices } from '@jupyterlab/codeeditor';
// import { CodeSnippetWidget } from '../src/CodeSnippetWidget';

// afterEach(cleanup);

// it('renders without crashing', () => {
//   let app: JupyterFrontEnd;
//   let editorServices: IEditorServices;
//   const getCurrentWidget = (): Widget => {
//     return app.shell.currentWidget;
//   };

//   const codeSnippetWidget = new CodeSnippetWidget(
//     getCurrentWidget,
//     app,
//     editorServices
//   );

//   expect(codeSnippetWidget).toBeInstanceOf(CodeSnippetWidget);
// });

// const openCodeSnippetEditor = (args: ICodeSnippetEditorMetadata): void => {
//   // codeSnippetEditors are in the main area
//   const widgetId = `jp-codeSnippet-editor-${args.id}`;

//   const openEditor = find(
//     app.shell.widgets('main'),
//     (widget: Widget, _: number) => {
//       return widget.id === widgetId;
//     }
//   );
//   if (openEditor) {
//     app.shell.activateById(widgetId);
//     return;
//   }

//   const codeSnippetEditor = new CodeSnippetEditor(
//     contentsService,
//     editorServices,
//     tracker,
//     codeSnippetWidget,
//     args
//   );

//   codeSnippetEditor.id = widgetId;
//   codeSnippetEditor.addClass(widgetId);
//   codeSnippetEditor.title.label =
//     args.name === ''
//       ? 'New Code Snippet'
//       : '[' + args.language + '] ' + args.name;
//   codeSnippetEditor.title.closable = true;
//   codeSnippetEditor.title.icon = editorIcon;

//   if (!tracker.has(codeSnippetEditor)) {
//     tracker.add(codeSnippetEditor);
//   }

//   if (!codeSnippetEditor.isAttached) {
//     app.shell.add(codeSnippetEditor, 'main', {
//       mode: 'tab-after'
//     });
//   }

//   // Activate the code Snippet Editor
//   app.shell.activateById(codeSnippetEditor.id);
// };

// it('renders without crashing', () => {

//   const codeSnippet: ICodeSnippet = {
//     name: 'test',
//     description: 'testing CodeSnippetDisplay component',
//     id: 0,
//     language: 'Python',
//     code: []
//   }

//   const test = new CodeSnippetDisplay()
//   odeSnippets={codeSnippets}
//               app={this.app}
//               getCurrentWidget={this.getCurrentWidget}
//               openCodeSnippetEditor={this.openCodeSnippetEditor.bind(this)}
//               editorServices={this.editorServices}
//               _codeSnippetWidgetModel={this._codeSnippetWidgetModel}
//               updateCodeSnippets={this.updateCodeSnippets}

//   render(<CodeSnippetDisplay />)

// });
