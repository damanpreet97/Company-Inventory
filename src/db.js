
/**
 * db.js - helper utilities for renderer if needed.
 * Primary DB operations are performed in main process via IPC.
 * This file can hold utility functions if you decide to use direct DB access in renderer.
 */
export function calcTotal(quantity, price) {
  return Number(quantity || 0) * Number(price || 0);
}
