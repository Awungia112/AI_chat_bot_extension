const apiKeyInput = document.getElementById("apiKey");
const apiUrlInput = document.getElementById("apiUrl");
const saveBtn = document.getElementById("saveBtn");

// Load saved values
chrome.storage.local.get(["apiKey", "apiUrl"], ({ apiKey, apiUrl }) => {
  if (apiKey) apiKeyInput.value = apiKey;
  if (apiUrl) apiUrlInput.value = apiUrl;
});

saveBtn.addEventListener("click", () => {
  const apiKey = apiKeyInput.value.trim();
  const apiUrl = apiUrlInput.value.trim();
  chrome.storage.local.set({ apiKey, apiUrl }, () => {
    alert("Saved!");
  });
});
