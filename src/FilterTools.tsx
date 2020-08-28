import { InputGroup, checkIcon } from '@jupyterlab/ui-components';

import React from 'react';

interface IFilterSnippetProps {
  tags: string[];
  onFilter: (searchValue: string, filterTags: string[]) => void;
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
const FILTER_SEARCHWRAPPER = 'jp-codesnippet-searchwrapper';
const FILTER_CLASS = 'jp-codeSnippet-filter';
const FILTER_BUTTON = 'jp-codeSnippet-filter-btn';

export class FilterTools extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false, selectedTags: [], searchValue: '' };
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.filterSnippets = this.filterSnippets.bind(this);
  }

  componentDidMount() {
    this.setState({ show: false, selectedTags: [], searchValue: '' });
  }

  componentDidUpdate(prevProps: IFilterSnippetProps) {
    if (prevProps !== this.props) {
      this.setState(state => ({
        selectedTags: state.selectedTags.filter(tag =>
          this.props.tags.includes(tag)
        )
      }));
    }
  }

  createFilterBox(): void {
    const filterArrow = document.querySelector(`.${FILTER_ARROW_UP}`);

    const filterOption = document.querySelector(`.${FILTER_OPTION}`);

    filterArrow.classList.toggle('idle');
    filterOption.classList.toggle('idle');
  }

  renderTags(): JSX.Element {
    return (
      <div className={FILTER_TAGS}>
        {this.props.tags.map((tag: string, index: number) =>
          this.renderTag(tag, index.toString())
        )}
      </div>
    );
  }

  renderTag(tag: string, index: string): JSX.Element {
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
      state => ({
        selectedTags: this.handleClickHelper(
          target,
          parent,
          state.selectedTags,
          clickedTag
        )
      }),
      this.filterSnippets
    );
  }

  handleClickHelper(
    target: HTMLElement,
    parent: HTMLElement,
    currentTags: string[],
    clickedTag: string
  ): string[] {
    if (parent.classList.contains('unapplied-tag')) {
      parent.classList.replace('unapplied-tag', 'applied-tag');
      const iconContainer = checkIcon.element({
        className: FILTER_CHECK,
        tag: 'span',
        elementPosition: 'center',
        height: '18px',
        width: '18px',
        marginLeft: '5px',
        marginRight: '-3px'
      });
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color1'
      );
      target.style.color = color;
      if (parent.children.length === 1) {
        parent.appendChild(iconContainer);
      }

      currentTags.splice(-1, 0, clickedTag);
    } else if (parent.classList.contains('applied-tag')) {
      parent.classList.replace('applied-tag', 'unapplied-tag');
      const color = getComputedStyle(document.documentElement).getPropertyValue(
        '--jp-ui-font-color2'
      );
      target.style.color = color;

      if (parent.children.length !== 1) {
        // remove check icon
        parent.removeChild(parent.children.item(1));
      }

      const idx = currentTags.indexOf(clickedTag);
      currentTags.splice(idx, 1);
    }
    return currentTags;
  }

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value }, this.filterSnippets);
  };

  filterSnippets(): void {
    this.props.onFilter(this.state.searchValue, this.state.selectedTags);
  }

  renderFilterOption(): JSX.Element {
    return (
      <div className={`${FILTER_OPTION} idle`}>
        <div className={FILTER_TITLE}>
          <span>cell tags</span>
        </div>
        {this.renderTags()}
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
            rightIcon="search"
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
