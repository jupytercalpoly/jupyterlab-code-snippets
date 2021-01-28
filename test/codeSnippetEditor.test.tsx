// start testing code snippet editor
// need to include functions

import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import { CodeSnippetEditor } from '../src/CodeSnippetEditor';
// import { CodeSnippetDisplay } from '../src/CodeSnippetDisplay';
import { CodeSnippetEditorTags } from '../src/CodeSnippetEditorTags';
// import { Link } from '../src/Link';


interface ICodeSnippetEditorTagProps {
    selectedTags: string[];
    tags: string[];
    handleChange: (selectedTags: string[], allTags: string[]) => void;
};

interface ICodeSnippetEditorTagState {
    selectedTags: string[];
    tags: string[];
    plusIconShouldHide: boolean;
    addingNewTag: boolean;
};

describe('jupyterlab/codeSnippetEditor', () => {
    
})