// background.js

import { StorageKeys } from './Enums/StorageKeys.js'
import { BaseOptionFailedError } from './Error/BaseOptionFailedError.js'
import { getTranslator } from './translator.js'

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: 'translateText',
//     title: '選択したテキストを翻訳',
//     contexts: ['selection'],
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === 'translateText' && info.selectionText) {
//     chrome.tabs.sendMessage(tab.id, {text: info.selectionText});
//   }
// });

// 翻訳処理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'translate':
      ;(async () => {
        const responseMessage = await messageHandleTranslate(request)
        sendResponse(responseMessage)
      })()
      return
    case 'openOptionsPage':
      openOptionsPage()
      return
  }

  return true
})

async function messageHandleTranslate(request) {
  try {
    const { translatorType } = await chrome.storage.sync.get([
      StorageKeys.TRANSLATOR_TYPE,
    ])

    const translate = getTranslator(translatorType)

    const translatedText = await translate(request.text)

    return { translatedText: translatedText }
  } catch (error) {
    let errorMessage = error.message
    let errorType = 'unknown'

    if (error instanceof BaseOptionFailedError) {
      errorType = error.constructor.name
      errorMessage = `${error.message} <span style="color: blue; cursor: pointer;" class="extension-openOptionsPage">設定画面を開く</span>`
    }

    return {
      error: {
        message: errorMessage,
        type: errorType,
      },
    }
  }
}

// オプションページを開く
function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    // Chrome 42以降で利用可能
    chrome.runtime.openOptionsPage()
  } else {
    // 古いバージョン用のフォールバック
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') })
  }
}
