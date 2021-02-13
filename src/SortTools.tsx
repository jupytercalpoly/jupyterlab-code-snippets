import React from 'react';
import { Widget } from '@lumino/widgets';
import { showMoreOptions } from './MoreOptions';

import ReactDOM from 'react-dom';
import SortOption from './SortOption';

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

interface ISortSnippetState {
  optionName: string;
  currSelected: string;
}

class OptionsHandler extends Widget {
  constructor(display: SortTools) {
    super({ node: display.createOptionsNode() });
  }
}
interface ISortMultiState {
  currSelected: string;
}

interface ISortMultiProps {
  currSelected: string;
  handleOptionClick: (name: string) => void;
}

// New component that holds  gets re-rendered whenever anything is changed/clicked.
export class SortMultiOption extends React.Component<
  ISortMultiProps,
  ISortMultiState
> {
  constructor(props: ISortMultiProps) {
    super(props);
    this.state = {
      currSelected: this.props.currSelected
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(selectedOption: string): void {
    this.props.handleOptionClick(selectedOption);
    this.setState({ currSelected: selectedOption });
  }

  render(): JSX.Element {
    return (
      <div className={CODE_SNIPPET_SORT_CONTENT} id={CODE_SNIPPET_SORT_CONTENT}>
        <div className={CODE_SNIPPET_SORT_SORTBY}>Sort by:</div>
        <div className={CODE_SNIPPET_SORT_LINE}></div>
        <SortOption
          optionSelected={this.state.currSelected === 'Last Modified'}
          optionName={'Last Modified'}
          onSelectMulti={this.handleClick}
          onSelectParent={this.props.handleOptionClick}
        ></SortOption>
        <SortOption
          optionSelected={this.state.currSelected === 'Date Created: Newest'}
          optionName={'Date Created: Newest'}
          onSelectMulti={this.handleClick}
          onSelectParent={this.props.handleOptionClick}
        ></SortOption>
        <SortOption
          optionSelected={this.state.currSelected === 'Date Created: Oldest'}
          optionName={'Date Created: Oldest'}
          onSelectMulti={this.handleClick}
          onSelectParent={this.props.handleOptionClick}
        ></SortOption>
      </div>
    );
  }
}

export class SortTools extends React.Component<{}, ISortSnippetState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      optionName: '',
      currSelected: ''
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
      <SortMultiOption
        currSelected={this.state.currSelected}
        handleOptionClick={this.handleOptionClick}
      />,
      body
    );
    return body;
  }

  // Converge the three sortoptions into a classful component that gets re-rendered when
  // an option gets clicked.
  // public createOptionsNodeHelper(): JSX.Element {
  //   return (
  //     <div className={CODE_SNIPPET_SORT_CONTENT} id={CODE_SNIPPET_SORT_CONTENT}>
  //       <div className={CODE_SNIPPET_SORT_SORTBY}>Sort by:</div>
  //       <div className={CODE_SNIPPET_SORT_LINE}></div>
  //       <SortOption
  //         optionSelected={this.state.currSelected === 'Last Modified'}
  //         optionName={'Last Modified'}
  //         onSelect={this.handleOptionClick}
  //       ></SortOption>
  //       <SortOption
  //         optionSelected={this.state.currSelected === 'Date Created : Newest'}
  //         optionName={'Date Created: Newest'}
  //         onSelect={this.handleOptionClick}
  //       ></SortOption>
  //       <SortOption
  //         optionSelected={this.state.currSelected === 'Date Created: Oldest'}
  //         optionName={'Date Created: Oldest'}
  //         onSelect={this.handleOptionClick}
  //       ></SortOption>
  //     </div>
  //   );
  // }

  handleOptionClick(selectedOption: string): void {
    this.setState({ currSelected: selectedOption });
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
