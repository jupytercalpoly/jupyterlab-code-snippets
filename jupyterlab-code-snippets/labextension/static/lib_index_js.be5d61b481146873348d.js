"use strict";
(self["webpackChunkjupyterlab_code_snippets"] = self["webpackChunkjupyterlab_code_snippets"] || []).push([["lib_index_js"],{

/***/ "./lib/CodeSnippetContentsService.js":
/*!*******************************************!*\
  !*** ./lib/CodeSnippetContentsService.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetContentsService": () => (/* binding */ CodeSnippetContentsService)
/* harmony export */ });
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/services */ "webpack/sharing/consume/default/@jupyterlab/services");
/* harmony import */ var _jupyterlab_services__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_services__WEBPACK_IMPORTED_MODULE_0__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

/**
 * Singleton contentsService class
 */
class CodeSnippetContentsService {
    constructor() {
        const drive = new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_0__.Drive({ name: 'snippetDrive ' });
        const contentsManager = new _jupyterlab_services__WEBPACK_IMPORTED_MODULE_0__.ContentsManager({ defaultDrive: drive });
        this.drive = drive;
        this.contentsManager = contentsManager;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new CodeSnippetContentsService();
        }
        return this.instance;
    }
    /**
     * Create a file/directory if it does not exist. Otherwise, save the change in a file/directory in the given path
     * @param path path to a file/directory
     * @param options options that specify if it's a file or directory and additial information
     * Usage: save('snippets', { type: 'directory' }) to create/save a directory
     *        save('snippets/test.json', {type: 'file', format: 'text', content: 'Lorem ipsum dolor sit amet'})
     */
    async save(path, options) {
        try {
            const changedModel = await this.contentsManager.save(path, options);
            return changedModel;
        }
        catch (error) {
            return error;
        }
    }
}


/***/ }),

/***/ "./lib/CodeSnippetDisplay.js":
/*!***********************************!*\
  !*** ./lib/CodeSnippetDisplay.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetDisplay": () => (/* binding */ CodeSnippetDisplay)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/coreutils */ "webpack/sharing/consume/default/@jupyterlab/coreutils");
/* harmony import */ var _jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/docregistry */ "webpack/sharing/consume/default/@jupyterlab/docregistry");
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/fileeditor */ "webpack/sharing/consume/default/@jupyterlab/fileeditor");
/* harmony import */ var _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/cells */ "webpack/sharing/consume/default/@jupyterlab/cells");
/* harmony import */ var _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _lumino_dragdrop__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @lumino/dragdrop */ "webpack/sharing/consume/default/@lumino/dragdrop");
/* harmony import */ var _lumino_dragdrop__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_lumino_dragdrop__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _CodeSnippetFilterTools__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./CodeSnippetFilterTools */ "./lib/CodeSnippetFilterTools.js");
/* harmony import */ var _CodeSnippetPreview__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./CodeSnippetPreview */ "./lib/CodeSnippetPreview.js");
/* harmony import */ var _CodeSnippetMenu__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./CodeSnippetMenu */ "./lib/CodeSnippetMenu.js");
/* harmony import */ var _CodeSnippetContentsService__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./CodeSnippetContentsService */ "./lib/CodeSnippetContentsService.js");
/* harmony import */ var _style_icon_jupyter_moreicon_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../style/icon/jupyter_moreicon.svg */ "./style/icon/jupyter_moreicon.svg");
/* harmony import */ var _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./CodeSnippetLanguages */ "./lib/CodeSnippetLanguages.js");
/* harmony import */ var _CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./CodeSnippetMessage */ "./lib/CodeSnippetMessage.js");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.
// Some lines of code are from Elyra Code Snippet.
/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */



















/**
 * The CSS class added to code snippet widget.
 */
const CODE_SNIPPETS_HEADER_CLASS = 'jp-codeSnippetsHeader';
const CODE_SNIPPET_TITLE = 'jp-codeSnippet-title';
const CODE_SNIPPETS_CONTAINER = 'jp-codeSnippetsContainer';
const DISPLAY_NAME_CLASS = 'jp-codeSnippetsContainer-name';
const BUTTON_CLASS = 'jp-codeSnippetsContainer-button';
const TITLE_CLASS = 'jp-codeSnippetsContainer-title';
const ACTION_BUTTONS_WRAPPER_CLASS = 'jp-codeSnippetsContainer-action-buttons';
const ACTION_BUTTON_CLASS = 'jp-codeSnippetsContainer-actionButton';
const SEARCH_BOLD = 'jp-codeSnippet-search-bolding';
const SNIPPET_DRAG_IMAGE = 'jp-codeSnippet-drag-image';
const CODE_SNIPPET_DRAG_HOVER = 'jp-codeSnippet-drag-hover';
const CODE_SNIPPET_DRAG_HOVER_SELECTED = 'jp-codeSnippet-drag-hover-selected';
const CODE_SNIPPET_METADATA = 'jp-codeSnippet-metadata';
const CODE_SNIPPET_DESC = 'jp-codeSnippet-description';
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_MORE_OPTIONS = 'jp-codeSnippet-options';
const CODE_SNIPPET_MORE_OTPIONS_CONTENT = 'jp-codeSnippet-more-options-content';
const CODE_SNIPPET_MORE_OTPIONS_COPY = 'jp-codeSnippet-more-options-copy';
const CODE_SNIPPET_MORE_OTPIONS_INSERT = 'jp-codeSnippet-more-options-insert';
const CODE_SNIPPET_MORE_OTPIONS_EDIT = 'jp-codeSnippet-more-options-edit';
const CODE_SNIPPET_MORE_OTPIONS_DELETE = 'jp-codeSnippet-more-options-delete';
const CODE_SNIPPET_MORE_OTPIONS_EXPORT = 'jp-codeSnippet-more-options-export';
const CODE_SNIPPET_CREATE_NEW_BTN = 'jp-createSnippetBtn';
const CODE_SNIPPET_NAME = 'jp-codeSnippet-name';
const OPTIONS_BODY = 'jp-codeSnippet-options-body';
/**
 * The threshold in pixels to start a drag event.
 */
const DRAG_THRESHOLD = 3;
/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'jp-codeSnippet-item';
/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';
/**
 * Icon for more options
 */
const moreOptionsIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.LabIcon({
    name: 'custom-ui-components:moreOptions',
    svgstr: _style_icon_jupyter_moreicon_svg__WEBPACK_IMPORTED_MODULE_12__["default"],
});
/**
 * A React Component for code-snippets display list.
 */
class CodeSnippetDisplay extends (react__WEBPACK_IMPORTED_MODULE_11___default().Component) {
    constructor(props) {
        super(props);
        this.filterSnippets = (codeSnippets, searchValue, filterTags, selectedLangTags) => {
            // filter with search
            let filteredSnippets = codeSnippets.slice();
            const matchedIndices = {};
            if (searchValue !== '') {
                const matchResults = [];
                const filteredSnippetsScore = [];
                // language, title, code
                filteredSnippets.forEach((snippet) => {
                    const matchResult = _lumino_algorithm__WEBPACK_IMPORTED_MODULE_8__.StringExt.matchSumOfSquares((snippet.language + snippet.name + snippet.code).toLowerCase(), searchValue.replace(' ', '').toLowerCase());
                    if (matchResult) {
                        matchResults.push(matchResult);
                        filteredSnippetsScore.push({
                            score: matchResult.score,
                            snippet: snippet,
                        });
                    }
                });
                // sort snippets by its score
                filteredSnippetsScore.sort((a, b) => a.score - b.score);
                const newFilteredSnippets = [];
                filteredSnippetsScore.forEach((snippetScore) => newFilteredSnippets.push(snippetScore.snippet));
                filteredSnippets = newFilteredSnippets;
                // sort the matchResults by its score
                matchResults.sort((a, b) => a.score - b.score);
                matchResults.forEach((res, id) => {
                    matchedIndices[filteredSnippets[id].id] = res.indices;
                });
            }
            // filter with tags
            if (filterTags.length !== 0) {
                filteredSnippets = filteredSnippets.filter((codeSnippet) => {
                    return filterTags.some((filterTag) => {
                        if (codeSnippet.tags) {
                            if (selectedLangTags.length !== 0) {
                                // lang tags selected
                                if (codeSnippet.tags.includes(filterTag) &&
                                    selectedLangTags.includes(codeSnippet.language)) {
                                    return true;
                                }
                                //if only language tags are selected
                                else if (filterTags.length === selectedLangTags.length &&
                                    filterTags.every((value) => selectedLangTags.includes(value))) {
                                    if (selectedLangTags.includes(codeSnippet.language)) {
                                        return true;
                                    }
                                }
                            }
                            else {
                                // no lang tags selected
                                if (codeSnippet.tags.includes(filterTag)) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    });
                });
            }
            // find id's that are not in filteredSnippets
            const willBeRemovedIds = [];
            for (const key in matchedIndices) {
                let hasKey = false;
                for (const codeSnippet of filteredSnippets) {
                    if (codeSnippet.id === parseInt(key)) {
                        hasKey = true;
                    }
                }
                if (hasKey === false) {
                    willBeRemovedIds.push(parseInt(key));
                }
            }
            // if the snippet does not have the tag, remove its mathed index
            willBeRemovedIds.forEach((id) => delete matchedIndices[id]);
            return {
                filteredCodeSnippets: filteredSnippets,
                matchedIndices: matchedIndices,
            };
        };
        // Handle code snippet insert into a notebook or document
        this.insertCodeSnippet = async (snippet) => {
            var _a, _b;
            const widget = this.props.getCurrentWidget();
            if (widget instanceof _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_2__.DocumentWidget &&
                widget.content instanceof _jupyterlab_fileeditor__WEBPACK_IMPORTED_MODULE_3__.FileEditor) {
                const documentWidget = widget;
                // code editor
                const fileEditor = documentWidget.content.editor;
                const markdownRegex = /^\.(md|mkdn?|mdown|markdown)$/;
                if (_jupyterlab_coreutils__WEBPACK_IMPORTED_MODULE_1__.PathExt.extname(documentWidget.context.path).match(markdownRegex) !==
                    null) {
                    // Wrap snippet into a code block when inserting it into a markdown file
                    fileEditor.replaceSelection('```' + snippet.language + '\n' + snippet.code + '\n```');
                }
                else if (documentWidget.constructor.name === 'PythonFileEditor') {
                    this.verifyLanguageAndInsert(snippet, 'python', fileEditor);
                }
                else {
                    fileEditor.replaceSelection(snippet.code);
                }
            }
            else if (widget instanceof _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_4__.NotebookPanel) {
                const notebookWidget = widget;
                const notebookCell = notebookWidget.content.activeCell;
                // editor
                const notebookCellEditor = notebookCell.editor;
                if (notebookCell instanceof _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6__.CodeCell) {
                    const kernelInfo = await ((_b = (_a = notebookWidget.sessionContext.session) === null || _a === void 0 ? void 0 : _a.kernel) === null || _b === void 0 ? void 0 : _b.info);
                    const kernelLanguage = (kernelInfo === null || kernelInfo === void 0 ? void 0 : kernelInfo.language_info.name) || '';
                    this.verifyLanguageAndInsert(snippet, kernelLanguage, notebookCellEditor);
                }
                else if (notebookCell instanceof _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6__.MarkdownCell) {
                    // Wrap snippet into a code block when inserting it into a markdown cell
                    notebookCellEditor.replaceSelection('```' + snippet.language + '\n' + snippet.code + '\n```');
                }
                else {
                    notebookCellEditor.replaceSelection(snippet.code);
                }
            }
            else {
                this.showErrDialog('Code snippet insert failed: Unsupported widget');
            }
        };
        // Handle language compatibility between code snippet and editor
        this.verifyLanguageAndInsert = async (snippet, editorLanguage, editor) => {
            if (editorLanguage &&
                snippet.language.toLowerCase() !== editorLanguage.toLowerCase()) {
                const result = await this.showWarnDialog(editorLanguage, snippet.name);
                if (result.button.accept) {
                    editor.replaceSelection(snippet.code);
                }
            }
            else {
                // Language match or editorLanguage is unavailable
                editor.replaceSelection(snippet.code);
            }
        };
        // Display warning dialog when inserting a code snippet incompatible with editor's language
        this.showWarnDialog = async (editorLanguage, snippetName) => {
            return (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                title: 'Warning',
                body: 'Code snippet "' +
                    snippetName +
                    '" is incompatible with ' +
                    editorLanguage +
                    '. Continue?',
                buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton(), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()],
            });
        };
        // Display error dialog when inserting a code snippet into unsupported widget (i.e. not an editor)
        this.showErrDialog = (errMsg) => {
            return (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                title: 'Error',
                body: errMsg,
                buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton()],
            });
        };
        // Create 6 dots drag/drop image on hover
        this.dragHoverStyle = (id) => {
            document
                .querySelector(`#${CODE_SNIPPET_DRAG_HOVER}${id}`)
                .classList // .getElementsByClassName(CODE_SNIPPET_DRAG_HOVER)
                // [id].classList.
                .add(CODE_SNIPPET_DRAG_HOVER_SELECTED);
        };
        // Remove 6 dots off hover
        this.dragHoverStyleRemove = (id) => {
            if (document.getElementsByClassName(CODE_SNIPPET_DRAG_HOVER_SELECTED)) {
                document
                    .querySelector(`#${CODE_SNIPPET_DRAG_HOVER}${id}`)
                    .classList.remove(CODE_SNIPPET_DRAG_HOVER_SELECTED);
            }
        };
        // Bold text in snippet name based on search
        this.boldNameOnSearch = (id, language, name, matchedIndices) => {
            const displayName = language + name;
            // check if the searchValue is not ''
            if (this.state.searchValue !== '') {
                const elements = [];
                if (matchedIndices) {
                    // get first match index in the name
                    let i = 0;
                    while (i < matchedIndices.length) {
                        if (matchedIndices[i] >= language.length) {
                            elements.push(displayName.substring(language.length, matchedIndices[i]));
                            break;
                        }
                        i++;
                    }
                    // when there is no match in name but language
                    if (i >= matchedIndices.length) {
                        return react__WEBPACK_IMPORTED_MODULE_11___default().createElement("span", null, name);
                    }
                    else {
                        // current and next indices are bold indices
                        let currIndex = matchedIndices[i];
                        let nextIndex;
                        // check if the match is the end of the name
                        if (i < matchedIndices.length - 1) {
                            i++;
                            nextIndex = matchedIndices[i];
                        }
                        else {
                            nextIndex = null;
                        }
                        while (nextIndex !== null) {
                            // make the current index bold
                            elements.push(react__WEBPACK_IMPORTED_MODULE_11___default().createElement("mark", { key: id + '_' + currIndex, className: SEARCH_BOLD }, displayName.substring(currIndex, currIndex + 1)));
                            // add the regular string until we reach the next bold index
                            elements.push(displayName.substring(currIndex + 1, nextIndex));
                            currIndex = nextIndex;
                            if (i < matchedIndices.length - 1) {
                                i++;
                                nextIndex = matchedIndices[i];
                            }
                            else {
                                nextIndex = null;
                            }
                        }
                        if (nextIndex === null) {
                            elements.push(react__WEBPACK_IMPORTED_MODULE_11___default().createElement("mark", { key: id + '_' + currIndex, className: SEARCH_BOLD }, displayName.substring(currIndex, currIndex + 1)));
                            elements.push(displayName.substring(currIndex + 1, displayName.length));
                        }
                        return react__WEBPACK_IMPORTED_MODULE_11___default().createElement("span", null, elements);
                    }
                }
            }
            return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement("span", { title: 'Double click to rename', className: CODE_SNIPPET_NAME, onDoubleClick: this.handleRenameSnippet }, name));
        };
        // Render display of code snippet list
        this.renderCodeSnippet = (codeSnippet, matchedIndices) => {
            const id = codeSnippet.id;
            const buttonClasses = BUTTON_CLASS;
            const displayName = '[' + codeSnippet.language + '] ' + codeSnippet.name;
            const name = codeSnippet.name;
            const language = codeSnippet.language;
            const actionButtons = [
                {
                    title: 'Insert, copy, edit, and delete',
                    icon: moreOptionsIcon,
                    onClick: (event) => {
                        (0,_CodeSnippetMenu__WEBPACK_IMPORTED_MODULE_13__.showMoreOptions)({
                            body: new OptionsHandler(this, codeSnippet),
                        });
                        this._setOptionsPosition(event);
                    },
                },
            ];
            return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { key: codeSnippet.name, className: CODE_SNIPPET_ITEM, id: `${CODE_SNIPPET_ITEM}${id}`, title: 'Right click for more options', onMouseOver: () => {
                    this.dragHoverStyle(id);
                }, onMouseOut: () => {
                    this.dragHoverStyleRemove(id);
                }, onContextMenu: (event) => {
                    event.preventDefault();
                    (0,_CodeSnippetMenu__WEBPACK_IMPORTED_MODULE_13__.showMoreOptions)({
                        body: new OptionsHandler(this, codeSnippet),
                    });
                    this._setOptionsPosition(event);
                } },
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { className: CODE_SNIPPET_DRAG_HOVER, title: "Drag to move", id: `${CODE_SNIPPET_DRAG_HOVER}${id}`, onMouseDown: (event) => {
                        this.handleDragSnippet(event);
                    } }),
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { className: CODE_SNIPPET_METADATA, onMouseEnter: () => {
                        (0,_CodeSnippetPreview__WEBPACK_IMPORTED_MODULE_14__.showPreview)({
                            id: id,
                            title: displayName,
                            body: new PreviewHandler(),
                            codeSnippet: codeSnippet,
                        }, this.props.editorServices);
                        this._setPreviewPosition(id);
                    }, onMouseLeave: () => {
                        this._evtMouseLeave();
                    } },
                    react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { key: displayName, className: TITLE_CLASS, id: `${TITLE_CLASS}${id}` },
                        react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { id: id.toString(), className: DISPLAY_NAME_CLASS },
                            this.renderLanguageIcon(language),
                            this.boldNameOnSearch(id, language, name, matchedIndices)),
                        react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { className: ACTION_BUTTONS_WRAPPER_CLASS, id: id.toString() }, actionButtons.map((btn) => {
                            return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement("button", { key: btn.title, title: btn.title, className: buttonClasses + ' ' + ACTION_BUTTON_CLASS, onClick: (event) => {
                                    btn.onClick(event);
                                } },
                                react__WEBPACK_IMPORTED_MODULE_11___default().createElement(btn.icon.react, { tag: "span", elementPosition: "center", width: "16px", height: "16px" })));
                        }))),
                    this.renderDescription(codeSnippet, id))));
        };
        this.handleFilter = (searchValue, filterTags, selectedLangTags) => {
            this.setState({
                searchValue: searchValue,
                filterTags: filterTags,
                selectedLangTags: selectedLangTags,
            });
        };
        this.getActiveTagsDictionary = () => {
            const tagsAndLangs = new Map();
            for (const codeSnippet of this.props.codeSnippets) {
                if (codeSnippet.tags) {
                    // check if tag is in dict, if it is add lang to value (if not already present)
                    // if tag not in dict add tag as key and lang as first val
                    for (const tag of codeSnippet.tags) {
                        if (tag !== codeSnippet.language) {
                            if (tagsAndLangs.has(tag)) {
                                const langs = tagsAndLangs.get(tag);
                                if (!langs.includes(codeSnippet.language)) {
                                    langs.push(codeSnippet.language);
                                }
                                tagsAndLangs.set(tag, langs);
                            }
                            else {
                                tagsAndLangs.set(tag, [codeSnippet.language]);
                            }
                        }
                    }
                }
            }
            return tagsAndLangs;
        };
        this.state = {
            searchValue: '',
            filterTags: [],
            selectedLangTags: [],
            searchOptions: [],
        };
        this._drag = null;
        this._dragData = null;
        this.handleDragMove = this.handleDragMove.bind(this);
        this._evtMouseUp = this._evtMouseUp.bind(this);
        this.handleRenameSnippet = this.handleRenameSnippet.bind(this);
        this.setSearchOptions = this.setSearchOptions.bind(this);
    }
    // rename snippet on double click
    async handleRenameSnippet(event) {
        const target = event.target;
        const oldName = target.innerHTML;
        const new_element = document.createElement('input');
        new_element.setAttribute('type', 'text');
        new_element.id = 'jp-codeSnippet-rename';
        new_element.innerHTML = target.innerHTML;
        target.replaceWith(new_element);
        new_element.value = target.innerHTML;
        new_element.focus();
        new_element.setSelectionRange(0, new_element.value.length);
        new_element.onblur = async () => {
            if (target.innerHTML !== new_element.value) {
                const newName = new_element.value;
                const isDuplicateName = this.props.codeSnippetManager.duplicateNameExists(newName);
                if (isDuplicateName) {
                    await (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
                        title: 'Duplicate Name of Code Snippet',
                        body: react__WEBPACK_IMPORTED_MODULE_11___default().createElement("p", null,
                            " ",
                            `"${newName}" already exists.`,
                            " "),
                        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton({ label: 'Dismiss' })],
                    });
                }
                else {
                    this.props.codeSnippetManager
                        .renameSnippet(oldName, newName)
                        .then(async (res) => {
                        if (res) {
                            target.innerHTML = new_element.value;
                        }
                        else {
                            console.log('Error in renaming snippet!');
                        }
                    });
                }
            }
            new_element.replaceWith(target);
        };
        new_element.onkeydown = (event) => {
            switch (event.code) {
                case 'Enter': // Enter
                    event.stopPropagation();
                    event.preventDefault();
                    new_element.blur();
                    break;
                case 'NumpadEnter': // Enter
                    event.stopPropagation();
                    event.preventDefault();
                    new_element.blur();
                    break;
                case 'Escape': // Escape
                    event.stopPropagation();
                    event.preventDefault();
                    new_element.blur();
                    break;
                case 'ArrowUp': // Up arrow
                    event.stopPropagation();
                    event.preventDefault();
                    new_element.selectionStart = new_element.selectionEnd = 0;
                    break;
                case 'ArrowDown': // Down arrow
                    event.stopPropagation();
                    event.preventDefault();
                    new_element.selectionStart = new_element.selectionEnd =
                        new_element.value.length;
                    break;
                default:
                    break;
            }
        };
    }
    handleDragSnippet(event) {
        const { button } = event;
        // if button is not the left click
        if (!(button === 0)) {
            return;
        }
        const target = event.target;
        this._dragData = {
            pressX: event.clientX,
            pressY: event.clientY,
            dragImage: target.nextSibling.firstChild.cloneNode(true),
        };
        const dragImageTextColor = getComputedStyle(document.body).getPropertyValue('--jp-content-font-color3');
        this._dragData.dragImage.children[0].style.color =
            dragImageTextColor;
        // add CSS style
        this._dragData.dragImage.classList.add(SNIPPET_DRAG_IMAGE);
        target.addEventListener('mouseup', this._evtMouseUp, true);
        target.addEventListener('mousemove', this.handleDragMove, true);
        // since a browser has its own drag'n'drop support for images and some other elements.
        target.ondragstart = () => false;
        event.preventDefault();
    }
    _evtMouseUp(event) {
        event.preventDefault();
        event.stopPropagation();
        const target = event.target;
        target.removeEventListener('mousemove', this.handleDragMove, true);
        target.removeEventListener('mouseup', this._evtMouseUp, true);
    }
    handleDragMove(event) {
        event.preventDefault();
        event.stopPropagation();
        const data = this._dragData;
        if (data &&
            this.shouldStartDrag(data.pressX, data.pressY, event.clientX, event.clientY)) {
            const idx = event.target.id.slice(CODE_SNIPPET_DRAG_HOVER.length);
            const codeSnippet = this.props.codeSnippets.filter((codeSnippet) => codeSnippet.id === parseInt(idx))[0];
            void this.startDrag(data.dragImage, codeSnippet, event.clientX, event.clientY);
        }
    }
    /**
     * Detect if a drag event should be started. This is down if the
     * mouse is moved beyond a certain distance (DRAG_THRESHOLD).
     *
     * @param prevX - X Coordinate of the mouse pointer during the mousedown event
     * @param prevY - Y Coordinate of the mouse pointer during the mousedown event
     * @param nextX - Current X Coordinate of the mouse pointer
     * @param nextY - Current Y Coordinate of the mouse pointer
     */
    shouldStartDrag(prevX, prevY, nextX, nextY) {
        const dx = Math.abs(nextX - prevX);
        const dy = Math.abs(nextY - prevY);
        return dx >= 0 || dy >= DRAG_THRESHOLD;
    }
    async startDrag(dragImage, codeSnippet, clientX, clientY) {
        const target = event.target;
        const model = new _jupyterlab_cells__WEBPACK_IMPORTED_MODULE_6__.CodeCellModel({});
        model.value.text = codeSnippet.code;
        model.metadata;
        const selected = [model.toJSON()];
        this._drag = new _lumino_dragdrop__WEBPACK_IMPORTED_MODULE_9__.Drag({
            mimeData: new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_10__.MimeData(),
            dragImage: dragImage,
            supportedActions: 'copy-move',
            proposedAction: 'copy',
            source: this,
        });
        this._drag.mimeData.setData(JUPYTER_CELL_MIME, selected);
        const textContent = codeSnippet.code;
        this._drag.mimeData.setData('text/plain', textContent);
        // Remove mousemove and mouseup listeners and start the drag.
        target.removeEventListener('mousemove', this.handleDragMove, true);
        target.removeEventListener('mouseup', this._evtMouseUp, true);
        return this._drag.start(clientX, clientY).then(() => {
            this.dragHoverStyleRemove(codeSnippet.id);
            this._drag = null;
            this._dragData = null;
        });
    }
    _evtMouseLeave() {
        const preview = document.querySelector('.jp-codeSnippet-preview');
        if (preview) {
            if (!preview.classList.contains('inactive')) {
                preview.classList.add('inactive');
            }
        }
    }
    //Set the position of the preview to be next to the snippet title.
    _setPreviewPosition(id) {
        const realTarget = document.querySelector(`#${TITLE_CLASS}${id}`);
        const newTarget = document.querySelector(`#${CODE_SNIPPET_ITEM}${id}`);
        // (CODE_SNIPPET_ITEM)[id];
        // distDown is the number of pixels to shift the preview down
        const distDown = realTarget.getBoundingClientRect().top - 43; //this is bumping it up
        const elementSnippet = newTarget;
        const heightSnippet = elementSnippet.clientHeight;
        const heightPreview = heightSnippet.toString(10) + 'px';
        document.documentElement.style.setProperty('--preview-max-height', heightPreview);
        const final = distDown.toString(10) + 'px';
        document.documentElement.style.setProperty('--preview-distance', final);
    }
    //Set the position of the option to be under to the three dots on snippet.
    _setOptionsPosition(event) {
        const target = event.target;
        let top;
        if (target.tagName === 'path') {
            top = target.getBoundingClientRect().top + 10;
        }
        else {
            top = target.getBoundingClientRect().top + 18;
        }
        if (top > 0.7 * window.screen.height) {
            top -= 120;
        }
        const leftAsString = (target.parentElement.style.left + event.pageX).toString() + 'px';
        const topAsString = top.toString(10) + 'px';
        document.documentElement.style.setProperty('--more-options-top', topAsString);
        document.documentElement.style.setProperty('--more-options-left', leftAsString);
    }
    renderLanguageIcon(language) {
        switch (language) {
            case 'Python': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.pythonIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Gfm': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.markdownIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Java': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.javaIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'R': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.rKernelIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Julia': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.juliaIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Matlab': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.matlabIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Scheme': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.schemeIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Processing': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.processingIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Scala': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.scalaIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Groovy': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.groovyIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Fortran': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.fortranIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Haskell': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.haskellIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Ruby': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.rubyIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'TypeScript': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.typescriptIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'JavaScript': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.javascriptIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'CoffeeScript': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.coffeescriptIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'LiveScript': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.livescriptIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'C#': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.csharpIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'F#': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.fsharpIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Go': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.goIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Erlang': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.erlangIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'OCaml': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.ocamlIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Forth': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.forthIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Perl': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.perlIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'PHP': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.phpIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Clojure': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.clojureIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Lua': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.luaIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'PureScript': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.purescriptIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'C++': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.cppIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Prolog': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.prologIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Common Lisp': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.lispIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'C': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.cIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Kotlin': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.kotlinIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'NodeJS': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.nodejsIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Coconut': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.coconutIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Babel': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.babelIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'SAS': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.sasIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'sbt': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.sbtIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Rust': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.rustIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Q#': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.qsharpIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Markdown': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.markdownIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            case 'Powershell': {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_15__.powershellIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
            default: {
                return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.fileIcon.react, { tag: "span", height: "16px", width: "16px", right: "7px", top: "5px", "margin-right": "3px" }));
            }
        }
    }
    renderDescription(codeSnippet, id) {
        if (codeSnippet.description && codeSnippet.description.length !== 0) {
            return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { className: CODE_SNIPPET_DESC, id: id.toString() },
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("p", { id: id.toString() }, `${codeSnippet.description}`)));
        }
        else {
            return null;
        }
    }
    getActiveTags() {
        let tags = [];
        const languages = [];
        for (const codeSnippet of this.props.codeSnippets) {
            if (codeSnippet.tags) {
                tags = tags.concat(codeSnippet.tags.filter((tag) => !tags.includes(tag)));
            }
            if (!languages.includes(codeSnippet.language)) {
                languages.push(codeSnippet.language);
            }
        }
        return [tags, languages];
    }
    deleteCommand(codeSnippet) {
        (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)({
            title: 'Delete snippet?',
            body: 'Are you sure you want to delete "' + codeSnippet.name + '"? ',
            buttons: [
                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton(),
                _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.warnButton({
                    label: 'Delete',
                }),
            ],
        }).then((response) => {
            if (response.button.accept) {
                const widgetId = `${CODE_SNIPPET_EDITOR}-${codeSnippet.id}`;
                const editor = (0,_lumino_algorithm__WEBPACK_IMPORTED_MODULE_8__.find)(this.props.app.shell.widgets('main'), (widget, _) => {
                    return widget.id === widgetId;
                });
                if (editor) {
                    editor.dispose();
                }
                // deleting snippets when there is one snippet active
                this.props.codeSnippetManager
                    .deleteSnippet(codeSnippet.id)
                    .then((result) => {
                    if (result) {
                        this.props.updateCodeSnippetWidget();
                    }
                    else {
                        console.log('Error in deleting the snippet');
                        return;
                    }
                });
            }
        });
    }
    exportCommand(codeSnippet) {
        // Request a text
        _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.InputDialog.getText({
            title: 'Export Snippet?',
            label: 'Directory to Export: ',
            placeholder: 'share/snippet',
            okLabel: 'Export',
        }).then((value) => {
            if (value.button.accept) {
                const dirs = value.value.split('/');
                const codeSnippetContentsManager = _CodeSnippetContentsService__WEBPACK_IMPORTED_MODULE_16__.CodeSnippetContentsService.getInstance();
                let path = '';
                for (let i = 0; i < dirs.length; i++) {
                    path += dirs[i] + '/';
                    codeSnippetContentsManager
                        .save(path, { type: 'directory' })
                        .catch((_) => {
                        alert('Path should be a relative path');
                    });
                }
                path += codeSnippet.name + '.json';
                codeSnippetContentsManager.save(path, {
                    type: 'file',
                    format: 'text',
                    content: JSON.stringify(codeSnippet),
                });
                (0,_CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_17__.showMessage)('export');
            }
        });
    }
    // remove dropdown menu
    removeOptionsNode() {
        const temp = document.getElementsByClassName(CODE_SNIPPET_MORE_OPTIONS)[0];
        if (!temp.classList.contains('inactive')) {
            temp.classList.add('inactive');
        }
    }
    // create dropdown menu
    createOptionsNode(codeSnippet) {
        const body = document.createElement('div');
        body.className = OPTIONS_BODY;
        const optionsContainer = document.createElement('div');
        optionsContainer.className = CODE_SNIPPET_MORE_OTPIONS_CONTENT;
        const insertSnip = document.createElement('div');
        insertSnip.className = CODE_SNIPPET_MORE_OTPIONS_INSERT;
        insertSnip.textContent = 'Insert snippet';
        insertSnip.onclick = () => {
            this.insertCodeSnippet(codeSnippet);
            this.removeOptionsNode();
        };
        const copySnip = document.createElement('div');
        copySnip.className = CODE_SNIPPET_MORE_OTPIONS_COPY;
        copySnip.textContent = 'Copy snippet to clipboard';
        copySnip.onclick = () => {
            _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Clipboard.copyToSystem(codeSnippet.code);
            (0,_CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_17__.showMessage)('copy');
            this.removeOptionsNode();
        };
        const editSnip = document.createElement('div');
        editSnip.className = CODE_SNIPPET_MORE_OTPIONS_EDIT;
        editSnip.textContent = 'Edit snippet';
        editSnip.onclick = () => {
            const allSnippetTags = this.getActiveTags()[0]; // snippet tags only
            const allLangTags = this.getActiveTags()[1];
            this.props.openCodeSnippetEditor({
                name: codeSnippet.name,
                description: codeSnippet.description,
                language: codeSnippet.language,
                code: codeSnippet.code,
                id: codeSnippet.id,
                tags: codeSnippet.tags,
                allSnippetTags: allSnippetTags,
                allLangTags: allLangTags,
                fromScratch: false,
            });
            this.removeOptionsNode();
        };
        const deleteSnip = document.createElement('div');
        deleteSnip.className = CODE_SNIPPET_MORE_OTPIONS_DELETE;
        deleteSnip.textContent = 'Delete snippet';
        deleteSnip.onclick = () => {
            this.deleteCommand(codeSnippet);
            this.removeOptionsNode();
        };
        const exportSnip = document.createElement('div');
        exportSnip.className = CODE_SNIPPET_MORE_OTPIONS_EXPORT;
        exportSnip.textContent = 'Export snippet';
        exportSnip.onclick = () => {
            this.exportCommand(codeSnippet);
            this.removeOptionsNode();
        };
        optionsContainer.appendChild(insertSnip);
        optionsContainer.appendChild(copySnip);
        optionsContainer.appendChild(editSnip);
        optionsContainer.appendChild(exportSnip);
        optionsContainer.appendChild(deleteSnip);
        body.append(optionsContainer);
        return body;
    }
    setSearchOptions(selectedOptions) {
        this.setState({
            searchOptions: selectedOptions,
        });
    }
    render() {
        const { filteredCodeSnippets, matchedIndices } = this.filterSnippets(this.props.codeSnippets, this.state.searchValue, this.state.filterTags, this.state.selectedLangTags);
        return (react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_11___default().createElement("header", { className: CODE_SNIPPETS_HEADER_CLASS },
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("span", { className: CODE_SNIPPET_TITLE }, 'Snippets'),
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("button", { className: CODE_SNIPPET_CREATE_NEW_BTN, onClick: () => {
                        this.props.openCodeSnippetEditor({
                            name: '',
                            description: '',
                            language: 'Python',
                            code: '',
                            id: this.props.codeSnippets.length,
                            tags: [],
                            allSnippetTags: this.getActiveTags()[0],
                            allLangTags: this.getActiveTags()[1],
                            fromScratch: true,
                        });
                    } },
                    react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_5__.addIcon.react, { tag: "span", right: "7px", top: "5px" }))),
            react__WEBPACK_IMPORTED_MODULE_11___default().createElement(_CodeSnippetFilterTools__WEBPACK_IMPORTED_MODULE_18__.FilterTools, { tagDictionary: this.getActiveTagsDictionary(), languageTags: this.getActiveTags()[1], snippetTags: this.getActiveTags()[0], onFilter: this.handleFilter }),
            react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", { className: CODE_SNIPPETS_CONTAINER },
                react__WEBPACK_IMPORTED_MODULE_11___default().createElement("div", null, filteredCodeSnippets.map((codeSnippet) => this.renderCodeSnippet(codeSnippet, matchedIndices[codeSnippet.id]))))));
    }
}
class OptionsHandler extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget {
    constructor(display, codeSnippet) {
        super({ node: display.createOptionsNode(codeSnippet) });
    }
}
class PreviewHandler extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_7__.Widget {
    constructor() {
        super({ node: Private.createPreviewNode() });
    }
}
class Private {
    static createPreviewContent() {
        const body = document.createElement('div');
        return body;
    }
    /**
     * Create structure for preview of snippet data.
     */
    static createPreviewNode() {
        return this.createPreviewContent();
    }
}


/***/ }),

/***/ "./lib/CodeSnippetEditor.js":
/*!**********************************!*\
  !*** ./lib/CodeSnippetEditor.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetEditor": () => (/* binding */ CodeSnippetEditor)
/* harmony export */ });
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/codeeditor */ "webpack/sharing/consume/default/@jupyterlab/codeeditor");
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _CodeSnippetService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CodeSnippetService */ "./lib/CodeSnippetService.js");
/* harmony import */ var _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./CodeSnippetLanguages */ "./lib/CodeSnippetLanguages.js");
/* harmony import */ var _CodeSnippetEditorTags__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./CodeSnippetEditorTags */ "./lib/CodeSnippetEditorTags.js");
/* harmony import */ var _CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CodeSnippetMessage */ "./lib/CodeSnippetMessage.js");
/* harmony import */ var _CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CodeSnippetUtilities */ "./lib/CodeSnippetUtilities.js");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.
// Some lines of code are from Elyra Code Snippet.
/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */









/**
 * CSS style classes
 */
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_EDITOR_TITLE = 'jp-codeSnippet-editor-title';
const CODE_SNIPPET_EDITOR_METADATA = 'jp-codeSnippet-editor-metadata';
const CODE_SNIPPET_EDITOR_INPUT_ACTIVE = 'jp-codeSnippet-editor-active';
const CODE_SNIPPET_EDITOR_NAME_INPUT = 'jp-codeSnippet-editor-name';
const CODE_SNIPPET_EDITOR_LABEL = 'jp-codeSnippet-editor-label';
const CODE_SNIPPET_EDITOR_DESC_INPUT = 'jp-codeSnippet-editor-description';
const CODE_SNIPPET_EDITOR_LANG_INPUT = 'jp-codeSnippet-editor-language';
const CODE_SNIPPET_EDITOR_MIRROR = 'jp-codeSnippetInput-editor';
const CODE_SNIPPET_EDITOR_INPUTAREA = 'jp-codeSnippetInputArea';
const CODE_SNIPPET_EDITOR_INPUTAREA_MIRROR = 'jp-codeSnippetInputArea-editor';
const EDITOR_DIRTY_CLASS = 'jp-mod-dirty';
class CodeSnippetEditor extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ReactWidget {
    constructor(editorServices, tracker, codeSnippetWidget, args) {
        super();
        this.addClass(CODE_SNIPPET_EDITOR);
        this.contentsService = _CodeSnippetService__WEBPACK_IMPORTED_MODULE_4__.CodeSnippetService.getCodeSnippetService();
        this.editorServices = editorServices;
        this.tracker = tracker;
        this._codeSnippetEditorMetaData = args;
        this.oldCodeSnippetName = args.name;
        this.saved = true;
        this._hasRefreshedSinceAttach = false;
        this.codeSnippetWidget = codeSnippetWidget;
        this.renderCodeInput = this.renderCodeInput.bind(this);
        this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
        this.activateCodeMirror = this.activateCodeMirror.bind(this);
        this.saveChange = this.saveChange.bind(this);
        this.updateSnippet = this.updateSnippet.bind(this);
        this.handleChangeOnTag = this.handleChangeOnTag.bind(this);
    }
    get codeSnippetEditorMetadata() {
        return this._codeSnippetEditorMetaData;
    }
    deactivateEditor(event) {
        let target = event.target;
        while (target && target.parentElement) {
            if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR) ||
                target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT) ||
                target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)) {
                break;
            }
            target = target.parentElement;
        }
        const nameInput = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`);
        const descriptionInput = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`);
        const editor = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} #code-${this._codeSnippetEditorMetaData.id}`);
        if (target.classList.contains(CODE_SNIPPET_EDITOR_NAME_INPUT)) {
            this.deactivateDescriptionField(descriptionInput);
            this.deactivateCodeMirror(editor);
        }
        else if (target.classList.contains(CODE_SNIPPET_EDITOR_DESC_INPUT)) {
            this.deactivateNameField(nameInput);
            this.deactivateCodeMirror(editor);
        }
        else if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
            this.deactivateNameField(nameInput);
            this.deactivateDescriptionField(descriptionInput);
        }
        else {
            this.deactivateNameField(nameInput);
            this.deactivateDescriptionField(descriptionInput);
            this.deactivateCodeMirror(editor);
        }
    }
    deactivateNameField(nameInput) {
        if (nameInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
            nameInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
        }
    }
    deactivateDescriptionField(descriptionInput) {
        if (descriptionInput.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
            descriptionInput.classList.remove(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
        }
    }
    activeFieldState(event) {
        const target = event.target;
        if (!target.classList.contains(CODE_SNIPPET_EDITOR_INPUT_ACTIVE)) {
            target.classList.add(CODE_SNIPPET_EDITOR_INPUT_ACTIVE);
        }
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        if (!this.editor &&
            document.getElementById('code-' + this._codeSnippetEditorMetaData.id)) {
            const editorFactory = this.editorServices.factoryService.newInlineEditor;
            const getMimeTypeByLanguage = this.editorServices.mimeTypeService.getMimeTypeByLanguage;
            this.editor = editorFactory({
                host: document.getElementById('code-' + this._codeSnippetEditorMetaData.id),
                model: new _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_0__.CodeEditor.Model({
                    value: this._codeSnippetEditorMetaData.code,
                    mimeType: getMimeTypeByLanguage({
                        name: this._codeSnippetEditorMetaData.language,
                        codemirror_mode: this._codeSnippetEditorMetaData.language,
                    }),
                }),
            });
            this.editor.model.value.changed.connect((args) => {
                this._codeSnippetEditorMetaData.code = args.text.split('\n');
                if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
                    this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
                }
                this.saved = false;
            });
        }
        if (this.isVisible) {
            this._hasRefreshedSinceAttach = true;
            this.editor.refresh();
        }
    }
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this._hasRefreshedSinceAttach = false;
        if (this.isVisible) {
            this.update();
        }
        window.addEventListener('beforeunload', (e) => {
            if (!this.saved) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }
    onAfterShow(msg) {
        if (!this._hasRefreshedSinceAttach) {
            this.update();
        }
    }
    /**
     * Initial focus on the editor when it gets activated!
     * @param msg
     */
    onActivateRequest(msg) {
        this.editor.focus();
    }
    onCloseRequest(msg) {
        if (!this.saved) {
            (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.showDialog)({
                title: 'Close without saving?',
                body: (react__WEBPACK_IMPORTED_MODULE_3___default().createElement("p", null,
                    ' ',
                    `"${this._codeSnippetEditorMetaData.name}" has unsaved changes, close without saving?`,
                    ' ')),
                buttons: [
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.cancelButton(),
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.warnButton({ label: 'Discard' }),
                    _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.Dialog.okButton({ label: 'Save' }),
                ],
            }).then((response) => {
                if (response.button.accept) {
                    if (response.button.label === 'Discard') {
                        this.dispose();
                        super.onCloseRequest(msg);
                    }
                    else if (response.button.label === 'Save') {
                        const name = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`).value;
                        const description = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`).value;
                        const language = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`).value;
                        const validity = (0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_5__.validateInputs)(name, description, language);
                        if (validity) {
                            this.updateSnippet().then((value) => {
                                if (value) {
                                    this.dispose();
                                    super.onCloseRequest(msg);
                                }
                            });
                        }
                    }
                }
            });
        }
        else {
            this.dispose();
            super.onCloseRequest(msg);
        }
    }
    /**
     * Visualize the editor more look like an editor
     * @param event
     */
    activateCodeMirror(event) {
        let target = event.target;
        while (target && target.parentElement) {
            if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
                break;
            }
            target = target.parentElement;
        }
        const editor = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} #code-${this._codeSnippetEditorMetaData.id}`);
        if (target.classList.contains(CODE_SNIPPET_EDITOR_MIRROR)) {
            if (!editor.classList.contains('active')) {
                editor.classList.add('active');
            }
        }
    }
    deactivateCodeMirror(editor) {
        if (editor.classList.contains('active')) {
            editor.classList.remove('active');
        }
    }
    handleInputFieldChange(event) {
        if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
            this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
        }
        const target = event.target;
        if (!target.classList.contains('FieldChanged')) {
            target.classList.add('FieldChanged');
        }
        this.saved = false;
    }
    saveChange(event) {
        const name = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`).value;
        const description = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`).value;
        const language = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`).value;
        const validity = (0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_5__.validateInputs)(name, description, language);
        if (validity) {
            this.updateSnippet();
        }
    }
    async updateSnippet() {
        const name = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_NAME_INPUT}`).value;
        const description = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_DESC_INPUT}`).value;
        const language = document.querySelector(`.${CODE_SNIPPET_EDITOR}-${this._codeSnippetEditorMetaData.id} .${CODE_SNIPPET_EDITOR_LANG_INPUT}`).value;
        this._codeSnippetEditorMetaData.name = name;
        this._codeSnippetEditorMetaData.description = description;
        this._codeSnippetEditorMetaData.language = language;
        const newName = this._codeSnippetEditorMetaData.name;
        const oldName = this.oldCodeSnippetName;
        const newSnippet = {
            name: this._codeSnippetEditorMetaData.name,
            description: this._codeSnippetEditorMetaData.description,
            language: this._codeSnippetEditorMetaData.language,
            code: this._codeSnippetEditorMetaData.code,
            id: this._codeSnippetEditorMetaData.id,
            tags: this._codeSnippetEditorMetaData.tags,
        };
        this._codeSnippetEditorMetaData;
        const isDuplicatName = this.contentsService.duplicateNameExists(newName);
        // update new name as an old name
        this.oldCodeSnippetName = this._codeSnippetEditorMetaData.name;
        // add new snippet
        if (this._codeSnippetEditorMetaData.fromScratch) {
            if (isDuplicatName) {
                const oldSnippet = this.contentsService.getSnippetByName(newName)[0];
                await (0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_5__.saveOverWriteFile)(this.contentsService, oldSnippet, newSnippet);
            }
            else {
                this.contentsService.addSnippet(newSnippet).then((res) => {
                    if (!res) {
                        console.log('Error in adding snippet');
                        return false;
                    }
                });
                (0,_CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_6__.showMessage)('confirm');
            }
        }
        // modify existing snippet
        else {
            if (newName !== oldName) {
                if (isDuplicatName) {
                    // overwrite
                    const oldSnippet = this.contentsService.getSnippetByName(newName)[0];
                    await (0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_5__.saveOverWriteFile)(this.contentsService, oldSnippet, newSnippet).then((res) => {
                        if (res) {
                            // get the id of snippet you are editting
                            const removedSnippet = this.contentsService.getSnippetByName(oldName)[0];
                            // delete the one you are editing
                            this.contentsService.deleteSnippet(removedSnippet.id);
                        }
                        else {
                            return false;
                        }
                    });
                }
            }
            this.contentsService
                .modifyExistingSnippet(oldName, newSnippet)
                .then((res) => {
                if (!res) {
                    console.log('Error in modifying snippet');
                    return false;
                }
            });
        }
        this.saved = true;
        // remove the dirty state
        this.title.className = this.title.className.replace(` ${EDITOR_DIRTY_CLASS}`, '');
        // change label
        this.title.label =
            '[' +
                this._codeSnippetEditorMetaData.language +
                '] ' +
                this._codeSnippetEditorMetaData.name;
        if (!this._codeSnippetEditorMetaData.fromScratch) {
            // update tracker
            this.tracker.save(this);
        }
        // update the display in code snippet explorer
        this.codeSnippetWidget.updateCodeSnippetWidget();
        // close editor if it's from scratch
        if (this._codeSnippetEditorMetaData.fromScratch) {
            this.dispose();
        }
        return true;
    }
    handleChangeOnTag(tags) {
        if (!this.title.className.includes(EDITOR_DIRTY_CLASS)) {
            this.title.className += ` ${EDITOR_DIRTY_CLASS}`;
        }
        this._codeSnippetEditorMetaData.tags = tags
            .filter((tag) => tag.clicked)
            .map((tag) => tag.name);
        this._codeSnippetEditorMetaData.allSnippetTags = tags.map((tag) => tag.name);
        this.saved = false;
    }
    handleOnBlur(event) {
        const target = event.target;
        if (!target.classList.contains('touched')) {
            target.classList.add('touched');
        }
    }
    /**
     * TODO: clean CSS style class - "Use constant"
     */
    renderCodeInput() {
        return (react__WEBPACK_IMPORTED_MODULE_3___default().createElement("section", { className: CODE_SNIPPET_EDITOR_INPUTAREA_MIRROR, onMouseDown: this.activateCodeMirror },
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", { className: CODE_SNIPPET_EDITOR_MIRROR, id: 'code-' + this._codeSnippetEditorMetaData.id.toString() })));
    }
    renderLanguages() {
        _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_7__.SUPPORTED_LANGUAGES.sort();
        return (react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("input", { className: CODE_SNIPPET_EDITOR_LANG_INPUT, list: "languages", name: "language", defaultValue: this._codeSnippetEditorMetaData.language, onChange: this.handleInputFieldChange, required: true }),
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("datalist", { id: "languages" }, _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_7__.SUPPORTED_LANGUAGES.map((lang) => this.renderLanguageOptions(lang)))));
    }
    renderLanguageOptions(option) {
        return react__WEBPACK_IMPORTED_MODULE_3___default().createElement("option", { key: option, value: option });
    }
    render() {
        const fromScratch = this._codeSnippetEditorMetaData.fromScratch;
        return (react__WEBPACK_IMPORTED_MODULE_3___default().createElement("div", { className: CODE_SNIPPET_EDITOR_INPUTAREA, onMouseDown: (event) => {
                this.deactivateEditor(event);
            } },
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("span", { className: CODE_SNIPPET_EDITOR_TITLE }, fromScratch ? 'New Code Snippet' : 'Edit Code Snippet'),
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("section", { className: CODE_SNIPPET_EDITOR_METADATA },
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("label", { className: CODE_SNIPPET_EDITOR_LABEL }, "Name (required)"),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("input", { className: CODE_SNIPPET_EDITOR_NAME_INPUT, defaultValue: this._codeSnippetEditorMetaData.name, placeholder: 'Ex. starter code', type: "text", required: true, onMouseDown: (event) => this.activeFieldState(event), onChange: (event) => {
                        this.handleInputFieldChange(event);
                    }, onBlur: this.handleOnBlur }),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("label", { className: CODE_SNIPPET_EDITOR_LABEL }, "Description (optional)"),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("input", { className: CODE_SNIPPET_EDITOR_DESC_INPUT, defaultValue: this._codeSnippetEditorMetaData.description, placeholder: 'Description', type: "text", onMouseDown: (event) => this.activeFieldState(event), onChange: (event) => {
                        this.handleInputFieldChange(event);
                    }, onBlur: this.handleOnBlur }),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("label", { className: CODE_SNIPPET_EDITOR_LABEL }, "Language (required)"),
                this.renderLanguages(),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement("label", { className: CODE_SNIPPET_EDITOR_LABEL }, "Tags"),
                react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_CodeSnippetEditorTags__WEBPACK_IMPORTED_MODULE_8__.CodeSnippetEditorTags, { allSnippetTags: this._codeSnippetEditorMetaData.allSnippetTags
                        ? this._codeSnippetEditorMetaData.allSnippetTags.map((tag) => ({
                            name: tag,
                            clicked: this._codeSnippetEditorMetaData.tags &&
                                this._codeSnippetEditorMetaData.tags.includes(tag)
                                ? true
                                : false,
                        }))
                        : [], langTags: this._codeSnippetEditorMetaData.allLangTags, handleChange: this.handleChangeOnTag })),
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement("span", { className: CODE_SNIPPET_EDITOR_LABEL }, "Code"),
            this.renderCodeInput(),
            react__WEBPACK_IMPORTED_MODULE_3___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_2__.Button, { className: "saveBtn", onClick: this.saveChange }, fromScratch ? 'Create & Close' : 'Save')));
    }
}


/***/ }),

/***/ "./lib/CodeSnippetEditorTags.js":
/*!**************************************!*\
  !*** ./lib/CodeSnippetEditorTags.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetEditorTags": () => (/* binding */ CodeSnippetEditorTags)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.


/**
 * CSS STYLING
 */
const CODE_SNIPPET_EDITOR_TAG = 'jp-codeSnippet-editor-tag';
const CODE_SNIPPET_EDITOR_TAG_PLUS_ICON = 'jp-codeSnippet-editor-tag-plusIcon';
const CODE_SNIPPET_EDITOR_TAG_LIST = 'jp-codeSnippet-editor-tagList';
class CodeSnippetEditorTags extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this.state = {
            allSnippetTags: [],
            plusIconClicked: false,
        };
        this.renderTags = this.renderTags.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        this.setState({
            allSnippetTags: this.props.allSnippetTags,
            plusIconClicked: false,
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                allSnippetTags: this.props.allSnippetTags,
            });
        }
    }
    handleClick(event) {
        const target = event.target;
        const clickedTag = target.innerText;
        this.handleClickHelper(clickedTag);
    }
    handleOnChange() {
        this.props.handleChange(this.state.allSnippetTags);
    }
    handleClickHelper(
    // parent: HTMLElement,
    clickedTag) {
        this.setState((state) => ({
            allSnippetTags: state.allSnippetTags.map((tag) => tag.name === clickedTag ? Object.assign(Object.assign({}, tag), { clicked: !tag.clicked }) : tag),
        }), this.handleOnChange);
    }
    addTagOnClick(event) {
        this.setState({ plusIconClicked: true });
        const inputElement = event.target;
        if (inputElement.value === 'Add Tag') {
            inputElement.value = '';
            inputElement.style.width = '62px';
            inputElement.style.minWidth = '62px';
        }
    }
    addTagOnKeyDown(event) {
        const inputElement = event.target;
        if (inputElement.value !== '' && event.key === 'Enter') {
            if (this.state.allSnippetTags.find((tag) => tag.name === inputElement.value)) {
                alert('Duplicate Tag Name!');
                return;
            }
            if (this.props.langTags.includes(inputElement.value)) {
                alert('This tag already exists in language tags!\nIf you want to create this tag, lowercase the first letter.');
                return;
            }
            const newTag = { name: inputElement.value, clicked: true };
            this.setState((state) => ({
                allSnippetTags: [...state.allSnippetTags, newTag],
                plusIconClicked: false,
            }), this.handleOnChange);
        }
    }
    addTagOnBlur(event) {
        const inputElement = event.target;
        inputElement.value = 'Add Tag';
        inputElement.style.width = '50px';
        inputElement.style.minWidth = '50px';
        inputElement.blur();
        this.setState({ plusIconClicked: false });
    }
    renderTags() {
        const hasTags = this.state.allSnippetTags;
        const inputBox = this.state.plusIconClicked === true ? (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", { className: `${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag`, key: 'editor-new-tag' },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("input", { onClick: (event) => this.addTagOnClick(event), onKeyDown: (event) => this.addTagOnKeyDown(event), onBlur: (event) => this.addTagOnBlur(event), autoFocus: true }))) : (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", { className: `${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag` },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { onClick: () => this.setState({ plusIconClicked: true }) }, "Add Tag"),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.addIcon.react, { tag: "span", className: CODE_SNIPPET_EDITOR_TAG_PLUS_ICON, elementPosition: "center", height: "16px", width: "16px", marginLeft: "2px" })));
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("li", { className: CODE_SNIPPET_EDITOR_TAG_LIST },
            hasTags
                ? this.state.allSnippetTags.map((tag, index) => (() => {
                    if (!tag.clicked) {
                        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", { className: `${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag`, id: 'editor' + '-' + tag.name + '-' + index, key: 'editor' + '-' + tag.name + '-' + index },
                            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { onClick: this.handleClick }, tag.name)));
                    }
                    else {
                        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("ul", { className: `${CODE_SNIPPET_EDITOR_TAG} tag applied-tag`, id: 'editor' + '-' + tag.name + '-' + index, key: 'editor' + '-' + tag.name + '-' + index },
                            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { onClick: this.handleClick }, tag.name),
                            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.checkIcon.react, { tag: "span", elementPosition: "center", height: "18px", width: "18px", marginLeft: "5px", marginRight: "-3px" })));
                    }
                })())
                : null,
            inputBox));
    }
    render() {
        return react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", null, this.renderTags());
    }
}


/***/ }),

/***/ "./lib/CodeSnippetFilterTools.js":
/*!***************************************!*\
  !*** ./lib/CodeSnippetFilterTools.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FilterTools": () => (/* binding */ FilterTools)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.


const FILTER_ARROW_UP = 'jp-codeSnippet-filter-arrow-up';
const FILTER_OPTION = 'jp-codeSnippet-filter-option';
const FILTER_TAGS = 'jp-codeSnippet-filter-tags';
const FILTER_TAG = 'jp-codeSnippet-filter-tag';
const FILTER_CHECK = 'jp-codeSnippet-filter-check';
const FILTER_TITLE = 'jp-codeSnippet-filter-title';
const FILTER_TOOLS = 'jp-codeSnippet-filterTools';
const FILTER_SEARCHBAR = 'jp-codeSnippet-searchbar';
const FILTER_SEARCHWRAPPER = 'jp-codeSnippet-searchwrapper';
const FILTER_CLASS = 'jp-codeSnippet-filter';
const FILTER_BUTTON = 'jp-codeSnippet-filter-btn';
class FilterTools extends (react__WEBPACK_IMPORTED_MODULE_1___default().Component) {
    constructor(props) {
        super(props);
        this.handleSearch = (event) => {
            this.setState({ searchValue: event.target.value }, this.filterSnippets);
        };
        this.state = { show: false, selectedTags: [], searchValue: '' }; //--> selectedTags & selectedLangTags
        this.createFilterBox = this.createFilterBox.bind(this);
        this.renderFilterOption = this.renderFilterOption.bind(this);
        this.renderTags = this.renderTags.bind(this);
        this.renderAppliedTag = this.renderAppliedTag.bind(this);
        this.renderUnappliedTag = this.renderUnappliedTag.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.filterSnippets = this.filterSnippets.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            // get all the tags together in one list
            const concatTags = this.props.snippetTags.concat(this.props.languageTags);
            this.setState((state) => ({
                selectedTags: state.selectedTags
                    .filter((tag) => concatTags.includes(tag))
                    .sort(),
            }));
        }
    }
    createFilterBox() {
        const filterArrow = document.querySelector(`.${FILTER_ARROW_UP}`);
        const filterOption = document.querySelector(`.${FILTER_OPTION}`);
        filterArrow.classList.toggle('idle');
        filterOption.classList.toggle('idle');
    }
    renderTags(tags, type) {
        const selectedLanguageTags = this.state.selectedTags.filter((tag) => this.props.languageTags.includes(tag));
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_TAGS }, tags.sort().map((tag, index) => {
            // language tags
            if (type === 'language' && this.props.languageTags.includes(tag)) {
                if (this.state.selectedTags.includes(tag)) {
                    return this.renderAppliedTag(tag, index.toString());
                }
                else {
                    return this.renderUnappliedTag(tag, index.toString());
                }
            }
            else if (
            // snippet tags
            type === 'snippet' &&
                !this.props.languageTags.includes(tag)) {
                if (selectedLanguageTags.length !== 0) {
                    // if languages are selected, only display snippet tags that have snippets in those languages
                    const langsMatch = this.props.tagDictionary
                        .get(tag)
                        .some((r) => selectedLanguageTags.includes(r));
                    if (langsMatch) {
                        if (this.state.selectedTags.includes(tag)) {
                            return this.renderAppliedTag(tag, index.toString());
                        }
                        else {
                            return this.renderUnappliedTag(tag, index.toString());
                        }
                    }
                }
                else {
                    if (this.state.selectedTags.includes(tag)) {
                        return this.renderAppliedTag(tag, index.toString());
                    }
                    else {
                        return this.renderUnappliedTag(tag, index.toString());
                    }
                }
            }
        })));
    }
    renderAppliedTag(tag, index) {
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: `${FILTER_TAG} tag applied-tag`, id: 'filter' + '-' + tag + '-' + index, key: 'filter' + '-' + tag + '-' + index },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { onClick: this.handleClick }, tag),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.checkIcon.react, { className: FILTER_CHECK, tag: "span", elementPosition: "center", height: "18px", width: "18px", marginLeft: "5px", marginRight: "-3px" })));
    }
    renderUnappliedTag(tag, index) {
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: `${FILTER_TAG} tag unapplied-tag`, id: 'filter' + '-' + tag + '-' + index, key: 'filter' + '-' + tag + '-' + index },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { onClick: this.handleClick }, tag)));
    }
    handleClick(event) {
        const target = event.target;
        const clickedTag = target.innerText;
        const parent = target.parentElement;
        this.setState((state) => ({
            selectedTags: this.handleClickHelper(parent, state.selectedTags, clickedTag),
        }), this.filterSnippets);
    }
    handleClickHelper(parent, currentTags, clickedTag) {
        if (parent.classList.contains('unapplied-tag')) {
            parent.classList.replace('unapplied-tag', 'applied-tag');
            currentTags.splice(-1, 0, clickedTag);
        }
        else if (parent.classList.contains('applied-tag')) {
            parent.classList.replace('applied-tag', 'unapplied-tag');
            const idx = currentTags.indexOf(clickedTag);
            currentTags.splice(idx, 1);
        }
        return currentTags.sort();
    }
    filterSnippets() {
        this.props.onFilter(this.state.searchValue, this.state.selectedTags, this.state.selectedTags.filter((tag) => this.props.languageTags.includes(tag)));
    }
    renderFilterOption() {
        // get all the tags together in one list
        const concatTags = this.props.snippetTags.concat(this.props.languageTags);
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: `${FILTER_OPTION} idle` },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_TITLE },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null, "language tags")),
            this.renderTags(concatTags, 'language'),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_TITLE },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("span", null, "snippet tags")),
            this.renderTags(concatTags, 'snippet')));
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_TOOLS },
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_SEARCHBAR },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.InputGroup, { className: FILTER_SEARCHWRAPPER, type: "text", placeholder: "SEARCH SNIPPETS", onChange: this.handleSearch, rightIcon: "ui-components:search", value: this.state.searchValue })),
            react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: FILTER_CLASS },
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("button", { className: FILTER_BUTTON, onClick: this.createFilterBox }, "Filter By Tags"),
                react__WEBPACK_IMPORTED_MODULE_1___default().createElement("div", { className: `${FILTER_ARROW_UP} idle` }),
                this.renderFilterOption())));
    }
}


/***/ }),

/***/ "./lib/CodeSnippetInputDialog.js":
/*!***************************************!*\
  !*** ./lib/CodeSnippetInputDialog.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetInputDialog": () => (/* binding */ CodeSnippetInputDialog),
/* harmony export */   "isValidFileName": () => (/* binding */ isValidFileName),
/* harmony export */   "showInputDialog": () => (/* binding */ showInputDialog)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _CodeSnippetService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CodeSnippetService */ "./lib/CodeSnippetService.js");
/* harmony import */ var _CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CodeSnippetMessage */ "./lib/CodeSnippetMessage.js");
/* harmony import */ var _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CodeSnippetLanguages */ "./lib/CodeSnippetLanguages.js");
/* harmony import */ var _CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CodeSnippetUtilities */ "./lib/CodeSnippetUtilities.js");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.







/**
 * The class name added to file dialogs.
 */
const FILE_DIALOG_CLASS = 'jp-codeSnippet-fileDialog';
/**
 * CSS STYLING
 */
const CODE_SNIPPET_DIALOG_NAME_INPUT = 'jp-codeSnippet-dialog-name-input';
const CODE_SNIPPET_DIALOG_DESC_INPUT = 'jp-codeSnippet-dialog-desc-input';
const CODE_SNIPPET_DIALOG_LANG_INPUT = 'jp-codeSnippet-dialog-lang-input';
const CODE_SNIPPET_INPUTTAG_PLUS_ICON = 'jp-codeSnippet-inputTag-plusIcon';
const CODE_SNIPPET_INPUTTAG_LIST = 'jp-codeSnippet-inputTagList';
const CODE_SNIPPET_INPUT_TAG = 'jp-codeSnippet-inputTag';
const CODE_SNIPPET_INPUT_TAG_CHECK = 'jp-codeSnippet-inputTag-check';
class CodeSnippetDialog extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog {
    onAfterAttach(msg) {
        const node = this.node;
        node.addEventListener('keydown', this, false);
        node.addEventListener('contextmenu', this, true);
        node.addEventListener('click', this, true);
        document.addEventListener('focus', this, true);
        const body = this.node.querySelector('.jp-Dialog-body');
        const el = body.querySelector(`.${CODE_SNIPPET_DIALOG_NAME_INPUT}`);
        this.first = el;
        el.focus();
    }
    onAfterDetach(msg) {
        const node = this.node;
        node.removeEventListener('keydown', this, false);
        node.removeEventListener('contextmenu', this, true);
        node.removeEventListener('click', this, true);
        document.removeEventListener('focus', this, true);
    }
    _evtKeydown(event) {
        switch (event.key) {
            case 'Escape':
                event.stopPropagation();
                event.preventDefault();
                this.reject();
                break;
            case 'Tab': {
                const last_button = document.querySelector('.jp-mod-accept');
                if (document.activeElement === last_button && !event.shiftKey) {
                    event.stopPropagation();
                    event.preventDefault();
                    this.first.focus();
                }
                break;
            }
            case 'Enter':
                event.stopPropagation();
                event.preventDefault();
                this.resolve();
                break;
            default:
                break;
        }
    }
}
function showCodeSnippetDialog(options = {}) {
    const dialog = new CodeSnippetDialog(options);
    return dialog.launch();
}
/**
 * Save an input with a dialog. This is what actually displays everything.
 * Result.value is the value retrieved from .getValue(). ---> .getValue() returns an array of inputs.
 */
function CodeSnippetInputDialog(codeSnippetWidget, code, language, idx) {
    const tags = [];
    const langTags = [];
    const codeSnippetManager = _CodeSnippetService__WEBPACK_IMPORTED_MODULE_3__.CodeSnippetService.getCodeSnippetService();
    const snippets = codeSnippetManager.snippets;
    // get all active tags
    for (const snippet of snippets) {
        if (snippet.tags) {
            for (const tag of snippet.tags) {
                if (!tags.includes(tag)) {
                    tags.push(tag);
                }
            }
        }
        if (!langTags.includes(snippet.language)) {
            langTags.push(snippet.language);
        }
    }
    const body = new InputHandler(tags, language, langTags);
    return showInputDialog(codeSnippetWidget, tags, idx, codeSnippetManager, code, language, body);
}
/**
 * This function creates the actual input form and processes the inputs given.
 */
function showInputDialog(codeSnippetWidget, tags, idx, codeSnippetManager, code, language, body) {
    return showCodeSnippetDialog({
        title: 'Save Code Snippet',
        body: body,
        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton(), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.okButton({ label: 'Save' })],
    }).then((result) => {
        if (!result.value) {
            return null;
        }
        const nameInput = result.value[0];
        const descriptionInput = result.value[1];
        const languageInput = result.value[2];
        if (!(0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_4__.validateInputs)(nameInput, descriptionInput, languageInput)) {
            showInputDialog(codeSnippetWidget, tags, idx, codeSnippetManager, code, language, body);
        }
        else {
            const tags = result.value.slice(3);
            const newSnippet = {
                name: nameInput.replace(' ', ''),
                description: descriptionInput,
                language: languageInput,
                code: code,
                id: idx,
                tags: tags,
            };
            for (const snippet of codeSnippetManager.snippets) {
                if (snippet.name === newSnippet.name) {
                    (0,_CodeSnippetUtilities__WEBPACK_IMPORTED_MODULE_4__.saveOverWriteFile)(codeSnippetManager, snippet, newSnippet).then((res) => {
                        if (res) {
                            codeSnippetWidget.renderCodeSnippetsSignal.emit(codeSnippetManager.snippets);
                        }
                    });
                    return;
                }
            }
            createNewSnippet(codeSnippetWidget, newSnippet, codeSnippetManager);
        }
    });
}
function createNewSnippet(codeSnippetWidget, newSnippet, codeSnippetManager) {
    codeSnippetManager.addSnippet(newSnippet).then((res) => {
        if (!res) {
            console.log('Error in adding snippet');
            return;
        }
    });
    codeSnippetWidget.renderCodeSnippetsSignal.emit(codeSnippetManager.snippets);
    (0,_CodeSnippetMessage__WEBPACK_IMPORTED_MODULE_5__.showMessage)('confirm');
}
/**
 * Test whether a name is a valid file name
 *
 * Disallows "/", "\", and ":" in file names, as well as names with zero length.
 */
function isValidFileName(name) {
    const validNameExp = /[/\\:]/;
    return name.length > 0 && !validNameExp.test(name);
}
/**
 * A widget used to get input data.
 */
class InputHandler extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget {
    /**
     * Construct a new "code snippet" dialog.
     * readonly inputNode: HTMLInputElement; <--- in Widget class
     */
    constructor(snippetTags, language, langTags) {
        super({ node: Private.createInputNode(snippetTags, language, langTags) });
        this.addClass(FILE_DIALOG_CLASS);
    }
    getValue() {
        const inputs = [];
        inputs.push(this.node.querySelector(`.${CODE_SNIPPET_DIALOG_NAME_INPUT}`).value, this.node.querySelector(`.${CODE_SNIPPET_DIALOG_DESC_INPUT}`).value, this.node.querySelector(`.${CODE_SNIPPET_DIALOG_LANG_INPUT}`).value);
        inputs.push(...Private.selectedTags);
        // reset selectedTags
        Private.selectedTags = [];
        return inputs;
    }
}
/**
 * A namespace for private data.
 */
class Private {
    static handleOnBlur(event) {
        const target = event.target;
        if (!target.classList.contains('touched')) {
            target.classList.add('touched');
        }
    }
    /**
     * Create the node for a code snippet form handler. This is what's creating all of the elements to be displayed.
     */
    static createInputNode(snippetTags, language, langTags) {
        Private.allSnippetTags = snippetTags;
        Private.allLangTags = langTags;
        const body = document.createElement('form');
        const nameTitle = document.createElement('label');
        nameTitle.textContent = 'Snippet Name (required)';
        const name = document.createElement('input');
        name.className = CODE_SNIPPET_DIALOG_NAME_INPUT;
        name.required = true;
        name.placeholder = 'Ex. starter code';
        name.onblur = Private.handleOnBlur;
        const descriptionTitle = document.createElement('label');
        descriptionTitle.textContent = 'Description (optional)';
        const description = document.createElement('input');
        description.className = CODE_SNIPPET_DIALOG_DESC_INPUT;
        description.placeholder = 'Description';
        description.onblur = Private.handleOnBlur;
        const languageTitle = document.createElement('label');
        languageTitle.textContent = 'Language (required)';
        const languageInput = document.createElement('input');
        languageInput.className = CODE_SNIPPET_DIALOG_LANG_INPUT;
        languageInput.setAttribute('list', 'languages');
        // capitalize the first character
        languageInput.value = language[0].toUpperCase() + language.slice(1);
        languageInput.required = true;
        const languageOption = document.createElement('datalist');
        languageOption.id = 'languages';
        languageOption.onblur = Private.handleOnBlur;
        _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_6__.SUPPORTED_LANGUAGES.sort();
        for (const supportedLanguage of _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_6__.SUPPORTED_LANGUAGES) {
            const option = document.createElement('option');
            option.value = supportedLanguage;
            languageOption.appendChild(option);
        }
        const tagList = document.createElement('li');
        tagList.classList.add(CODE_SNIPPET_INPUTTAG_LIST);
        for (const tag of snippetTags) {
            const tagElem = document.createElement('ul');
            tagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag unapplied-tag`;
            const tagBtn = document.createElement('button');
            tagBtn.innerText = tag;
            tagBtn.onclick = Private.handleClick;
            tagElem.appendChild(tagBtn);
            tagList.appendChild(tagElem);
        }
        const addTagElem = document.createElement('ul');
        addTagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag unapplied-tag`;
        const newTagName = document.createElement('button');
        newTagName.innerText = 'Add Tag';
        newTagName.style.cursor = 'pointer';
        addTagElem.appendChild(newTagName);
        const plusIcon = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.addIcon.element({
            tag: 'span',
            className: CODE_SNIPPET_INPUTTAG_PLUS_ICON,
            elementPosition: 'center',
            height: '16px',
            width: '16px',
            marginLeft: '2px',
        });
        newTagName.onclick = Private.addTag;
        addTagElem.appendChild(plusIcon);
        tagList.append(addTagElem);
        body.appendChild(nameTitle);
        body.appendChild(name);
        body.appendChild(descriptionTitle);
        body.appendChild(description);
        body.appendChild(languageTitle);
        body.appendChild(languageInput);
        body.appendChild(languageOption);
        body.appendChild(tagList);
        return body;
    }
    // replace the newTagName to input and delete plusIcon and insertbefore current tag on keydown or blur (refer to cell tags)
    static addTag(event) {
        const target = event.target;
        const plusIcon = document.querySelector('.jp-codeSnippet-inputTag-plusIcon');
        plusIcon.remove();
        const newTagName = document.createElement('input');
        target.parentElement.replaceChild(newTagName, target);
        newTagName.onkeydown = Private.addTagOnKeyDown;
        newTagName.onblur = Private.addTagOnBlur;
        newTagName.focus();
        return false;
    }
    static addTagOnKeyDown(event) {
        const inputElement = event.target;
        if (inputElement.value !== '' && event.key === 'Enter') {
            // duplicate tag
            if (Private.allSnippetTags.includes(inputElement.value)) {
                alert('Duplicate Tag Name!');
                return;
            }
            if (Private.allLangTags.includes(inputElement.value)) {
                alert('This tag already exists in language tags!\nIf you want to create this tag, lowercase the first letter.');
                return;
            }
            event.preventDefault();
            // create new tag
            const tagList = document.querySelector('.jp-codeSnippet-inputTagList');
            const tagElem = document.createElement('ul');
            tagElem.className = `${CODE_SNIPPET_INPUT_TAG} tag applied-tag`;
            const tagBtn = document.createElement('button');
            tagBtn.innerText = inputElement.value;
            tagBtn.onclick = Private.handleClick;
            tagElem.appendChild(tagBtn);
            tagList.insertBefore(tagElem, inputElement.parentElement);
            // add check mark when tag gets selected
            const iconContainer = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.checkIcon.element({
                className: CODE_SNIPPET_INPUT_TAG_CHECK,
                tag: 'span',
                elementPosition: 'center',
                height: '18px',
                width: '18px',
                marginLeft: '5px',
                marginRight: '-3px',
            });
            const color = getComputedStyle(document.documentElement).getPropertyValue('--jp-ui-font-color1');
            tagBtn.style.color = color;
            tagElem.appendChild(iconContainer);
            // add it to the selected tags
            Private.selectedTags.push(tagBtn.innerText);
            Private.allSnippetTags.push(tagBtn.innerText);
            // reset InputElement
            inputElement.blur();
            event.stopPropagation();
        }
        else if (event.key === 'Escape') {
            inputElement.blur();
            event.stopPropagation();
        }
    }
    static addTagOnBlur(event) {
        const inputElement = event.target;
        // add plusIcon
        const plusIcon = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.addIcon.element({
            tag: 'span',
            className: CODE_SNIPPET_INPUTTAG_PLUS_ICON,
            elementPosition: 'center',
            height: '16px',
            width: '16px',
            marginLeft: '2px',
        });
        // change input to span
        const newTagName = document.createElement('button');
        newTagName.innerText = 'Add Tag';
        newTagName.style.cursor = 'pointer';
        inputElement.parentElement.replaceChild(newTagName, inputElement);
        newTagName.parentElement.appendChild(plusIcon);
        newTagName.onclick = Private.addTag;
    }
    static handleClick(event) {
        const target = event.target;
        const parent = target.parentElement;
        if (parent.classList.contains('unapplied-tag')) {
            Private.selectedTags.push(target.innerText);
            parent.classList.replace('unapplied-tag', 'applied-tag');
            const iconContainer = _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_1__.checkIcon.element({
                className: CODE_SNIPPET_INPUT_TAG_CHECK,
                tag: 'span',
                elementPosition: 'center',
                height: '18px',
                width: '18px',
                marginLeft: '5px',
                marginRight: '-3px',
            });
            const color = getComputedStyle(document.documentElement).getPropertyValue('--jp-ui-font-color1');
            target.style.color = color;
            if (parent.children.length === 1) {
                parent.appendChild(iconContainer);
            }
        }
        else if (parent.classList.contains('applied-tag')) {
            const idx = Private.selectedTags.indexOf(target.innerText);
            Private.selectedTags.splice(idx, 1);
            parent.classList.replace('applied-tag', 'unapplied-tag');
            const color = getComputedStyle(document.documentElement).getPropertyValue('--jp-ui-font-color2');
            target.style.color = color;
            if (parent.children.length !== 1) {
                // remove check icon
                parent.removeChild(parent.children.item(1));
            }
        }
        return false;
    }
}
Private.selectedTags = [];


/***/ }),

/***/ "./lib/CodeSnippetLanguages.js":
/*!*************************************!*\
  !*** ./lib/CodeSnippetLanguages.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SUPPORTED_LANGUAGES": () => (/* binding */ SUPPORTED_LANGUAGES),
/* harmony export */   "babelIcon": () => (/* binding */ babelIcon),
/* harmony export */   "cIcon": () => (/* binding */ cIcon),
/* harmony export */   "clojureIcon": () => (/* binding */ clojureIcon),
/* harmony export */   "coconutIcon": () => (/* binding */ coconutIcon),
/* harmony export */   "coffeescriptIcon": () => (/* binding */ coffeescriptIcon),
/* harmony export */   "cppIcon": () => (/* binding */ cppIcon),
/* harmony export */   "csharpIcon": () => (/* binding */ csharpIcon),
/* harmony export */   "erlangIcon": () => (/* binding */ erlangIcon),
/* harmony export */   "forthIcon": () => (/* binding */ forthIcon),
/* harmony export */   "fortranIcon": () => (/* binding */ fortranIcon),
/* harmony export */   "fsharpIcon": () => (/* binding */ fsharpIcon),
/* harmony export */   "goIcon": () => (/* binding */ goIcon),
/* harmony export */   "groovyIcon": () => (/* binding */ groovyIcon),
/* harmony export */   "haskellIcon": () => (/* binding */ haskellIcon),
/* harmony export */   "javaIcon": () => (/* binding */ javaIcon),
/* harmony export */   "javascriptIcon": () => (/* binding */ javascriptIcon),
/* harmony export */   "juliaIcon": () => (/* binding */ juliaIcon),
/* harmony export */   "kotlinIcon": () => (/* binding */ kotlinIcon),
/* harmony export */   "lispIcon": () => (/* binding */ lispIcon),
/* harmony export */   "livescriptIcon": () => (/* binding */ livescriptIcon),
/* harmony export */   "luaIcon": () => (/* binding */ luaIcon),
/* harmony export */   "markdownIcon": () => (/* binding */ markdownIcon),
/* harmony export */   "matlabIcon": () => (/* binding */ matlabIcon),
/* harmony export */   "nodejsIcon": () => (/* binding */ nodejsIcon),
/* harmony export */   "ocamlIcon": () => (/* binding */ ocamlIcon),
/* harmony export */   "perlIcon": () => (/* binding */ perlIcon),
/* harmony export */   "phpIcon": () => (/* binding */ phpIcon),
/* harmony export */   "powershellIcon": () => (/* binding */ powershellIcon),
/* harmony export */   "processingIcon": () => (/* binding */ processingIcon),
/* harmony export */   "prologIcon": () => (/* binding */ prologIcon),
/* harmony export */   "purescriptIcon": () => (/* binding */ purescriptIcon),
/* harmony export */   "qsharpIcon": () => (/* binding */ qsharpIcon),
/* harmony export */   "rubyIcon": () => (/* binding */ rubyIcon),
/* harmony export */   "rustIcon": () => (/* binding */ rustIcon),
/* harmony export */   "sasIcon": () => (/* binding */ sasIcon),
/* harmony export */   "sbtIcon": () => (/* binding */ sbtIcon),
/* harmony export */   "scalaIcon": () => (/* binding */ scalaIcon),
/* harmony export */   "schemeIcon": () => (/* binding */ schemeIcon),
/* harmony export */   "typescriptIcon": () => (/* binding */ typescriptIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icon_language_icons_babel_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/icon/language_icons/babel.svg */ "./style/icon/language_icons/babel.svg");
/* harmony import */ var _style_icon_language_icons_c_svg__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ../style/icon/language_icons/c.svg */ "./style/icon/language_icons/c.svg");
/* harmony import */ var _style_icon_language_icons_clojure_svg__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ../style/icon/language_icons/clojure.svg */ "./style/icon/language_icons/clojure.svg");
/* harmony import */ var _style_icon_language_icons_coconut_svg__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ../style/icon/language_icons/coconut.svg */ "./style/icon/language_icons/coconut.svg");
/* harmony import */ var _style_icon_language_icons_coffeescript_svg__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../style/icon/language_icons/coffeescript.svg */ "./style/icon/language_icons/coffeescript.svg");
/* harmony import */ var _style_icon_language_icons_cpp_svg__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ../style/icon/language_icons/cpp.svg */ "./style/icon/language_icons/cpp.svg");
/* harmony import */ var _style_icon_language_icons_csharp_svg__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../style/icon/language_icons/csharp.svg */ "./style/icon/language_icons/csharp.svg");
/* harmony import */ var _style_icon_language_icons_erlang_svg__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ../style/icon/language_icons/erlang.svg */ "./style/icon/language_icons/erlang.svg");
/* harmony import */ var _style_icon_language_icons_forth_svg__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ../style/icon/language_icons/forth.svg */ "./style/icon/language_icons/forth.svg");
/* harmony import */ var _style_icon_language_icons_fortran_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../style/icon/language_icons/fortran.svg */ "./style/icon/language_icons/fortran.svg");
/* harmony import */ var _style_icon_language_icons_fsharp_svg__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../style/icon/language_icons/fsharp.svg */ "./style/icon/language_icons/fsharp.svg");
/* harmony import */ var _style_icon_language_icons_go_svg__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ../style/icon/language_icons/go.svg */ "./style/icon/language_icons/go.svg");
/* harmony import */ var _style_icon_language_icons_groovy_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../style/icon/language_icons/groovy.svg */ "./style/icon/language_icons/groovy.svg");
/* harmony import */ var _style_icon_language_icons_haskell_svg__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../style/icon/language_icons/haskell.svg */ "./style/icon/language_icons/haskell.svg");
/* harmony import */ var _style_icon_language_icons_java_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style/icon/language_icons/java.svg */ "./style/icon/language_icons/java.svg");
/* harmony import */ var _style_icon_language_icons_javascript_svg__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../style/icon/language_icons/javascript.svg */ "./style/icon/language_icons/javascript.svg");
/* harmony import */ var _style_icon_language_icons_julia_svg__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../style/icon/language_icons/julia.svg */ "./style/icon/language_icons/julia.svg");
/* harmony import */ var _style_icon_language_icons_kotlin_svg__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ../style/icon/language_icons/kotlin.svg */ "./style/icon/language_icons/kotlin.svg");
/* harmony import */ var _style_icon_language_icons_lisp_svg__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ../style/icon/language_icons/lisp.svg */ "./style/icon/language_icons/lisp.svg");
/* harmony import */ var _style_icon_language_icons_livescript_svg__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../style/icon/language_icons/livescript.svg */ "./style/icon/language_icons/livescript.svg");
/* harmony import */ var _style_icon_language_icons_lua_svg__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ../style/icon/language_icons/lua.svg */ "./style/icon/language_icons/lua.svg");
/* harmony import */ var _style_icon_language_icons_matlab_svg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../style/icon/language_icons/matlab.svg */ "./style/icon/language_icons/matlab.svg");
/* harmony import */ var _style_icon_language_icons_nodejs_svg__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ../style/icon/language_icons/nodejs.svg */ "./style/icon/language_icons/nodejs.svg");
/* harmony import */ var _style_icon_language_icons_ocaml_svg__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ../style/icon/language_icons/ocaml.svg */ "./style/icon/language_icons/ocaml.svg");
/* harmony import */ var _style_icon_language_icons_perl_svg__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ../style/icon/language_icons/perl.svg */ "./style/icon/language_icons/perl.svg");
/* harmony import */ var _style_icon_language_icons_php_svg__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ../style/icon/language_icons/php.svg */ "./style/icon/language_icons/php.svg");
/* harmony import */ var _style_icon_language_icons_processing_svg__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../style/icon/language_icons/processing.svg */ "./style/icon/language_icons/processing.svg");
/* harmony import */ var _style_icon_language_icons_prolog_svg__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ../style/icon/language_icons/prolog.svg */ "./style/icon/language_icons/prolog.svg");
/* harmony import */ var _style_icon_language_icons_purescript_svg__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ../style/icon/language_icons/purescript.svg */ "./style/icon/language_icons/purescript.svg");
/* harmony import */ var _style_icon_language_icons_qsharp_svg__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ../style/icon/language_icons/qsharp.svg */ "./style/icon/language_icons/qsharp.svg");
/* harmony import */ var _style_icon_language_icons_ruby_svg__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../style/icon/language_icons/ruby.svg */ "./style/icon/language_icons/ruby.svg");
/* harmony import */ var _style_icon_language_icons_rust_svg__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ../style/icon/language_icons/rust.svg */ "./style/icon/language_icons/rust.svg");
/* harmony import */ var _style_icon_language_icons_sas_svg__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ../style/icon/language_icons/sas.svg */ "./style/icon/language_icons/sas.svg");
/* harmony import */ var _style_icon_language_icons_sbt_svg__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ../style/icon/language_icons/sbt.svg */ "./style/icon/language_icons/sbt.svg");
/* harmony import */ var _style_icon_language_icons_scala_svg__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../style/icon/language_icons/scala.svg */ "./style/icon/language_icons/scala.svg");
/* harmony import */ var _style_icon_language_icons_scheme_svg__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../style/icon/language_icons/scheme.svg */ "./style/icon/language_icons/scheme.svg");
/* harmony import */ var _style_icon_language_icons_typescript_svg__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../style/icon/language_icons/typescript.svg */ "./style/icon/language_icons/typescript.svg");
/* harmony import */ var _style_icon_language_icons_markdown_svg__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ../style/icon/language_icons/markdown.svg */ "./style/icon/language_icons/markdown.svg");
/* harmony import */ var _style_icon_language_icons_powershell_svg__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ../style/icon/language_icons/powershell.svg */ "./style/icon/language_icons/powershell.svg");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.








































/**
 * List of languages supported by JupyterLab
 */
const SUPPORTED_LANGUAGES = [
    'Python',
    'Java',
    'R',
    'Julia',
    'Matlab',
    'Octave',
    'Scheme',
    'Processing',
    'Scala',
    'Groovy',
    'Agda',
    'Fortran',
    'Haskell',
    'Ruby',
    'TypeScript',
    'JavaScript',
    'CoffeeScript',
    'LiveScript',
    'C#',
    'F#',
    'Go',
    'Galileo',
    'Gfm',
    'Erlang',
    'PARI/GP',
    'Aldor',
    'OCaml',
    'Forth',
    'Perl',
    'PHP',
    'Scilab',
    'bash',
    'zsh',
    'Clojure',
    'Hy',
    'Lua',
    'PureScript',
    'Q',
    'Cryptol',
    'C++',
    'Xonsh',
    'Prolog',
    'Common Lisp',
    'Maxima',
    'C',
    'Kotlin',
    'Pike',
    'NodeJS',
    'Singular',
    'TaQL',
    'Coconut',
    'Babel',
    'Clojurescript',
    'sbt',
    'Guile',
    'SAS',
    'Stata',
    'Racekt',
    'SQL',
    'HiveQL',
    'Rust',
    'Rascal',
    'Q#',
    'Markdown',
    'Powershell',
];
/**
 * Language icons
 */
const babelIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:babel',
    svgstr: _style_icon_language_icons_babel_svg__WEBPACK_IMPORTED_MODULE_1__["default"],
});
const javaIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:java',
    svgstr: _style_icon_language_icons_java_svg__WEBPACK_IMPORTED_MODULE_2__["default"],
});
const juliaIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:julia',
    svgstr: _style_icon_language_icons_julia_svg__WEBPACK_IMPORTED_MODULE_3__["default"],
});
const matlabIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:matlab',
    svgstr: _style_icon_language_icons_matlab_svg__WEBPACK_IMPORTED_MODULE_4__["default"],
});
const schemeIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:scheme',
    svgstr: _style_icon_language_icons_scheme_svg__WEBPACK_IMPORTED_MODULE_5__["default"],
});
const processingIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:processing',
    svgstr: _style_icon_language_icons_processing_svg__WEBPACK_IMPORTED_MODULE_6__["default"],
});
const scalaIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:scala',
    svgstr: _style_icon_language_icons_scala_svg__WEBPACK_IMPORTED_MODULE_7__["default"],
});
const groovyIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:groovy',
    svgstr: _style_icon_language_icons_groovy_svg__WEBPACK_IMPORTED_MODULE_8__["default"],
});
const fortranIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:fortran',
    svgstr: _style_icon_language_icons_fortran_svg__WEBPACK_IMPORTED_MODULE_9__["default"],
});
const haskellIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:haskell',
    svgstr: _style_icon_language_icons_haskell_svg__WEBPACK_IMPORTED_MODULE_10__["default"],
});
const rubyIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:ruby',
    svgstr: _style_icon_language_icons_ruby_svg__WEBPACK_IMPORTED_MODULE_11__["default"],
});
const typescriptIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:typescript',
    svgstr: _style_icon_language_icons_typescript_svg__WEBPACK_IMPORTED_MODULE_12__["default"],
});
const javascriptIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:javascript',
    svgstr: _style_icon_language_icons_javascript_svg__WEBPACK_IMPORTED_MODULE_13__["default"],
});
const coffeescriptIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:coffeescript',
    svgstr: _style_icon_language_icons_coffeescript_svg__WEBPACK_IMPORTED_MODULE_14__["default"],
});
const livescriptIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:livescript',
    svgstr: _style_icon_language_icons_livescript_svg__WEBPACK_IMPORTED_MODULE_15__["default"],
});
const csharpIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:csharp',
    svgstr: _style_icon_language_icons_csharp_svg__WEBPACK_IMPORTED_MODULE_16__["default"],
});
const fsharpIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:fsharp',
    svgstr: _style_icon_language_icons_fsharp_svg__WEBPACK_IMPORTED_MODULE_17__["default"],
});
const goIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:go',
    svgstr: _style_icon_language_icons_go_svg__WEBPACK_IMPORTED_MODULE_18__["default"],
});
const erlangIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:erlang',
    svgstr: _style_icon_language_icons_erlang_svg__WEBPACK_IMPORTED_MODULE_19__["default"],
});
const ocamlIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:ocaml',
    svgstr: _style_icon_language_icons_ocaml_svg__WEBPACK_IMPORTED_MODULE_20__["default"],
});
const forthIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:forth',
    svgstr: _style_icon_language_icons_forth_svg__WEBPACK_IMPORTED_MODULE_21__["default"],
});
const perlIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:perl',
    svgstr: _style_icon_language_icons_perl_svg__WEBPACK_IMPORTED_MODULE_22__["default"],
});
const phpIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:php',
    svgstr: _style_icon_language_icons_php_svg__WEBPACK_IMPORTED_MODULE_23__["default"],
});
const clojureIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:clojure',
    svgstr: _style_icon_language_icons_clojure_svg__WEBPACK_IMPORTED_MODULE_24__["default"],
});
const luaIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:lua',
    svgstr: _style_icon_language_icons_lua_svg__WEBPACK_IMPORTED_MODULE_25__["default"],
});
const purescriptIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:purescript',
    svgstr: _style_icon_language_icons_purescript_svg__WEBPACK_IMPORTED_MODULE_26__["default"],
});
const cppIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:cpp',
    svgstr: _style_icon_language_icons_cpp_svg__WEBPACK_IMPORTED_MODULE_27__["default"],
});
const prologIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:prolog',
    svgstr: _style_icon_language_icons_prolog_svg__WEBPACK_IMPORTED_MODULE_28__["default"],
});
const lispIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:lisp',
    svgstr: _style_icon_language_icons_lisp_svg__WEBPACK_IMPORTED_MODULE_29__["default"],
});
const cIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:c',
    svgstr: _style_icon_language_icons_c_svg__WEBPACK_IMPORTED_MODULE_30__["default"],
});
const kotlinIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:kotlin',
    svgstr: _style_icon_language_icons_kotlin_svg__WEBPACK_IMPORTED_MODULE_31__["default"],
});
const nodejsIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:nodejs',
    svgstr: _style_icon_language_icons_nodejs_svg__WEBPACK_IMPORTED_MODULE_32__["default"],
});
const sasIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:sas',
    svgstr: _style_icon_language_icons_sas_svg__WEBPACK_IMPORTED_MODULE_33__["default"],
});
const coconutIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:coconut',
    svgstr: _style_icon_language_icons_coconut_svg__WEBPACK_IMPORTED_MODULE_34__["default"],
});
const sbtIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:sbt',
    svgstr: _style_icon_language_icons_sbt_svg__WEBPACK_IMPORTED_MODULE_35__["default"],
});
const rustIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:rust',
    svgstr: _style_icon_language_icons_rust_svg__WEBPACK_IMPORTED_MODULE_36__["default"],
});
const qsharpIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:qsharp',
    svgstr: _style_icon_language_icons_qsharp_svg__WEBPACK_IMPORTED_MODULE_37__["default"],
});
const markdownIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:markdown',
    svgstr: _style_icon_language_icons_markdown_svg__WEBPACK_IMPORTED_MODULE_38__["default"],
});
const powershellIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: 'custom-ui-components:powershell',
    svgstr: _style_icon_language_icons_powershell_svg__WEBPACK_IMPORTED_MODULE_39__["default"],
});


/***/ }),

/***/ "./lib/CodeSnippetMenu.js":
/*!********************************!*\
  !*** ./lib/CodeSnippetMenu.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "OptionsMessage": () => (/* binding */ OptionsMessage),
/* harmony export */   "showMoreOptions": () => (/* binding */ showMoreOptions)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/messaging */ "webpack/sharing/consume/default/@lumino/messaging");
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_messaging__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_4__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.





/**
 * The class name for options box
 */
const OPTIONS_CLASS = 'jp-codeSnippet-options';
const OPTIONS_CONTENT = 'jp-codeSnippet-options-content';
const OPTIONS_BODY = 'jp-codeSnippet-options-body';
/**
 * Create and show a code snippet options.
 *
 * @param options - The code snippet options setup options.
 *
 * @returns A promise that resolves with whether the code snippet options was accepted.
 */
function showMoreOptions(options = {}) {
    const optionsMessage = new OptionsMessage(options);
    return optionsMessage.launch();
}
/**
 * A widget used to show options message.
 */
class OptionsMessage extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget {
    constructor(options = {}) {
        super();
        this.addClass(OPTIONS_CLASS);
        const renderer = OptionsMessage.defaultRenderer;
        this._host = options.host || document.body;
        const layout = (this.layout = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.PanelLayout());
        const content = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Panel();
        content.addClass(OPTIONS_CONTENT);
        layout.addWidget(content);
        const body = renderer.createBody(options.body);
        content.addWidget(body);
        if (OptionsMessage.tracker.size > 0) {
            const previous = OptionsMessage.tracker.currentWidget;
            previous.reject();
            OptionsMessage.tracker.dispose();
        }
        void OptionsMessage.tracker.add(this);
    }
    /**
     * Launch the code snippet options as a modal window.
     *
     * @returns a promise that resolves with the result of the code snippet options.
     */
    launch() {
        // Return the existing code snippet options if already open.
        if (this._promise) {
            return this._promise.promise;
        }
        const promise = (this._promise = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_3__.PromiseDelegate());
        const promises = Promise.all(Private.launchQueue);
        Private.launchQueue.push(this._promise.promise);
        return promises.then(() => {
            _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget.attach(this, this._host);
            return promise.promise;
        });
    }
    /**
     * Handle the DOM events for the directory listing.
     *
     * @param event - The DOM event sent to the widget.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the panel's DOM node. It should
     * not be called directly by user code.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'click':
                this._evtClick(event);
                break;
            case 'contextmenu':
                this._evtClick(event);
                break;
            default:
                break;
        }
    }
    /**
     * Handle the `'click'` event for a code snippet options button.
     *
     * @param event - The DOM event sent to the widget
     */
    _evtClick(event) {
        const content = this.node.getElementsByClassName(OPTIONS_CONTENT)[0];
        if (!content.contains(event.target)) {
            event.stopPropagation();
            event.preventDefault();
            this.reject();
        }
    }
    /**
     * Reject the current code snippet options with a default reject value.
     *
     * #### Notes
     * Will be a no-op if the code snippet options is not shown.
     */
    reject() {
        if (!this._promise) {
            return;
        }
        this._resolve();
    }
    /**
     * Resolve a button item.
     */
    _resolve() {
        // Prevent loopback.
        const promise = this._promise;
        if (!promise) {
            this.dispose();
            return;
        }
        this._promise = null;
        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_4__.ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
        this.dispose();
        promise.resolve();
    }
    /**
     * Dispose of the resources used by the code snippet options.
     */
    dispose() {
        const promise = this._promise;
        if (promise) {
            this._promise = null;
            promise.reject(void 0);
            _lumino_algorithm__WEBPACK_IMPORTED_MODULE_4__.ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
        }
        super.dispose();
    }
    /**
     *  A message handler invoked on an `'after-attach'` message.
     */
    onAfterAttach(msg) {
        const node = this.node;
        node.addEventListener('click', this, true);
        node.addEventListener('contextmenu', this, true);
    }
    /**
     *  A message handler invoked on an `'after-detach'` message.
     */
    onAfterDetach(msg) {
        const node = this.node;
        node.removeEventListener('click', this, true);
        node.removeEventListener('contextmenu', this, true);
    }
}
(function (OptionsMessage) {
    class Renderer {
        /**
         * Create the body of the code snippet options.
         *
         * @param value - The input value for the body.
         *
         * @returns A widget for the body.
         */
        createBody(value) {
            let body;
            if (typeof value === 'string') {
                body = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget({ node: document.createElement('span') });
                body.node.textContent = value;
            }
            else if (value instanceof _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget) {
                body = value;
            }
            else {
                body = _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget.create(value);
                // Immediately update the body even though it has not yet attached in
                // order to trigger a render of the DOM nodes from the React element.
                _lumino_messaging__WEBPACK_IMPORTED_MODULE_2__.MessageLoop.sendMessage(body, _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget.Msg.UpdateRequest);
            }
            body.addClass(OPTIONS_BODY);
            return body;
        }
    }
    OptionsMessage.Renderer = Renderer;
    /**
     * The default renderer instance.
     */
    OptionsMessage.defaultRenderer = new Renderer();
    /**
     * The code snippet options widget tracker.
     */
    OptionsMessage.tracker = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.WidgetTracker({
        namespace: '@jupyterlab/code_snippet:OptionsWidget',
    });
})(OptionsMessage || (OptionsMessage = {}));
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * The queue for launching code snippet optionss.
     */
    Private.launchQueue = [];
})(Private || (Private = {}));


/***/ }),

/***/ "./lib/CodeSnippetMessage.js":
/*!***********************************!*\
  !*** ./lib/CodeSnippetMessage.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetMessage": () => (/* binding */ CodeSnippetMessage),
/* harmony export */   "showMessage": () => (/* binding */ showMessage)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_icon_jupyter_checkmark_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style/icon/jupyter_checkmark.svg */ "./style/icon/jupyter_checkmark.svg");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.
// import { WidgetTracker, ReactWidget } from '@jupyterlab/apputils';



/**
 * The class name for message
 */
// const CONFIRM_CLASS = 'jp-codeSnippet-confirm';
const CONFIRM_CONTENT = 'jp-codeSnippet-Message-content';
const CONFIRM_BODY = 'jp-codeSnippet-Message-body';
const CODE_SNIPPET_CONFIRM_TEXT = 'jp-codeSnippet-confirm-text';
/**
 * Create and show a dialog.
 *
 * @param options - The dialog setup options.
 *
 * @returns A promise that resolves with whether the dialog was accepted.
 */
function showMessage(type) {
    const confirmMessage = new CodeSnippetMessage({
        body: new MessageHandler(type),
        buttons: [],
    });
    return confirmMessage.launch();
}
/**
 * A widget used to show message.
 */
class CodeSnippetMessage extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog {
    constructor(options = {}) {
        super(options);
        this.children().next().addClass(CONFIRM_CONTENT);
    }
    onAfterAttach(msg) {
        const node = this.node;
        node.addEventListener('click', this, true);
        document.addEventListener('keydown', this, false);
    }
    /**
     *  A message handler invoked on an `'after-detach'` message.
     */
    onAfterDetach(msg) {
        const node = this.node;
        node.removeEventListener('click', this, true);
        document.removeEventListener('keydown', this, false);
    }
    handleEvent(event) {
        switch (event.type) {
            case 'keydown':
                this._evtKeydown(event);
                break;
            case 'click':
                this._evtClick(event);
                break;
        }
    }
    _evtKeydown(event) {
        // Check for escape key
        switch (event.key) {
            case 'Escape':
                event.stopPropagation();
                event.preventDefault();
                this.reject();
                break;
        }
    }
}
class MessageHandler extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_1__.Widget {
    constructor(type) {
        super({ node: Private.createMessageNode(type) });
        this.addClass(CONFIRM_BODY);
    }
}
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    // create a confirm message when new snippet is created successfully
    function createMessageNode(type) {
        const body = document.createElement('div');
        body.innerHTML = _style_icon_jupyter_checkmark_svg__WEBPACK_IMPORTED_MODULE_2__["default"];
        const messageContainer = document.createElement('div');
        messageContainer.className = CODE_SNIPPET_CONFIRM_TEXT;
        const message = document.createElement('text');
        if (type === 'confirm') {
            message.textContent = 'Saved as Snippet!';
        }
        else if (type === 'copy') {
            message.textContent = 'Saved to Clipboard!';
        }
        else if (type === 'export') {
            message.textContent = 'Exported the Snippet!';
        }
        messageContainer.appendChild(message);
        body.append(messageContainer);
        return body;
    }
    Private.createMessageNode = createMessageNode;
})(Private || (Private = {}));


/***/ }),

/***/ "./lib/CodeSnippetPreview.js":
/*!***********************************!*\
  !*** ./lib/CodeSnippetPreview.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Preview": () => (/* binding */ Preview),
/* harmony export */   "showPreview": () => (/* binding */ showPreview)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/codeeditor */ "webpack/sharing/consume/default/@jupyterlab/codeeditor");
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @lumino/messaging */ "webpack/sharing/consume/default/@lumino/messaging");
/* harmony import */ var _lumino_messaging__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_lumino_messaging__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _CodeSnippetService__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./CodeSnippetService */ "./lib/CodeSnippetService.js");
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.







/**
 * The class name for preview box.
 */
const PREVIEW_CLASS = 'jp-codeSnippet-preview';
const PREVIEW_CONTENT = 'jp-codeSnippet-preview-content';
const PREVIEW_BODY = 'jp-codeSnippet-preview-body';
/**
 * Create and show a preview.
 *
 * @param options - The preview setup options.
 *
 */
function showPreview(options = {}, editorServices) {
    //Insert check method to see if the preview is already open
    const preview = new Preview(options, editorServices);
    if (preview.ready === false) {
        return;
    }
    return preview.launch();
}
/**
 * A widget used to show preview
 */
class Preview extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget {
    constructor(options = {}, editorServices) {
        super();
        this.ready = true;
        this._title = options.title;
        this._id = options.id;
        this.codeSnippet = options.codeSnippet;
        this.editorServices = editorServices;
        this.codeSnippetService = _CodeSnippetService__WEBPACK_IMPORTED_MODULE_6__.CodeSnippetService.getCodeSnippetService();
        this.addClass(PREVIEW_CLASS);
        const layout = (this.layout = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.PanelLayout());
        const content = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Panel();
        content.addClass(PREVIEW_CONTENT);
        content.id = PREVIEW_CONTENT + this._id;
        layout.addWidget(content);
        if (Preview.tracker.size > 0) {
            const previous = Preview.tracker.currentWidget;
            previous.reject();
            Preview.tracker.dispose();
        }
        if (this.ready === true) {
            void Preview.tracker.add(this);
        }
    }
    /**
     * Launch the preview as a modal window.
     */
    launch() {
        // Return the existing preview if already open.
        if (this._promise) {
            return this._promise.promise;
        }
        const promise = (this._promise = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_4__.PromiseDelegate());
        const promises = Promise.all(Private.launchQueue);
        Private.launchQueue.push(this._promise.promise);
        return promises.then(() => {
            _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget.attach(this, document.getElementById('jp-main-dock-panel'));
            return promise.promise;
        });
    }
    /**
     * Reject the current preview with a default reject value.
     *
     * #### Notes
     * Will be a no-op if the preview is not shown.
     */
    reject() {
        if (!this._promise) {
            return;
        }
        this._resolve();
    }
    /**
     * Resolve a button item.
     */
    _resolve() {
        // Prevent loopback.
        const promise = this._promise;
        if (!promise) {
            this.dispose();
            return;
        }
        this._promise = null;
        _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__.ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
        this.dispose();
        promise.resolve();
    }
    /**
     * Dispose of the resources used by the preview.
     */
    dispose() {
        const promise = this._promise;
        if (promise) {
            this._promise = null;
            promise.reject(void 0);
            _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__.ArrayExt.removeFirstOf(Private.launchQueue, promise.promise);
        }
        super.dispose();
    }
    /**
     *  A message handler invoked on an `'after-attach'` message.
     */
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        this._hasRefreshedSinceAttach = false;
        if (this.isVisible) {
            this.update();
        }
    }
    onAfterShow(msg) {
        if (!this._hasRefreshedSinceAttach) {
            this.update();
        }
    }
    onUpdateRequest(msg) {
        super.onUpdateRequest(msg);
        if (!this.editor && document.getElementById(PREVIEW_CONTENT + this._id)) {
            const editorFactory = this.editorServices.factoryService.newInlineEditor;
            const getMimeTypeByLanguage = this.editorServices.mimeTypeService.getMimeTypeByLanguage;
            let previewFontSize = this.codeSnippetService.settings.get('snippetPreviewFontSize').composite;
            if (this.codeSnippetService.settings.get('snippetPreviewFontSize').user !==
                undefined) {
                previewFontSize = this.codeSnippetService.settings.get('snippetPreviewFontSize').user;
            }
            this.editor = editorFactory({
                host: document.getElementById(PREVIEW_CONTENT + this._id),
                config: { readOnly: true, fontSize: previewFontSize },
                model: new _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_1__.CodeEditor.Model({
                    value: this.codeSnippet.code,
                    mimeType: getMimeTypeByLanguage({
                        name: this.codeSnippet.language,
                        codemirror_mode: this.codeSnippet.language,
                    }),
                }),
            });
        }
        if (this.isVisible) {
            this._hasRefreshedSinceAttach = true;
            this.editor.refresh();
        }
    }
}
(function (Preview) {
    class Renderer {
        /**
         * Create the body of the preview.
         *
         * @param value - The input value for the body.
         *
         * @returns A widget for the body.
         */
        createBody(value) {
            let body;
            if (typeof value === 'string') {
                body = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget({ node: document.createElement('span') });
                body.node.textContent = value;
            }
            else if (value instanceof _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget) {
                body = value;
            }
            else {
                body = _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget.create(value);
                // Immediately update the body even though it has not yet attached in
                // order to trigger a render of the DOM nodes from the React element.
                _lumino_messaging__WEBPACK_IMPORTED_MODULE_3__.MessageLoop.sendMessage(body, _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Widget.Msg.UpdateRequest);
            }
            body.addClass(PREVIEW_BODY);
            return body;
        }
    }
    Preview.Renderer = Renderer;
    /**
     * The default renderer instance.
     */
    Preview.defaultRenderer = new Renderer();
    /**
     * The preview widget tracker.
     */
    Preview.tracker = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.WidgetTracker({
        namespace: '@jupyterlab/code_snippet:preview',
    });
})(Preview || (Preview = {}));
/**
 * The namespace for module private data.
 */
var Private;
(function (Private) {
    /**
     * The queue for launching previews.
     */
    Private.launchQueue = [];
})(Private || (Private = {}));


/***/ }),

/***/ "./lib/CodeSnippetService.js":
/*!***********************************!*\
  !*** ./lib/CodeSnippetService.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetService": () => (/* binding */ CodeSnippetService)
/* harmony export */ });
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CodeSnippetWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeSnippetWidget */ "./lib/CodeSnippetWidget.js");


class CodeSnippetService {
    constructor(settings, app) {
        this.settingManager = settings;
        // when user changes the snippets using settingsEditor
        this.settingManager.changed.connect(async (plugin) => {
            const newCodeSnippetList = plugin.get('snippets').user;
            if (!_lumino_coreutils__WEBPACK_IMPORTED_MODULE_0__.JSONExt.deepEqual(newCodeSnippetList, this.codeSnippetList)) {
                this.codeSnippetList = this.convertToICodeSnippetList(newCodeSnippetList);
                const leftWidgets = app.shell.widgets('left').iter();
                let current = leftWidgets.next();
                while (current) {
                    if (current instanceof _CodeSnippetWidget__WEBPACK_IMPORTED_MODULE_1__.CodeSnippetWidget) {
                        current.updateCodeSnippetWidget();
                        break;
                    }
                    current = leftWidgets.next();
                }
                // order code snippet and sync it with setting
                this.orderSnippets();
                await plugin
                    .set('snippets', this.codeSnippetList)
                    .catch((e) => {
                    console.log('Error in syncing orders of snippets with those in settings');
                    console.log(e);
                });
            }
        });
        // load user's saved snippets
        if (this.settingManager.get('snippets').user) {
            const userSnippets = this.convertToICodeSnippetList(this.settingManager.get('snippets').user);
            this.codeSnippetList = userSnippets;
        }
        // set default preview font size
        if (this.settingManager.get('snippetPreviewFontSize').user === undefined) {
            this.settingManager.set('snippetPreviewFontSize', this.settingManager.default('snippetPreviewFontSize'));
        }
    }
    convertToICodeSnippetList(snippets) {
        const snippetList = [];
        snippets.forEach((snippet) => {
            const newSnippet = snippet;
            snippetList.push(newSnippet);
        });
        return snippetList;
    }
    static init(settings, app) {
        if (!this.codeSnippetService) {
            this.codeSnippetService = new CodeSnippetService(settings, app);
        }
    }
    static getCodeSnippetService() {
        return this.codeSnippetService;
    }
    get settings() {
        return this.settingManager;
    }
    get snippets() {
        return this.codeSnippetList;
    }
    getSnippetByName(snippetName) {
        return this.codeSnippetList.filter((snippet) => snippet.name.toLowerCase() === snippetName.toLowerCase());
    }
    async addSnippet(snippet) {
        const id = snippet.id;
        this.codeSnippetList.splice(id, 0, snippet);
        const numSnippets = this.codeSnippetList.length;
        // update id's of snippets.
        let i = id + 1;
        for (; i < numSnippets; i++) {
            this.codeSnippetList[i].id += 1;
        }
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
    async deleteSnippet(id) {
        let numSnippets = this.codeSnippetList.length;
        // should never satisfy this condition
        if (id >= numSnippets) {
            console.log('error in codeSnippetService');
        }
        if (id === numSnippets - 1) {
            this.codeSnippetList.pop();
        }
        else {
            this.codeSnippetList.splice(id, 1);
            numSnippets = this.codeSnippetList.length;
            let i = id;
            for (; i < numSnippets; i++) {
                this.codeSnippetList[i].id -= 1;
            }
        }
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
    async renameSnippet(oldName, newName) {
        for (const snippet of this.codeSnippetList) {
            if (snippet.name === oldName) {
                snippet.name = newName;
                break;
            }
        }
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
    duplicateNameExists(newName) {
        for (const snippet of this.codeSnippetList) {
            if (snippet.name.toLowerCase() === newName.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    async modifyExistingSnippet(oldName, newSnippet) {
        for (const snippet of this.codeSnippetList) {
            if (snippet.name.toLowerCase() === oldName.toLowerCase()) {
                this.codeSnippetList.splice(snippet.id, 1, newSnippet);
                break;
            }
        }
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
    async moveSnippet(fromIdx, toIdx) {
        if (toIdx > fromIdx) {
            toIdx = toIdx - 1;
        }
        if (toIdx === fromIdx) {
            return;
        }
        const snippetToMove = this.codeSnippetList[fromIdx];
        this.deleteSnippet(fromIdx).then((res) => {
            if (!res) {
                console.log('Error in moving snippet(delete)');
                return false;
            }
        });
        snippetToMove.id = toIdx;
        this.addSnippet(snippetToMove).then((res) => {
            if (!res) {
                console.log('Error in moving snippet(add)');
                return false;
            }
        });
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
    // order snippets just in case when it gets shared between users
    async orderSnippets() {
        this.codeSnippetList.sort((a, b) => a.id - b.id);
        this.codeSnippetList.forEach((snippet, i) => (snippet.id = i));
        await this.settingManager
            .set('snippets', this.codeSnippetList)
            .catch((_) => {
            return false;
        });
        return true;
    }
}


/***/ }),

/***/ "./lib/CodeSnippetUtilities.js":
/*!*************************************!*\
  !*** ./lib/CodeSnippetUtilities.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "saveOverWriteFile": () => (/* binding */ saveOverWriteFile),
/* harmony export */   "validateInputs": () => (/* binding */ validateInputs)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CodeSnippetLanguages */ "./lib/CodeSnippetLanguages.js");


/**
 * Test whether user typed in all required inputs.
 */
function validateInputs(name, description, language) {
    let status = true;
    let message = '';
    if (name === '') {
        message += 'Name must be filled out\n';
        status = false;
    }
    if (language === '') {
        message += 'Language must be filled out';
        status = false;
    }
    if (!_CodeSnippetLanguages__WEBPACK_IMPORTED_MODULE_1__.SUPPORTED_LANGUAGES.includes(language)) {
        message += 'Language must be one of the options';
        status = false;
    }
    if (status === false) {
        alert(message);
    }
    return status;
}
/**
 * Rename a file, warning for overwriting another.
 */
async function saveOverWriteFile(codeSnippetManager, oldSnippet, newSnippet) {
    const newName = newSnippet.name;
    return await shouldOverwrite(newName).then((res) => {
        if (res) {
            newSnippet.id = oldSnippet.id;
            codeSnippetManager.deleteSnippet(oldSnippet.id).then((res) => {
                if (!res) {
                    console.log('Error in overwriting a snippet (delete)');
                    return false;
                }
            });
            codeSnippetManager.addSnippet(newSnippet).then((res) => {
                if (!res) {
                    console.log('Error in overwriting a snippet (add)');
                    return false;
                }
            });
            return true;
        }
    });
}
/**
 * Ask the user whether to overwrite a file.
 */
async function shouldOverwrite(newName) {
    const options = {
        title: 'Overwrite code snippet?',
        body: `"${newName}" already exists, overwrite?`,
        buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.cancelButton(), _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.Dialog.warnButton({ label: 'Overwrite' })],
    };
    return (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.showDialog)(options).then((result) => {
        return result.button.accept;
    });
}


/***/ }),

/***/ "./lib/CodeSnippetWidget.js":
/*!**********************************!*\
  !*** ./lib/CodeSnippetWidget.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CodeSnippetWidget": () => (/* binding */ CodeSnippetWidget)
/* harmony export */ });
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CodeSnippetService__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CodeSnippetService */ "./lib/CodeSnippetService.js");
/* harmony import */ var _CodeSnippetDisplay__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CodeSnippetDisplay */ "./lib/CodeSnippetDisplay.js");
/* harmony import */ var _CodeSnippetInputDialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CodeSnippetInputDialog */ "./lib/CodeSnippetInputDialog.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "webpack/sharing/consume/default/react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.
// Some lines of code are from Elyra Code Snippet.
/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */






/**
 * A class used to indicate a snippet item.
 */
const CODE_SNIPPET_ITEM = 'jp-codeSnippet-item';
/**
 * The mimetype used for Jupyter cell data.
 */
const JUPYTER_CELL_MIME = 'application/vnd.jupyter.cells';
/**
 * A class used to indicate a drop target.
 */
const DROP_TARGET_CLASS = 'jp-codeSnippet-dropTarget';
const CODE_SNIPPET_EDITOR = 'jp-codeSnippet-editor';
const CODE_SNIPPET_DRAG_HOVER = 'jp-codeSnippet-drag-hover';
const commands = {
    OPEN_CODE_SNIPPET_EDITOR: `${CODE_SNIPPET_EDITOR}:open`,
};
/**
 * A widget for Code Snippets.
 */
class CodeSnippetWidget extends _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.ReactWidget {
    constructor(getCurrentWidget, app, editorServices) {
        super();
        this.app = app;
        this.editorServices = editorServices;
        this.getCurrentWidget = getCurrentWidget;
        this.renderCodeSnippetsSignal = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_1__.Signal(this);
        this.codeSnippetManager = _CodeSnippetService__WEBPACK_IMPORTED_MODULE_3__.CodeSnippetService.getCodeSnippetService();
        this.moveCodeSnippet = this.moveCodeSnippet.bind(this);
        this.openCodeSnippetEditor = this.openCodeSnippetEditor.bind(this);
        this.updateCodeSnippetWidget = this.updateCodeSnippetWidget.bind(this);
        this.node.setAttribute('data-lm-dragscroll', 'true');
    }
    updateCodeSnippetWidget() {
        if (this.codeSnippetManager) {
            const newSnippets = this.codeSnippetManager.snippets;
            newSnippets && this.renderCodeSnippetsSignal.emit(newSnippets);
        }
    }
    onAfterShow(msg) {
        this.updateCodeSnippetWidget();
    }
    openCodeSnippetEditor(args) {
        this.app.commands.execute(commands.OPEN_CODE_SNIPPET_EDITOR, args);
    }
    /**
     * Handle the DOM events for the widget.
     *
     * @param event - The DOM event sent to the widget.
     *
     * #### Notes
     * This method implements the DOM `EventListener` interface and is
     * called in response to events on the notebook panel's node. It should
     * not be called directly by user code.
     */
    handleEvent(event) {
        switch (event.type) {
            case 'lm-dragenter':
                this._evtDragEnter(event);
                break;
            case 'lm-dragleave':
                this._evtDragLeave(event);
                break;
            case 'lm-dragover':
                this._evtDragOver(event);
                break;
            case 'lm-drop':
                this._evtDrop(event);
                break;
            default:
                break;
        }
    }
    /**
     * A message handler invoked on an `'after-attach'` message.
     * @param msg
     */
    onAfterAttach(msg) {
        super.onAfterAttach(msg);
        const node = this.node;
        node.addEventListener('lm-dragenter', this);
        node.addEventListener('lm-dragleave', this);
        node.addEventListener('lm-dragover', this);
        node.addEventListener('lm-drop', this);
    }
    /**
     * Handle `before-detach` messages for the widget.
     * @param msg
     */
    onBeforeDetach(msg) {
        const node = this.node;
        node.removeEventListener('lm-dragenter', this);
        node.removeEventListener('lm-dragleave', this);
        node.removeEventListener('lm-dragover', this);
        node.removeEventListener('lm-drop', this);
    }
    /**
     * Find the snippet containing the target html element.
     *
     * #### Notes
     * Returns undefined if the cell is not found.
     */
    _findSnippet(node) {
        // Trace up the DOM hierarchy to find the root cell node.
        // Then find the corresponding child and select it.
        let n = node;
        while (n && n !== this.node) {
            if (n.classList.contains(CODE_SNIPPET_ITEM)) {
                return n;
            }
            n = n.parentElement;
        }
        return undefined;
    }
    /**
     * Handle the `'lm-dragenter'` event for the widget.
     */
    _evtDragEnter(event) {
        if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const target = event.target;
        if (!event.mimeData.hasData('snippet/id')) {
            const snippetId = target.id.slice(CODE_SNIPPET_DRAG_HOVER.length);
            event.mimeData.setData('snippet/id', parseInt(snippetId));
        }
        const snippet = this._findSnippet(target);
        if (snippet === undefined) {
            return;
        }
        const snippetNode = snippet;
        snippetNode.classList.add(DROP_TARGET_CLASS);
    }
    /**
     * Handle the `'lm-dragleave'` event for the widget.
     */
    _evtDragLeave(event) {
        if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
        if (elements.length) {
            elements[0].classList.remove(DROP_TARGET_CLASS);
        }
    }
    /**
     * Handle the `'lm-dragover'` event for the widget.
     */
    _evtDragOver(event) {
        const data = this.findCellData(event.mimeData);
        if (data === undefined) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        event.dropAction = event.proposedAction;
        const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
        if (elements.length) {
            elements[0].classList.remove(DROP_TARGET_CLASS);
        }
        const target = event.target;
        const snippet = this._findSnippet(target);
        if (snippet === undefined) {
            return;
        }
        const snippetNode = snippet;
        snippetNode.classList.add(DROP_TARGET_CLASS);
    }
    findCellData(mime) {
        const code = mime.getData('text/plain');
        return code;
    }
    /**
     * Handle the `'lm-drop'` event for the widget.
     */
    async _evtDrop(event) {
        const data = this.findCellData(event.mimeData);
        if (data === undefined) {
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (event.proposedAction === 'none') {
            event.dropAction = 'none';
            return;
        }
        let target = event.target;
        while (target && target.parentElement) {
            if (target.classList.contains(DROP_TARGET_CLASS)) {
                target.classList.remove(DROP_TARGET_CLASS);
                break;
            }
            target = target.parentElement;
        }
        const snippet = this._findSnippet(target);
        // if target is CodeSnippetWidget, then snippet is undefined
        let idx;
        if (snippet !== undefined) {
            idx = parseInt(snippet.id.slice(CODE_SNIPPET_ITEM.length));
        }
        else {
            idx = this.codeSnippetManager.snippets.length;
        }
        /**
         * moving snippets inside the snippet panel
         */
        const source = event.source;
        if (source instanceof _CodeSnippetDisplay__WEBPACK_IMPORTED_MODULE_4__.CodeSnippetDisplay) {
            event.dropAction = 'move';
            if (event.mimeData.hasData('snippet/id')) {
                const srcIdx = event.mimeData.getData('snippet/id');
                this.moveCodeSnippet(srcIdx, idx);
            }
        }
        else {
            const notebook = event.mimeData.getData('internal:cells')[0].parent;
            const language = notebook.model.defaultKernelLanguage;
            // Handle the case where we are copying cells
            event.dropAction = 'copy';
            (0,_CodeSnippetInputDialog__WEBPACK_IMPORTED_MODULE_5__.CodeSnippetInputDialog)(this, data, language, idx);
        }
        // Reorder snippet just to make sure id's are in order.
        this.codeSnippetManager.orderSnippets().then((res) => {
            if (!res) {
                console.log('Error in ordering snippets');
                return;
            }
        });
    }
    // move code snippet within code snippet explorer
    moveCodeSnippet(srcIdx, targetIdx) {
        this.codeSnippetManager
            .moveSnippet(srcIdx, targetIdx)
            .then((res) => {
            if (!res) {
                console.log('Error in moving snippet');
                return;
            }
        });
        const newSnippets = this.codeSnippetManager.snippets;
        this.renderCodeSnippetsSignal.emit(newSnippets);
    }
    render() {
        return (react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_0__.UseSignal, { signal: this.renderCodeSnippetsSignal, initialArgs: [] }, (_, codeSnippets) => (react__WEBPACK_IMPORTED_MODULE_2___default().createElement("div", null,
            react__WEBPACK_IMPORTED_MODULE_2___default().createElement(_CodeSnippetDisplay__WEBPACK_IMPORTED_MODULE_4__.CodeSnippetDisplay, { codeSnippets: codeSnippets, codeSnippetManager: this.codeSnippetManager, app: this.app, getCurrentWidget: this.getCurrentWidget, openCodeSnippetEditor: this.openCodeSnippetEditor, editorServices: this.editorServices, updateCodeSnippetWidget: this.updateCodeSnippetWidget })))));
    }
}


/***/ }),

/***/ "./lib/index.js":
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/application */ "webpack/sharing/consume/default/@jupyterlab/application");
/* harmony import */ var _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/settingregistry */ "webpack/sharing/consume/default/@jupyterlab/settingregistry");
/* harmony import */ var _jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @jupyterlab/codeeditor */ "webpack/sharing/consume/default/@jupyterlab/codeeditor");
/* harmony import */ var _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @lumino/algorithm */ "webpack/sharing/consume/default/@lumino/algorithm");
/* harmony import */ var _lumino_algorithm__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _style_icon_jupyter_snippeteditoricon_svg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../style/icon/jupyter_snippeteditoricon.svg */ "./style/icon/jupyter_snippeteditoricon.svg");
/* harmony import */ var _style_icon_jupyter_snippeticon_svg__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../style/icon/jupyter_snippeticon.svg */ "./style/icon/jupyter_snippeticon.svg");
/* harmony import */ var _CodeSnippetInputDialog__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./CodeSnippetInputDialog */ "./lib/CodeSnippetInputDialog.js");
/* harmony import */ var _CodeSnippetWidget__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./CodeSnippetWidget */ "./lib/CodeSnippetWidget.js");
/* harmony import */ var _CodeSnippetEditor__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./CodeSnippetEditor */ "./lib/CodeSnippetEditor.js");
/* harmony import */ var _CodeSnippetService__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./CodeSnippetService */ "./lib/CodeSnippetService.js");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @jupyterlab/notebook */ "webpack/sharing/consume/default/@jupyterlab/notebook");
/* harmony import */ var _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @jupyterlab/docregistry */ "webpack/sharing/consume/default/@jupyterlab/docregistry");
/* harmony import */ var _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_7__);
// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.
// Some lines of code are from Elyra Code Snippet.
/*
 * Copyright 2018-2020 IBM Corporation
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions a* limitations under the License.
 */














// Code Snippet Constants
const CODE_SNIPPET_EXTENSION_ID = 'code-snippet-extension';
const CODE_SNIPPET_SETTING_ID = 'jupyterlab-code-snippets:snippets';
/**
 * Snippet Editor Icon
 */
const editorIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_4__.LabIcon({
    name: 'custom-ui-components:codeSnippetEditorIcon',
    svgstr: _style_icon_jupyter_snippeteditoricon_svg__WEBPACK_IMPORTED_MODULE_8__["default"],
});
/**
 * Snippet Icon
 */
const codeSnippetIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_4__.LabIcon({
    name: 'custom-ui-components:codeSnippetIcon',
    svgstr: _style_icon_jupyter_snippeticon_svg__WEBPACK_IMPORTED_MODULE_9__["default"],
});
/**
 * Initialization data for the code_snippets extension.
 */
const code_snippet_extension = {
    id: CODE_SNIPPET_EXTENSION_ID,
    autoStart: true,
    requires: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.ICommandPalette, _jupyterlab_application__WEBPACK_IMPORTED_MODULE_0__.ILayoutRestorer, _jupyterlab_codeeditor__WEBPACK_IMPORTED_MODULE_3__.IEditorServices],
    activate: activateCodeSnippet,
};
function activateCodeSnippet(app, palette, restorer, editorServices) {
    console.log('JupyterLab extension jupyterlab-code-snippets is activated!');
    const getCurrentWidget = () => {
        return app.shell.currentWidget;
    };
    const codeSnippetWidget = new _CodeSnippetWidget__WEBPACK_IMPORTED_MODULE_10__.CodeSnippetWidget(getCurrentWidget, app, editorServices);
    codeSnippetWidget.id = CODE_SNIPPET_EXTENSION_ID;
    codeSnippetWidget.title.icon = codeSnippetIcon;
    codeSnippetWidget.title.caption = 'Code Snippet Explorer';
    restorer.add(codeSnippetWidget, CODE_SNIPPET_EXTENSION_ID);
    // Rank has been chosen somewhat arbitrarily to give priority to the running
    // sessions widget in the sidebar.
    app.shell.add(codeSnippetWidget, 'left', { rank: 900 });
    // open code Snippet Editor
    const openCodeSnippetEditor = (args) => {
        // codeSnippetEditors are in the main area
        const widgetId = `jp-codeSnippet-editor-${args.id}`;
        // when the editor is already open
        const openEditor = (0,_lumino_algorithm__WEBPACK_IMPORTED_MODULE_5__.find)(app.shell.widgets('main'), (widget, _) => {
            return widget.id === widgetId;
        });
        if (openEditor) {
            app.shell.activateById(widgetId);
            return;
        }
        const codeSnippetEditor = new _CodeSnippetEditor__WEBPACK_IMPORTED_MODULE_11__.CodeSnippetEditor(editorServices, tracker, codeSnippetWidget, args);
        codeSnippetEditor.id = widgetId;
        codeSnippetEditor.addClass(widgetId);
        codeSnippetEditor.title.label =
            args.name === ''
                ? 'New Code Snippet'
                : '[' + args.language + '] ' + args.name;
        codeSnippetEditor.title.closable = true;
        codeSnippetEditor.title.icon = editorIcon;
        if (!tracker.has(codeSnippetEditor)) {
            tracker.add(codeSnippetEditor);
        }
        if (!codeSnippetEditor.isAttached) {
            app.shell.add(codeSnippetEditor, 'main', {
                mode: 'tab-after',
            });
        }
        // Activate the code Snippet Editor
        app.shell.activateById(codeSnippetEditor.id);
    };
    const editorSaveCommand = 'jp-codeSnippet-editor:save';
    app.commands.addCommand(editorSaveCommand, {
        execute: () => {
            const editor = tracker.currentWidget;
            editor.updateSnippet();
        },
    });
    // Add keybinding to save
    app.commands.addKeyBinding({
        command: editorSaveCommand,
        args: {},
        keys: ['Accel S'],
        selector: '.jp-codeSnippet-editor',
    });
    const editorCommand = 'jp-codeSnippet-editor:open';
    app.commands.addCommand(editorCommand, {
        execute: (args) => {
            openCodeSnippetEditor(args);
        },
    });
    // Add an application command
    const saveCommand = 'codeSnippet:save-as-snippet';
    const toggled = false;
    app.commands.addCommand(saveCommand, {
        label: 'Save As Code Snippet',
        isEnabled: () => true,
        isVisible: () => true,
        isToggled: () => toggled,
        iconClass: 'some-css-icon-class',
        execute: () => {
            let language = '';
            // get the language of document or notebook
            if (app.shell.currentWidget instanceof _jupyterlab_notebook__WEBPACK_IMPORTED_MODULE_6__.NotebookPanel) {
                language = app.shell.currentWidget.sessionContext
                    .kernelPreference.language;
            }
            else if (app.shell.currentWidget instanceof _jupyterlab_docregistry__WEBPACK_IMPORTED_MODULE_7__.DocumentWidget) {
                language = app.shell.currentWidget.context.model
                    .defaultKernelLanguage;
            }
            const highlightedCode = getSelectedText();
            if (highlightedCode === '') {
                //if user just right-clicks cell(s) to save
                const curr = document.getElementsByClassName('jp-Cell jp-mod-selected');
                let code = '';
                // changed i = 1 to i = 0.
                for (let i = 0; i < curr.length; i++) {
                    //loop through each cell
                    const text = curr[i];
                    const cellInputWrappers = text.getElementsByClassName('jp-Cell-inputWrapper');
                    for (const cellInputWrapper of cellInputWrappers) {
                        const codeLines = cellInputWrapper.querySelectorAll('.CodeMirror-line');
                        for (const codeLine of codeLines) {
                            let codeLineText = codeLine.textContent;
                            if (codeLineText.charCodeAt(0) === 8203) {
                                //check if first char in line is invalid
                                codeLineText = ''; //replace invalid line with empty string
                            }
                            code += codeLineText + '\n';
                        }
                    }
                }
                (0,_CodeSnippetInputDialog__WEBPACK_IMPORTED_MODULE_12__.CodeSnippetInputDialog)(codeSnippetWidget, code, language, codeSnippetWidget.codeSnippetManager.snippets.length);
            }
            else {
                (0,_CodeSnippetInputDialog__WEBPACK_IMPORTED_MODULE_12__.CodeSnippetInputDialog)(codeSnippetWidget, highlightedCode, language, codeSnippetWidget.codeSnippetManager.snippets.length);
            }
        },
    });
    // Put the saveCommand above in context menu
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.jp-Notebook',
        rank: 13,
    });
    app.contextMenu.addItem({
        command: saveCommand,
        selector: '.jp-Notebook',
        rank: 14,
    });
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.jp-Notebook',
        rank: 15,
    });
    // Put the saveCommand in non-notebook file context menu
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.jp-FileEditor',
        rank: 7,
    });
    app.contextMenu.addItem({
        command: saveCommand,
        selector: '.jp-FileEditor',
        rank: 8,
    });
    app.contextMenu.addItem({
        type: 'separator',
        selector: '.jp-FileEditor',
        rank: 9,
    });
    // Track and restore the widget state
    const tracker = new _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_1__.WidgetTracker({
        namespace: 'codeSnippetEditor',
    });
    restorer.restore(tracker, {
        command: editorCommand,
        args: (widget) => {
            const editorMetadata = widget.codeSnippetEditorMetadata;
            return {
                name: editorMetadata.name,
                description: editorMetadata.description,
                language: editorMetadata.language,
                code: editorMetadata.code,
                id: editorMetadata.id,
                tags: editorMetadata.tags,
                allSnippetTags: editorMetadata.allSnippetTags,
                allLangTags: editorMetadata.allLangTags,
                fromScratch: editorMetadata.fromScratch,
            };
        },
        name: (widget) => {
            return widget.id;
        },
    });
}
const codeSnippetExtensionSetting = {
    id: CODE_SNIPPET_SETTING_ID,
    autoStart: true,
    requires: [_jupyterlab_settingregistry__WEBPACK_IMPORTED_MODULE_2__.ISettingRegistry],
    activate: (app, settingRegistry) => {
        void settingRegistry
            .load(CODE_SNIPPET_SETTING_ID)
            .then((settings) => {
            _CodeSnippetService__WEBPACK_IMPORTED_MODULE_13__.CodeSnippetService.init(settings, app);
            console.log('JupyterLab extension jupyterlab-code-snippets setting is activated!');
        })
            .catch((e) => console.log(e));
    },
};
function getSelectedText() {
    let selectedText;
    // window.getSelection
    if (window.getSelection) {
        selectedText = window.getSelection();
    }
    // document.getSelection
    else if (document.getSelection) {
        selectedText = document.getSelection();
    }
    return selectedText.toString();
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([code_snippet_extension, codeSnippetExtensionSetting]);


/***/ }),

/***/ "./style/icon/jupyter_checkmark.svg":
/*!******************************************!*\
  !*** ./style/icon/jupyter_checkmark.svg ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"20\" height=\"20\" viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z\" fill=\"#388E3C\"/>\n</svg>\n");

/***/ }),

/***/ "./style/icon/jupyter_moreicon.svg":
/*!*****************************************!*\
  !*** ./style/icon/jupyter_moreicon.svg ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6 10C4.9 10 4 10.9 4 12C4 13.1 4.9 14 6 14C7.1 14 8 13.1 8 12C8 10.9 7.1 10 6 10ZM18 10C16.9 10 16 10.9 16 12C16 13.1 16.9 14 18 14C19.1 14 20 13.1 20 12C20 10.9 19.1 10 18 10ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z\" fill=\"#616161\"/>\n</svg>\n");

/***/ }),

/***/ "./style/icon/jupyter_snippeteditoricon.svg":
/*!**************************************************!*\
  !*** ./style/icon/jupyter_snippeteditoricon.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"13\" height=\"13\" viewBox=\"0 0 13 13\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<rect x=\"0.5\" y=\"0.5\" width=\"12\" height=\"12\" fill=\"white\" stroke=\"#0097A7\"/>\n<path d=\"M6.79894 3.5L7.45729 3.63333L6.20106 9.5L5.54271 9.36667L6.79894 3.5ZM9.04942 6.5L7.84357 5.30333V4.36L10 6.5L7.84357 8.63667V7.69333L9.04942 6.5ZM3 6.5L5.15643 4.36V5.30333L3.95058 6.5L5.15643 7.69333V8.63667L3 6.5Z\" fill=\"#0097A7\"/>\n</svg>\n");

/***/ }),

/***/ "./style/icon/jupyter_snippeticon.svg":
/*!********************************************!*\
  !*** ./style/icon/jupyter_snippeticon.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"22\" height=\"18\" viewBox=\"0 0 22 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n<path class=\"jp-icon3\" d=\"M11.89 0L13.85 0.4L10.11 18L8.14996 17.6L11.89 0ZM18.59 9L15 5.41V2.58L21.42 9L15 15.41V12.58L18.59 9ZM0.579956 9L6.99996 2.58V5.41L3.40996 9L6.99996 12.58V15.41L0.579956 9Z\" fill=\"#616161\"/>\n</svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/babel.svg":
/*!*********************************************!*\
  !*** ./style/icon/language_icons/babel.svg ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m18.23 11.21c-.03-.16-.47-.71-1.32-1.65-.02-.19.29-.45.9-.8l1.74-1.55c.39-.5.62-1.28.69-2.38l-.02-.26c-.07-.78-.63-1.4-1.69-1.89-.63-.42-1.76-.65-3.38-.68-1.35.11-3.11.59-5.28 1.43-.6.43-1.28.86-2.04 1.28l.01.14.21-.08c.08-.01.13.03.14.11l.13-.07.07-.01.01.06c0 .07-.47.44-1.76 1.35l-.06.12c-.31.02-.61.25-.91.67l.08.12.25-.09.18.24c.32-.33.66-.62 1.03-.87.19.05.29.11.44.16 1.02-.75 2.03-1.3 3.04-1.64l.01.14c-.2.27-.32.42-.38.42l.1.23c.01.19-2.55 7-6.66 14.44l.08.19c.35-.08.58-.17.75-.26l.01.13.4-.03-.67 1.76.14.06c.57-.64 1-1.29 1.3-1.88 1.67-.49 2.94-.97 3.82-1.44.88-.08 1.56-.31 2.02-.7l.92-.47c1.27-.98 2.22-1.67 2.87-2.08 1.33-.98 2.2-1.93 2.6-2.85l.23-1.37m-3.46 2.31-1.77 1.39c-1.29.85-2 1.3-2.09 1.3-2.07 1.13-3.36 1.72-3.86 1.76l-.05.01c.04-.23.96-2.12 2.75-5.67.78-.06 2.02-.43 3.71-1.1l.41-.03c.85-.08 1.49.09 1.91.49l.03.26c-.31.9-.67 1.44-1.04 1.59m1.09-5.78c-.18.22-.68.59-1.5 1.11-.27.03-1.27.42-3.01 1.18l-.28-.05-.01-.12c-.02-.25.09-.57.34-.95.13-.7.28-1.12.44-1.2l1.45-3.28c-.02-.22.29-.35.93-.46l.21-.02.01.18 1.16-.16c1.15-.1 1.75.14 1.8.7l.13-.02-.03-.32.15-.02c.35.19.52.4.54.68.02.18-.08.41-.29.68-.09.01-.14-.06-.15-.18l-.14.01-.03.4c-.58.87-1.01 1.31-1.27 1.34z\" style=\"fill:#fdd835\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/c.svg":
/*!*****************************************!*\
  !*** ./style/icon/language_icons/c.svg ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m16.45 15.97.42 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96-1.14-1.27-1.68-2.88-1.68-4.83.04-2.31.72-4.08 2.04-5.32 1.28-1.25 2.92-1.89 4.9-1.89.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.6 2.49-1.04-.34c-.4-.1-.87-.15-1.4-.15-1.15-.01-2.11.36-2.86 1.1-.76.73-1.14 1.85-1.18 3.34.01 1.36.37 2.42 1.08 3.2.71.77 1.7 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.09-.32z\" style=\"fill:#0277bd\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/clojure.svg":
/*!***********************************************!*\
  !*** ./style/icon/language_icons/clojure.svg ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"matrix(.94843 0 0 .94843 6.4961 6.3946)\"><g><path d=\"m123.32 130.3c-1.15 2.492-2.419 5.292-3.733 8.272-4.645 10.524-9.789 23.33-11.668 31.534-.675 2.922-1.093 6.543-1.085 10.558 0 1.588.085 3.257.22 4.957 6.567 2.413 13.66 3.74 21.067 3.753 6.743-.013 13.221-1.127 19.284-3.143-1.425-1.303-2.785-2.692-4.023-4.257-8.22-10.482-12.806-25.844-20.062-51.674\" style=\"fill:#64dd17\"/><path d=\"m92.97 78.225c-15.699 11.064-25.972 29.312-26.011 49.992.039 20.371 10.003 38.383 25.307 49.493 3.754-15.637 13.164-29.955 27.275-58.655-.838-2.302-1.793-4.822-2.862-7.469-3.909-9.806-9.551-21.194-14.586-26.351-2.567-2.694-5.682-5.022-9.123-7.01\" style=\"fill:#64dd17\"/><path d=\"m181.39 198.37c-8.1-1.015-14.785-2.24-20.633-4.303-9.836 4.884-20.913 7.643-32.642 7.643-40.584 0-73.483-32.894-73.488-73.49 0-22.027 9.704-41.773 25.056-55.24-4.106-.992-8.388-1.571-12.762-1.563-21.562.203-44.323 12.136-53.799 44.363-.886 4.691-.675 8.238-.675 12.442 0 63.885 51.791 115.68 115.67 115.68 39.122 0 73.682-19.439 94.611-49.169-11.32 2.821-22.206 4.17-31.528 4.199-3.494 0-6.774-.187-9.811-.558\" style=\"fill:#7cb342\"/><path d=\"m159.66 175.95c.714.354 2.333.932 4.586 1.571 15.157-11.127 25.007-29.05 25.046-49.307h-.006c-.057-33.771-27.386-61.096-61.165-61.163-6.714.013-13.164 1.121-19.203 3.122 12.419 14.156 18.391 34.386 24.168 56.515.003.01.008.018.01.026.011.018 1.848 6.145 5.002 14.274 3.132 8.118 7.594 18.168 12.46 25.492 3.195 4.908 6.709 8.435 9.102 9.47\" style=\"fill:#29b6f6\"/><path d=\"m128.12 12.541c-38.744 0-73.016 19.073-94.008 48.318 10.925-6.842 22.08-9.31 31.815-9.222 13.446.039 24.017 4.208 29.089 7.06 1.225.706 2.388 1.466 3.527 2.247 9.05-3.986 19.05-6.215 29.574-6.215 40.589.005 73.493 32.899 73.499 73.488h-.006c0 20.464-8.37 38.967-21.863 52.291 3.312.371 6.844.602 10.451.584 12.811.006 26.658-2.821 37.039-11.552 6.769-5.702 12.44-14.051 15.585-26.569.615-4.835.969-9.75.969-14.752 0-63.882-51.786-115.68-115.67-115.68\" style=\"fill:#1e88e5\"/></g></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/coconut.svg":
/*!***********************************************!*\
  !*** ./style/icon/language_icons/coconut.svg ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m8.0417 3.0359c-.28774.078252-.56654.16598-.73703.23713-.52668.21982-.98314.49155-1.3848.82444-.12441.10311-.24788.19883-.27468.21042-.12652.054729-.70093.65437-1.0071 1.0516-1.7319 2.2465-2.4417 5.5125-1.8599 8.565.075453.39591.33846 1.362.46441 1.7055.76461 2.0854 2.1369 3.7186 3.9283 4.6731 1.4125.75259 3.0843 1.0604 4.8224.88717.34798-.03467.52376-.06278 1.0844-.16574.23343-.04287 1.3817-.38454 1.6589-.49424 2.3921-.94675 4.3656-2.5822 5.5722-4.6185.50665-.85507.79584-1.6685 1.0291-2.8814.36994-1.9236-.5021-4.2624-2.3238-6.2294-2.6435-2.8542-6.788-4.4585-10.181-3.9422-.20701.031508-.50408.098905-.79182.17716zm.4205 1.5069c.27995-.075961.57525-.13864.81289-.1667.65238-.077031 1.3037-.069092 1.9943.023737 3.131.42089 6.308 2.4879 7.8054 5.0768.49823.8614.78835 1.7899.80342 2.5787.01211.63417-.129 1.1793-.43165 1.6782-.15489.25532-.3045.43314-.54842.6473-.61288.53812-1.4549.87659-2.5016 1.0051-.54773.06723-.91934.20565-1.2289.46014-.06823.05609-.64296.58818-1.2792 1.1823-1.2482 1.1656-1.2374 1.1562-1.4202 1.1033-.04719-.01365-.11537-.05265-.15105-.08639-.12965-.12259-.12528-.1612.07962-1.2241.1048-.5436.18866-1.0528.18768-1.132-.0034-.27051-.11283-.54687-.29759-.75093-.11288-.12462-.29934-.24365-.54652-.34914-2.3593-1.0069-4.3434-2.7757-5.2958-4.7217-.2041-.41706-.29285-.65253-.41172-1.0883-.28952-1.0613-.22-1.9129.21878-2.683.32221-.56549.77766-.96396 1.4876-1.3018.17803-.084725.44303-.17557.72299-.25153z\" style=\"fill:#8d6e63;stroke-width:.023397\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/coffeescript.svg":
/*!****************************************************!*\
  !*** ./style/icon/language_icons/coffeescript.svg ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m2 21h18v-2h-18m18-11h-2v-3h2m0-2h-16v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4 -4v-3h2a2 2 0 0 0 2 -2v-3c0-1.11-.9-2-2-2z\" fill=\"#42a5f5\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/cpp.svg":
/*!*******************************************!*\
  !*** ./style/icon/language_icons/cpp.svg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m10 15.97.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96-1.12-1.27-1.68-2.88-1.68-4.83.05-2.31.72-4.08 2-5.32 1.32-1.25 2.96-1.89 4.94-1.89.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.06-.34c-.4-.1-.86-.15-1.39-.15-1.16-.01-2.12.36-2.87 1.1-.76.73-1.15 1.85-1.18 3.34 0 1.36.37 2.42 1.08 3.2.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32m.5-4.97h2v-2h2v2h2v2h-2v2h-2v-2h-2v-2m7 0h2v-2h2v2h2v2h-2v2h-2v-2h-2z\" style=\"fill:#0277bd\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/csharp.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/csharp.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m11.5 15.97l.41 2.44c-.26.14-.68.27-1.24.39-.57.13-1.24.2-2.01.2-2.21-.04-3.87-.7-4.98-1.96-1.12-1.27-1.68-2.88-1.68-4.83.05-2.31.72-4.08 2-5.32 1.32-1.25 2.96-1.89 4.94-1.89.75 0 1.4.07 1.94.19s.94.25 1.2.4l-.58 2.49-1.06-.34c-.4-.1-.86-.15-1.39-.15-1.16-.01-2.12.36-2.87 1.1-.76.73-1.15 1.85-1.18 3.34 0 1.36.37 2.42 1.08 3.2.71.77 1.71 1.17 2.99 1.18l1.33-.12c.43-.08.79-.19 1.1-.32m2.39 3.03l.61-4h-1.5l.34-2h1.5l.32-2h-1.5l.34-2h1.5l.61-4h2l-.61 4h1l.61-4h2l-.61 4h1.5l-.34 2h-1.5l-.32 2h1.5l-.34 2h-1.5l-.61 4h-2l.61-4h-1l-.61 4h-2m2.95-6h1l.32-2h-1l-.32 2z\" fill=\"#0277bd\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/erlang.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/erlang.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 30 30\" xmlns=\"http://www.w3.org/2000/svg\">\n<g transform=\"translate(0,-267)\">\n<path d=\"m5.2074 271.33c-.047558.0515-.096794.10075-.14366.15316-2.3762 2.6622-3.5642 6.2773-3.5642 10.846 0 4.4183 1.1557 7.8618 3.4591 10.339h19.415c2.5529-1.1508 4.1269-3.43 4.1269-3.43l-3.1468-2.52-1.4538 1.382c-.8666.77235-.84504.93111-2.3146 1.7796-1.4956.67375-3.0405.96588-4.6339.96588-2.5159 0-4.4233-.90829-5.7232-2.0586-1.2859-1.1503-1.9849-4.5111-2.0967-6.6803l17.458.0672-.18252-1.4722s-.84698-7.1283-2.5413-9.3717zm8.7593.84595c1.5655 0 3.2206.53467 3.9614 1.4714.7408.93668.93123 1.667.97316 3.5239h-9.7914c.11182-1.9555.43618-2.8104 1.3727-3.6978.93649-.88737 2.0305-1.2975 3.4841-1.2975z\" fill=\"#f44336\"/>\n</g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/forth.svg":
/*!*********************************************!*\
  !*** ./style/icon/language_icons/forth.svg ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"256\" height=\"256\" version=\"1.1\" viewBox=\"0 0 67.733 67.733\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:osb=\"http://www.openswatchbook.org/uri/2009/osb\">\n <path d=\"m10.321 12.006c-0.21038 0-0.37976 0.1735-0.37976 0.3892v12.63c0 0.2157 0.16938 0.38961 0.37976 0.38961h16.925c0.21038 0 0.37976-0.17391 0.37976-0.38961v-12.63c0-0.2157-0.16938-0.3892-0.37976-0.3892zm30.167 0c-0.21038 0-0.37976 0.1735-0.37976 0.3892v12.63c0 0.2157 0.16938 0.38961 0.37976 0.38961h16.925c0.21038 0 0.37976-0.17391 0.37976-0.38961v-12.63c0-0.2157-0.16938-0.3892-0.37976-0.3892zm-30.167 22.322c-0.21038 0-0.37976 0.1735-0.37976 0.3892v12.63c0 0.2157 0.16938 0.38961 0.37976 0.38961h16.925c0.21038 0 0.37976-0.17391 0.37976-0.38961v-12.63c0-0.2157-0.16938-0.3892-0.37976-0.3892zm30.167 0c-0.21038 0-0.37976 0.1735-0.37976 0.3892v12.63c0 0.2157 0.16938 0.38961 0.37976 0.38961h4.0525v4.3514h-4.0308c-0.20757 0-0.37483 0.16726-0.37483 0.37483v2.8898c0 0.20757 0.16726 0.37442 0.37483 0.37442h8.3029c0.20758 0 0.37442-0.16685 0.37442-0.37442v-4.135h3.7976c0.20757 0 0.37442-0.16726 0.37442-0.37483v-3.1062h4.0542c0.21038 0 0.37976-0.17391 0.37976-0.38961v-12.63c0-0.2157-0.16938-0.3892-0.37976-0.3892z\" fill=\"#ef5350\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/fortran.svg":
/*!***********************************************!*\
  !*** ./style/icon/language_icons/fortran.svg ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg id=\"svg\" version=\"1.1\" viewBox=\"0 0 16 16\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(3.2316e-7 1.1732e-6)\" style=\"fill:#ff7043\" aria-label=\"F\"><path d=\"m12.564 5.0924h-.61515q-.17224-.64796-.72177-1.3861-.54133-.73818-1.0417-.812-.25426-.032808-.60695-.049212-.34448-.016404-.78739-.016404h-1.9521v4.6751h1.3369q.60695 0 .94323-.12303.33628-.13123.57414-.3937.16404-.18044.29527-.55774.13943-.38549.18044-.8202h.62335v4.5685h-.62335q-.024606-.36089-.17224-.8202-.13943-.45931-.30347-.66436-.24606-.30347-.62335-.4101-.36909-.11483-.89402-.11483h-1.3369v4.0108q0 .27067.10663.48392.10663.21325.37729.34448.12303.05741.53313.13943.4101.08202.62335.09022v.58234h-5.0442v-.58234q.24606-.0164.65616-.04921.4101-.04101.53313-.09842.24606-.10663.35269-.31168.11483-.21325.11483-.50852v-8.3988q0-.27067-.090222-.47572-.090222-.21325-.37729-.34448-.22145-.10663-.59874-.18865-.36909-.08202-.59054-.098424v-.58234h9.1288z\" style=\"fill:#ff7043;stroke-width:1.1453\"/></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/fsharp.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/fsharp.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"533.33\" height=\"533.33\" version=\"1.1\" viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\">\n<g transform=\"translate(.3386 -.59284)\">\n<path d=\"m235.91 36.659-213.94 213.94 213.94 213.94v-84.361l-129.7-129.7 129.7-129.7z\" fill=\"#378bba\"/>\n<path d=\"m235.91 156.61-93.622 93.62 93.622 93.622z\" fill=\"#378bba\"/>\n<path d=\"m263.42 36.64 213.94 213.94-213.94 213.94v-84.361l129.7-129.7-129.7-129.7z\" fill=\"#30b9db\"/>\n</g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/go.svg":
/*!******************************************!*\
  !*** ./style/icon/language_icons/go.svg ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 300 300\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><style type=\"text/css\">\n\t.st0{fill:#2DBCAF;}\n\t.st1{fill:#5DC9E1;}\n\t.st2{fill:#FDDD00;}\n\t.st3{fill:#CE3262;}\n\t.st4{fill:#00ACD7;}\n\t.st5{fill:#FFFFFF;}\n</style><g transform=\"matrix(1.4595 0 0 1.4595 -35.938 -9.1601)\" style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><path class=\"st4\" d=\"m40.2 101.1c-.4 0-.5-.2-.3-.5l2.1-2.7c.2-.3.7-.5 1.1-.5h35.7c.4 0 .5.3.3.6l-1.7 2.6c-.2.3-.7.6-1 .6z\" style=\"fill:#00acc1\"/></g></g></g><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><path class=\"st4\" d=\"m25.1 110.3c-.4 0-.5-.2-.3-.5l2.1-2.7c.2-.3.7-.5 1.1-.5h45.6c.4 0 .6.3.5.6l-.8 2.4c-.1.4-.5.6-.9.6z\" style=\"fill:#00acc1\"/></g></g></g><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><path class=\"st4\" d=\"m49.3 119.5c-.4 0-.5-.3-.3-.6l1.4-2.5c.2-.3.6-.6 1-.6h20c.4 0 .6.3.6.7l-.2 2.4c0 .4-.4.7-.7.7z\" style=\"fill:#00acc1\"/></g></g></g><g style=\"fill:#00acc1\"><g id=\"CXHf1q_3_\" style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><g style=\"fill:#00acc1\"><path class=\"st4\" d=\"m153.1 99.3c-6.3 1.6-10.6 2.8-16.8 4.4-1.5.4-1.6.5-2.9-1-1.5-1.7-2.6-2.8-4.7-3.8-6.3-3.1-12.4-2.2-18.1 1.5-6.8 4.4-10.3 10.9-10.2 19 .1 8 5.6 14.6 13.5 15.7 6.8.9 12.5-1.5 17-6.6.9-1.1 1.7-2.3 2.7-3.7h-19.3c-2.1 0-2.6-1.3-1.9-3 1.3-3.1 3.7-8.3 5.1-10.9.3-.6 1-1.6 2.5-1.6h36.4c-.2 2.7-.2 5.4-.6 8.1-1.1 7.2-3.8 13.8-8.2 19.6-7.2 9.5-16.6 15.4-28.5 17-9.8 1.3-18.9-.6-26.9-6.6-7.4-5.6-11.6-13-12.7-22.2-1.3-10.9 1.9-20.7 8.5-29.3 7.1-9.3 16.5-15.2 28-17.3 9.4-1.7 18.4-.6 26.5 4.9 5.3 3.5 9.1 8.3 11.6 14.1.6.9.2 1.4-1 1.7z\" style=\"fill:#00acc1\"/></g><g style=\"fill:#00acc1\"><path class=\"st4\" d=\"m186.2 154.6c-9.1-.2-17.4-2.8-24.4-8.8-5.9-5.1-9.6-11.6-10.8-19.3-1.8-11.3 1.3-21.3 8.1-30.2 7.3-9.6 16.1-14.6 28-16.7 10.2-1.8 19.8-.8 28.5 5.1 7.9 5.4 12.8 12.7 14.1 22.3 1.7 13.5-2.2 24.5-11.5 33.9-6.6 6.7-14.7 10.9-24 12.8-2.7.5-5.4.6-8 .9zm23.8-40.4c-.1-1.3-.1-2.3-.3-3.3-1.8-9.9-10.9-15.5-20.4-13.3-9.3 2.1-15.3 8-17.5 17.4-1.8 7.8 2 15.7 9.2 18.9 5.5 2.4 11 2.1 16.3-.6 7.9-4.1 12.2-10.5 12.7-19.1z\" style=\"fill:#00acc1\"/></g></g></g></g></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/groovy.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/groovy.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m12 1.8809a10.119 10.119 0 0 0 -10.119 10.119 10.119 10.119 0 0 0 10.119 10.119 10.119 10.119 0 0 0 10.119 -10.119 10.119 10.119 0 0 0 -10.119 -10.119zm1.2539 2.4219c.90983 0 1.6469.2609 2.2129.7793.57129.51839.85742 1.1885.85742 2.0137 0 .88867-.31893 1.6725-.95898 2.3496-.64006.67708-1.3765 1.0156-2.207 1.0156-.48665 0-.89022-.11938-1.2129-.35742-.31738-.23804-.47656-.53174-.47656-.88086 0-.21159.05998-.39852.18164-.5625.12695-.16398.27352-.24609.4375-.24609.15869 0 .23828.092204.23828.27734 0 .16398.05998.29093.18164.38086.12166.089925.26123.13477.41992.13477.42318 0 .8287-.28866 1.2148-.86523.39144-.58187.58789-1.2021.58789-1.8633 0-.46549-.15161-.84383-.45312-1.1348-.30151-.29622-.68994-.44531-1.166-.44531-.71411 0-1.4063.31836-2.0781.95312-.6665.63477-1.2116 1.4691-1.6348 2.5059-.41789 1.0315-.62695 2.0143-.62695 2.9453 0 .85693.18441 1.5391.55469 2.0469.37028.50252.86296.75391 1.4766.75391 1.0368 0 2.0278-.73397 2.9746-2.1992l1.4922-.21289c.18514-.02645.27734.01839.27734.13476 0 .0529-.07202.27962-.21484.68164-.14282.40202-.33732 1.0741-.58594 2.0156.8199-.47607 1.4547-1.0035 1.9043-1.5801v.91406c-.3597.41789-1.0469.88843-2.0625 1.4121-.21159 1.4071-.68156 2.4928-1.4062 3.2598-.72469.7723-1.5388 1.1602-2.4434 1.1602-.43376 0-.77482-.10173-1.0234-.30274-.24333-.20101-.36523-.47762-.36523-.83203 0-.98389.95565-1.9395 2.8652-2.8652.20101-.71411.39551-1.3564.58594-1.9277-.33325.48136-.81641.90706-1.4512 1.2773-.63476.37028-1.2247.55469-1.7695.55469-.88867 0-1.6283-.38338-2.2207-1.1504-.58716-.7723-.88086-1.7481-.88086-2.9277 0-1.2431.3335-2.4204 1-3.5313.6665-1.1161 1.5406-2.0073 2.625-2.6738 1.0844-.67179 2.1348-1.0078 3.1504-1.0078zm-1.2227 12.188c-1.3753.68766-2.0625 1.3647-2.0625 2.0312 0 .35441.16927.5332.50781.5332.6665 0 1.1844-.85588 1.5547-2.5645z\" fill=\"#26c6da\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/haskell.svg":
/*!***********************************************!*\
  !*** ./style/icon/language_icons/haskell.svg ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"300\" height=\"300\" version=\"1.1\" viewBox=\"0 0 300.00001 300\" xmlns=\"http://www.w3.org/2000/svg\">\n <g stroke-width=\"2.4224\">\n  <path d=\"m23.928 240.5 59.94-89.852-59.94-89.855h44.955l59.94 89.855-59.94 89.852z\" fill=\"#ef5350\"/>\n  <path d=\"m83.869 240.5 59.94-89.852-59.94-89.855h44.955l119.88 179.71h-44.95l-37.46-56.156-37.468 56.156z\" fill=\"#ffa726\"/>\n  <path d=\"m228.72 188.08-19.98-29.953h69.93v29.956h-49.95zm-29.97-44.924-19.98-29.953h99.901v29.953z\" fill=\"#ffee58\"/>\n </g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/java.svg":
/*!********************************************!*\
  !*** ./style/icon/language_icons/java.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m2 21h18v-2h-18m18-11h-2v-3h2m0-2h-16v10a4 4 0 0 0 4 4h6a4 4 0 0 0 4 -4v-3h2a2 2 0 0 0 2 -2v-3c0-1.11-.9-2-2-2z\" fill=\"#f44336\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/javascript.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/javascript.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m3 3h18v18h-18v-18m4.73 15.04c.4.85 1.19 1.55 2.54 1.55 1.5 0 2.53-.8 2.53-2.55v-5.78h-1.7v5.74c0 .86-.35 1.08-.9 1.08-.58 0-.82-.4-1.09-.87l-1.38.83m5.98-.18c.5.98 1.51 1.73 3.09 1.73 1.6 0 2.8-.83 2.8-2.36 0-1.41-.81-2.04-2.25-2.66l-.42-.18c-.73-.31-1.04-.52-1.04-1.02 0-.41.31-.73.81-.73.48 0 .8.21 1.09.73l1.31-.87c-.55-.96-1.33-1.33-2.4-1.33-1.51 0-2.48.96-2.48 2.23 0 1.38.81 2.03 2.03 2.55l.42.18c.78.34 1.24.55 1.24 1.13 0 .48-.45.83-1.15.83-.83 0-1.31-.43-1.67-1.03l-1.38.8z\" fill=\"#ffca28\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/julia.svg":
/*!*********************************************!*\
  !*** ./style/icon/language_icons/julia.svg ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 50 50\" xmlns=\"http://www.w3.org/2000/svg\">\n<g transform=\"translate(0,-247)\">\n<g transform=\"translate(.21075 -.010315)\">\n<circle cx=\"13.497\" cy=\"281.63\" r=\"9.5549\" fill=\"#bc342d\"/>\n<circle cx=\"36.081\" cy=\"281.63\" r=\"9.5549\" fill=\"#864e9f\"/>\n<circle cx=\"24.722\" cy=\"262.39\" r=\"9.5549\" fill=\"#328a22\"/>\n</g>\n</g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/kotlin.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/kotlin.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n<defs>\n<linearGradient id=\"linearGradient4183\" x1=\"1.7253\" x2=\"22.185\" y1=\"22.67\" y2=\"1.9823\" gradientTransform=\"matrix(.89324 0 0 .89324 1.3055 1.1285)\" gradientUnits=\"userSpaceOnUse\">\n<stop stop-color=\"#0296d8\" offset=\"0\"/>\n<stop stop-color=\"#8371d9\" offset=\"1\"/>\n</linearGradient>\n<linearGradient id=\"linearGradient4206\" x1=\"1.8691\" x2=\"22.798\" y1=\"22.382\" y2=\"3.3774\" gradientTransform=\"matrix(.89324 0 0 .89324 1.323 1.1285)\" gradientUnits=\"userSpaceOnUse\">\n<stop stop-color=\"#cb55c0\" offset=\"0\"/>\n<stop stop-color=\"#f28e0e\" offset=\"1\"/>\n</linearGradient>\n</defs>\n<path d=\"m2.9751 2.976v18.048h18.05v-.02966l-4.4784-4.5116-4.4802-4.5151 4.4802-4.5151 4.4435-4.4767z\" fill=\"url(#linearGradient4183)\"/>\n<path d=\"m12.223 2.976-9.2307 9.2307v8.8173h.083741l9.0319-9.0319-.02443-.02443 4.4802-4.5151 4.4435-4.4767h-8.7841z\" fill=\"url(#linearGradient4206)\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/lisp.svg":
/*!********************************************!*\
  !*** ./style/icon/language_icons/lisp.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"24\" height=\"24\" version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n <path d=\"m12 2c-5.5166 3e-7 -10 4.4834-10 10s4.4834 10 10 10 10-4.4834 10-10-4.4834-10-10-10zm0 1.6191c4.6321 3e-7 8.3809 3.7488 8.3809 8.3809 0 3.3074-1.9159 6.1557-4.6953 7.5195-0.05691 0.0062-0.1128 0.017435-0.16992 0.021485-0.10582 0.0076-0.21226 0.009735-0.31836 0.009765-0.1499-2e-5 -0.30007-0.006514-0.44922-0.021484-0.14912-0.01496-0.29843-0.03859-0.44531-0.068359-0.14691-0.02976-0.29235-0.065096-0.43555-0.10938-0.14316-0.044309-0.28189-0.09786-0.41992-0.15625-0.13807-0.058379-0.2747-0.12149-0.40625-0.19336-0.13151-0.07184-0.25913-0.15173-0.38281-0.23633-0.1237-0.08467-0.24084-0.17489-0.35547-0.27148-0.11466-0.09657-0.22563-0.19715-0.33008-0.30469-0.10444-0.1075-0.20368-0.22244-0.29688-0.33984-0.09314-0.11741-0.18077-0.23911-0.26172-0.36523-0.080987-0.12613-0.15467-0.25508-0.22266-0.38867-0.06799-0.13356-0.12928-0.27243-0.18359-0.41211-0.054337-0.13971-0.10247-0.2794-0.14258-0.42383-0.04007-0.14445-0.072216-0.29173-0.097656-0.43945-0.02548-0.14769-0.044067-0.29581-0.054687-0.44531-0.0076-0.10582-0.011689-0.21226-0.011719-0.31836 1.9e-5 -0.1499 0.006464-0.30007 0.021484-0.44922 0.01496-0.14912 0.040543-0.29843 0.070313-0.44531 0.02976-0.14691 0.065095-0.29235 0.10938-0.43555 0.04431-0.14322 0.095907-0.2838 0.1543-0.42187 0.05838-0.13802 0.12345-0.2728 0.19531-0.4043 0.07183-0.13156 0.15173-0.25908 0.23633-0.38281 0.08466-0.1237 0.1749-0.24278 0.27148-0.35742 0.04786-0.05679 0.096841-0.11378 0.14453-0.16406s0.096681-0.10337 0.14453-0.16016c0.09659-0.11463 0.18682-0.23567 0.27148-0.35938 0.084604-0.12374 0.16253-0.25125 0.23438-0.38281 0.071868-0.1315 0.13888-0.26628 0.19726-0.4043 0.05838-0.13808 0.10803-0.27866 0.15234-0.42188 0.04429-0.14321 0.081558-0.28864 0.11133-0.43555 0.02977-0.14688 0.053409-0.29619 0.068359-0.44531 0.01498-0.14915 0.021465-0.29932 0.021485-0.44922-2.6e-5 -0.10609-0.004229-0.21058-0.011719-0.31641-0.0106-0.1495-0.029207-0.29958-0.054688-0.44727-0.025449-0.14773-0.057584-0.29305-0.097656-0.4375-0.040117-0.14443-0.08629-0.28802-0.14062-0.42773-0.054316-0.13969-0.11756-0.2766-0.18555-0.41016-0.067991-0.13359-0.14168-0.2645-0.22266-0.39062-0.080951-0.12612-0.16858-0.24782-0.26172-0.36523-0.093187-0.11739-0.19244-0.22844-0.29688-0.33594-0.10445-0.10754-0.21346-0.21202-0.32812-0.30859-0.11463-0.09659-0.23371-0.18682-0.35742-0.27148-0.12369-0.084603-0.2513-0.16058-0.38281-0.23242-0.13155-0.071871-0.26818-0.13889-0.40625-0.19727-0.13803-0.058379-0.27675-0.10803-0.41992-0.15234-0.1432-0.044284-0.28864-0.083515-0.43555-0.11328-0.14688-0.029767-0.29619-0.051448-0.44531-0.066406-0.14915-0.014986-0.29932-0.023418-0.44922-0.023438-0.078538 1.88e-5 -0.15596 0.0056309-0.23438 0.0097657 1.0982-0.52798 2.324-0.83203 3.625-0.83203zm1.5312 2.7852c0.72596 0.99434 1.3381 1.8137 1.4707 2.916 0.17547 1.459-1.6175 5.1557-2.334 6.2187h1.4648c0.51679-0.80134 1.6526-3.2498 1.9863-4.2656 0.38311 0.69597 1.2971 3.367 1.5039 4.2656h1.334c-0.50631-1.9586-1.5148-5.0413-3.9531-9.0918 0 3e-7 -0.98948-0.042969-1.4727-0.042969zm-8.5234 2.0566h1.334c0.2068 0.8986 1.1208 3.5697 1.5039 4.2656 0.3337-1.0158 1.4695-3.4643 1.9863-4.2656h1.4648c-0.7165 1.063-2.5095 4.7598-2.334 6.2188 0.1326 1.1023 0.74474 1.9217 1.4707 2.916-0.48318 0-1.4727-0.042969-1.4727-0.042969-2.4383-4.0505-3.4468-7.1332-3.9531-9.0918z\" fill=\"#ef5350\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/livescript.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/livescript.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"40mm\" height=\"40mm\" version=\"1.1\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\">\n <g transform=\"translate(0,-257)\" fill=\"#317eac\">\n  <rect x=\"5.4186\" y=\"260.18\" width=\"3.6853\" height=\"34.207\"/>\n  <rect transform=\"rotate(90)\" x=\"288.2\" y=\"-37.074\" width=\"3.6853\" height=\"34.207\"/>\n  <rect transform=\"rotate(45)\" x=\"208.79\" y=\"166.91\" width=\"2.8348\" height=\"34.207\"/>\n  <rect x=\"10.73\" y=\"262.47\" width=\"2.8348\" height=\"22.08\"/>\n  <rect x=\"15.36\" y=\"262.52\" width=\"2.8348\" height=\"17.382\"/>\n  <rect x=\"19.99\" y=\"262.47\" width=\"2.8348\" height=\"12.802\"/>\n  <rect x=\"24.526\" y=\"262.49\" width=\"2.8348\" height=\"8.2544\"/>\n  <rect x=\"28.783\" y=\"262.46\" width=\"2.8348\" height=\"5.1972\"/>\n  <rect transform=\"matrix(0,-1,-1,0,0,0)\" x=\"-286.54\" y=\"-34.801\" width=\"2.8348\" height=\"22.08\"/>\n  <rect transform=\"matrix(0,-1,-1,0,0,0)\" x=\"-281.91\" y=\"-34.753\" width=\"2.8348\" height=\"17.382\"/>\n  <rect transform=\"matrix(0,-1,-1,0,0,0)\" x=\"-277.28\" y=\"-34.801\" width=\"2.8348\" height=\"12.802\"/>\n  <rect transform=\"matrix(0,-1,-1,0,0,0)\" x=\"-272.75\" y=\"-34.781\" width=\"2.8348\" height=\"8.2544\"/>\n  <rect transform=\"matrix(0,-1,-1,0,0,0)\" x=\"-268.49\" y=\"-34.809\" width=\"2.8348\" height=\"5.1972\"/>\n </g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/lua.svg":
/*!*******************************************!*\
  !*** ./style/icon/language_icons/lua.svg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<g transform=\"translate(-.20339 -.1017)\">\n<circle cx=\"12.203\" cy=\"12.102\" r=\"10.322\" fill=\"none\" stroke=\"#42a5f5\"/>\n<path d=\"m12.33 5.7461a6.4831 6.3814 0 0 0 -6.4824 6.3809 6.4831 6.3814 0 0 0 6.4824 6.3809 6.4831 6.3814 0 0 0 6.4844 -6.3809 6.4831 6.3814 0 0 0 -6.4844 -6.3809zm1.8594 1.916a2.329 2.2925 0 0 1 2.3301 2.293 2.329 2.2925 0 0 1 -2.3301 2.291 2.329 2.2925 0 0 1 -2.3281 -2.291 2.329 2.2925 0 0 1 2.3281 -2.293z\" fill=\"#42a5f5\" fill-rule=\"evenodd\"/>\n<ellipse cx=\"19.631\" cy=\"4.6154\" rx=\"2.329\" ry=\"2.2925\" fill=\"#42a5f5\" fill-rule=\"evenodd\"/>\n</g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/markdown.svg":
/*!************************************************!*\
  !*** ./style/icon/language_icons/markdown.svg ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M2.25 15.75v-8h2l3 3 3-3h2v8h-2v-5.17l-3 3-3-3v5.17h-2m14-8h3v4h2.5l-4 4.5-4-4.5h2.5z\" fill=\"#42a5f5\"/></svg>");

/***/ }),

/***/ "./style/icon/language_icons/matlab.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/matlab.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 720 720\" xmlns=\"http://www.w3.org/2000/svg\">\n<title>Layer 1</title>\n<g fill-rule=\"evenodd\">\n<path d=\"m209.25 329.98-156.88 57.656 121.32 85.822 96.752-95.805-61.197-47.674z\" fill=\"#4db6ac\"/>\n<path d=\"m480.19 71.446c-13.123 1.784-9.5653 1.013-28.4 16.091-18.009 14.417-69.925 100.35-97.674 129.26-24.688 25.721-34.46 12.199-60.102 33.661-25.68 21.494-65.273 64.464-65.273 64.464l63.978 47.319 101.43-139.48c23.948-32.932 23.693-37.266 36.743-71.821 6.3846-16.906 17.76-29.899 27.756-45.808 12.488-19.874 30.186-34.855 21.543-33.68z\" fill=\"#00897b\"/>\n<path d=\"m478.21 69.796c-31.267-.18821-62.068 137.25-115.56 242.69-54.543 107.52-162.24 176.82-162.24 176.82 18.157 8.2431 34.682 4.9095 54.236 23.395 13.375 16.164 52.091 95.975 75.174 146.12 0 0 18.965-10.297 42.994-27.694 24.03-17.398 53.124-41.897 73.384-70.301 26.884-37.692 47.897-61.042 65.703-75.271s32.404-19.336 46.459-20.54c50.237-4.3047 124.58 85.792 124.58 85.792s-155.67-480.71-204.74-481.01z\" fill=\"#ffb74d\"/>\n</g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/nodejs.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/nodejs.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" viewBox=\"0 0 24 24\">\n    <path fill=\"#8bc34a\" d=\"m12 1.85c-.27 0-.55.07-.78.2l-7.44 4.3c-.48.28-.78.8-.78 1.36v8.58c0 .56.3 1.08.78 1.36l1.95 1.12c.95.46 1.27.47 1.71.47 1.4 0 2.21-.85 2.21-2.33v-8.47c0-.12-.1-.22-.22-.22h-.93c-.13 0-.23.1-.23.22v8.47c0 .66-.68 1.31-1.77.76l-2.05-1.17c-.07-.05-.11-.13-.11-.21v-8.58c0-.09.04-.17.11-.21l7.44-4.29c.06-.04.16-.04.22 0l7.44 4.29c.07.04.11.12.11.21v8.58c0 .08-.04.16-.11.21l-7.44 4.29c-.06.04-.16.04-.23 0l-1.88-1.14c-.08-.03-.16-.04-.21-.01-.53.3-.63.36-1.12.51-.12.04-.31.11.07.32l2.48 1.47c.24.14.5.21.78.21s.54-.07.78-.21l7.44-4.29c.48-.28.78-.8.78-1.36v-8.58c0-.56-.3-1.08-.78-1.36l-7.44-4.3c-.23-.13-.5-.2-.78-.2m2 6.15c-2.12 0-3.39.89-3.39 2.39 0 1.61 1.26 2.08 3.3 2.28 2.43.24 2.62.6 2.62 1.08 0 .83-.67 1.18-2.23 1.18-1.98 0-2.4-.49-2.55-1.47-.02-.1-.11-.18-.22-.18h-.96c-.12 0-.21.09-.21.22 0 1.24.68 2.74 3.94 2.74 2.35 0 3.7-.93 3.7-2.55 0-1.61-1.08-2.03-3.37-2.34-2.31-.3-2.54-.46-2.54-1 0-.45.2-1.05 1.91-1.05 1.5 0 2.09.33 2.32 1.36.02.1.11.17.21.17h.97c.05 0 .11-.02.15-.07.04-.04.07-.1.05-.16-.14-1.78-1.32-2.6-3.7-2.6z\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/ocaml.svg":
/*!*********************************************!*\
  !*** ./style/icon/language_icons/ocaml.svg ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"prefix__a\" x1=\"-666.97\" x2=\"-666.97\" y1=\"142.12\" y2=\"142.12\" gradientTransform=\"translate(103.96 1.86) scale(.13619)\" gradientUnits=\"userSpaceOnUse\"><stop stop-color=\"#F29100\" offset=\"0\"/><stop stop-color=\"#EC670F\" offset=\"1\"/></linearGradient></defs><path d=\"M12.019 15.021l.003-.008c-.005-.021-.006-.026-.003.008z\" fill=\"none\"/><path d=\"M4.51 3.273a2.523 2.523 0 00-2.524 2.523V11.3c.361-.13.88-.898 1.043-1.085.285-.327.337-.743.478-1.006.323-.597.379-1.009 1.113-1.009.342 0 .478.08.71.39.16.216.438.615.568.882.15.307.396.724.503.808.08.062.16.11.233.137.119.044.218-.037.297-.1.102-.082.145-.247.24-.467.135-.317.283-.697.367-.83.146-.23.195-.501.352-.633.232-.195.535-.208.618-.225.466-.092.677.225.907.43.15.133.355.403.5.765.114.283.26.544.32.707.059.158.203.41.289.713.077.275.286.486.365.616 0 0 .121.34.858.65.16.067.482.176.674.246.32.116.63.101 1.025.054.281 0 .434-.408.562-.734.075-.193.148-.745.197-.902.048-.153-.064-.27.031-.405.112-.156.178-.164.242-.368.138-.436.936-.458 1.384-.458.374 0 .327.363.96.239.364-.072.714.046 1.1.149.324.086.63.184.812.398.119.139.412.834.113.863.029.035.05.099.104.134-.067.262-.357.075-.518.041-.217-.045-.37.007-.583.101-.363.162-.894.143-1.21.407-.27.223-.269.721-.394 1 0 0-.348.895-1.106 1.443-.194.14-.574.477-1.4.605-.372.057-.719.062-1.1.043-.186-.009-.362-.018-.549-.02-.11-.002-.48-.013-.461.022l-.041.103.024.138c.015.083.019.149.022.225.006.157-.013.32-.005.478.017.328.138.627.154.958.017.368.199.758.375 1.059.067.114.169.128.213.269.052.161.003.333.028.505.1.668.292 1.366.592 1.97a.16.16 0 00.008.014c.371-.062.743-.196 1.226-.267.885-.132 2.115-.064 2.906-.138 2-.188 3.085.82 4.882.407V5.796a2.523 2.523 0 00-2.523-2.523zm-.907 11.144c-.015 0-.03 0-.046.003-.159.025-.313.08-.412.24-.08.13-.108.355-.164.505-.064.175-.176.338-.274.505-.18.305-.504.581-.644.879-.028.06-.053.13-.076.2v3.402c.163.028.333.062.524.113 1.407.375 1.75.407 3.13.25l.13-.018c.105-.22.187-.968.255-1.2.054-.178.127-.32.155-.5.026-.173-.003-.337-.017-.493-.04-.393.285-.533.44-.87.14-.304.22-.651.336-.963.11-.298.284-.721.579-.872-.036-.041-.617-.06-.772-.076a5.064 5.064 0 01-.5-.07c-.314-.064-.656-.126-.965-.2a10.15 10.15 0 01-.947-.328c-.298-.138-.503-.497-.732-.507zm5.737.83c-.74.149-.97.876-1.32 1.451-.192.319-.396.59-.548.928-.14.312-.128.657-.368.924a2.55 2.55 0 00-.528.922c-.023.067-.088.776-.158.943l1.101-.078c1.026.07.73.464 2.332.378l2.529-.078a7.127 7.127 0 00-.228-.588c-.07-.147-.16-.434-.218-.56a3.536 3.536 0 00-.309-.526c-.184-.215-.227-.23-.28-.503-.095-.473-.344-1.33-.637-1.923-.151-.306-.403-.562-.634-.784-.2-.195-.655-.522-.734-.505z\" fill=\"#ff9800\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/perl.svg":
/*!********************************************!*\
  !*** ./style/icon/language_icons/perl.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m12.5 14c-1 0-3 1-3 2 0 2 3 2 3 2v-1a1 1 0 0 1 -1 -1 1 1 0 0 1 1 -1v-1m0 5s-4-.5-4-2.5c0-3 3-3.75 4-3.75v-1.25c-1 0-5 1.5-5 4.5 0 4 5 4 5 4v-1m-1.93-11.97 1.19.53c.43-2.44 1.58-4.06 1.58-4.06-.43 1.03-.71 1.88-.89 2.55 1.21-2.5 3.66-4.05 3.66-4.05-1.18 1.18-2.05 2.46-2.64 3.53 1.58-1.68 3.77-2.78 3.77-2.78-2.69 1.72-3.9 4.45-4.2 5.21l.55.08c0 .52 0 1 .25 1.38.76 1.89 4.66 2.05 4.66 6.58s-4.03 6-6.17 6-6.83-.97-6.83-6 4.95-5.07 5.83-7.08c.12-.38-.76-1.89-.76-1.89z\" fill=\"#9575cd\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/php.svg":
/*!*******************************************!*\
  !*** ./style/icon/language_icons/php.svg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\"><svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"><path d=\"M12,18.08C5.37,18.08 0,15.36 0,12C0,8.64 5.37,5.92 12,5.92C18.63,5.92 24,8.64 24,12C24,15.36 18.63,18.08 12,18.08M6.81,10.13C7.35,10.13 7.72,10.23 7.9,10.44C8.08,10.64 8.12,11 8.03,11.47C7.93,12 7.74,12.34 7.45,12.56C7.17,12.78 6.74,12.89 6.16,12.89H5.29L5.82,10.13H6.81M3.31,15.68H4.75L5.09,13.93H6.32C6.86,13.93 7.3,13.87 7.65,13.76C8,13.64 8.32,13.45 8.61,13.18C8.85,12.96 9.04,12.72 9.19,12.45C9.34,12.19 9.45,11.89 9.5,11.57C9.66,10.79 9.55,10.18 9.17,9.75C8.78,9.31 8.18,9.1 7.35,9.1H4.59L3.31,15.68M10.56,7.35L9.28,13.93H10.7L11.44,10.16H12.58C12.94,10.16 13.18,10.22 13.29,10.34C13.4,10.46 13.42,10.68 13.36,11L12.79,13.93H14.24L14.83,10.86C14.96,10.24 14.86,9.79 14.56,9.5C14.26,9.23 13.71,9.1 12.91,9.1H11.64L12,7.35H10.56M18,10.13C18.55,10.13 18.91,10.23 19.09,10.44C19.27,10.64 19.31,11 19.22,11.47C19.12,12 18.93,12.34 18.65,12.56C18.36,12.78 17.93,12.89 17.35,12.89H16.5L17,10.13H18M14.5,15.68H15.94L16.28,13.93H17.5C18.05,13.93 18.5,13.87 18.85,13.76C19.2,13.64 19.5,13.45 19.8,13.18C20.04,12.96 20.24,12.72 20.38,12.45C20.53,12.19 20.64,11.89 20.7,11.57C20.85,10.79 20.74,10.18 20.36,9.75C20,9.31 19.37,9.1 18.54,9.1H15.79L14.5,15.68Z\" fill=\"#1E88E5\" /></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/powershell.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/powershell.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.783 4.039c.488 0 .796.398.667.885l-3.145 14.151c-.11.488-.587.886-1.075.886H2.218c-.487 0-.796-.398-.666-.886l3.144-14.15c.11-.488.587-.886 1.075-.886h16.012M15.812 15.98h-3.98a.832.832 0 0 0-.827.836c0 .467.369.845.826.845h3.981a.845.845 0 0 0 .846-.845.843.843 0 0 0-.846-.836m-10.001.278a.867.867 0 0 0-.209 1.214.884.884 0 0 0 1.234.23c7.315-5.146 7.364-5.205 7.414-5.235a.844.844 0 0 0 .279-.597.903.903 0 0 0-.16-.558L9.473 6.06a.863.863 0 0 0-1.244-.03.868.868 0 0 0-.05 1.234l4.13 4.418z\" style=\"fill:#03a9f4;stroke-width:.99517\"/></svg>");

/***/ }),

/***/ "./style/icon/language_icons/processing.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/processing.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 300 300\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><style type=\"text/css\">\n\t.st0{display:none;fill:#4CAF50;}\n\t.st1{fill:#263238;}\n\t.st2{fill:#FFFFFF;}\n</style><g transform=\"matrix(13.507 0 0 13.507 -18.982 -9.1065)\" style=\"fill:#cfd8dc\"><path class=\"st2\" d=\"m6.7 8.6h2.1 2.3v11.1c.7.1 1.4.2 2.1.3v1.2h-6.4v-1.3c.7-.1 1.4-.2 2.1-.3v-9.6c-.3 0-.7 0-1.1-.1s-.7-.1-1-.2c0-.3-.1-.7-.1-1.1z\" style=\"fill:#cfd8dc\"/><path class=\"st2\" d=\"m11.3 5.7v-2.8c.4-.1.9-.3 1.5-.4.5-.1 1.3-.2 2.2-.1.5.1 1.1.2 1.7.6.2.2.7.6 1 1.3.5 1.1.1 2.2-.1 2.6-.6 1.4-2 1.9-2.2 2 .4.1 1 .2 1.6.7 1.1.9 1.2 2.1 1.3 2.4.2 1.7-1.1 2.9-1.3 3.2-.8.8-1.6 1-2.1 1.2-.8.3-1.6.3-2.1.3v-1.6h.9c.4-.1 1.1-.2 1.8-.7.2-.2.8-.7.8-1.7 0-.2.1-1.1-.6-1.8-.4-.4-.8-.5-1.4-.7s-1.2-.2-1.5-.2v-1.4c.3 0 .7-.1 1.2-.3s1-.3 1.4-.8c.2-.2.8-.9.7-1.9 0-.2-.1-.8-.6-1.2-.5-.5-1.2-.5-1.6-.5-.6 0-1.1.2-1.3.3-.1.5-.1 1.1-.2 1.6-.3-.1-.7-.1-1.1-.1z\" style=\"fill:#cfd8dc\"/></g></svg>");

/***/ }),

/***/ "./style/icon/language_icons/prolog.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/prolog.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m12 15.385c.47397.71096 1.1088 1.295 1.862 1.6928l-1.862 1.862-1.862-1.862c.75327-.3978 1.3965-.9818 1.862-1.6928m4.2319-4.0626a1.6928 1.6928 0 0 0-1.6928 1.6928 1.6928 1.6928 0 0 0 1.6928 1.6928 1.6928 1.6928 0 0 0 1.6928-1.6928c0-.93948-.76174-1.6928-1.6928-1.6928m-8.4638 0a1.6928 1.6928 0 0 0-1.6928 1.6928 1.6928 1.6928 0 0 0 1.6928 1.6928 1.6928 1.6928 0 0 0 1.6928-1.6928c0-.93948-.76174-1.6928-1.6928-1.6928m8.4638-2.1159a3.3855 3.3855 0 0 1 3.3855 3.3855 3.3855 3.3855 0 0 1-3.3855 3.3855 3.3855 3.3855 0 0 1-3.3855-3.3855 3.3855 3.3855 0 0 1 3.3855-3.3855m-8.4638 0a3.3855 3.3855 0 0 1 3.3855 3.3855 3.3855 3.3855 0 0 1-3.3855 3.3855 3.3855 3.3855 0 0 1-3.3855-3.3855 3.3855 3.3855 0 0 1 3.3855-3.3855m-4.0287-6.5171c1.4896 3.1316.41472 5.4676-.584 7.7867-.3047.6771-.46551 1.3796-.46551 2.1159a5.0783 5.0783 0 0 0 5.0783 5.0783c.17774-.0085.35548-.01693.53322-.04232l2.5053 2.5053 1.1934 1.1765 1.1934-1.1765 2.5053-2.5053c.17774.02539.35548.03385.53322.04232a5.0783 5.0783 0 0 0 5.0783-5.0783c0-.73635-.16081-1.4388-.46551-2.1159-.99872-2.3191-2.0736-4.6551-.584-7.7867-2.2344 1.7435-5.4168 3.1231-8.2606 3.1316-2.8438-.00846-6.0262-1.3881-8.2606-3.1316z\" style=\"fill:#ef5350;stroke-width:.84638\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/purescript.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/purescript.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg width=\"100\" height=\"100\" enable-background=\"new 0 0 821.326 907.827\" version=\"1.1\" viewBox=\"0 0 100 99.999997\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(.1933 -.1)\" fill=\"#42a5f5\"><path d=\"m98.079 38.548-18.858-18.868-5.0864 5.0876 16.313 16.322-16.313 16.321 5.0864 5.0864 18.858-18.861c.67928-.68168 1.0547-1.5874 1.0547-2.5491-.003-.96174-.37659-1.8627-1.0547-2.5396\" clip-path=\"url(#SVGID_2_)\" stroke-width=\"1.1917\"/><path d=\"m25.483 42.794-5.0888-5.0888-18.865 18.863c-.67691.67691-1.0511 1.5826-1.0487 2.5444 0 .96174.37182 1.8639 1.0487 2.542l18.865 18.865 5.0888-5.0864-16.321-16.321z\" clip-path=\"url(#SVGID_2_)\" stroke-width=\"1.1917\"/><polygon transform=\"matrix(1.1917 0 0 1.1917 -306.84 -629.05)\" points=\"316.68 557.77 310.22 551.74 281.84 551.74 288.3 557.77\" clip-path=\"url(#SVGID_2_)\"/><polygon transform=\"matrix(1.1917 0 0 1.1917 -306.84 -629.05)\" points=\"310.22 572.9 316.68 566.86 288.3 566.86 281.84 572.9\" clip-path=\"url(#SVGID_2_)\"/><polygon transform=\"matrix(1.1917 0 0 1.1917 -306.84 -629.05)\" points=\"316.68 588.02 310.22 581.98 281.84 581.98 288.3 588.02\" clip-path=\"url(#SVGID_2_)\"/></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/qsharp.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/qsharp.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(.40625)\"><g transform=\"translate(-.6031 .86453)\"><g transform=\"translate(.066291)\"><g transform=\"translate(-.13258)\" style=\"fill:#fbc02d\" aria-label=\"Q\"><path d=\"m12.201 15.549c.89923-1.1011 1.4681-2.9363 1.4681-4.7347 0-1.9636-.69736-3.8539-1.8719-5.1201-1.1562-1.2479-2.661-1.8535-4.5696-1.8535s-3.4134.60561-4.5696 1.8535c-1.1745 1.2663-1.8719 3.1565-1.8719 5.1568 0 2.0003.69736 3.8906 1.8719 5.1568 1.1562 1.2479 2.6793 1.8535 4.5696 1.8535 1.3764 0 2.4041-.27528 3.4685-.91758l1.5782 1.4865 1.3947-1.4865zm-3.3951-3.2115-1.3947 1.4865 1.4131 1.3397c-.42209.22022-1.0277.34868-1.6149.34868-2.2022 0-3.6703-1.8535-3.6703-4.6613 0-2.8078 1.4681-4.6613 3.6887-4.6613 2.2389 0 3.6887 1.8352 3.6887 4.6797 0 1.1011-.20187 2.0921-.60561 2.8996z\" style=\"fill:#fbc02d;stroke-width:1.3639\"/></g><path d=\"m17.719 3.8633-.61133 4h-1.5l-.33984 2h1.5l-.32031 2h-1.5l-.33984 2h1.5l-.60938 4h2l.60938-4h1l-.60938 4h2l.60938-4h1.5l.33984-2h-1.5l.32031-2h1.5l.33984-2h-1.5l.61133-4h-2l-.61133 4h-1l.61133-4zm1.0488 6h1l-.32031 2h-1z\" style=\"fill:#fbc02d\"/></g></g></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/ruby.svg":
/*!********************************************!*\
  !*** ./style/icon/language_icons/ruby.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m18.041 3.1767c2.2391.38208 2.8789 1.9193 2.8434 3.5275v-.035542l-1.0129 13.266-13.133.89744h.00889c-1.0929-.044427-3.5187-.15105-3.6342-3.5453l1.2173-2.2214 2.4613 5.74 2.097-6.7707-.044427.0089.017771-.01777 6.8507 2.1858-1.7682-6.9129 6.5308-.40873-5.1447-4.2117 2.7101-1.5105v.00889m-14.928 14.075v.01777-.01777m3.803-10.378c2.6301-2.6212 6.0333-4.1673 7.3394-2.8434 1.2973 1.3062-.071083 4.5227-2.7012 7.1351-2.6656 2.6123-6.0155 4.2473-7.3216 2.9322-1.3062-1.3239.035542-4.6116 2.6745-7.2239z\" style=\"fill:#f44336;stroke-width:.88855\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/rust.svg":
/*!********************************************!*\
  !*** ./style/icon/language_icons/rust.svg ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 144 144\" viewbox=\"0 0 144 144\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m68.252 26.207a3.5614 3.5614 0 0 1 7.1228 0 3.5614 3.5614 0 0 1 -7.1228 0m-42.486 32.245a3.5614 3.5614 0 0 1 7.1228 0 3.5614 3.5614 0 0 1 -7.1228 0m84.97.16616a3.5614 3.5614 0 0 1 7.1228 0 3.5614 3.5614 0 0 1 -7.1228 0m-74.661 4.8792c1.6386-.72764 2.3788-2.6481 1.6512-4.2902l-1.5802-3.5729h6.2141v28.01h-12.537a43.847 43.847 0 0 1 -1.4197 -16.738zm25.994.68867v-8.2561h14.798c.7643 0 5.3971.88347 5.3971 4.3475 0 2.8762-3.5534 3.9075-6.4754 3.9075zm-20.203 44.452a3.5614 3.5614 0 0 1 7.1228 0 3.5614 3.5614 0 0 1 -7.1228 0m52.769.16615a3.5614 3.5614 0 0 1 7.1228 0 3.5614 3.5614 0 0 1 -7.1228 0m1.1012-8.0762c-1.7543-.37585-3.48.74025-3.8559 2.498l-1.7876 8.342a43.847 43.847 0 0 1 -36.566 -.17532l-1.7864-8.342c-.37585-1.7555-2.1015-2.8739-3.8547-2.4969l-7.3646 1.5813a43.847 43.847 0 0 1 -3.8078 -4.4884h35.834c.40564 0 .67607-.0733.67607-.44231v-12.676c0-.36897-.27043-.44231-.67607-.44231h-10.48v-8.0349h11.335c1.0347 0 5.5323.29564 6.9704 6.0445.45033 1.7681 1.4392 7.5193 2.1153 9.3607.67378 2.0649 3.417 6.19 6.3402 6.19h18.501a43.847 43.847 0 0 1 -4.061 4.7004zm19.898-33.468a43.847 43.847 0 0 1 .0928 7.6121h-4.4987c-.45031 0-.63138.29564-.63138.7368v2.066c0 4.8631-2.7421 5.9208-5.145 6.1901-2.2883.25782-4.8253-.95796-5.1381-2.3582-1.3499-7.5926-3.5992-9.214-7.1514-12.016 4.4082-2.7994 8.9952-6.9291 8.9952-12.457 0-5.9689-4.0919-9.7285-6.881-11.572-3.9132-2.5794-8.2458-3.0962-9.4146-3.0962h-46.526a43.847 43.847 0 0 1 24.531 -13.845l5.4842 5.7535c1.2398 1.2983 3.2933 1.3464 4.5904.10542l6.1362-5.8692a43.847 43.847 0 0 1 30.017 21.379l-4.2008 9.4879c-.72534 1.642.0149 3.5625 1.6524 4.2902zm10.477.15355-.14324-1.4667 4.3268-4.0358c.88005-.82045.55117-2.4717-.57407-2.8911l-5.5312-2.0683-.43314-1.4278 3.4502-4.7921c.70356-.974.0572-2.529-1.1276-2.7238l-5.8325-.94879-.70128-1.3097 2.451-5.3799c.50189-1.0955-.43087-2.4969-1.6363-2.451l-5.9196.20626-.93504-1.1344 1.3602-5.7661c.27502-1.1711-.91326-2.3605-2.0843-2.0855l-5.7649 1.359-1.1367-.93504.20741-5.9196c.0459-1.1986-1.3567-2.1348-2.4499-1.6375l-5.3788 2.4522-1.3097-.70242-.95108-5.8337c-.19251-1.1825-1.7486-1.8288-2.7226-1.1275l-4.7955 3.4502-1.4255-.432-2.0683-5.5323c-.41939-1.1275-2.0718-1.4518-2.8899-.57638l-4.0358 4.3303-1.4667-.14323-3.1168-5.0361c-.63023-1.0198-2.3181-1.0198-2.9461 0l-3.1168 5.0361-1.4679.14323-4.0369-4.3303c-.81816-.87545-2.4705-.55117-2.8899.57638l-2.0683 5.5323-1.4266.432-4.7944-3.4502c-.974-.70357-2.5313-.055-2.7238 1.1275l-.95108 5.8337-1.3097.70242-5.3788-2.4522c-1.0932-.4996-2.4957.43887-2.4499 1.6375l.20626 5.9196-1.1367.93504-5.7649-1.359c-1.1711-.27272-2.3605.91441-2.0855 2.0855l1.3579 5.7661-.93275 1.1344-5.9196-.20626c-1.194-.03438-2.1348 1.3556-1.6375 2.451l2.4522 5.3799-.70242 1.3097-5.8325.94879c-1.1848.19251-1.8265 1.7498-1.1275 2.7238l3.4502 4.7921-.43314 1.4278-5.5323 2.0683c-1.123.41939-1.4518 2.0706-.57409 2.8911l4.328 4.0358-.14324 1.4667-5.035 3.1168c-1.0198.63023-1.0198 2.3181 0 2.9461l5.035 3.1168.14324 1.4667-4.328 4.0369c-.87774.81816-.54888 2.4682.57409 2.8899l5.5323 2.0683.43314 1.4278-3.4502 4.7932c-.70128.97629-.05614 2.5324 1.1287 2.7226l5.8314.9488.70242 1.312-2.4522 5.3776c-.4996 1.0932.44346 2.4992 1.6375 2.451l5.9173-.2074.93504 1.1367-1.3579 5.7672c-.27501 1.1688.91441 2.3559 2.0855 2.0809l5.7649-1.3579 1.1367.93275-.20626 5.9208c-.04584 1.1986 1.3567 2.1359 2.4499 1.6363l5.3788-2.451 1.3097.70241.95108 5.8303c.19251 1.1871 1.7498 1.8288 2.7238 1.1298l4.7921-3.4525 1.4278.43428 2.0683 5.53c.41939 1.123 2.0718 1.4541 2.8899.57409l4.0369-4.328 1.4679.14667 3.1168 5.035c.62794 1.0152 2.3158 1.0176 2.9461 0l3.1168-5.035 1.4667-.14667 4.0358 4.328c.81816.88003 2.4705.54888 2.8899-.57409l2.0683-5.53 1.4278-.43428 4.7932 3.4525c.974.69899 2.5301.0551 2.7226-1.1298l.95108-5.8303 1.3097-.70241 5.3788 2.451c1.0932.49961 2.4934-.43544 2.4499-1.6363l-.20627-5.9208 1.1356-.93275 5.7649 1.3579c1.1711.27501 2.3594-.91212 2.0844-2.0809l-1.3579-5.7672.93275-1.1367 5.9196.2074c1.194.0482 2.1382-1.3579 1.6363-2.451l-2.4511-5.3776.70129-1.312 5.8325-.9488c1.1871-.19021 1.8311-1.7463 1.1275-2.7226l-3.4502-4.7932.43314-1.4278 5.5312-2.0683c1.1253-.42168 1.4541-2.0718.5741-2.8899l-4.3268-4.0369.14322-1.4667 5.035-3.1168c1.0198-.62794 1.021-2.3158.00092-2.9461z\" fill=\"#ff7043\" stroke-width=\"1.1459\"/>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/sas.svg":
/*!*******************************************!*\
  !*** ./style/icon/language_icons/sas.svg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<!-- Created with Inkscape (http://www.inkscape.org/) by Marsupilami -->\n<svg\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   version=\"1.0\"\n   width=\"1024\"\n   height=\"420\"\n   viewBox=\"0 0 129.24898 53.067852\"\n   id=\"svg2320\">\n  <defs\n     id=\"defs2322\" />\n  <g\n     transform=\"translate(-310.37551,-505.82825)\"\n     id=\"layer1\">\n    <path\n       d=\"M 18.46875,0 C 16.638866,-0.041377236 14.748438,0.1725 12.8125,0.65625 C 3.86,2.8925 -6.16125,14.40875 4.78125,27.6875 L 11.3125,35.59375 L 13.15625,37.84375 C 14.39375,39.315 16.41875,39.28875 17.90625,38.0625 C 19.40125,36.829998 19.82625,34.80875 18.59375,33.3125 C 18.592173,33.310397 18.071121,32.679752 17.84375,32.40625 L 17.875,32.40625 C 17.402936,31.838361 17.300473,31.743127 16.8125,31.15625 C 14.448752,28.313409 11.75,25.03125 11.75,25.03125 C 6.9987503,19.265 9.11875,12.14125 15.5625,8.09375 C 21.24,4.5275001 31.65875,5.80125 35.25,11.65625 C 32.988202,4.9805465 26.398246,0.17930136 18.46875,0 z M 19.78125,13.9375 C 18.937031,13.90875 18.055625,14.230625 17.3125,14.84375 C 15.815001,16.0775 15.39375,18.10125 16.625,19.59375 C 16.627499,19.597501 16.77625,19.7825 17.03125,20.09375 C 19.863614,23.496657 23.625,28.0625 23.625,28.0625 C 28.3775,33.82875 26.25625,40.92125 19.8125,44.96875 C 14.136251,48.53375 3.71625,47.2575 0.125,41.40625 C 2.90875,49.618751 12.23875,54.9875 22.5625,52.40625 C 31.5175,50.166248 41.53625,38.6825 30.59375,25.40625 L 22.9375,16.15625 L 22.0625,15.0625 C 21.44375,14.326875 20.625469,13.96625 19.78125,13.9375 z \"\n       transform=\"translate(310.37551,505.82825)\"\n       style=\"fill:#007cc2;fill-opacity:1;fill-rule:nonzero;stroke:none\"\n       id=\"path2440\" />\n    <path\n       d=\"M 53.53125,6.3125 C 47.8625,6.3125 41.374998,9.2362506 41.375,16.28125 C 41.375,22.9875 46.708752,24.869999 52,26.15625 C 57.355,27.4425 62.656249,28.187498 62.65625,32.65625 C 62.65625,37.05875 58.121251,37.875002 54.78125,37.875 C 50.3725,37.875 46.218751,36.27125 46.03125,31.125 L 40.6875,31.125 C 41,39.79375 47.161249,42.968749 54.46875,42.96875 C 61.085,42.96875 68.343749,40.27125 68.34375,31.9375 C 68.34375,25.16375 63.041251,23.25625 57.6875,21.96875 C 52.7125,20.6825 47.031249,20.00625 47.03125,15.875 C 47.03125,12.3525 50.75625,11.40625 53.96875,11.40625 C 57.49875,11.40625 61.151251,12.810001 61.53125,17.28125 L 66.875,17.28125 C 66.435,8.74625 60.712498,6.3125001 53.53125,6.3125 z M 84.40625,6.3125 C 77.159998,6.3125001 70.90625,9.3625 70.59375,18.03125 L 75.9375,18.03125 C 76.190003,12.883749 79.5275,11.40625 84.0625,11.40625 C 87.466253,11.40625 91.3125,12.20625 91.3125,17.21875 C 91.312501,21.553749 86.2975,21.155 80.375,22.375 C 74.833751,23.526251 69.34375,25.23 69.34375,33.15625 C 69.343748,40.133748 74.20125,42.96875 80.125,42.96875 C 84.656249,42.968749 88.6025,41.255 91.5625,37.53125 C 91.562499,41.322498 93.3525,42.96875 96.125,42.96875 C 97.823751,42.968749 98.9925,42.60875 99.9375,42 L 99.9375,37.53125 C 99.244997,37.802498 98.7525,37.875 98.3125,37.875 C 96.612501,37.875002 96.625,36.68 96.625,33.96875 L 96.625,15.9375 C 96.624998,7.7424996 90.265,6.3125 84.40625,6.3125 z M 112.40625,6.3125 C 106.7375,6.3125 100.25,9.2362506 100.25,16.28125 C 100.25,22.9875 105.61625,24.869999 110.90625,26.15625 C 116.2625,27.4425 121.5625,28.187498 121.5625,32.65625 C 121.5625,37.05875 117.02625,37.875002 113.6875,37.875 C 109.2775,37.875 105.125,36.27125 104.9375,31.125 L 99.5625,31.125 C 99.87625,39.79375 106.06875,42.968749 113.375,42.96875 C 119.9875,42.96875 127.21875,40.27125 127.21875,31.9375 C 127.21875,25.16375 121.91625,23.25625 116.5625,21.96875 C 111.58875,20.6825 105.9375,20.00625 105.9375,15.875 C 105.9375,12.3525 109.63125,11.40625 112.84375,11.40625 C 116.37,11.40625 120.025,12.810001 120.40625,17.28125 L 125.78125,17.28125 C 125.3425,8.74625 119.59,6.3125001 112.40625,6.3125 z M 91.25,24.0625 L 91.25,29.96875 C 91.25,33.1525 88.36875,37.875 81.3125,37.875 C 78.040002,37.875002 75,36.51375 75,32.71875 C 75.000003,28.452501 78.0375,27.115 81.5625,26.4375 C 85.15375,25.761251 89.1725,25.6875 91.25,24.0625 z M 38.21875,39.40625 C 37.088748,39.406249 36.125,40.28375 36.125,41.46875 C 36.125001,42.658749 37.08875,43.53125 38.21875,43.53125 C 39.338748,43.53125 40.28125,42.65875 40.28125,41.46875 C 40.281252,40.283749 39.33875,39.40625 38.21875,39.40625 z M 127.15625,39.40625 C 126.0225,39.406249 125.0625,40.285 125.0625,41.46875 C 125.0625,42.66 126.0225,43.53125 127.15625,43.53125 C 128.275,43.53125 129.25,42.66 129.25,41.46875 C 129.25,40.285 128.275,39.40625 127.15625,39.40625 z M 38.21875,39.75 C 39.146248,39.750002 39.875,40.49 39.875,41.46875 C 39.875,42.456249 39.14625,43.1875 38.21875,43.1875 C 37.273748,43.187501 36.53125,42.45625 36.53125,41.46875 C 36.53125,40.489999 37.27375,39.75 38.21875,39.75 z M 127.15625,39.75 C 128.08375,39.750002 128.84375,40.49125 128.84375,41.46875 C 128.84375,42.4575 128.08375,43.1875 127.15625,43.1875 C 126.21,43.187499 125.5,42.4575 125.5,41.46875 C 125.5,40.49125 126.21,39.75 127.15625,39.75 z M 37.40625,40.28125 L 37.40625,42.65625 L 37.78125,42.65625 L 37.78125,41.625 L 38.1875,41.625 L 38.8125,42.65625 L 39.21875,42.65625 L 38.53125,41.59375 C 38.88375,41.553751 39.15625,41.395 39.15625,40.96875 C 39.156251,40.49875 38.8775,40.28125 38.3125,40.28125 L 37.40625,40.28125 z M 126.375,40.28125 L 126.375,42.65625 L 126.71875,42.65625 L 126.71875,41.625 L 127.15625,41.625 L 127.78125,42.65625 L 128.1875,42.65625 L 127.5,41.59375 C 127.84625,41.554998 128.125,41.395 128.125,40.96875 C 128.125,40.49875 127.8425,40.28125 127.28125,40.28125 L 126.375,40.28125 z M 37.78125,40.59375 L 38.28125,40.59375 C 38.528749,40.593749 38.78125,40.6425 38.78125,40.9375 C 38.78125,41.300001 38.5275,41.3125 38.21875,41.3125 L 37.78125,41.3125 L 37.78125,40.59375 z M 126.71875,40.59375 L 127.21875,40.59375 C 127.47125,40.593749 127.75,40.64125 127.75,40.9375 C 127.75,41.300001 127.4625,41.3125 127.15625,41.3125 L 126.71875,41.3125 L 126.71875,40.59375 z \"\n       transform=\"translate(310.37551,505.82825)\"\n       style=\"fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none\"\n       id=\"path2448\" />\n  </g>\n</svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/sbt.svg":
/*!*******************************************!*\
  !*** ./style/icon/language_icons/sbt.svg ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<svg width=\"300\" height=\"300\" enable-background=\"new 0 0 370 160\" version=\"1.1\" viewBox=\"0 0 300 300\" xmlns=\"http://www.w3.org/2000/svg\">\n <g transform=\"translate(0,140)\">\n  <path d=\"m105.46 69.517c-7.8746 0-13.452-7.5213-13.452-15.37v-0.32702c0-7.8484 5.5778-13.735 13.452-13.735h164.05c1.4765-4.9052 2.6249-11.446 3.2811-17.986h-137.81c-7.8746 0-14.273-6.0498-14.273-13.898 0-7.8484 6.3981-13.898 14.273-13.898h137.31c-0.82027-6.5403-1.9686-13.081-3.7732-17.986h-104.01c-7.8746 0-14.273-6.0498-14.273-13.898 0-7.8484 6.3981-13.898 14.273-13.898h91.87c-21.327-37.607-60.864-61.315-106.14-61.315-67.918 0-123.04 54.448-123.04 122.3 0 67.856 55.122 123.28 123.04 123.28 46.591 0 87.112-25.507 107.95-63.114h-152.73z\" fill=\"#0277bd\" stroke-width=\"1.6378\"/>\n </g>\n</svg>");

/***/ }),

/***/ "./style/icon/language_icons/scala.svg":
/*!*********************************************!*\
  !*** ./style/icon/language_icons/scala.svg ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg enable-background=\"new 0 0 256 256\" version=\"1.1\" viewBox=\"0 0 256 256\" xml:space=\"preserve\" xmlns=\"http://www.w3.org/2000/svg\"><g transform=\"translate(-6.1456 .2445)\" fill=\"#f44336\" fill-rule=\"evenodd\"><rect transform=\"matrix(.98931 -.14586 0 1 0 0)\" x=\"60.251\" y=\"59.435\" width=\"150.71\" height=\"49.488\"/><rect transform=\"matrix(.98931 -.14586 0 1 0 0)\" x=\"60.237\" y=\"122.87\" width=\"150.71\" height=\"49.488\"/><rect transform=\"matrix(.98931 -.14586 0 1 0 0)\" x=\"60.231\" y=\"186.14\" width=\"150.71\" height=\"49.488\"/><rect transform=\"rotate(17.923)\" x=\"87.528\" y=\"67.767\" width=\"100.48\" height=\"9.2044\"/><rect transform=\"rotate(17.923)\" x=\"126.41\" y=\"23.362\" width=\"100.48\" height=\"9.2044\"/><rect transform=\"rotate(17.923)\" x=\"107.03\" y=\"128.07\" width=\"100.48\" height=\"9.2044\"/><rect transform=\"rotate(17.923)\" x=\"145.89\" y=\"83.566\" width=\"100.48\" height=\"9.2044\"/></g></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/scheme.svg":
/*!**********************************************!*\
  !*** ./style/icon/language_icons/scheme.svg ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<svg version=\"1.1\" viewBox=\"0 0 24 24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"m5.1102 21.186 4.7769-13.883-.94161-2.1933h-1.5387v-2.2966h2.2966c.48229 0 .89568.29856 1.0679.72343l6.5798 15.353h1.5387v2.2966h-2.2966c-.49377 0-.90716-.31004-1.0679-.73492l-4.2947-10.002-3.6861 10.737z\" style=\"fill:#f44336;stroke-width:1.1483\"/></svg>\n");

/***/ }),

/***/ "./style/icon/language_icons/typescript.svg":
/*!**************************************************!*\
  !*** ./style/icon/language_icons/typescript.svg ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("\n<svg clip-rule=\"evenodd\" fill-rule=\"evenodd\" stroke-linejoin=\"round\" stroke-miterlimit=\"1.414\" version=\"1.1\" viewBox=\"0 0 500 500\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"m46 46v408h408v-408h-408zm310.02 198.17v.00586c3.9124.01226 8.3586.21357 11.703.57617 13.619 1.4734 24.225 7.349 33.248 18.416 4.4934 5.5129 6.0307 7.9253 5.7031 8.957-.21108.66564-3.294 2.874-13.096 9.3809-9.6287 6.3921-12.731 8.3066-13.451 8.3066-.73045 0-2.2517-1.5657-4.4453-4.5723-4.2244-5.7892-8.5373-8.4314-15.205-9.3125-7.1704-.9496-13.602 1.3105-16.752 5.8887-2.6923 3.9112-3.099 10.206-.95899 14.779 2.4792 5.2976 6.9671 8.2262 24.166 15.768 19.836 8.6975 29.888 14.651 37.209 22.039 7.8838 7.9563 11.878 17.143 13.105 30.137.59907 6.3332-.13284 13.84-1.9453 19.943-4.4447 14.961-16.439 25.916-34.02 31.072-4.8597 1.4248-9.3818 2.276-13.855 2.6035-6.8282.50274-16.603.22572-22.486-.63086-14.884-2.1677-31.686-10.829-40.064-20.65-4.1128-4.8205-9.3633-12.754-9.3633-14.15 0-.67351.33372-1.0557 1.6562-1.8965 3.9213-2.4911 26.394-15.338 26.83-15.338.26345 0 1.4373 1.3838 2.6074 3.0742 2.6512 3.8278 9.17 10.407 12.484 12.602 2.7074 1.7928 6.1691 3.2327 10.279 4.2715 2.3539.5868 3.6002.69141 8.7363.69141 5.2475-.00176 6.3243-.0901 8.6719-.72071 6.2096-1.6713 11.057-5.1293 13.111-9.3535.90039-1.8254.91797-2.0533.91797-6.4805v-4.5898l-1.1035-2.1894c-2.6734-5.3067-8.4338-8.9474-26.645-16.836-8.3655-3.6237-18.611-8.733-22.611-11.275-9.1282-5.801-15.455-12.433-19.607-20.551-4.13-8.073-4.7459-11.078-4.7559-23.217-.01017-9.5024-.02592-9.3858 1.9414-15.451 1.785-5.5038 5.439-11.652 9.4727-15.939 8.0511-8.5582 19.813-14.058 32.406-15.152 1.6108-.15244 3.768-.21208 6.1152-.20508zm-108.36 1.877h.00391c24.253.01227 38.156.0962 38.379.23633.42036.2603.47265 2.3708.47265 15.842v15.541l-24.201.08789-24.201.08789v68.713c0 37.793-.07654 68.938-.18164 69.213-.17115.46249-2.0325.49805-17.779.49805h-17.588l-.18164-.71094c-.11745-.39011-.20308-31.536-.20508-69.213l-.00586-68.504-24.201-.08594-24.201-.08789v-15.357c0-12.18.08414-15.442.4082-15.766.333-.34334 12.684-.43187 65.902-.48437 10.261-.01034 19.495-.01477 27.58-.00977z\" fill=\"#0288d1\"/>\n</svg>");

/***/ })

}]);
//# sourceMappingURL=lib_index_js.be5d61b481146873348d.js.map