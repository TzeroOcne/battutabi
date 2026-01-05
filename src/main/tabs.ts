import { BrowserWindow, ipcMain, WebContentsView } from "electron";
import { ContextMenuParams } from "../types/event";
import { LoadOptions, Tab } from "../types/tabs";

const tabs: Record<string, WebContentsView> = {};
let latestTab:WebContentsView|null = null;

function resizeView(win: BrowserWindow, view: WebContentsView): void {
  const { width, height } = win.getContentBounds();
  view.setBounds({
    x: 0,
    y: 80,
    width,
    height: height - 80,
  });
}

export function loadTab(id: string, options: LoadOptions): void {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) {
    return;
  }
  const { url, file, visible } = options;
  if (!tabs[id]) {
    const view = new WebContentsView();
    win.webContents.send(
      'open-new-tab',
      {
        id,
        title: '',
        url,
        file,
      } satisfies Tab,
    );

    win.contentView.addChildView(view);
    resizeView(win, view);

    view.webContents.on('page-title-updated', (_, title) => {
      win.webContents.send('page-title-updated', { id, title });
    });
    view.webContents.on('will-navigate', ({ url }) => {
      win.webContents.send('will-navigate', { id, url });
    });
    view.webContents.on('did-start-navigation', ({ url }) => {
      win.webContents.send('did-start-navigation', { id, url });
    });
    view.webContents.on('context-menu', (_, params) => {
      ipcMain.emit(
        'contextmenu',
        undefined,
        {
          type: 'CONTENT',
          tabId: id,
          linkUrl: params.linkURL,
        } satisfies ContextMenuParams,
      );
    })

    win.on('resize', () => {
      resizeView(win, view);
    });
    // view.webContents.openDevTools();
    tabs[id] = view;
  }
  const view = tabs[id];
  if (latestTab && view !== latestTab) {
    latestTab.setVisible(false);
  }
  if (visible !== undefined) {
    view.setVisible(visible);
  }
  if (url) {
    view.webContents.loadURL(url);
  }
  if (file) {
    view.webContents.loadFile(file);
  }
  latestTab = view;
}

export function removeTabById(id: string): void {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) {
    return;
  }
  if (!tabs[id]) return;
  const tab = tabs[id];
  delete tabs[id];
  win.contentView.removeChildView(tab);
  tab.webContents.close();
}
