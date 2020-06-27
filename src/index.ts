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

    //Add an application command
    const commandID = 'my-command';
    const toggled = false;
    app.commands.addCommand(commandID, {
      label: 'Tester Command',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: () => {
        console.log(`Executed ${commandID}`);
        /* TODO: Replace command with command 
        that saves snippet to snippet bar */
    }});
    
    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    })

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
