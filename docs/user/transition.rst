Transition to 2.1.0
===================

The 2.1.0 update has made snippets globally accessible across notebooks by saving 
them at the JupyterLab Settings API endpoint.

One side effect of this change is that snippets created in the previous version of 
this extension will not be supported. The /snippets folder will continue to be available
if previously created in a project folder.


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
    for snip in snippets:
        if not('tags' in snip):
            snip["tags"] = []
        if snippets.index(snip) == len(snippets)-1:
            print(snip)
        else:
            print(snip, end=",\n")


This script will concatenate and print out all of the json objects in a /snippets folder
in a project. After running the script, copy the output and paste into the User Preferences
panel in settings.
