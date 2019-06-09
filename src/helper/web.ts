export interface IGitIssueContent {
  title: string;
  body: string;
}

export function generateNewGitIssueUrl(content: IGitIssueContent) {
  const url: string = `https://github.com/matei-tm/vscode-f-orm-m8/issues/new?title=${content.title}&body=${content.body}`;
  return url;
}

export function generateNewGitIssueContent(error: Error): IGitIssueContent {
  const title: string = `Bug Report: ${error.message}`;

  const body: string = `
# Bug Report

## Description

<!-- If you want to give a brief description of the error, please do so here. -->

## Steps to Reproduce

<!-- Please tell me exactly how to reproduce the problem you are running into. -->

1. ...
2. ...
3. ...

## Exception Info

**Type:** \`${(typeof error).toString()}\`

**Name:** \`${error.name}\`

**Message:** \`${error.message}\`

**Stack:**

\`\`\`
${error.stack}
\`\`\`
`;

  return { title, body };
}

export function openNewGitIssueUrl(error: Error) {
  require('openurl').open(generateNewGitIssueUrl(generateNewGitIssueContent(error)));
}
