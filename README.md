# JupyterLab Code Snippet

## Save, reuse, and share code snippets using JupyterLab Code Snippets

![Github Actions Status](https://github.com/jupytercalpoly/jupyterlab-code-snippets/workflows/Build/badge.svg) [![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jahn96/jupyterlab-code-snippets.git/jupyterlab_update?urlpath=lab) [![NPM Version](https://img.shields.io/npm/v/jupyterlab-code-snippets.svg?style=flat)](https://npmjs.org/package/jupyterlab-code-snippets 'View this project on npm') [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/jupytercalpoly/jupyterlab-code-snippets/blob/master/LICENSE) [![Documentation Status](https://readthedocs.org/projects/jupyterlab-code-snippets-documentation/badge/?version=latest)](https://jupyterlab-code-snippets-documentation.readthedocs.io/en/latest/?badge=latest)

This extension is a derivative of [Elyra](https://github.com/elyra-ai/elyra)'s original design and further developed by Jupyter Cal Poly Team.

Read [Press Release](./PRESSRELEASE.md) for more information.

Check out [the Current Progress](./PROGRESS.md) to keep up with our feature updates!

This extension is composed of a NPM package named `jupyterlab-code-snippets`
for the frontend extension.

![Alt Text](Design/overview.gif)

## Requirements

- JupyterLab >= 3.0

## Install

```bash
jupyter labextension install jupyterlab-code-snippets
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
