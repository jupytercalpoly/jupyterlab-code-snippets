Codebase Orientation
--------------------

Directories
~~~~~~~~~~~

Code Snippets: ``snippets/``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

This comprises the sample code snippets for the extension. Refer to
`Code Snippet Metadata`_ to learn more about the content of each code
snippet.

Binder setup: ``binder/``
^^^^^^^^^^^^^^^^^^^^^^^^^
This contains an environment specification for ``repo2docker`` which
allows the repository to be tested on `mybinder.org`_. This
specification is developer focused. For a more user-focused binder see
the `JupyterLab demo`_.

Test: ``test/`` ``cypress/``
^^^^^^^^^^^^^^^^^^^^^^^^^^^^
``test/`` contains unit test scripts using jest. And, ``cypress/`` contains integration test scripts using Cypress.

Design: ``design/``
^^^^^^^^^^^^^^^^^^^
This directory contains gifs or images that show the design perspective of
our extension.

Style: ``style/``
^^^^^^^^^^^^^^^^^^^
This directory contains all of the CSS styling used in the extension.

Documentation: ``docs/``
^^^^^^^^^^^^^^^^^^^^^^^^
This directory contains the Sphinx project for this documentation.

Files
~~~~~
Description of each file in ``src/``

-  CodeSnippetContentsService.ts: this contains a wrapper class that
   uses the functions defined in @jupyterlab/contentsSerivce.
-  CodeSnippetDisplay.tsx: this contains a major React component that defines key code snippets UI and renders
   code snippets.
-  CodeSnippetEditor.tsx : this contains a React component that creates
   an editor for each code snippet.
-  CodeSnippetEditorTags.tsx: this contains a React component that
   renders code snippet tags in code snippet editor.
-  CodeSnippetFilterTools.tsx: this contains a react component that renders a
   search bar and filter box.
-  CodeSnippetInputDialog.ts: this contains a class that defines
   the content of the custom code snippet form.
-  CodeSnippetLanguages.ts: this contains a list of supported languages
   and their corresponding icons.
-  CodeSnippetMenu.ts: this contains a lumino widget that creates dropdown
   dialog when three dots icon is clicked.
-  CodeSnippetMessage.ts: this contains a class that creates a message as a modal window after creating, copying, or downloading snippet.
-  CodeSnippetPreview.ts: this contains a lumino widget that creates a preview minimap.
-  CodeSnippetService.ts: this contains a wrapper class that handles the backend storage of the code snippets in JupyterLab Settings API.
-  CodeSnippetUtilities.ts: this contains a few utility functions that are used across the codebase.
-  CodeSnippetWidget.tsx: this contains a Lumino react widget that acts as a container of code snippets.
-  index.ts: this contains the activation of our extension.

.. _Code Snippet Metadata: https://jupyterlab-code-snippets-documentation.readthedocs.io/en/latest/contributor/snippet_metadata.html
.. _mybinder.org: https://mybinder.org/
.. _JupyterLab demo: https://mybinder.org/v2/gh/jupytercalpoly/jupyterlab-code-snippets.git/master?urlpath=lab
