import { BrowserWindow } from 'electron';
import * as path from "path";

export default class Main {
    static mainWindow: Electron.BrowserWindow;
    static application: Electron.App;
    static BrowserWindow: any;
    private static onWindowAllClosed() {
        if (process.platform !== 'darwin') {
            Main.application.quit();
        }
    }

    private static onClose() {
        Main.mainWindow = null;
    }

    private static onReady() {
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

    static main(app: Electron.App, browserWindow: typeof BrowserWindow) {
        Main.BrowserWindow = browserWindow;
        Main.application = app;
        Main.application.on('window-all-closed', Main.onWindowAllClosed);
        Main.application.on('ready', Main.onReady);
    }
}