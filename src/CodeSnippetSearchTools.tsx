import React from 'react';
import { Widget } from '@lumino/widgets';
import { showMoreOptions } from './MoreOptions';

import ReactDOM from 'react-dom';
import SearchOption from './CodeSnippetSearchOption';

const SORT_TOOL = 'jp-codeSnippet-sort-tool';
const SORT_ICON_INACTIVE = 'jp-codeSnippet-sort-icon-inactive';
const SORT_ICON_ACTIVE = 'jp-codeSnippet-sort-icon-active';
const CODE_SNIPPET_SORT_CONTENT = 'jp-codeSnippet-sort-content';
const CODE_SNIPPET_SORT_SORTBY = 'jp-codeSnippet-sort-sortby';
const CODE_SNIPPET_SORT_LINE = 'jp-codeSnippet-sort-line';
// const CODE_SNIPPET_SORT_SELECTED = 'jp-codeSnippet-sort-selected';

/* Add on click to span and then create function to actually do the sorting*/
/* Right now the coloring of the arrows is off, make sure when dialog disappears arrow turns back to gray*/
/* Add innerHTML for the checkmark when something is clicked. When its clicked again remove the checkmark. */

interface ISearchSnippetState {
  optionName: string;
  currSelected: string[];
}

interface ISearchSnippetProps {
  selectedSearchOptions: string[];
  setSearchOptions: (options: string[]) => void;
}

class OptionsHandler extends Widget {
  constructor(display: SearchTools) {
    super({ node: display.createOptionsNode() });
  }
}
interface ISearchMultiState {
  currSelected: string[];
}

interface ISearchMultiProps {
  currSelected: string[];
  handleOptionClick: (options: string[]) => void;
}

// New component that holds  gets re-rendered whenever anything is changed/clicked.
export class SearchMultiOption extends React.Component<
  ISearchMultiProps,
  ISearchMultiState
> {
  constructor(props: ISearchMultiProps) {
    super(props);
    this.state = {
      currSelected: this.props.currSelected
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // duplicate code between this and parent clickhandler, potentially combine
  // STATUS: state updates are a bit weird, when unchecked, adding to state. When checked removing. Delay in update.
  handleClick(selectedOption: string, selected: boolean): void {
    if (selected) {
      // select option
      this.setState(
        state => ({
          currSelected: [...state.currSelected, selectedOption]
        }),
        () => {
          //callback
          this.props.handleOptionClick(this.state.currSelected);
        }
      );
    } else {
      // unselect option
      const array = [...this.state.currSelected];
      const index = array.indexOf(selectedOption);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState(
          {
            currSelected: array
          },
          () => {
            this.props.handleOptionClick(this.state.currSelected);
          }
        );
      }
    }
  }

  render(): JSX.Element {
    return (
      <div className={CODE_SNIPPET_SORT_CONTENT} id={CODE_SNIPPET_SORT_CONTENT}>
        <div className={CODE_SNIPPET_SORT_SORTBY}>Search by:</div>
        <div className={CODE_SNIPPET_SORT_LINE}></div>
        <SearchOption
          optionSelected={this.state.currSelected.includes('Name')}
          optionName={'Name'}
          onSelectMulti={this.handleClick}
        ></SearchOption>
        <SearchOption
          optionSelected={this.state.currSelected.includes('Language')}
          optionName={'Language'}
          onSelectMulti={this.handleClick}
        ></SearchOption>
        <SearchOption
          optionSelected={this.state.currSelected.includes('Code')}
          optionName={'Code'}
          onSelectMulti={this.handleClick}
        ></SearchOption>
      </div>
    );
  }
}

export class SearchTools extends React.Component<
  ISearchSnippetProps,
  ISearchSnippetState
> {
  constructor(props: ISearchSnippetProps) {
    super(props);
    this.state = {
      optionName: '',
      currSelected: this.props.selectedSearchOptions
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleOptionClick = this.handleOptionClick.bind(this);
  }

  private _setSortToolPosition(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ): void {
    const target = event.target as HTMLElement;
    const top = target.getBoundingClientRect().top + 30;
    const leftAsString =
      (target.getBoundingClientRect().left - 164).toString(10) + 'px';
    const topAsString = top.toString(10) + 'px';
    document.documentElement.style.setProperty(
      '--more-options-top',
      topAsString
    );
    document.documentElement.style.setProperty(
      '--more-options-left',
      leftAsString
    );
  }

  public createOptionsNode(): HTMLElement {
    const body = document.createElement('div');
    body.className = 'jp-codeSnippet-sort-test-container';
    ReactDOM.render(
      <SearchMultiOption
        currSelected={this.state.currSelected}
        handleOptionClick={this.handleOptionClick}
      />,
      body
    );
    return body;
  }

  handleOptionClick(selectedOptions: string[]): void {
    this.setState({
      currSelected: selectedOptions
    });
    this.props.setSearchOptions(selectedOptions);
  }

  handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    const target = event.target as HTMLElement;
    // const clickedTag = target.innerText;
    // const parent = target.parentElement;
    this.handleClickHelper(target);
    showMoreOptions({ body: new OptionsHandler(this) });
    this._setSortToolPosition(event);
  }

  handleClickHelper(parent: HTMLElement): void {
    if (parent.classList.contains(SORT_ICON_INACTIVE)) {
      parent.classList.replace(SORT_ICON_INACTIVE, SORT_ICON_ACTIVE);
    } else if (parent.classList.contains(SORT_ICON_ACTIVE)) {
      parent.classList.replace(SORT_ICON_ACTIVE, SORT_ICON_INACTIVE);
    }
  }

  render(): JSX.Element {
    return (
      <div className={SORT_TOOL}>
        <span className={SORT_ICON_INACTIVE} onClick={this.handleClick}></span>
      </div>
    );
  }
}
