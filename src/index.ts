import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

//import { requestAPI } from './codesnippets';

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
      label: 'Save As Code Snippet',
      isEnabled: () => true,
      isVisible: () => true,
      isToggled: () => toggled,
      iconClass: 'some-css-icon-class',
      execute: () => {
        console.log(`Executed ${commandID}`);
        let temp = getSelectedText();
        console.log(`Highlight trial: ${temp}`);
        /* TODO: Replace command with command 
        that saves snippet to snippet bar */
    }});
    
    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    })

    function getSelectedText() { 
      let selectedText; 

      // window.getSelection 
      if (window.getSelection) { 
          selectedText = window.getSelection(); 
      } 
      // document.getSelection 
      else if (document.getSelection) { 
          selectedText = document.getSelection(); 
      } 
      return selectedText;
  } 

    /*requestAPI<any>('get_example', {body: 'hi', method: 'POST'})
      .then(data => {
        console.log(data);
      })
      .catch(reason => {
        console.error(
          `The code_snippets server extension appears to be missing.\n${reason}`
        );
      });*/
  }
};

export default extension;
