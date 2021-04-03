import { ipcRenderer } from 'electron'

export function send(channel: string, data?: unknown): void {
  ipcRenderer.send(channel, data)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function receive(channel: string, handler: (...args: any[]) => void): void {
  ipcRenderer.on(channel, (evt, ...args) => handler(...args))
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function receiveOnce(channel: string, handler: (...args: any[]) => void): void {
  ipcRenderer.once(channel, (evt, ...args) => handler(...args))
}
