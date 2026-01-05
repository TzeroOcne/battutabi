export function send<T>(channel: string, ...args: T[]): void {
  window.electron.ipcRenderer.send(channel, ...args);
}

export function on<T>(channel: string, listener: (event: Electron.IpcRendererEvent, ...args: T[]) => void): void {
  window.electron.ipcRenderer.on(channel, listener);
}
