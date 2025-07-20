function getProblemTitle() {
  // Make sure we are on a LeetCode problem page
  if (window.location.hostname.includes("leetcode")) {
    const titleElement = document.querySelector("div[data-cy='question-title']");
    if (titleElement) {
      return titleElement.innerText.trim();
    }
  }
  return "";
}

// Listener to handle GET_TITLE messages from popup.js
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TITLE") {
    const title = getProblemTitle();
    sendResponse({ title });
  }

  // Required if using async or DOM reads
  return true;
});
