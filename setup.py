"""
Setup Module to setup Python Handlers for the code_snippets extension.
"""
import os

from jupyter_packaging import (
    create_cmdclass,
    ensure_python,
    get_version
)
import setuptools

HERE = os.path.abspath(os.path.dirname(__file__))

# The name of the project
name="metadata_code_snippets"

# Ensure a valid python version
ensure_python(">=3.5")

# Get our version
version = get_version(os.path.join(name, "_version.py"))

data_files_spec = [
    ("share/jupyter/metadata/code-snippets", "share/jupyter/metadata/code-snippets", "*.json")
]

cmdclass = create_cmdclass(
    data_files_spec=data_files_spec
)


with open("README.md", "r") as fh:
    long_description = fh.read()

setup_args = dict(
    name=name,
    version=version,
    url="https://github.com/jupytercalpoly/project2.git",
    author="Jay Ahn, Kiran Pinnipati",
    description="Save, reuse, and share code snippets using JupyterLab Code Snippets",
    long_description= long_description,
    long_description_content_type="text/markdown",
    cmdclass=cmdclass,
    install_requires=[
        "jupyterlab~=2.0",
        "elyra==1.0.0b1"
    ],
    zip_safe=False,
    include_package_data=True,
    license="BSD-3-Clause",
    platforms="Linux, Mac OS X, Windows",
    keywords=["Jupyter", "JupyterLab"],
    classifiers=[
        "License :: OSI Approved :: BSD License",
        "Programming Language :: Python",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.5",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",
        "Framework :: Jupyter",
    ],
)


if __name__ == "__main__":
    setuptools.setup(**setup_args)
