const { app, BrowserWindow, globalShortcut, Menu } = require('electron');
const path = require('node:path');
const url = require('url');
const { exec } = require('child_process');
const { ipcMain } = require('electron');

// Escucha los logs de preload.js
ipcMain.on('log', (event, ...args) => {
    console.log('[PRELOAD LOG]:', ...args);
});

// Utilidad para decodificar Base64
const atob = (base64) => Buffer.from(base64, 'base64').toString('utf-8');

let mainWindow; // Variable global para la ventana principal

// Función para registrar el protocolo personalizado
function registerProtocol() {
    const protocolName = "snormativa";
    const executablePath = `"${process.execPath}" "%1"`; // Ruta al .exe con "%1" para capturar la URL

    const commands = [
        `reg add HKCR\\${protocolName} /ve /d "URL:Normativa Protocol" /f`,
        `reg add HKCR\\${protocolName} /v "URL Protocol" /f`,
        `reg add HKCR\\${protocolName}\\shell /f`,
        `reg add HKCR\\${protocolName}\\shell\\open /f`,
        `reg add HKCR\\${protocolName}\\shell\\open\\command /ve /d ${executablePath} /f`
    ];

    commands.forEach(command => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error al registrar el protocolo: ${error.message}`);
            } else {
                console.log(`Protocolo registrado con éxito: ${command}`);
            }
        });
    });
}

// Maneja las URLs personalizadas
function handleCustomProtocol(protocolUrl) {
    console.log('URL recibida:', protocolUrl);

    try {
        const params = new URL(protocolUrl).searchParams;
        const encodedId = params.get('id');

        if (encodedId) {
            const decodedId = atob(encodedId);
            const [number1, number2] = decodedId.split(':');
            console.log('Decodificado:', decodedId);
            console.log('Número 1:', number1);
            console.log('Número 2:', number2);

            if (mainWindow) {
                mainWindow.webContents.on('did-finish-load', () => {
                    mainWindow.webContents.send('params', {
                        idArchivo: number1,
                        idNormativa: number2,
                    });
                });
            }
        } else {
            console.warn('No se encontró el parámetro "id" en la URL');
        }
    } catch (error) {
        console.error('Error al manejar la URL personalizada:', error);
    }
}

// Crea la ventana principal
function createWindow() {
    mainWindow = new BrowserWindow({
        title: '',
        // autoHideMenuBar: true,
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: true,
        },
    });

    // Activa las herramientas de desarrollo
    mainWindow.webContents.openDevTools();

    // Deshabilitar Ctrl+R (Recargar)
    globalShortcut.register('CommandOrControl+R', () => {
        console.log('Ctrl+R está deshabilitado');
    });

    // Deshabilitar Ctrl+Shift+I (DevTools)
    globalShortcut.register('CommandOrControl+Shift+I', () => {
        console.log('Ctrl+Shift+I está deshabilitado');
    });

    //-------------------------------------------------------------------
    // Iniciar app
    //-------------------------------------------------------------------
    const ruta = path.join(__dirname, 'dist/hc-normativas-frontend/browser/index.html');

    mainWindow.loadFile(ruta)
        .catch(error => {
            console.error("Error al cargar el archivo:", error);
        });
}

// Registra el protocolo como predeterminado
app.setAsDefaultProtocolClient('snormativa');

// Eventos del ciclo de vida de la app
app.on('ready', () => {
    console.log('[APP READY]: La aplicación está lista.');
    registerProtocol();
    createWindow();
    // const testUrl = 'snormativa://open.snormativas?id=MjYxNDA6MTI4MDQ=';
    // handleCustomProtocol(testUrl);
    if (process.argv.length >= 2) {
        const protocolArg = process.argv.find((arg) => arg.startsWith('snormativa://'));
        if (protocolArg) {
            handleCustomProtocol(protocolArg);
        }
    }
});

app.on('second-instance', (event, argv) => {
    const protocolArg = argv.find((arg) => arg.startsWith('snormativa://'));
    if (protocolArg) {
        handleCustomProtocol(protocolArg);
    }
});

app.on('open-url', (event, protocolUrl) => {
    event.preventDefault();
    handleCustomProtocol(protocolUrl);
});

app.on('window-all-closed', () => {
    console.log('[WINDOWS CLOSED]: Cerrando todas las ventanas.');
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    console.log('[ACTIVATE]: Reactivando la aplicación.');
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
