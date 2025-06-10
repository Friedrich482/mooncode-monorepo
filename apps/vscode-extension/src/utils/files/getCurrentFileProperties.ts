import * as vscode from "vscode";

const getCurrentFileProperties = (
  document: vscode.TextDocument | undefined,
) => {
  if (!document) {
    return {
      projectName: null,
      relativePath: null,
      absolutePath: null,
    };
  }

  const fileUri = document.uri;

  const relativePathWithoutFolder = vscode.workspace.asRelativePath(
    fileUri,
    false,
  );

  return {
    projectName: vscode.workspace.getWorkspaceFolder(fileUri)?.name,
    relativePath: relativePathWithoutFolder,
    absolutePath: fileUri.fsPath,
  };
};

export default getCurrentFileProperties;
