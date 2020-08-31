.. _snippet_metadata:

Code Snippet Metadata 
-------------------
.. code::

   {
      code: string,
      description: string,
      language: string,
      code: string[],
      id: number,
      tags?: string[]
   }

This is a sample code snippet metadata:

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
