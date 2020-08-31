.. _contribute:

How to Contribute
-----------------
General Guidelines for Contributing
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

For general documentation about contributing to Jupyter projects, see
the `Project Jupyter Contributor
Documentation <https://jupyter.readthedocs.io/en/latest/contributing/content-contributor.html>`__
and `Code of
Conduct <https://github.com/jupyter/governance/blob/master/conduct/code_of_conduct.md>`__.

All source code is written in
`TypeScript <http://www.typescriptlang.org/Handbook>`__. See the `Style
Guide <https://github.com/jupyterlab/jupyterlab/wiki/TypeScript-Style-Guide>`__.

All source code is formatted using `prettier <https://prettier.io>`__.
When code is modified and committed, all staged files will be
automatically formatted using pre-commit git hooks (with help from the
`lint-staged <https://github.com/okonet/lint-staged>`__ and
`husky <https://github.com/typicode/husky>`__ libraries). The benefit of
using a code formatter like prettier is that it removes the topic of
code style from the conversation when reviewing pull requests, thereby
speeding up the review process.

You may also use the prettier npm script (e.g. ``npm run prettier`` or
``yarn prettier`` or ``jlpm prettier``) to format the entire code base.
We recommend installing a prettier extension for your code editor and
configuring it to format your code with a keyboard shortcut or
automatically on save.

Contributing Installation
~~~~~~~~~~~~~~~~~~~~~~~~~
.. code:: bash

    # Clone the repo to your local environment
    # Move to jupyterlab-code-snippets directory
    
    # Install dependencies
    jlpm
    # Build Typescript source
    jlpm build
    # Link your development version of the extension with JupyterLab
    jupyter labextension install .
    # Rebuild Typescript source after making changes
    jlpm build
    # Rebuild JupyterLab after making any changes
    jupyter lab build

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

.. code:: bash

    # Watch the source directory in another terminal tab
    jlpm watch
    # Run jupyterlab in watch mode in one terminal tab
    jupyter lab --watch

Now every change will be built locally and bundled into JupyterLab. Be sure to refresh your browser page after saving file changes to reload the extension (note: you'll need to wait for webpack to finish, which can take 10s+ at times).
