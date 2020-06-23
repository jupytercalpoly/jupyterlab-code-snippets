import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './codesnippets';

/**
 * Initialization data for the code_snippets extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'code-snippets',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension code-snippets is activated!');

    requestAPI<any>('get_example')
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The code_snippets server extension appears to be missing.\n${reason}`
        );
      });
  }
};

export default extension;
