import * as express from "express";
import * as path from "path";
import * as vscode from "vscode";
import { DASHBOARD_PORT } from "@repo/utils/constants";

const serveDashboard = (context: vscode.ExtensionContext) => {
  const app = express();
  const pathToFrontendDist = path.join(
    context.extensionPath,
    "..",
    "dashboard",
    "dist",
  );

  if (!require("fs").existsSync(pathToFrontendDist)) {
    vscode.window.showErrorMessage(
      `Dashboard frontend not found at: ${pathToFrontendDist}`,
    );
    return;
  }

  app.use(express.static(pathToFrontendDist));
  app.get("*", (_, res) => {
    res.sendFile(path.join(pathToFrontendDist, "index.html"));
  });

  const server = app
    .listen(DASHBOARD_PORT, () => {
      console.log(`Dashboard server started on port ${DASHBOARD_PORT}`);
    })
    .on("error", (error) => {
      vscode.window.showErrorMessage(
        `Failed to start dashboard server: ${error.message}`,
      );
    });

  context.subscriptions.push({
    dispose: () => {
      server.close();
    },
  });
};

export default serveDashboard;
