import { BrowserWindow, WebContentsView } from "electron";

const tabs: WebContentsView[] = [];

export function loadUrl(url: string): void {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) {
    return;
  }
  if (tabs.length === 0) {
    const view = new WebContentsView();
    win.contentView.addChildView(view);
    const { width: totalWidth, height } = win.getContentBounds();
    const viewWidth = totalWidth;
    view.setBounds({
      x: 0,
      y: 32,
      width: viewWidth,
      height: height - 32,
    });
    // view.webContents.openDevTools();
    tabs.push(view);
  }
  const [view] = tabs;
  view.webContents.loadURL(url);
}
