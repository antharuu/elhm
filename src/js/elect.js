"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
class Main {
    static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }
    static onClose() {
        Main.mainWindow = null;
    }
    static onReady() {
        Main.mainWindow = new Main.BrowserWindow({
            webPreferences: {
                preload: path.join(__dirname, "projects.js"),
            },
            nodeIntegration: true,
            width: 1280,
            height: 720,
            autoHideMenuBar: true,
            center: true,
            minWidth: 720,
            minHeight: 480,
            fullscreenable: true,
            skipTaskbar: true,
            icon: "images/potion.png",
            darkTheme: true,
            thickFrame: true
        });
        Main.mainWindow
            .loadURL("file:///" + path.join(__dirname, "../../index.html"));
        Main.mainWindow.webContents.openDevTools();
        Main.mainWindow.on('closed', Main.onClose);
    }
    static main(app, browserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}
exports.default = Main;
