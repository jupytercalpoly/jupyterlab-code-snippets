import { InputGroup } from '@jupyterlab/ui-components';
import { checkIcon } from '@jupyterlab/ui-components';

import React from 'react';

interface IFilterSnippetProps {
  tags: string[];
  onFilter: (searchValue: string, filterTags: string[]) => void;
}

interface IFilterSnippetState {
  show: boolean;
  filteredTags: string[];
  searchValue: string;
}

export class FilterTools extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false, filteredTags: [], searchValue: '' };
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderTag = this.renderTag.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.filterSnippets = this.filterSnippets.bind(this);
    // this.searchSnippets = this.searchSnippets.bind(this);
    // this.updateValue = this.updateValue.bind(this);
  }

  createFilterBox(): void {
    // toggle filtercontainer display none ...
    // this.setState(state => ({
    //   show: !state.show
    // }));
    const filterArrow = document.querySelector(
      '.jp-codeSnippet-filter-arrow-up'
    );

    const filterOption = document.querySelector(
      '.jp-codeSnippet-filter-option'
    );

    filterArrow.classList.toggle('idle');
    filterOption.classList.toggle('idle');
  }

  renderTags(): JSX.Element {
    return (
      <div className={'jp-codeSnippet-filter-tags'}>
        {this.props.tags.map((tag: string, index: number) =>
          this.renderTag(tag, index.toString())
        )}
      </div>
    );
  }

  renderTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={'jp-codeSnippet-filter-tag tag unapplied-tag'}
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
    // const filteredTags = this.state.filteredTags.slice();

    this.setState(
      state => ({
        filteredTags: this.handleClickHelper(
          target,
          parent,
          state.filteredTags,
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
        className: 'jp-codeSnippet-filter-check',
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
    console.log(currentTags);
    return currentTags;
  }

  handleSearch = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ searchValue: event.target.value }, this.filterSnippets);
  };

  filterSnippets(): void {
    this.props.onFilter(this.state.searchValue, this.state.filteredTags);
  }

  renderFilterOption(): JSX.Element {
    return (
      <div className={'jp-codeSnippet-filter-option idle'}>
        <div className={'jp-codeSnippet-filter-title'}>
          <span>cell tags</span>
        </div>
        {this.renderTags()}
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <div className="jp-codeSnippet-filterTools">
        <div className="jp-codeSnippet-searchbar">
          <InputGroup
            className="jp-codesnippet-searchwrapper"
            type="text"
            placeholder="SEARCH SNIPPETS"
            onChange={this.handleSearch}
            rightIcon="search"
            value={this.state.searchValue}
          />
        </div>
        <div className={'jp-codeSnippet-filter'}>
          <button
            className={'jp-codeSnippet-filter-btn'}
            onClick={this.createFilterBox}
          >
            Filter
          </button>
          {/* <div className="jp-codeSnippet-filterContainer idle"> */}
          <div className="jp-codeSnippet-filter-arrow-up idle"></div>
          {this.renderFilterOption()}
        </div>
        {/* </div> */}
      </div>
    );
  }
}
