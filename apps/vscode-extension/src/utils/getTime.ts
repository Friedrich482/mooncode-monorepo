import * as vscode from "vscode";

const getTime = () => {
  let elapsedTime = performance.now();
  let elapsedTimeBetweenKeystrokes = performance.now();

  vscode.workspace.onDidChangeTextDocument(() => {
    const currentElapsedTime = parseInt(
      ((performance.now() - elapsedTime) / 1000).toFixed()
    );

    const currentElapsedBetweenKeystrokes = parseInt(
      ((performance.now() - elapsedTimeBetweenKeystrokes) / 1000).toFixed()
    );

    vscode.window.showInformationMessage(
      `elapsedTime in seconds : ${currentElapsedTime}; elapsedTimeBetweenKeyStrokes : ${currentElapsedBetweenKeystrokes}`
    );

    if (currentElapsedBetweenKeystrokes >= 900) {
      elapsedTime = performance.now();
    }

    // restart the elapsed time between keystrokes
    elapsedTimeBetweenKeystrokes = performance.now();
  });
};

export default getTime;
