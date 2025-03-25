import { StorageKeys } from './Enums/StorageKeys.js'

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(
    [
      StorageKeys.TRANSLATOR_TYPE,
      StorageKeys.GOOGLE_API_KEY,
      StorageKeys.DEEPL_API_KEY,
    ],
    (result) => {
      if (result.translatorType) {
        document.getElementById('translatorType').value = result.translatorType
      }
      if (result.googleApiKey) {
        document.getElementById('googleApiKey').value = result.googleApiKey
      }
      if (result.deeplApiKey) {
        document.getElementById('deeplApiKey').value = result.deeplApiKey
      }
    }
  )

  document.getElementById('saveButton').addEventListener('click', () => {
    const translatorType = document.getElementById('translatorType').value
    const googleApiKey = document.getElementById('googleApiKey').value
    const deeplApiKey = document.getElementById('deeplApiKey').value

    chrome.storage.sync.set(
      {
        translatorType: translatorType,
        googleApiKey: googleApiKey,
        deeplApiKey: deeplApiKey,
      },
      () => {
        const status = document.getElementById('status')
        status.textContent = 'APIキーが保存されました。'
        setTimeout(() => {
          status.textContent = ''
        }, 2000)
      }
    )
  })
})
