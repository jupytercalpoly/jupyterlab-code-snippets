Transition to 2.1.0
===================

The 2.1.0 update has made snippets globally accessible across notebooks by saving 
them at the JupyterLab Settings API endpoint.

One side effect of this change is that snippets created in the previous version of 
this extension will not be supported. The /snippets folder will continue to be available
if previously created in a project folder.

In addition, the searching/tag feature has been expanded as well.


Transferring Single Snippets
----------------------------

To add old snippets to the new snippet location, simply copy the JSON object and go to:
Settings > Advanced Settings Editor > Code Snippet Manager

In the User Preferences panel there will be an array of snippets existing globally
(something like "snippets" : [...]) where the ... are the globally accessible
snippets.

At the end of the existing list, paste the copied JSON object, make sure the id value is
sequential to what already is in the list. Save using the save icon in the top right corner.
Snippet should appear in the snippets panel!

Open JSON file of snippet to upload:

.. image:: ../../Design/smallOpenJSON.png
   :align: center

Copy the JSON object:

.. image:: ../../Design/copy_JSON.png
   :align: center

Navigate to settings:

.. image:: ../../Design/smallGoToSettings.png
   :align: center

Paste JSON object into list of snippets:

.. image:: ../../Design/saveASingleSnippet.gif
   :align: center


After saving, new snippet should appear at the bottom of the snippets list in the snippet panel:

.. image:: ../../Design/smallSnippetAdded.png
   :align: center


Transferring Multiple Snippets
------------------------------

To help with converting entire /snippets folder worth of snippets we have developed a python
script to help with the transition:

.. code::

    import os
    import json
    import glob

    def extract_id(json):
        try:
            return json['id']
        except KeyError:
            return 0

    snippets = []
    counter = 0
    for filepath in glob.glob(os.path.join('snippets', '*.json')):
        with open(filepath) as f:
            content = json.load(f)
            content['id'] = counter
            snippets.append(content)
            counter+=1

    snippets.sort(key=extract_id)
    print('{"snippets": [\n')
    for snip in snippets:
        if not('tags' in snip):
            snip["tags"] = []
        if snippets.index(snip) == len(snippets)-1:
            print(json.dumps(snip, indent=4, sort_keys=True))
        else:
            print(json.dumps(snip, indent=4, sort_keys=True), end=",\n")
    print("]\n}\n")


This script will concatenate and print out all of the json objects in a /snippets folder
in a project. After running the script, copy the output and paste into the User Preferences
panel in settings, similar to the single snippet upload.

**NOTE**: If adding objects to existing list of snippets in user preferences, change *counter* variable
to n+1 where n is the ID of the last snippet stored in user preferences.

This script will print something like : 

.. code::


   {"snippets": [

   {
      "code": [
         "print(\"hello\")"
      ],
      "description": "",
      "id": 0,
      "language": "Python",
      "name": "new_snippet_3",
      "tags": [
         "import statements"
      ]
   },
   {
      "code": [
         "def most_frequent(list):",
         "    return max(set(list), key = list.count)",
         "  ",
         "",
         "numbers = [1,2,1,2,3,2,1,4,2]",
         "most_frequent(numbers)  "
      ],
      "description": "This method returns the most frequent element that appears in a list.",
      "id": 1,
      "language": "Python",
      "name": "most_frequent",
      "tags": []
   }
   ]
   }

After generating this dictionary, one can simply delete the current contents of user preferences 
(Advanced Settings > Code Snippet Manager > User Preferences) and paste this dictionary instead.
This will delete the current snippets at the endpoint (which will be default snippets if the extension is 
freshly updated/installed) and replace them with the old snippets.

**NOTE**: If adding objects onto an existing list of objects, make sure the ID numbers are all in sequential,
ascending order.

Search and Tag Update
---------------------

.. image:: ../../Design/smallUnselectedTags.png
   :align: center

**NOTE 1**: Snippet tags function on an OR basis, as in when the "data analytics" tag and the "import statements" tag are selected together, 
the panel displays any tags that are tagged as import statements OR tagged as "data analytics."

ex) Snippet tags selected together:

.. image:: ../../Design/smallSnippetTagsSelected.png
   :align: center

ex) Language tags selected together:

.. image:: ../../Design/smallLanguageTagsSelected.png
   :align: center

**NOTE 2**: Language tags and snippets tags have an AND relationship. As in when the "Python" tag and the "data analytics" tags are selected together, 
only snippets that are both in the language Python AND tagged as data analytics will appear.

.. image:: ../../Design/smallLangAndSnippetTag.png
   :align: center

**NOTE 3**: When language tags are selected, only snippet tags in that language will appear for ease of selection.

.. image:: ../../Design/smallPythonTagOnly.png
   :align: center

**NOTE 4**: If 2 of the same language tags appear in the Language Tags section this indicates that one of the snippets
contains a snippet tag that matches the language name. To get rid of the duplicate tag, filter through snippets and
untag any snippets that have that Language in their snippet tags.
