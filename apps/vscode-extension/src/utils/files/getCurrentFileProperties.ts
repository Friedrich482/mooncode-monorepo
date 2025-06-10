import * as vscode from "vscode";

const getCurrentFileProperties = (
  document: vscode.TextDocument | undefined,
) => {
  if (!document) {
    return {
      projectName: null,
      projectPath: null,
      relativePath: null,
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
      relativePath: null,
      absolutePath: null,
    };
  }

  const relativePathWithoutFolder = vscode.workspace.asRelativePath(
    fileUri,
    false,
  );

  return {
    projectName,
    projectPath,
    relativePath: relativePathWithoutFolder,
    absolutePath: fileUri.fsPath,
  };
};

export default getCurrentFileProperties;
