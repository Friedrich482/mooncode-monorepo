import * as vscode from "vscode";

const getElapsedTime = () => {
  const beginning = performance.now();

  vscode.workspace.onDidChangeTextDocument(() => {
    const elapsedTime = parseInt(
      ((performance.now() - beginning) / 1000).toFixed()
    );

    const hours = Math.floor(elapsedTime / 3600);
    const minutes = Math.floor((elapsedTime / 60) % 60);
    const seconds = Math.floor(elapsedTime % 60);

    const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const paddedHours = hours < 10 ? `0${hours}` : hours;

    vscode.window.showInformationMessage(
      `Time elapsed :${paddedHours}:${paddedMinutes}:${paddedSeconds}`
    );
  });
};

export default getElapsedTime;
