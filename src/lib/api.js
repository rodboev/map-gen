import localforage from 'localforage'
import memoryDriver from 'localforage-memoryStorageDriver'
import axios from 'axios'
import { setupCache } from 'axios-cache-adapter'

const store = localforage.createInstance({
  driver: [
    localforage.INDEXEDDB,
    localforage.LOCALSTORAGE,
    memoryDriver._driver
  ],
  name: 'map-gen-cache'
});

const cache = setupCache({
  maxAge: 60 * 60 * 1000,
  store
});

const api = axios.create({
  adapter: cache.adapter
});

export { api as default, cache };