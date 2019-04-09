import * as vs from "vscode";
import { Uri } from "vscode";

export class FlutterHooks {
    static getDartPackages() {
        var dartExtension = vs.extensions.getExtension('dart-code.dart-code');

        if (dartExtension === undefined) {
            return;
        }

        if (dartExtension.isActive === false) {
            dartExtension.activate().then(
                function () {
                    console.log("Extension activated");
                    vs.commands.executeCommand("dart.getPackages");
                },
                function () {
                    console.log("Extension activation failed");
                }
            );
        } else {
            vs.commands.executeCommand("dart.getPackages");
        }
    }

    public static createPubBuildRunnerTask(folder: vs.WorkspaceFolder | undefined) {

        if (folder === undefined) {
            throw new Error("Workspace folder is undefined");
        }

        let workingDirectory = folder.uri instanceof Uri ? folder.uri.fsPath : folder.uri;

        const task = new vs.Task(
            {
                command: "build",
                type: "flutter",
            },
            folder,
            `build_runner build`,
            "flutter",
            new vs.ShellExecution(
                "flutter",
                ["packages", "pub", "run", "build_runner", "build", "--delete-conflicting-outputs"],
                { cwd: workingDirectory },
            ),
            "$dart-pub-build_runner");

        task.group = vs.TaskGroup.Build;
        task.isBackground = true;
        task.name = `build_runner build`;
        return task;
    }
}
