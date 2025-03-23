// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'translateText',
    title: '選択したテキストを翻訳',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'translateText' && info.selectionText) {
    chrome.tabs.sendMessage(tab.id, {text: info.selectionText});
  }
});

// DeepL API を使用した翻訳処理
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'translate') {
    // ここに DeepL API を使用した翻訳処理を実装
    // 例:
    translateWithDeepL(request.text).then(translatedText => {
      sendResponse({translatedText: translatedText});
    }).catch(error => {
      sendResponse({error: error.message});
    });

    return true; // 非同期レスポンスのために true を返す
  }
});

// DeepL API を使用した翻訳関数の例
async function translateWithDeepL(text) {
  // ここに DeepL API を使用した翻訳処理を実装
  // 保存された API キーを取得
  const {deeplApiKey, targetLang} = await chrome.storage.sync.get([
    'deeplApiKey',
    'targetLang',
  ]);

  if (!deeplApiKey) {
    openOptionsPage();
    throw new Error('APIキーが設定されていません。');
  }

  // API リクエスト
  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      auth_key: deeplApiKey,
      text: text,
      target_lang: targetLang || 'JA', // デフォルトは日本語
    }),
  });

  if (!response.ok) {
    throw new Error('Translation failed');
  }

  const data = await response.json();
  return data.translations[0].text;
}

function openOptionsPage() {
  if (chrome.runtime.openOptionsPage) {
    // Chrome 42以降で利用可能
    chrome.runtime.openOptionsPage();
  } else {
    // 古いバージョン用のフォールバック
    chrome.tabs.create({url: chrome.runtime.getURL('options.html')});
  }
}
