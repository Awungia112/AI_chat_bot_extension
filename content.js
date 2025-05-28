
const pageText = document.body.innerText || "";
chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "getPageContent") {
    sendResponse({ content: pageText });
  }
});
