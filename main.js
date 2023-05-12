const { app, BrowserWindow } = require('electron')
const path = require('path')

// run this as early in the main process as possible
if (require('electron-squirrel-startup')) app.quit();

function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        show: false,
        backgroundColor: '#ffffff',
        icon: path.join(__dirname, 'logo/datagrapher.ico'),
        webPreferences: {
            nodeIntegration: true
        }
    })
    
    win.once('ready-to-show', () => {
        win.show()
    })
    
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
