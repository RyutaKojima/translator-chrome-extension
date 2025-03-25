import {StorageKeys} from './Enums/StorageKeys.js';
import {
  EmptyApiKeyError,
  InvalidTranslatorTypeError,
} from './Error/BaseOptionFailedError.js';

export function getTranslator(translatorType) {
  switch (translatorType) {
    case 'google':
      return translateWithGoogleAPI;
    case 'deepl':
      return translateWithDeepL;
      //   case 'microsoft':
      //     return translateWithMicrosoftAPI;
    default:
      throw new InvalidTranslatorTypeError('Invalid translator type');
  }
}

// Google API を使用した翻訳関数
async function translateWithGoogleAPI(text) {

  const {googleApiKey, targetLang} = await chrome.storage.sync.get([
    StorageKeys.GOOGLE_API_KEY,
    StorageKeys.TARGET_LANG,
  ]);

  if (!googleApiKey) {
    throw new EmptyApiKeyError('Google APIキーが設定されていません。');
  }

  const url = `https://translation.googleapis.com/language/translate/v2?key=${googleApiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      target: targetLang || 'ja', // 翻訳先の言語コードを指定
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data.translations[0].translatedText;
}

// DeepL API を使用した翻訳関数
async function translateWithDeepL(text) {
  // ここに DeepL API を使用した翻訳処理を実装
  // 保存された API キーを取得
  const {deeplApiKey, targetLang} = await chrome.storage.sync.get([
    StorageKeys.DEEPL_API_KEY,
    StorageKeys.TARGET_LANG,
  ]);

  if (!deeplApiKey) {
    throw new EmptyApiKeyError('DeepL APIキーが設定されていません。');
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
