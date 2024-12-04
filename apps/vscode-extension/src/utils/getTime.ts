import * as vscode from "vscode";

const getTime = (): (() => number) => {
  const MAX_IDLE_TIME = 900; // 15 minutes
  let startTime = performance.now();
  let lastActivityTime = performance.now();
  let frozenTime: number | null = null;
  let freezeStartTime: number | null = null;
  let isFrozen = false;

  setInterval(() => {
    const now = performance.now();
    const idleDuration = (now - lastActivityTime) / 1000;

    if (idleDuration >= MAX_IDLE_TIME && !isFrozen) {
      frozenTime = (now - startTime) / 1000;
      freezeStartTime = now;
      isFrozen = true;
    } else if (idleDuration < MAX_IDLE_TIME && isFrozen) {
      const freezeDuration = (now - freezeStartTime!) / 1000;
      //  we set the start time to the time when we unfroze to account for the time that passed while we were frozen
      startTime += freezeDuration * 1000;
      frozenTime = null;
      freezeStartTime = null;
      isFrozen = false;
    }
  }, 1000);

  const activityListeners = [
    vscode.workspace.onDidChangeTextDocument(() => {
      lastActivityTime = performance.now();
    }),
    vscode.window.onDidChangeActiveTextEditor(() => {
      lastActivityTime = performance.now();
    }),
    vscode.window.onDidChangeVisibleTextEditors(() => {
      lastActivityTime = performance.now();
    }),
  ];

  return () => {
    const now = performance.now();
    if (isFrozen) {
      return frozenTime!;
    }
    return parseInt(((now - startTime) / 1000).toFixed(2));
  };
};
export default getTime;
