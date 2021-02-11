import React from 'react';
import { checkIcon } from '@jupyterlab/ui-components';

const CODE_SNIPPET_SORT_OPTION_UNSELECT =
  'jp-codeSnippet-sort-option-unselected';
const CODE_SNIPPET_SORT_OPTION_SELECT = 'jp-codeSnippet-sort-option-selected';

interface SortOptionProps {
  optionSelected: Boolean;
  optionName: String;
}

const SortOption = ({ optionSelected, optionName }: SortOptionProps) => {
  if (optionSelected) {
    return (
      <div className={CODE_SNIPPET_SORT_OPTION_SELECT}>
        <checkIcon.react
          className="jupyterlab-CodeSnippets-sort-selected"
          elementPosition="center"
          height="16px"
          width="16px"
          marginLeft="2px"
        />
        {optionName}
      </div>
    );
  } else {
    return (
      <div className={CODE_SNIPPET_SORT_OPTION_UNSELECT}>{optionName}</div>
    );
  }
};

export default SortOption;
