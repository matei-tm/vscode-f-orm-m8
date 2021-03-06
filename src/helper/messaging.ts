'use strict';

import * as vscode from 'vscode';
import { openNewGitIssueUrl } from './web';

enum ErrorOptionType {
  report = 'Report issue',
  ignore = 'Ignore',
}

const errorOptions = [{ title: ErrorOptionType.report }, { title: ErrorOptionType.ignore }];

const messagePrefix: string = 'f-orm-m8: ';

export function showInfo(message: string): Thenable<string | undefined> {
  return vscode.window.showInformationMessage(`${messagePrefix}${message}`);
}

export function showWarning(message: string): Thenable<string | undefined> {
  return vscode.window.showWarningMessage(`${messagePrefix}${message}`);
}

export function showError(error: Error, isCritical: boolean = false): void {
  let message: string = messagePrefix;
  if (!isCritical) {
    message += error.message;
    vscode.window.showErrorMessage(message);
    return;
  }
  message += `A critical error has occurred.\n
    If this happens again, please report it.\n\n
    
    Error message: ${error.message}`;

  vscode.window.showErrorMessage(message, {}, ...errorOptions).then((option?: vscode.MessageItem) => {
    if (option) {
      handleErrorOptionResponse(option.title, error);
    }
  });
}

function handleErrorOptionResponse(option: string, error: Error) {
  switch (option) {
    case ErrorOptionType.report:
      openNewGitIssueUrl(error);
      break;
    default:
      break;
  }
}

export function showCriticalError(error: Error): void {
  showError(error, true);
}
