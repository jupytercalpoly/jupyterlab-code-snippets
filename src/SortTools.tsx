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

/* Add on click to span and then create function to actually do the sorting*/
/* Right now the coloring of the arrows is off, make sure when dialog disappears arrow turns back to gray*/

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
    const insertSnip = document.createElement('div');
    insertSnip.className = CODE_SNIPPET_SORT_SORTBY;
    // 4 space start to sortby
    insertSnip.textContent = '    Sort by:';
    /*insertSnip.onclick = (): void => {};*/
    const copySnip = document.createElement('div');
    copySnip.className = CODE_SNIPPET_SORT_OPTION;
    copySnip.textContent = '    Last Modified';
    /*copySnip.onclick = (): void => {};*/
    const editSnip = document.createElement('div');
    editSnip.className = CODE_SNIPPET_SORT_OPTION;
    editSnip.textContent = '    Date Created: Newest';
    /*editSnip.onclick = (): void => {};*/
    const deleteSnip = document.createElement('div');
    deleteSnip.className = CODE_SNIPPET_SORT_OPTION;
    deleteSnip.textContent = '    Date Created: Oldest';
    /*deleteSnip.onclick = (): void => {};*/
    optionsContainer.appendChild(insertSnip);
    optionsContainer.appendChild(copySnip);
    optionsContainer.appendChild(editSnip);
    optionsContainer.appendChild(deleteSnip);
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
