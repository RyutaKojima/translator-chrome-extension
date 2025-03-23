document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['deeplApiKey'], (result) => {
    if (result.deeplApiKey) {
      document.getElementById('apiKey').value = result.deeplApiKey;
    }
  });

  document.getElementById('saveButton').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value;

    console.log(apiKey);

    chrome.storage.sync.set({deeplApiKey: apiKey}, () => {
      const status = document.getElementById('status');
      status.textContent = 'APIキーが保存されました。';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });
});
