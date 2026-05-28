const { app, BrowserWindow, protocol, ipcMain, net } = require('electron');
const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { exec } = require('child_process');
const { promisify } = require('util');
const { pathToFileURL } = require('url');
const JSZip = require('jszip');

const execAsync = promisify(exec);

// Register custom protocol 'app' as privileged to resolve absolute asset paths in Next.js static exports
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
]);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    title: "BloopDocs",
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  // Load production custom protocol in packaged app, otherwise load Next.js dev server
  const isDev = !app.isPackaged;
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // Open Developer Tools in dev mode
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL('app://index.html');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Intercept custom protocol 'app://' and serve from Next.js build output directory ('out')
app.whenReady().then(() => {
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    
    // Default to index.html for root route
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }
    
    // Map to local 'out' folder in the parent root directory
    const resolvedPath = path.join(__dirname, '..', 'out', pathname);
    return net.fetch(pathToFileURL(resolvedPath).toString());
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handler: Convert Files locally using local LibreOffice installation
ipcMain.handle('convert-files', async (event, { files, targetExt }) => {
  const sessionId = Math.random().toString(36).substring(2, 10).toUpperCase();
  const tmpDir = path.join(os.tmpdir(), `bloopdocs_desktop_${sessionId}`);
  const inDir = path.join(tmpDir, 'in');
  const outDir = path.join(tmpDir, 'out');
  const profileDir = path.join(tmpDir, 'profile');

  try {
    // 1. Check if LibreOffice is installed locally on the host system
    const isMac = process.platform === 'darwin';
    const isWin = process.platform === 'win32';
    
    let sofficePath = 'soffice'; // default Linux fallback
    
    if (isMac) {
      sofficePath = '/Applications/LibreOffice.app/Contents/MacOS/soffice';
    } else if (isWin) {
      // Common Windows paths for LibreOffice
      const paths = [
        path.join(process.env.PROGRAMFILES || 'C:\\Program Files', 'LibreOffice', 'program', 'soffice.exe'),
        path.join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'LibreOffice', 'program', 'soffice.exe')
      ];
      
      let foundPath = null;
      for (const p of paths) {
        try {
          await fs.stat(p);
          foundPath = p;
          break;
        } catch {}
      }
      
      if (foundPath) {
        sofficePath = foundPath;
      } else {
        throw new Error("LibreOffice installation was not found on your Windows PC. Please install LibreOffice (https://www.libreoffice.org) and try again.");
      }
    }
    
    // On Mac, verify if LibreOffice is actually installed in /Applications
    if (isMac) {
      try {
        await fs.stat(sofficePath);
      } catch (err) {
        throw new Error("LibreOffice app was not found in your /Applications folder. Please download and install LibreOffice for macOS to enable local conversions.");
      }
    }

    // 2. Create local temporary workspace
    await fs.mkdir(inDir, { recursive: true });
    await fs.mkdir(outDir, { recursive: true });
    await fs.mkdir(profileDir, { recursive: true });

    const zip = new JSZip();

    // 3. Write received file streams to disk
    for (const f of files) {
      const safeName = f.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const inPath = path.join(inDir, safeName);
      
      // Write file buffer to local disk
      await fs.writeFile(inPath, Buffer.from(f.data));
      
      // 4. Execute local soffice headless conversion
      // -env:UserInstallation prevents multi-instance file lock collisions
      const userProfileUrl = pathToFileURL(profileDir).toString();
      const command = `"${sofficePath}" -env:UserInstallation=${userProfileUrl} --headless --convert-to ${targetExt} "${inPath}" --outdir "${outDir}"`;
      
      await execAsync(command);

      // 5. Read converted outputs
      const baseName = path.parse(safeName).name;
      const expectedOutFile = `${baseName}.${targetExt}`;
      const outPath = path.join(outDir, expectedOutFile);
      
      const outBuffer = await fs.readFile(outPath);
      const originalBase = path.parse(f.name).name;
      zip.file(`${originalBase}.${targetExt}`, outBuffer);
    }

    // 6. Generate final ZIP buffer
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    // Clean up all temporary session directories securely
    await fs.rm(tmpDir, { recursive: true, force: true });

    // Return the resulting binary ZIP array to the frontend
    return zipBuffer;

  } catch (error) {
    console.error("Local Desktop Conversion Engine Error:", error);
    // Cleanup on failure
    try {
      await fs.rm(tmpDir, { recursive: true, force: true });
    } catch {}
    throw error;
  }
});
