import { Menu, MenuItem } from "electron";
import { getTabById, loadTab } from "./tabs";
import { randomUUID } from "node:crypto";

export const ContextMenuManager = {
  targetUrl: <string|null>null,
  targetTabId: <string|null>null,

  menu: new Menu(),
  append(menuItem: MenuItem) {
    this.menu.append(menuItem);
  },
  popup(options?: Electron.PopupOptions) {
    this.menu.popup(options);
  },

  clickLink(tabId: string, linkUrl: string) {
    this.targetUrl = linkUrl;
    this.targetTabId = tabId;
    this.popup();
  },

  actionClicked() {
    this.targetUrl = null;
  },

  separator: new MenuItem({ type: "separator" }),
  openLink: new MenuItem({
    label: "Open Link",
    click: () => {
      const { targetTabId, targetUrl } = ContextMenuManager;
      if (!targetTabId || !targetUrl) {
        throw new Error("No target tab or url");
      }
      loadTab(targetTabId, { url: targetUrl });
      ContextMenuManager.actionClicked();
    },
  }),
  openLinkInNewTab: new MenuItem({
    label: "Open Link in New Tab",
    click: () => {
      const { targetUrl } = ContextMenuManager;
      if (!targetUrl) {
        throw new Error("No target url");
      }
      loadTab(randomUUID(), { url: targetUrl, visible: true });
      ContextMenuManager.actionClicked();
    },
  }),
  openLinkInBackgroundTab: new MenuItem({
    label: "Open Link in Background Tab",
    click: () => {
      const { targetUrl } = ContextMenuManager;
      if (!targetUrl) {
        throw new Error("No target url");
      }
      loadTab(randomUUID(), { url: targetUrl, visible: false });
      ContextMenuManager.actionClicked();
    },
  }),
  openDevTools: new MenuItem({
    label: "Open DevTools",
    click: () => {
      const { targetTabId } = ContextMenuManager;
      if (!targetTabId) {
        throw new Error("No target tab");
      }
      getTabById(targetTabId).webContents.openDevTools();
      ContextMenuManager.actionClicked();
    },
  }),

  init() {
    this.append(this.openLink);
    this.append(this.openLinkInNewTab);
    this.append(this.openLinkInBackgroundTab);
    this.append(this.separator);
    this.append(this.openDevTools);
  },
};

ContextMenuManager.init();

export default ContextMenuManager;
