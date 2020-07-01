import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { RequestHandler } from '@elyra/application';
//import { requestAPI } from './codesnippets';
import { URLExt } from '@jupyterlab/coreutils';

export interface ICodeSnippet {
  name: string;
  displayName: string;
  description: string;
  language: string;
  code: string[];
}

/**
 * Initialization data for the code_snippets extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'code-snippets',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension code-snippets is activated!');
    const url = "elyra/metadata/code-snippets";

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
        RequestHandler.makePostRequest(
          url,
          JSON.stringify({ 
            display_name: "highlighted2",
            metadata: {
                code: [
                    JSON.stringify(temp)
                ],
                description: "Print highlighted code 2",
                language: "python",
            },
            name: "highlighted2",
            schema_name: "code-snippet",
          }),
          false
        );
        
        //console.log(`Highlight trial: ${JSON.stringify(response)}`);
        console.log(`Highlight trial: ${temp}`);
        /* TODO: Replace command with command 
        that saves snippet to snippet bar */
    }});
    
    //Put the command above in context menu
    app.contextMenu.addItem({
      command: commandID,
      selector: '.jp-CodeCell'
    })
    
    // Example Get Request
    RequestHandler.makeGetRequest(
     URLExt.join(url, '/example2'),
      false);
  
  } 
  }
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
};

export default extension;
