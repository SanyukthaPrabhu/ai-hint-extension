function getProblemTitle() {
  if (window.location.hostname.includes("leetcode")) {
    return document.querySelector("div[data-cy='question-title']")?.innerText || "";
  }
  return "Unknown Problem";
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TITLE") {
    sendResponse({ title: getProblemTitle() });
  }
});
