import React from 'react';

const SORT_TOOL = 'jp-codeSnippet-sort-tool';
const SORT_ICON = 'jp-codeSnippet-sort-icon';
/* Add on click to span and then create function to actually do the sorting*/

export class SortTools extends React.Component {
  render(): JSX.Element {
    return (
      <div className={SORT_TOOL}>
        <span className={SORT_ICON}></span>
      </div>
    );
  }
}
