// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { checkIcon, addIcon } from '@jupyterlab/ui-components';
import React from 'react';

export interface ITag {
  name: string;
  clicked: boolean;
}

interface ICodeSnippetEditorTagProps {
  allSnippetTags: ITag[]; // snippet tags only
  langTags: string[];
  handleChange: (tags: ITag[]) => void;
}
interface ICodeSnippetEditorTagState {
  allSnippetTags: ITag[];
  plusIconClicked: boolean;
}

/**
 * CSS STYLING
 */
const CODE_SNIPPET_EDITOR_TAG = 'jp-codeSnippet-editor-tag';
const CODE_SNIPPET_EDITOR_TAG_PLUS_ICON = 'jp-codeSnippet-editor-tag-plusIcon';
const CODE_SNIPPET_EDITOR_TAG_LIST = 'jp-codeSnippet-editor-tagList';

export class CodeSnippetEditorTags extends React.Component<
  ICodeSnippetEditorTagProps,
  ICodeSnippetEditorTagState
> {
  constructor(props: ICodeSnippetEditorTagProps) {
    super(props);
    this.state = {
      allSnippetTags: [],
      plusIconClicked: false,
    };
    this.renderTags = this.renderTags.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(): void {
    this.setState({
      allSnippetTags: this.props.allSnippetTags,
      plusIconClicked: false,
    });
  }

  componentDidUpdate(prevProps: ICodeSnippetEditorTagProps): void {
    if (prevProps !== this.props) {
      this.setState({
        allSnippetTags: this.props.allSnippetTags,
      });
    }
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const target = event.target as HTMLElement;
    const clickedTag = target.innerText;

    this.handleClickHelper(clickedTag);
  }

  handleOnChange(): void {
    this.props.handleChange(this.state.allSnippetTags);
  }

  handleClickHelper(
    // parent: HTMLElement,
    clickedTag: string
  ): void {
    this.setState(
      (state) => ({
        allSnippetTags: state.allSnippetTags.map((tag: ITag) =>
          tag.name === clickedTag ? { ...tag, clicked: !tag.clicked } : tag
        ),
      }),
      this.handleOnChange
    );
  }

  addTagOnClick(event: React.MouseEvent<HTMLInputElement>): void {
    this.setState({ plusIconClicked: true });
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.value === 'Add Tag') {
      inputElement.value = '';
      inputElement.style.width = '62px';
      inputElement.style.minWidth = '62px';
    }
  }

  addTagOnKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.value !== '' && event.key === 'Enter') {
      if (
        this.state.allSnippetTags.find(
          (tag: ITag) => tag.name === inputElement.value
        )
      ) {
        alert('Duplicate Tag Name!');
        return;
      }

      if (this.props.langTags.includes(inputElement.value)) {
        alert(
          'This tag already exists in language tags!\nIf you want to create this tag, lowercase the first letter.'
        );
        return;
      }

      const newTag = { name: inputElement.value, clicked: true };

      this.setState(
        (state) => ({
          allSnippetTags: [...state.allSnippetTags, newTag],
          plusIconClicked: false,
        }),
        this.handleOnChange
      );
    }
  }

  addTagOnBlur(event: React.FocusEvent<HTMLInputElement>): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = 'Add Tag';
    inputElement.style.width = '50px';
    inputElement.style.minWidth = '50px';
    inputElement.blur();
    this.setState({ plusIconClicked: false });
  }

  renderTags(): JSX.Element {
    const hasTags = this.state.allSnippetTags;
    const inputBox =
      this.state.plusIconClicked === true ? (
        <ul
          className={`${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag`}
          key={'editor-new-tag'}
        >
          <input
            onClick={(
              event: React.MouseEvent<HTMLInputElement, MouseEvent>
            ): void => this.addTagOnClick(event)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>): void =>
              this.addTagOnKeyDown(event)
            }
            onBlur={(event: React.FocusEvent<HTMLInputElement>): void =>
              this.addTagOnBlur(event)
            }
            autoFocus
          />
        </ul>
      ) : (
        <ul className={`${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag`}>
          <button
            onClick={(): void => this.setState({ plusIconClicked: true })}
          >
            Add Tag
          </button>
          <addIcon.react
            tag="span"
            className={CODE_SNIPPET_EDITOR_TAG_PLUS_ICON}
            elementPosition="center"
            height="16px"
            width="16px"
            marginLeft="2px"
          />
        </ul>
      );
    return (
      <li className={CODE_SNIPPET_EDITOR_TAG_LIST}>
        {hasTags
          ? this.state.allSnippetTags.map((tag: ITag, index: number) =>
              ((): JSX.Element => {
                if (!tag.clicked) {
                  return (
                    <ul
                      className={`${CODE_SNIPPET_EDITOR_TAG} tag unapplied-tag`}
                      id={'editor' + '-' + tag.name + '-' + index}
                      key={'editor' + '-' + tag.name + '-' + index}
                    >
                      <button onClick={this.handleClick}>{tag.name}</button>
                    </ul>
                  );
                } else {
                  return (
                    <ul
                      className={`${CODE_SNIPPET_EDITOR_TAG} tag applied-tag`}
                      id={'editor' + '-' + tag.name + '-' + index}
                      key={'editor' + '-' + tag.name + '-' + index}
                    >
                      <button onClick={this.handleClick}>{tag.name}</button>
                      <checkIcon.react
                        tag="span"
                        elementPosition="center"
                        height="18px"
                        width="18px"
                        marginLeft="5px"
                        marginRight="-3px"
                      />
                    </ul>
                  );
                }
              })()
            )
          : null}
        {inputBox}
      </li>
    );
  }

  render(): JSX.Element {
    return <div>{this.renderTags()}</div>;
  }
}
