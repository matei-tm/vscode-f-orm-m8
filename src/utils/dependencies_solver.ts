import { InsertionMethod } from "../functions/generators";
import * as vscode from "vscode";
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import { PubError } from "../model/pubError";

export class DependenciesSolver {
    static async solveDependencyOnSqflite(currentFolder: any) {
        try {
            await vscode.workspace.openTextDocument(currentFolder + "/pubspec.yaml")
                .then(doc => vscode.window.showTextDocument(doc));

            if (!vscode.window.activeTextEditor || !DependenciesSolver.pubspecFileIsOpen()) {
                showError(new PubError("Pubspec file not opened."));
                return;
            }

            vscode.commands.executeCommand("editor.action.formatDocument");

            const pubspecString = vscode.window.activeTextEditor.document.getText();
            const originalLines = pubspecString.split("\n");
            const modifiedPubspec = DependenciesSolver.addDependencyByText(pubspecString);

            vscode.window.activeTextEditor.edit(editBuilder => {
                editBuilder.replace(
                    new vscode.Range(
                        new vscode.Position(0, 0),
                        new vscode.Position(
                            originalLines.length - 1,
                            originalLines[originalLines.length - 1].length
                        )
                    ),
                    modifiedPubspec.result
                );
            });

            await vscode.window.activeTextEditor.document.save();

            showInfo(
                `${modifiedPubspec.insertionMethod.toString()} sqflite`
            );
        } catch (error) {
            showCriticalError(error);
        }
    }

    private static pubspecFileIsOpen(): any {
        return (
            vscode.window.activeTextEditor &&
            (vscode.window.activeTextEditor.document.fileName.endsWith(
                "pubspec.yaml"
            ) ||
                vscode.window.activeTextEditor.document.fileName.endsWith("pubspec.yml"))
        );
    }

    private static addDependencyByText(
        pubspecString: string
    ): { insertionMethod: InsertionMethod; result: string } {
        var sqflitePackageName = 'sqflite';
        var sqflitePackageVersion = '0.13.0';
        var sqfliteDependencyString = `${sqflitePackageName}: ^${sqflitePackageVersion}`;

        let insertionMethod = InsertionMethod.ADD;

        let lines = pubspecString.split("\n");

        let dependencyLineIndex = lines.findIndex(
            line => line.trim() === "dependencies:"
        );

        if (dependencyLineIndex === -1) {
            lines.push("dependencies:");
            dependencyLineIndex = lines.length - 1;
        }

        if (dependencyLineIndex === lines.length - 1) {
            lines.push("");
        }

        const existingPackageLineIndex = lines.findIndex(line => {
            if (!line.includes(":")) {
                return false;
            }

            const sanitizedLine: string = line.trim();
            const colonIndex: number = sanitizedLine.indexOf(":");
            const potentialMatch = sanitizedLine.substring(0, colonIndex);

            return potentialMatch.trim() === sqflitePackageName;
        });
        if (existingPackageLineIndex !== -1) {
            const originalLine = lines[existingPackageLineIndex];

            lines[existingPackageLineIndex] =
                "  " + sqfliteDependencyString;

            if (originalLine.includes("\r")) {
                lines[existingPackageLineIndex] += "\r";
            }
            if (originalLine.includes("\n")) {
                lines[existingPackageLineIndex] += "\n";
            }

            insertionMethod = InsertionMethod.REPLACE;
        } else {
            for (let i = dependencyLineIndex + 1; i < lines.length; i++) {
                if (!lines[i].startsWith(" ") && !lines[i].trim().startsWith("#")) {
                    lines[i] =
                        "  " + sqfliteDependencyString + "\r\n" + lines[i];
                    break;
                }
                if (i === lines.length - 1) {
                    if (!lines[i].includes("\r")) {
                        lines[i] = lines[i] + "\r";
                    }
                    lines.push("  " + sqfliteDependencyString);
                    break;
                }
            }
        }

        pubspecString = lines
            .join("\n")
            .split("\n")

            .join("\n")
            .trim();

        return { insertionMethod: insertionMethod, result: pubspecString };
    }
}