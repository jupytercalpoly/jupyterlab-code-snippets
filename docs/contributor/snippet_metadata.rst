.. _snippet_metadata:

Code Snippet Metadata 
-------------------
This extension uses JupyterLab Contents Service and creates a
``snippets/`` if it doesn’t exist. This is where code snippet json files
are stored, following a schema defined below.

.. code::

   {
      name: string,
      description: string,
      language: string,
      code: string[],
      id: number,
      tags?: string[]
   }

This is a sample code snippet json file:

.. code:: json

   {
     "name": "import_statements",
     "description": "Import statements for matlibplot.",
     "language": "python",
     "code": [
           "import matplotlib as mpl",
           "import matplotlib.pyplot as plt"
     ],
     "id": 1,
     "tags":["import statements"]
   }
