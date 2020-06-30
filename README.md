# code_snippets

![Github Actions Status](https://github.com/jupytercalpoly/project2.git/workflows/Build/badge.svg)[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupytercalpoly/project2.git/master?urlpath=lab)

Save, reuse, and share code snippets using JupyterLab Code Snippets

Read [press release](./PRESSRELEASE.md) for more information.

This extension is composed of a Python package named `code_snippets`
for the server extension and a NPM package named `code-snippets`
for the frontend extension.

## Requirements

* JupyterLab >= 2.0

## Install

Note: You will need NodeJS to install the extension.

Right now, this extension is only available from source.

First clone this repo:
```
git clone https://github.com/jupytercalpoly/jupyterlab-code-snippets
```

Move into the root directory and install a development version of the server extension. This extension uses the Elyra metadata service as a backend and creates a `"code-snippets"` namespace for storing code snippets from this extension.

```bash
# Move into the root directory
cd jupyterlab-code-snippets
# Install a development version of the server extension backend.
pip install -e .
```

**NEED INSTRUCTIONS FOR INSTALLING JAVASCRIPT!**


## Troubleshoot

If you are seeing the frontend extension but it is not working, check
that the server extension is enabled:

```bash
jupyter serverextension list
```

If the server extension is installed and enabled but you are not seeing
the frontend, check the frontend is installed:

```bash
jupyter labextension list
```

If it is installed, try:

```bash
jupyter lab clean
jupyter lab build
```

## Contributing

### Install

The `jlpm` command is JupyterLab's pinned version of
[yarn](https://yarnpkg.com/) that is installed with JupyterLab. You may use
`yarn` or `npm` in lieu of `jlpm` below.

```bash
# Clone the repo to your local environment
# Move to code_snippets directory

# Install server extension
pip install -e .
# Register server extension
jupyter serverextension enable --py code_snippets --sys-prefix

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
```

You can watch the source directory and run JupyterLab in watch mode to watch for changes in the extension's source and automatically rebuild the extension and application.

```bash
# Watch the source directory in another terminal tab
jlpm watch
# Run jupyterlab in watch mode in one terminal tab
jupyter lab --watch
```

Now every change will be built locally and bundled into JupyterLab. Be sure to refresh your browser page after saving file changes to reload the extension (note: you'll need to wait for webpack to finish, which can take 10s+ at times).

### Uninstall

```bash
pip uninstall code_snippets
jupyter labextension uninstall code-snippets
```
