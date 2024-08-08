import { writable, get } from "svelte/store";

export const seckey = writable<string | null>(null);
export const expire = writable<string | null>(null);

// ローカルストレージからseckeyとexpireを取得する関数
export function initializeStores() {
  const storedSeckey = localStorage.getItem("nchan_private_key");
  const storedExpire = localStorage.getItem("nchan_private_key_expire");

  seckey.set(storedSeckey ? storedSeckey : null);
  expire.set(storedExpire ? storedExpire : null);
}

// seckeyとexpireをローカルストレージに保存する関数
export function saveToLocalStorage(newSeckey: string, newExpire: string) {
  localStorage.setItem("nchan_private_key", newSeckey);
  localStorage.setItem("nchan_private_key_expire", newExpire);
  seckey.set(newSeckey);
  expire.set(newExpire);
}

// seckeyとexpireを破棄する関数
export function clearStores() {
  localStorage.removeItem("nchan_private_key");
  localStorage.removeItem("nchan_private_key_expire");
  seckey.set(null);
  expire.set(null);
}

export function getSeckey(): string | null {
  const currentExpire = localStorage.getItem("nchan_private_key_expire");
  if (currentExpire && new Date(currentExpire) > new Date()) {
    return get(seckey);
  }
  clearStores();
  return null;
}
