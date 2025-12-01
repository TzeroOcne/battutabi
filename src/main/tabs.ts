import { BrowserWindow, WebContentsView } from "electron";
import { LoadOptions } from "../types/tabs";

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

export function loadUrl(id: string, options: LoadOptions): void {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) {
    return;
  }
  const { url, visible } = options;
  if (!tabs[id]) {
    const view = new WebContentsView();
    win.contentView.addChildView(view);
    resizeView(win, view);
    view.webContents.on('page-title-updated', (_, title) => {
      win.webContents.send('page-title-updated', { id, title });
    });
    view.webContents.on('will-navigate', ({ url }) => {
      win.webContents.send('will-navigate', { id, url });
    });
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
  latestTab = view;
}
