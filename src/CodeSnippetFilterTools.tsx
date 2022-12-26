// Copyright (c) 2020, jupytercalpoly
// Distributed under the terms of the BSD-3 Clause License.

import { InputGroup, checkIcon } from '@jupyterlab/ui-components';
import React from 'react';

interface IFilterSnippetProps {
  tagDictionary: Map<string, string[]>;
  languageTags: string[]; // just lang tags
  snippetTags: string[]; // just snippet tags
  onFilter: (
    searchValue: string,
    filterTags: string[],
    selectedLangTags: string[]
  ) => void;
}

interface IFilterSnippetState {
  show: boolean;
  selectedTags: string[];
  searchValue: string;
}

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

export class FilterTools extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false, selectedTags: [], searchValue: '' }; //--> selectedTags & selectedLangTags
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderAppliedTag = this.renderAppliedTag.bind(this);
    this.renderUnappliedTag = this.renderUnappliedTag.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.filterSnippets = this.filterSnippets.bind(this);
  }

  componentDidUpdate(prevProps: IFilterSnippetProps): void {
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

  createFilterBox(): void {
    const filterArrow = document.querySelector(`.${FILTER_ARROW_UP}`);

    const filterOption = document.querySelector(`.${FILTER_OPTION}`);

    filterArrow.classList.toggle('idle');
    filterOption.classList.toggle('idle');
  }

  renderTags(tags: string[], type: string): JSX.Element {
    const selectedLanguageTags = this.state.selectedTags.filter((tag) =>
      this.props.languageTags.includes(tag)
    );
    return (
      <div className={FILTER_TAGS}>
        {tags.sort().map((tag: string, index: number) => {
          // language tags
          if (type === 'language' && this.props.languageTags.includes(tag)) {
            if (this.state.selectedTags.includes(tag)) {
              return this.renderAppliedTag(tag, index.toString());
            } else {
              return this.renderUnappliedTag(tag, index.toString());
            }
          } else if (
            // snippet tags
            type === 'snippet' &&
            !this.props.languageTags.includes(tag)
          ) {
            if (selectedLanguageTags.length !== 0) {
              // if languages are selected, only display snippet tags that have snippets in those languages
              const langsMatch = this.props.tagDictionary
                .get(tag)
                .some((r) => selectedLanguageTags.includes(r));
              if (langsMatch) {
                if (this.state.selectedTags.includes(tag)) {
                  return this.renderAppliedTag(tag, index.toString());
                } else {
                  return this.renderUnappliedTag(tag, index.toString());
                }
              }
            } else {
              if (this.state.selectedTags.includes(tag)) {
                return this.renderAppliedTag(tag, index.toString());
              } else {
                return this.renderUnappliedTag(tag, index.toString());
              }
            }
          }
        })}
      </div>
    );
  }

  renderAppliedTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={`${FILTER_TAG} tag applied-tag`}
        id={'filter' + '-' + tag + '-' + index}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button onClick={this.handleClick}>{tag}</button>
        <checkIcon.react
          className={FILTER_CHECK}
          tag="span"
          elementPosition="center"
          height="18px"
          width="18px"
          marginLeft="5px"
          marginRight="-3px"
        />
      </div>
    );
  }

  renderUnappliedTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={`${FILTER_TAG} tag unapplied-tag`}
        id={'filter' + '-' + tag + '-' + index}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button onClick={this.handleClick}>{tag}</button>
      </div>
    );
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const target = event.target as HTMLElement;
    const clickedTag = target.innerText;
    const parent = target.parentElement;

    this.setState(
      (state) => ({
        selectedTags: this.handleClickHelper(
          parent,
          state.selectedTags,
          clickedTag
        ),
      }),
      this.filterSnippets
    );
  }

  handleClickHelper(
    parent: HTMLElement,
    currentTags: string[],
    clickedTag: string
  ): string[] {
    if (parent.classList.contains('unapplied-tag')) {
      parent.classList.replace('unapplied-tag', 'applied-tag');
      currentTags.splice(-1, 0, clickedTag);
    } else if (parent.classList.contains('applied-tag')) {
      parent.classList.replace('applied-tag', 'unapplied-tag');

      const idx = currentTags.indexOf(clickedTag);
      currentTags.splice(idx, 1);
    }
    return currentTags.sort();
  }

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value }, this.filterSnippets);
  };

  filterSnippets(): void {
    this.props.onFilter(
      this.state.searchValue,
      this.state.selectedTags,
      this.state.selectedTags.filter((tag) =>
        this.props.languageTags.includes(tag)
      )
    );
  }

  renderFilterOption(): JSX.Element {
    // get all the tags together in one list
    const concatTags = this.props.snippetTags.concat(this.props.languageTags);
    return (
      <div className={`${FILTER_OPTION} idle`}>
        <div className={FILTER_TITLE}>
          <span>language tags</span>
        </div>
        {this.renderTags(concatTags, 'language')}
        <div className={FILTER_TITLE}>
          <span>snippet tags</span>
        </div>
        {this.renderTags(concatTags, 'snippet')}
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className={FILTER_TOOLS}>
        <div className={FILTER_SEARCHBAR}>
          <InputGroup
            className={FILTER_SEARCHWRAPPER}
            type="text"
            placeholder="SEARCH SNIPPETS"
            onChange={this.handleSearch}
            rightIcon="ui-components:search"
            value={this.state.searchValue}
          />
        </div>
        <div className={FILTER_CLASS}>
          <button className={FILTER_BUTTON} onClick={this.createFilterBox}>
            Filter By Tags
          </button>
          <div className={`${FILTER_ARROW_UP} idle`}></div>
          {this.renderFilterOption()}
        </div>
      </div>
    );
  }
}
