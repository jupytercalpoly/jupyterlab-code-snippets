import React from 'react';
import { Widget } from '@lumino/widgets';
import { showMoreOptions } from './MoreOptions';
import { checkIcon } from '@jupyterlab/ui-components';
import ReactDOMServer from 'react-dom/server';
import SortOption from './SortOption';

interface ISortSnippetProps {}

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
  optionSelected: Boolean;
  optionName: String;
  currSelected: String;
}

class OptionsHandler extends Widget {
  constructor(display: SortTools) {
    super({ node: display.createOptionsNode() });
  }
}
export class SortTools extends React.Component<
  ISortSnippetProps,
  ISortSnippetState
> {
  constructor(props: ISortSnippetProps) {
    super(props);
    this.state = {
      optionSelected: false,
      optionName: '',
      currSelected: ''
    };
    this.handleClick = this.handleClick.bind(this);
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
    body.innerHTML = ReactDOMServer.renderToStaticMarkup(
      this.createOptionsNodeHelper()
    ); //new
    // optionsContainer.className = CODE_SNIPPET_SORT_CONTENT;
    // const sortBy = document.createElement('div');
    // sortBy.className = CODE_SNIPPET_SORT_SORTBY;
    // sortBy.textContent = 'Sort by:';

    // const divider = document.createElement('div');
    // divider.className = CODE_SNIPPET_SORT_LINE;

    // let lastMod = document.createElement('div');
    // lastMod.className = CODE_SNIPPET_SORT_OPTION;
    // lastMod.textContent = 'Last Modified';
    // lastMod.onclick = (event): void => {
    //   lastMod.innerHTML = this.simple(event, optionsContainer);
    // };
    // const createNew = document.createElement('div');
    // createNew.className = CODE_SNIPPET_SORT_OPTION;
    // createNew.textContent = 'Date Created: Newest';
    // const createOld = document.createElement('div');
    // createOld.className = CODE_SNIPPET_SORT_OPTION;
    // createOld.textContent = 'Date Created: Oldest';

    // optionsContainer.appendChild(sortBy);
    // optionsContainer.appendChild(divider);
    // optionsContainer.appendChild(lastMod);
    // optionsContainer.appendChild(createNew);
    // optionsContainer.appendChild(createOld);
    // body.append(optionsContainer);
    return body;
  }

  public createOptionsNodeHelper() {
    return (
      <div className={CODE_SNIPPET_SORT_CONTENT} id={CODE_SNIPPET_SORT_CONTENT}>
        <div className={CODE_SNIPPET_SORT_SORTBY}>Sort by:</div>
        <div className={CODE_SNIPPET_SORT_LINE}></div>
        <SortOption
          optionSelected={this.state.currSelected == 'Last Modified'}
          optionName={'Last Modified'}
        ></SortOption>
        <SortOption
          optionSelected={false}
          optionName={'Date Created: Newest'}
        ></SortOption>
        <SortOption
          optionSelected={false}
          optionName={'Date Created: Oldest'}
        ></SortOption>
      </div>
    );
  }

  simple(event: MouseEvent, container: HTMLDivElement) {
    console.log(event);
    const target = event.target as HTMLElement;
    return this.createCheck(target.innerText);
  }

  createCheck(option: String) {
    //inner div, display flex
    return ReactDOMServer.renderToStaticMarkup(
      <div>
        <checkIcon.react
          className="jupyterlab-CodeSnippets-sort-selected"
          elementPosition="center"
          height="16px"
          width="16px"
          marginLeft="2px"
        />
        {option}
      </div>
    );
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
