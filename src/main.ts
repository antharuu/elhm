import {app, BrowserWindow} from "electron";

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720
    });
    win.loadFile('index.html');
}

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
}); 