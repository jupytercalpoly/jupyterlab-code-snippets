import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';

interface ISearchProp {
  onSearch: (searchValue: string) => void;
}

export class SearchBar extends React.Component<ISearchProp> {
  state = {
    value: ''
  };

  updateValue = (event: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ value: event.target.value }, this.searchSnippets);
  };

  searchSnippets = (): void => {
    this.props.onSearch(this.state.value);
  };

  render(): JSX.Element {
    return (
      <div className="jp-codesnippet-searchbar">
        <InputGroup
          className="jp-codesnippet-searchwrapper"
          type="text"
          placeholder="SEARCH SNIPPETS"
          onChange={this.updateValue}
          rightIcon="search"
          value={this.state.value}
        />
      </div>
    );
  }
}
