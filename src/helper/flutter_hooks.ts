import * as vs from 'vscode';
import { Uri } from 'vscode';
import { Utils } from '../utils/utils';

export class FlutterHooks {
  public static getDartPackages() {
    const dartExtension = vs.extensions.getExtension('dart-code.dart-code');

    if (dartExtension === undefined) {
      return;
    }

    if (dartExtension.isActive === false) {
      dartExtension.activate().then(
        () => {
          Utils.consoleLog('Extension activated');
          vs.commands.executeCommand('dart.getPackages');
        },
        () => {
          Utils.consoleLog('Extension activation failed');
        },
      );
    } else {
      vs.commands.executeCommand('dart.getPackages');
    }
  }

  public static createPubBuildRunnerBuildTask(folder: vs.WorkspaceFolder | undefined) {
    if (folder === undefined) {
      throw new Error('Workspace folder is undefined');
    }

    const workingDirectory = folder.uri instanceof Uri ? folder.uri.fsPath : folder.uri;

    const task = new vs.Task(
      {
        command: 'build',
        type: 'flutter',
      },
      folder,
      `build_runner build`,
      'flutter',
      new vs.ShellExecution(
        'flutter',
        ['packages', 'pub', 'run', 'build_runner', 'build', '--delete-conflicting-outputs'],
        { cwd: workingDirectory },
      ),
      '$dart-pub-build_runner',
    );

    task.group = vs.TaskGroup.Build;
    task.isBackground = true;
    task.name = `build_runner build`;
    return task;
  }

  public static createPubBuildRunnerCleanTask(folder: vs.WorkspaceFolder | undefined) {
    if (folder === undefined) {
      throw new Error('Workspace folder is undefined');
    }

    const workingDirectory = folder.uri instanceof Uri ? folder.uri.fsPath : folder.uri;

    const task = new vs.Task(
      {
        command: 'clean',
        type: 'flutter',
      },
      folder,
      `build_runner clean`,
      'flutter',
      new vs.ShellExecution('flutter', ['packages', 'pub', 'run', 'build_runner', 'clean'], { cwd: workingDirectory }),
      '$dart-pub-build_runner',
    );

    task.group = vs.TaskGroup.Clean;
    task.isBackground = true;
    task.name = `build_runner clean`;
    return task;
  }
}
