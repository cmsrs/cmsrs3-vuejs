import storage from "../src/state/storage.js"
import jsonStoreModule from "./jsonStore.js"

const jsonStore = jsonStoreModule.getJsonStore()

    
beforeEach(() => {
    storage.setItem('auth', jsonStore.auth )
    storage.setItem('config', jsonStore.config )
})
  