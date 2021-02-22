import React from 'react';
import { checkIcon } from '@jupyterlab/ui-components';

const CODE_SNIPPET_SORT_OPTION_UNSELECT =
  'jp-codeSnippet-sort-option-unselected';
const CODE_SNIPPET_SORT_OPTION_SELECT = 'jp-codeSnippet-sort-option-selected';

interface ISortSnippetOptionProps {
  optionSelected: boolean;
  optionName: string;
  onSelectMulti: (name: string, selected: boolean) => void;
}

const SearchOption = ({
  optionSelected,
  optionName,
  onSelectMulti
}: ISortSnippetOptionProps): JSX.Element => {
  if (optionSelected) {
    return (
      <div
        className={CODE_SNIPPET_SORT_OPTION_SELECT}
        onClick={(): void => {
          onSelectMulti(optionName, false);
        }}
      >
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
      <div
        className={CODE_SNIPPET_SORT_OPTION_UNSELECT}
        onClick={(): void => {
          onSelectMulti(optionName, true);
        }}
      >
        {optionName}
      </div>
    );
  }
};

export default SearchOption;
