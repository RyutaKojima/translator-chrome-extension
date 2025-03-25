var selectionRect = null

// テキスト選択時に表示するボタン要素を作成
function createTranslateButton() {
  const button = document.createElement('div')
  button.id = 'translator-selection-button'
  button.innerHTML = '翻訳' // または小さなアイコン画像を使用

  // ボタンのスタイル
  button.style.position = 'absolute'
  button.style.zIndex = '9999'
  button.style.background = '#4285f4'
  button.style.color = 'white'
  button.style.padding = '5px 10px'
  button.style.borderRadius = '4px'
  button.style.fontSize = '12px'
  button.style.cursor = 'pointer'
  button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)'
  button.style.display = 'none' // 初期状態では非表示

  return button
}

function createPopup() {
  // ここに翻訳結果を表示する処理を実装

  // 例: ポップアップ要素を作成して表示
  const popup = document.createElement('div')

  popup.id = 'translator-result-popup'
  popup.style.position = 'absolute'
  popup.style.display = 'none'
  popup.style.top = '0px'
  popup.style.left = '0px'
  popup.style.width = '300px'
  popup.style.zIndex = '10000'

  popup.style.color = 'gray'
  popup.style.background = 'white'
  popup.style.padding = '10px'
  popup.style.borderRadius = '4px'
  popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)'

  popup.innerHTML = `
        <div>
            <button id="translator-closeButton">❌</button>
            <div id="translator-translated-text"></div>
        </div>
    `

  const closeButton = popup.querySelector('#translator-closeButton')
  closeButton.style.float = 'right'
  closeButton.style.marginLeft = '10px'
  closeButton.style.background = 'none'
  closeButton.style.border = 'none'
  closeButton.addEventListener('click', () => (popup.style.display = 'none'))

  return popup
}

// テキスト選択時の処理
function handleTextSelection() {
  const selection = window.getSelection()
  const selectedText = selection.toString().trim()

  const button = document.getElementById('translator-selection-button')

  if (selectedText) {
    // 選択されたテキストの位置を取得
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    selectionRect = rect

    // ボタンの位置を設定
    button.style.top = `${window.scrollY + rect.bottom + 5}px`
    button.style.left = `${window.scrollX + rect.left}px`
    button.style.display = 'block'

    // ボタンにクリックイベントを設定
    button.onclick = () => {
      translateSelectedText(selectedText)
      button.style.display = 'none' // 翻訳後はボタンを非表示に
    }
  } else {
    button.style.display = 'none'
  }
}

// 翻訳処理を実行する関数
function translateSelectedText(text) {
  const loaderText = `<div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite;"></div>`
  showTranslationResult(loaderText, false)

  // ここに既存の翻訳処理を実装
  // 例: chrome.runtime.sendMessage を使用してバックグラウンドスクリプトに翻訳リクエストを送信
  chrome.runtime.sendMessage(
    {
      action: 'translate',
      text: text,
    },
    (response) => {
      // 翻訳結果を表示する処理
      showTranslationResult(
        response.translatedText || response.error?.message || 'undefined error',
        true
      )
    }
  )
}

// 翻訳結果を表示する関数
function showTranslationResult(translatedText, viewCloseButton) {
  // ポップアップの位置を変更して表示
  const popup = document.getElementById('translator-result-popup')
  popup.style.display = 'block'
  popup.style.top = `${window.scrollY + selectionRect.bottom + 10}px`
  popup.style.left = `${window.scrollX + selectionRect.left}px`
  popup.style.width = selectionRect.width + 'px'

  // 翻訳結果のテキストを変更
  const divTranslatedText = document.getElementById(
    'translator-translated-text'
  )
  divTranslatedText.innerHTML = translatedText

  const closeButton = document.getElementById('translator-closeButton')
  if (closeButton) {
    closeButton.style.display = viewCloseButton ? 'block' : 'none'
  }
}

// 初期化
function init() {
  const translateButton = createTranslateButton()
  const popup = createPopup()
  document.body.appendChild(translateButton)
  document.body.appendChild(popup)

  document.addEventListener('mouseup', handleTextSelection)

  // クリック時にボタンが表示されている場合でも、別の場所をクリックしたらボタンを非表示にする
  document.addEventListener('mousedown', (event) => {
    const button = document.getElementById('translator-selection-button')
    if (button && event.target !== button) {
      button.style.display = 'none'
    }
  })

  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('extension-openOptionsPage')) {
      chrome.runtime.sendMessage({ action: 'openOptionsPage' })
    }
  })

  // CSS for loading animation
  const style = document.createElement('style')
  style.textContent = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`
  document.head.appendChild(style)
}

// ページ読み込み完了時に初期化
// document.addEventListener('DOMContentLoaded', init);
init()
