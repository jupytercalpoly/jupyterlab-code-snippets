# JupyterLab Code Snippet

## Save, reuse, and share code snippets using JupyterLab Code Snippets

![Github Actions Status](https://github.com/jupytercalpoly/jupyterlab-code-snippets/workflows/Build/badge.svg) [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jupytercalpoly/jupyterlab-code-snippets.git/master?urlpath=lab) [![npm version](https://badge.fury.io/js/jupyterlab-code-snippets.svg)](https://badge.fury.io/js/jupyterlab-code-snippets 'View this project on npm') [![PyPI version](https://badge.fury.io/py/jupyterlab-code-snippets.svg)](https://badge.fury.io/py/jupyterlab-code-snippets) [![Conda Version](https://img.shields.io/conda/vn/conda-forge/jupyterlab-code-snippets.svg)](https://anaconda.org/conda-forge/jupyterlab-code-snippets) [![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](https://opensource.org/licenses/BSD-3-Clause) [![Documentation Status](https://readthedocs.org/projects/jupyterlab-code-snippets-documentation/badge/?version=latest)](https://jupyterlab-code-snippets-documentation.readthedocs.io/en/latest/?badge=latest)

This extension is a derivative of [Elyra](https://github.com/elyra-ai/elyra)'s original design and further developed by Jupyter Cal Poly Team.

Read [Press Release](./PRESSRELEASE.md) for more information.

Check out [the Current Progress](./PROGRESS.md) to keep up with our feature updates!

This extension is composed of a NPM package named `jupyterlab-code-snippets`
for the frontend extension.

![Alt Text](Design/overview.gif)

## Requirements

- JupyterLab >= 3.5.3
- Python >= 3.7

## Install

Install using jupyter:

```bash
jupyter labextension install jupyterlab-code-snippets
```

Install using pip:

```bash
pip install jupyterlab-code-snippets
```

```bash
conda install -c conda-forge jupyterlab-code-snippets
```

## Troubleshoot

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
# Move to jupyter-lab-code-snippets directory

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
jupyter labextension uninstall jupyterlab-code-snippets
```

OR

```bash
pip uninstall jupyterlab-code-snippets
```
