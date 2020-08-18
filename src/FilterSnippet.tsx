import React from 'react';
// import { usePopper } from 'react-popper';
// import { createPopper } from '@popperjs/core';
// import { Overlay, Button } from 'react-bootstrap';

interface IFilterSnippetProps {
  tags: string[];
}

interface IFilterSnippetState {
  show: boolean;
}

export class FilterSnippet extends React.Component<
  IFilterSnippetProps,
  IFilterSnippetState
> {
  button: Element;
  option: HTMLElement;
  constructor(props: IFilterSnippetProps) {
    super(props);
    this.state = { show: false };
    this.createFilterBox = this.createFilterBox.bind(this);
    this.renderFilterOption = this.renderFilterOption.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.renderTag = this.renderTag.bind(this);
    // this.target = useRef(null);
  }

  // show() {}
  createFilterBox(): void {
    this.setState((state, _) => ({
      show: !state.show
    }));
  }

  renderTags(): JSX.Element {
    return (
      <div className={'jp-codeSnippet-filter-tags'}>
        {this.props.tags.map((tag: string, index: number) =>
          this.renderTag(tag, index.toString())
        )}
      </div>
    );
  }

  renderTag(tag: string, index: string): JSX.Element {
    return (
      <div
        className={'jp-codeSnippet-filter-tag tag unapplied-tag'}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button>{tag}</button>
      </div>
    );
  }

  renderFilterOption(): JSX.Element {
    return (
      <div className={'jp-codeSnippet-filter-option'}>
        <div className={'jp-codeSnippet-filter-title'}>
          <span>cell tags</span>
        </div>
        {this.renderTags()}
      </div>
    );
  }

  // renderOption(): JSX.Element {}

  render(): React.ReactElement {
    return (
      <div className={'jp-codeSnippet-filter'}>
        <button
          className={'jp-codeSnippet-filter-btn'}
          onClick={this.createFilterBox}
        >
          Filter By Tags
        </button>
        {this.state.show ? (
          <div className="jp-codeSnippet-filter-arrow-up"></div>
        ) : null}
        {this.state.show ? this.renderFilterOption() : null}
        {/* <Overlay target={target.current} placement="right"></Overlay> */}
      </div>
    );
  }
}
