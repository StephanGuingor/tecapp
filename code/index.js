const { app, BrowserWindow, Menu } = require('electron')
const url = require("url")
const path = require("path")
const Store = require("./persistance/StoreModel.js")

// CONSTANTS PAGES
const tecPage = "tec_page.html";
const udemyPage = "udemy_page.html";
const mainPage = "index.html";


// Creating Store for the Settings
// First instantiate the class
const store = new Store({
    // We'll call our data file 'user-preferences'
    configName: 'user-preferences',
    defaults: {
      // 800x600 is the default size of our window
      windowBounds: { width: 800, height: 600 }
    }
  });



// Find Electron if debug mode is one
if (process.env.NODE_ENV !== "production"){
require("electron-reload")(__dirname,{
    electron: path.join(__dirname,"../node_modules",".bin","electron")
})
}

let mainWindow;
// Get computer ready
app.on("ready", () => {
    // Get Size
    let { width, height } = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width,
        height,
        darkTheme:true,
        webPreferences: {
            worldSafeExecuteJavaScrip:true,
            nodeIntegration: true
        
        }
    });
  
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,"views/index.html"),
        protocol:"file",
        slashes:true
    }))

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);

    //  If main window is closed, quit the Application
    mainWindow.on('close',() => {
        app.quit();
    })

      // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    let { width, height } = mainWindow.getBounds();
    // Now that we have them, save them using the `set` method.
    store.set('windowBounds', { width, height });
  });
})

// Creates Pop Up
function createProductWindow(){
    popupWindow = new BrowserWindow({
        width: 300,
        height: 300,
        title:"Pop Up",
        titleBarStyle: "default",
      
        
    })
    popupWindow.setMenu(null);
    popupWindow.loadURL(url.format({
        pathname: path.join(__dirname,"views/index.html"),
        protocol:"file",
        slashes:true
    }))

    popupWindow.on('closed',() => {
        popupWindow = null;
    });
    
}

const templateMenu = [
    {
        label: 'File',
        submenu: [
            {
                label: "New Product",
                accelerator:"Ctrl+N",
                click(){
                   createProductWindow();                  
                }
            },
            {
                label: "Exit",
                accelerator: process.platform == "darwin" ? "command+Q" : "Ctrl+Q",
                click(){
                    app.quit();
                }
            }
        ]
    }
    
]


// In main process.
const { ipcMain } = require('electron')


// When user click on tec button
ipcMain.on('onBackMain', (event, arg) => {
    console.log("jumped to main");
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,`views/${mainPage}`),
        protocol:"file",
        slashes:true
    }))
  event.returnValue = 'mainPage'
})


// When user click on tec button
ipcMain.on('onTec', (event, arg) => {
    console.log("jumped to tec page");
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,`views/${tecPage}`),
        protocol:"file",
        slashes:true
    }))
  event.returnValue = 'tecSend'
})

// When user clicks on udemy button
ipcMain.on('onUdemy', (event, arg) => {
    console.log("jumped to udemy page");
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,`views/${udemyPage}`),
        protocol:"file",
        slashes:true
    }))
  event.returnValue = 'udemySend'
})


// Mac menu and debug tools
if (process.platform === "darwin") {
    templateMenu.unshift({
        label:app.getName(),
    });
}

if (process.env.NODE_ENV !== "production"){
    templateMenu.push({
        label:'Dev Tools',
        submenu:[
            {
                label: "Show/Hide Dev Tools",
                accelerator:"Ctrl+Shift+I",
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: "reload"
            }
        ]
    })
    }


// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

