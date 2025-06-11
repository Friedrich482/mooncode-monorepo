import * as path from "path";
import * as vscode from "vscode";
const getCurrentFileProperties = (
  document: vscode.TextDocument | undefined,
) => {
  if (!document) {
    return {
      projectName: null,
      projectPath: null,
      absolutePath: null,
    };
  }

  const fileUri = document.uri;

  const projectName = vscode.workspace.getWorkspaceFolder(fileUri)?.name;
  const projectPath = vscode.workspace.getWorkspaceFolder(fileUri)?.uri.fsPath;

  if (!projectName || !projectPath) {
    return {
      projectName: null,
      projectPath: null,
      absolutePath: null,
    };
  }

  return {
    projectName,
    projectPath,
    absolutePath: path.normalize(fileUri.fsPath),
  };
};

export default getCurrentFileProperties;
