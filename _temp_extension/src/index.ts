import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab-code-snippets extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-code-snippets',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-code-snippets is activated!');
  }
};

export default extension;
