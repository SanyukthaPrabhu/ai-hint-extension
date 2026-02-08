function getProblemTitle() {
  // Priority 1: The UI Heading (Standard LeetCode)
  const uiTitle = document.querySelector('span.text-title-large, [data-cy="question-title"]');
  if (uiTitle && uiTitle.innerText.trim()) {
    return uiTitle.innerText.replace(/^\d+\.\s*/, "").trim();
  }

  // Priority 2: The Browser Tab Title (Backup)
  // LeetCode tab titles usually look like "Two Sum - LeetCode"
  const tabTitle = document.title;
  if (tabTitle && tabTitle.includes("- LeetCode")) {
    return tabTitle.split("-")[0].trim();
  }

  // Priority 3: URL Parsing (Last Resort)
  // URL is usually leetcode.com/problems/two-sum/
  const pathParts = window.location.pathname.split('/');
  const slug = pathParts[pathParts.indexOf('problems') + 1];
  if (slug) {
    // Converts "two-sum" to "Two Sum"
    return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  return "Unknown Problem";
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_TITLE") {
    const foundTitle = getProblemTitle();
    console.log("Extension found title:", foundTitle); 
    sendResponse({ title: foundTitle });
  }
  return true; 
});