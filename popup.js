
const chatDiv = document.getElementById('chat')
const input = document.getElementById('userInput')

input.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter' && input.value.trim()) {
    const userText = input.value
    appendMessage('user', userText)
    input.value = ''

    const { apiKey, apiUrl } = await loadSettings()
    if (!apiKey || !apiUrl) {
      alert('Please set your API key and endpoint.')
      return
    }

    const requestPayload = {
      model: 'allam-2-7b',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: userText },
      ],
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
      })

      const data = await res.json()
      const botReply = data.choices?.[0]?.message?.content || 'No response'
      appendMessage('bot', botReply)
    } catch (err) {
      console.error(err)
      appendMessage('bot', '⚠️ Failed to fetch response.')
    }
  }
})

function appendMessage(sender, text) {
  const msg = document.createElement('div')
  msg.className =
    sender === 'user'
      ? 'text-right text-sm text-black dark:text-white'
      : 'text-left text-blue-700 dark:text-blue-300'
  msg.textContent = text
  chatDiv.appendChild(msg)
  chatDiv.scrollTop = chatDiv.scrollHeight
}

async function loadSettings() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['apiKey', 'apiUrl'], resolve)
  })
}

const apiKeyInput = document.getElementById('apiKey')
const apiUrlInput = document.getElementById('apiUrl')
const saveBtn = document.getElementById('saveBtn')

// Load saved values
chrome.storage.local.get(['apiKey', 'apiUrl'], ({ apiKey, apiUrl }) => {
  if (apiKey) apiKeyInput.value = apiKey
  if (apiUrl) apiUrlInput.value = apiUrl
})

saveBtn.addEventListener('click', () => {
  const apiKey = apiKeyInput.value.trim()
  const apiUrl = apiUrlInput.value.trim()
  chrome.storage.local.set({ apiKey, apiUrl }, () => {
    alert('Saved!')
    document.getElementById('settingsPanel').classList.add('hidden')
    document.getElementById('chatPanel').classList.remove('hidden')
  })
})

// Panel toggle logic
document.getElementById('openSettings').addEventListener('click', () => {
  document.getElementById('chatPanel').classList.add('hidden')
  document.getElementById('settingsPanel').classList.remove('hidden')
})

document.getElementById('backToChat').addEventListener('click', () => {
  document.getElementById('settingsPanel').classList.add('hidden')
  document.getElementById('chatPanel').classList.remove('hidden')
})

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "getPageContent" }, (response) => {
      if (response?.content) {
        console.log("Page content:", response.content);
        // You can now use this as input to your chatbot
        appendMessage("user", response.content.substring(0, 500)); // Example: first 500 chars
      }
    });
  });
});
