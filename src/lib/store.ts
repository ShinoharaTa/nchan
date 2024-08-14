import { writable, get } from "svelte/store";

const seckey = writable<string | null>(null);
const anonymous = writable<string | null>(null);
const expire = writable<string | null>(null);

function getLocalStorage() {
  try {
    const localStorageItem = localStorage.getItem("nchan_keys_v1");
    const parsed = JSON.parse(localStorageItem ?? "");
    seckey.set(parsed.seckey);
    anonymous.set(parsed.seckey);
    expire.set(parsed.seckey);
  } catch (e) {
    console.error("loading initian keys.");
    seckey.set(null);
    anonymous.set(null);
    expire.set(null);
  }
}

function setLocalStorage() {
  const keys = {
    seckey: get(seckey),
    anonymous: get(anonymous),
    expire: get(expire),
  };
  const keysString = JSON.stringify(keys);
  localStorage.setItem("nchan_keys_v1", keysString);
}

export function initializeStores() {
  localStorage.removeItem("nchan_private_key");
  localStorage.removeItem("nchan_private_key_expire");
  getLocalStorage();
}

// seckeyとexpireをローカルストレージに保存する関数
export function saveToAnonymousKey(newSeckey: string, newExpire: string) {
  anonymous.set(newSeckey);
  expire.set(newExpire);
  setLocalStorage();
}

export function saveToIdentifiedKey(newSeckey: string) {
  seckey.set(newSeckey);
  setLocalStorage();
}

export function removeIdentifiedKey() {
  deleteSeckey();
}

// seckeyとexpireを破棄する関数
function clearAnonymous() {
  expire.set(null);
  anonymous.set(null);
  setLocalStorage();
}

function deleteSeckey() {
  seckey.set(null);
  setLocalStorage();
}

export function getAnonymousKey(): string | null {
  const currentExpire = get(expire);
  if (currentExpire && new Date(currentExpire) > new Date()) {
    return get(anonymous);
  }
  clearAnonymous();
  return null;
}

export function getSecKey(): string | null {
  return get(seckey);
}
