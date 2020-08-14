import React from 'react';
// import { usePopper } from 'react-popper';
// import { createPopper } from '@popperjs/core';
// import { Overlay, Button } from 'react-bootstrap';

interface IFilterSnippetProps {
  empty: boolean;
}

interface IFilterSnippetState {
  show: boolean;
  languages: string[];
  tags: string[];
}

export class FilterSnippet extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  button: Element;
  option: HTMLElement;
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false, languages: [], tags: [] };
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    // this.target = useRef(null);
  }

  // show() {}
  createFilterBox(): void {
    this.setState((state, _) => ({
      show: !state.show,
      languages: [],
      tags: []
    }));
  }

  renderFilterOption(): JSX.Element {
    return <div className={'jp-codeSnippet-filter-option'}>My tooltip</div>;
  }

  // renderOption(): JSX.Element {}

  render(): React.ReactElement {
    return (
      <div className={'jp-codeSnippet-filter'}>
        <button onClick={this.createFilterBox}>Filter</button>
        {this.state.show ? this.renderFilterOption() : null}
        {/* <Overlay target={target.current} placement="right"></Overlay> */}
      </div>
    );
  }
}
