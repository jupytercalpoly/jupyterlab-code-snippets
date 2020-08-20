import React from 'react';

interface ICodeSnippetTagProps {
  tags: string[];
}

interface ICodeSnippetTagState {
  selectedTags: string[];
}

export class CodeSnippetTags extends React.Component<
  ICodeSnippetTagProps,
  ICodeSnippetTagState
> {
  constructor(props: ICodeSnippetTagProps) {
    super(props);
    this.renderTags = this.renderTags.bind(this);
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
        id={'filter' + '-' + tag + '-' + index}
        key={'filter' + '-' + tag + '-' + index}
      >
        <button>{tag}</button>
      </div>
    );
  }

  render(): JSX.Element {
    return <div>{this.renderTags()}</div>;
  }
}
