import { InputGroup } from '@jupyterlab/ui-components';
import React from 'react';

interface ISearchProp {
  onFilter: (filterValue: string) => void;
}

export class SearchBar extends React.Component<ISearchProp> {
  state = {
    value: '',
  };

  updateValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: event.target.value }, this.filterSnippets);
  };

  filterSnippets = () => {
    this.props.onFilter(this.state.value);
  };

  render() {
    return (
      <div className="jp-codesnippet-searchbar">
        <InputGroup
          className="jp-codesnippet-searchwrapper"
          type="text"
          placeholder="Type Here..."
          onChange={this.updateValue}
          rightIcon="search"
          value={this.state.value}
        />
      </div>
    );
  }
}
