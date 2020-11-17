import React from 'react';
import { Widget } from '@lumino/widgets';
import { showMoreOptions } from './MoreOptions';
interface ISortSnippetProps {
  sortCategory: string;
}

const SORT_TOOL = 'jp-codeSnippet-sort-tool';
const SORT_ICON_INACTIVE = 'jp-codeSnippet-sort-icon-inactive';
const SORT_ICON_ACTIVE = 'jp-codeSnippet-sort-icon-active';
const CODE_SNIPPET_SORT_CONTENT = 'jp-codeSnippet-sort-content';
const CODE_SNIPPET_SORT_SORTBY = 'jp-codeSnippet-sort-sortby';
const CODE_SNIPPET_SORT_OPTION = 'jp-codeSnippet-sort-option';
// const CODE_SNIPPET_SORT_SELECTED = 'jp-codeSnippet-sort-selected';

/* Add on click to span and then create function to actually do the sorting*/
/* Right now the coloring of the arrows is off, make sure when dialog disappears arrow turns back to gray*/
/* Add innerHTML for the checkmark when something is clicked. When its clicked again remove the checkmark. */

class OptionsHandler extends Widget {
  constructor(display: SortTools) {
    super({ node: display.createOptionsNode() });
  }
}
export class SortTools extends React.Component {
  constructor(props: ISortSnippetProps) {
    super(props);
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
    const optionsContainer = document.createElement('div');
    optionsContainer.className = CODE_SNIPPET_SORT_CONTENT;
    const sortBy = document.createElement('div');
    sortBy.className = CODE_SNIPPET_SORT_SORTBY;
    // 4 space start
    sortBy.textContent = '    Sort by:';
    const lastMod = document.createElement('div');
    lastMod.className = CODE_SNIPPET_SORT_OPTION;
    // const checkMark = document.createElement('span');
    // checkMark.className = CODE_SNIPPET_SORT_SELECTED;
    // copySnip.appendChild(checkMark);
    lastMod.textContent = '    Last Modified';
    /*copySnip.onclick = (): void => {};*/
    const createNew = document.createElement('div');
    createNew.className = CODE_SNIPPET_SORT_OPTION;
    createNew.textContent = '    Date Created: Newest';
    /*editSnip.onclick = (): void => {};*/
    const createOld = document.createElement('div');
    createOld.className = CODE_SNIPPET_SORT_OPTION;
    createOld.textContent = '    Date Created: Oldest';
    /*deleteSnip.onclick = (): void => {};*/
    optionsContainer.appendChild(sortBy);
    optionsContainer.appendChild(lastMod);
    optionsContainer.appendChild(createNew);
    optionsContainer.appendChild(createOld);
    body.append(optionsContainer);
    return body;
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
